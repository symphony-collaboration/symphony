import { Construct } from "constructs";
import {
  App,
  AssetType,
  TerraformAsset,
  TerraformOutput,
  TerraformStack,
  TerraformVariable,
  Fn,
} from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CLUSTER_NAME, PRIMARY_REGION, SECONDARY_REGION } from "./config";
import { ProjectService } from "@cdktf/provider-google/lib/project-service";
import { ArtifactRegistryRepository } from "@cdktf/provider-google/lib/artifact-registry-repository";
import { KubernetesCluster } from "./constructs/kubernetes_cluster";
import { NamespaceV1 } from "@cdktf/provider-kubernetes/lib/namespace-v1";
import { RoleV1 } from "@cdktf/provider-kubernetes/lib/role-v1";
import { RoleBindingV1 } from "@cdktf/provider-kubernetes/lib/role-binding-v1";
import { ComputeGlobalAddress } from "@cdktf/provider-google/lib/compute-global-address";
import { ComputeManagedSslCertificate } from "@cdktf/provider-google/lib/compute-managed-ssl-certificate";
import { KubernetesIngress } from "./constructs/kubernetes_ingress";
import { DataGoogleComputeNetwork } from "@cdktf/provider-google/lib/data-google-compute-network";
import { ServiceNetworkingConnection } from "@cdktf/provider-google/lib/service-networking-connection";
import { SqlDatabaseInstance } from "@cdktf/provider-google/lib/sql-database-instance";
import { SqlDatabase } from "@cdktf/provider-google/lib/sql-database";
import { SqlUser } from "@cdktf/provider-google/lib/sql-user";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";
import { SecretV1 } from "@cdktf/provider-kubernetes/lib/secret-v1";
import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";
import { DataKubernetesServiceAccount } from "@cdktf/provider-kubernetes/lib/data-kubernetes-service-account";
import { Annotations } from "@cdktf/provider-kubernetes/lib/annotations";
import { ServiceAccountIamMember } from "@cdktf/provider-google/lib/service-account-iam-member";
import { ServiceAccount } from "@cdktf/provider-google/lib/service-account";
import KubernetesJob from "./constructs/kubernetes_job";
import { PriorityClassV1 } from "@cdktf/provider-kubernetes/lib/priority-class-v1";
import { DeploymentV1 } from "@cdktf/provider-kubernetes/lib/deployment-v1";
import { Manifest } from "@cdktf/provider-kubernetes/lib/manifest";
import { generateBucketName } from "./helpers/utils";

type RoomSecrets = {
  postgresDbUrl: string;
  cloudStorageBucketName: string;
  gProjectId: string;
};
type DashboardSecrets = {
  postgresDbUrl: string;
  gProjectId: string;
};

class SymphonyInfrastructure extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define input variables

    const projectId = new TerraformVariable(this, "projectId", {
      type: "string",
      description: "globally unique project name",
      default: "symphony-backend",
    });

    new GoogleProvider(this, "google", {
      zone: "europe-west2",
      project: projectId.stringValue,
    });

    // enable required APIs

    const services = [
      "container",
      "compute",
      "sql-component",
      "sqladmin",
      "storage-component",
      "iam",
      "iamcredentials",
      "artifactregistry",
    ];

    services.forEach((service) => {
      new ProjectService(this, service, {
        service: `${service}.googleapis.com`,
        disableOnDestroy: false,
      });
    });

    // create artifact registry repo to store docker images

    new ArtifactRegistryRepository(this, "symphony-repo", {
      location: PRIMARY_REGION,
      repositoryId: "symphony-prod",
      description: "Main repo for Symphony",
      format: "DOCKER",
    });

    new KubernetesCluster(this, {
      name: CLUSTER_NAME,
      region: "europe-west2",
      project: projectId.stringValue,
    });
  }
}

class SymphonyApplication extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // get project id again since cross-stack reference not supported
    // get domain name for ingress

    const projectId = new TerraformVariable(this, "projectId", {
      type: "string",
      description: "globally unique project id",
      default: "fourth-elixir-380718",
    });

    const domainName = new TerraformVariable(this, "domainName", {
      type: "string",
      description: "host domain name",
      default: "symphony.yusufbirader.com",
    });

    // create provider

    new GoogleProvider(this, "google", {
      zone: PRIMARY_REGION,
      project: projectId.stringValue,
    });

    // access cluster

    const cluster = KubernetesCluster.onCluster(this, CLUSTER_NAME);

    // create namespaces

    const serverNs = new NamespaceV1(this, "server-ns", {
      metadata: { name: "server" },
    });
    const roomsNs = new NamespaceV1(this, "rooms-ns", {
      metadata: { name: "rooms" },
    });
    const dashboardNs = new NamespaceV1(this, "dashboard-ns", {
      metadata: { name: "dashboard" },
    });

    // create roles

    const serverRoomsRole = new RoleV1(this, "server-rooms-role", {
      dependsOn: [serverNs],
      metadata: {
        name: "server-rooms-role",
        namespace: roomsNs.metadata.name,
      },
      rule: [
        {
          apiGroups: [""],
          resources: ["pods"],
          verbs: ["get", "watch", "list"],
        },
        {
          apiGroups: ["apps"],
          resources: ["deployments"],
          verbs: ["get", "list", "create"],
        },
        {
          apiGroups: [""],
          resources: ["services"],
          verbs: ["get", "list", "create"],
        },
      ],
    });
    const roomsRole = new RoleV1(this, "room-role", {
      metadata: {
        name: "room-role",
        namespace: roomsNs.metadata.name,
      },
      rule: [
        {
          apiGroups: ["apps"],
          resources: ["deployments"],
          verbs: ["get", "list", "delete"],
        },
        {
          apiGroups: [""],
          resources: ["services"],
          verbs: ["get", "list", "delete"],
        },
      ],
    });

    // create role bindings

    new RoleBindingV1(this, "server-rooms-role-binding", {
      dependsOn: [serverRoomsRole],
      metadata: {
        name: "server-rooms-role-binding",
        namespace: roomsNs.metadata.name,
      },
      subject: [
        {
          kind: "ServiceAccount",
          name: "default",
          namespace: serverNs.metadata.name,
        },
      ],
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "server-rooms-role",
      },
    });

    new RoleBindingV1(this, "room-role-binding", {
      dependsOn: [roomsNs, roomsRole],
      metadata: {
        name: "room-role-binding",
        namespace: roomsNs.metadata.name,
      },
      subject: [
        {
          kind: "ServiceAccount",
          name: "default",
          namespace: roomsNs.metadata.name,
        },
      ],
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "Role",
        name: "room-role",
      },
    });

    // create web server

    const webProxy = cluster.exposeService({
      name: "symphony-proxy",
      namespace: serverNs.metadata.name,
      replicas: "1",
      containerName: "symphony-proxy",
      containerImage: "docker.io/ybirader/symphony-proxy:latest",
      containerPort: 8081,
      type: "NodePort",
      labels: { app: "symphony-proxy" },
      args: [],
      readinessPath: "/ready",
      livenessPath: "/health",
      envs: [{ name: "PORT", value: 8081 }],
      dependencies: [serverNs],
    });

    // create static IP

    const staticIp = new ComputeGlobalAddress(this, "symphony-ip", {
      name: "symphony-secure-ip",
      project: projectId.stringValue,
    });

    new TerraformOutput(this, "ip-output", {
      value: `Please point your domain (${domainName.stringValue}) A record to the IP address ${staticIp.address}`,
      description: "static IP address for external load balancer",
    });

    // create SSL cert

    const sslCert = new ComputeManagedSslCertificate(this, "symphony-cert", {
      name: "symphony-secure-cert",
      project: projectId.stringValue,
      managed: {
        domains: [domainName.stringValue, `www.${domainName.stringValue}`],
      },
    });

    // create ingress with external HTTP(S) load balancer

    new KubernetesIngress(this, {
      name: "symphony-ingress",
      namespace: serverNs.metadata.name,
      labels: { name: "symphony-ingress" },
      host: domainName.stringValue,
      annotations: {
        "kubernetes.io/ingress.class": "gce",
        "ingress.gcp.kubernetes.io/pre-shared-cert": sslCert.name,
        "kubernetes.io/ingress.global-static-ip-name": staticIp.name,
      },
      dependencies: [],
    });

    // get vpc

    const vpc = new DataGoogleComputeNetwork(this, "vpc", {
      name: "default",
    });

    // create private service access

    const privateIpAddress = new ComputeGlobalAddress(this, "private-ip", {
      dependsOn: [vpc],
      name: "private-ip-address",
      purpose: "VPC_PEERING",
      addressType: "INTERNAL",
      prefixLength: 16,
      network: vpc.selfLink,
    });

    const networkingConnection = new ServiceNetworkingConnection(
      this,
      "private-vpc-connection",
      {
        dependsOn: [privateIpAddress],
        network: vpc.selfLink,
        service: "servicenetworking.googleapis.com",
        reservedPeeringRanges: [privateIpAddress.name],
      }
    );

    // create CloudSQL instance

    const postgresDatabaseInstance = new SqlDatabaseInstance(
      this,
      "postgresInstance",
      {
        dependsOn: [networkingConnection],
        name: "symphony-postgres-instance",
        databaseVersion: "POSTGRES_14",
        region: SECONDARY_REGION,
        settings: {
          tier: "db-f1-micro",
          ipConfiguration: {
            ipv4Enabled: true,
            privateNetwork: vpc.selfLink,
            authorizedNetworks: [
              {
                name: "admin",
                value: "0.0.0.0/0",
              },
            ],
          },
        },
        deletionProtection: false,
      }
    );
    const postgresDatabase = new SqlDatabase(this, "postgres", {
      dependsOn: [postgresDatabaseInstance],
      name: "symphony-postgres",
      instance: postgresDatabaseInstance.name,
      deletionPolicy: "ABANDON",
    });
    const postgresUser = new SqlUser(this, "postgres-user", {
      dependsOn: [postgresDatabaseInstance],
      name: "postgres-user",
      instance: postgresDatabaseInstance.name,
      password: "symphony-db",
      deletionPolicy: "ABANDON",
    });

    // create storage bucket

    const storageBucket = new StorageBucket(this, "document-bucket", {
      name: generateBucketName(),
      location: PRIMARY_REGION,
      forceDestroy: true,
    });

    // create secret in rooms namespace

    const postgresDbUrl = `postgresql://${postgresUser.name}:${postgresUser.password}@${postgresDatabaseInstance.publicIpAddress}:5432/${postgresDatabase.name}?socket=/cloudsql/${postgresDatabaseInstance.connectionName}`;

    const roomSecretsData: RoomSecrets = {
      postgresDbUrl,
      cloudStorageBucketName: storageBucket.name,
      gProjectId: projectId.stringValue,
    };

    const roomSecrets = new SecretV1(this, "rooms-secret", {
      dependsOn: [
        postgresDatabaseInstance,
        postgresDatabase,
        postgresUser,
        storageBucket,
      ],
      metadata: {
        name: "rooms-secret",
        namespace: roomsNs.metadata.name,
      },
      data: roomSecretsData,
    });

    // create dashboard ui service

    const dashboardSecretsData: DashboardSecrets = {
      postgresDbUrl,
      gProjectId: projectId.stringValue,
    };

    const dashboardSecrets = new SecretV1(this, "dashboard-secret", {
      dependsOn: [postgresDatabaseInstance, postgresDatabase, postgresUser],
      metadata: {
        name: "dashboard-secret",
        namespace: dashboardNs.metadata.name,
      },
      data: dashboardSecretsData,
    });

    const dashboardEnvs = [
      { name: "PORT", value: "8080" },
      {
        name: "PG_DATABASE_URL",
        valueFrom: {
          secretKeyRef: {
            name: dashboardSecrets.metadata.name,
            key: "postgresDbUrl",
          },
        },
      },
      {
        name: "G_PROJECT_ID",
        valueFrom: {
          secretKeyRef: {
            name: dashboardSecrets.metadata.name,
            key: "gProjectId",
          },
        },
      },
    ];

    cluster.exposeService({
      name: "dashboard-ui",
      namespace: dashboardNs.metadata.name,
      replicas: "1",
      containerName: "dashboard-ui",
      containerImage: "docker.io/ybirader/dashboard-ui",
      containerPort: 8080,
      labels: { app: "dashboard-ui" },
      readinessPath: "/ready",
      livenessPath: "/health",
      envs: dashboardEnvs,
      args: [],
      dependencies: [
        dashboardNs,
        postgresDatabase,
        postgresDatabaseInstance,
        postgresUser,
        dashboardSecrets,
      ],
    });

    // configure workload identity for rooms

    const roomsServiceAccount = new ServiceAccount(this, "rooms-sa", {
      displayName: "rooms-sa",
      accountId: "rooms-sa",
    });
    new ProjectIamMember(this, "storage-admin", {
      project: projectId.stringValue,
      role: "roles/storage.admin",
      member: `serviceAccount:${roomsServiceAccount.email}`,
    });

    const k8sRoomServiceAccount = new DataKubernetesServiceAccount(
      this,
      "rooms-k8s-sa",
      {
        metadata: {
          name: "default",
          namespace: roomsNs.metadata.name,
        },
      }
    );
    new ServiceAccountIamMember(this, "k8-rooms-impersonation", {
      serviceAccountId: roomsServiceAccount.name,
      role: "roles/iam.workloadIdentityUser",
      member: `serviceAccount:${projectId.stringValue}.svc.id.goog[${roomsNs.metadata.name}/${k8sRoomServiceAccount.metadata.name}]`,
    });
    new Annotations(this, "rooms-sa-annotation", {
      apiVersion: "v1",
      kind: "ServiceAccount",
      metadata: {
        name: k8sRoomServiceAccount.metadata.name,
        namespace: roomsNs.metadata.name,
      },
      annotations: {
        "iam.gke.io/gcp-service-account": `${roomsServiceAccount.email}`,
      },
    });

    // create k8 job to initalize db schema

    new KubernetesJob(this, {
      name: "db-init",
      imageName: "docker.io/ybirader/db-init:latest",
      command: ["npm", "run", "init"],
      envs: [{ name: "PG_DATABASE_URL", value: postgresDbUrl }],
      dependencies: [postgresDatabaseInstance, postgresDatabase, postgresUser],
    });

    // balloon pod

    const balloonPriority = new PriorityClassV1(this, "balloon-priority", {
      metadata: {
        name: "balloon-priority",
      },
      value: -10,
      preemptionPolicy: "Never",
      globalDefault: false,
      description: "Balloon pod priority",
    });

    new DeploymentV1(this, "balloon-deployment", {
      metadata: {
        name: "balloon-deployment",
      },
      spec: {
        replicas: "3",
        selector: {
          matchLabels: {
            app: "balloon",
          },
        },
        template: {
          metadata: {
            labels: {
              app: "balloon",
            },
          },
          spec: {
            priorityClassName: balloonPriority.metadata.name,
            terminationGracePeriodSeconds: 0,
            container: [
              {
                name: "ubuntu",
                image: "ubuntu",
                command: ["sleep"],
                args: ["infinity"],
                resources: {
                  requests: {
                    cpu: "200m",
                    memory: "250Mi",
                  },
                },
              },
            ],
          },
        },
      },
    });

    // create resources for Prometheus monitoring

    // add pod monitoring to monitored namespaces

    const podMonitoringCrd = new Manifest(this, "pod-monitoring", {
      manifest: {
        apiVersion: "monitoring.googleapis.com/v1",
        kind: "PodMonitoring",
        metadata: {
          name: "pod-monitoring",
          namespace: roomsNs.metadata.name,
        },
        spec: {
          selector: {
            matchLabels: {
              app: "symphony-websocket",
            },
          },
          endpoints: [
            {
              port: "8081",
              interval: "60s",
              metricRelabelling: [
                {
                  action: "keep",
                  regex:
                    "kube_(daemonset|deployment|pod|namespace|node|statefulset)_.+",
                  sourceLabels: ["__name__"],
                },
              ],
            },
          ],
        },
      },
    });

    // define permissions and resources to query metrics

    const monitoringNs = new NamespaceV1(this, "monitoring-ns", {
      metadata: { name: "monitoring" },
    });
    const k8sMonitoringServiceAccount = new DataKubernetesServiceAccount(
      this,
      "monitoring-k8s-sa",
      {
        metadata: {
          name: "default",
          namespace: monitoringNs.metadata.name,
        },
      }
    );
    const monitoringServiceAccount = new ServiceAccount(this, "monitoring-sa", {
      displayName: "monitoring-sa",
      accountId: "monitoring-sa",
    });
    const monitoringViewer = new ProjectIamMember(this, "monitoring-viewer", {
      project: projectId.stringValue,
      role: "roles/monitoring.viewer",
      member: `serviceAccount:${monitoringServiceAccount.email}`,
    });
    new ServiceAccountIamMember(this, "k8s-monitoring-impersonation", {
      serviceAccountId: monitoringServiceAccount.name,
      role: "roles/iam.workloadIdentityUser",
      member: `serviceAccount:${projectId.stringValue}.svc.id.goog[${monitoringNs.metadata.name}/${k8sMonitoringServiceAccount.metadata.name}]`,
    });
    new Annotations(this, "monitoring-sa-annotation", {
      apiVersion: "v1",
      kind: "ServiceAccount",
      metadata: {
        name: k8sMonitoringServiceAccount.metadata.name,
        namespace: monitoringNs.metadata.name,
      },
      annotations: {
        "iam.gke.io/gcp-service-account": `${monitoringServiceAccount.email}`,
      },
    });

    cluster.exposeService({
      name: "prometheus-ui",
      namespace: monitoringNs.metadata.name,
      replicas: "1",
      containerName: "prometheus-ui",
      containerImage: "gke.gcr.io/prometheus-engine/frontend:v0.5.0-gke.0",
      containerPort: 9090,
      labels: { app: "prometheus-ui" },
      readinessPath: "/-/ready",
      livenessPath: "/-/healthy",
      args: [
        "--web.listen-address=:9090",
        `--query.project-id=${projectId.stringValue}`,
      ],
      envs: [],
      dependencies: [podMonitoringCrd, monitoringViewer],
    });

    const grafanaValues = new TerraformAsset(this, "grafana-values", {
      path: `${process.cwd()}/assets/grafana/grafana-values.yml`,
      type: AssetType.FILE,
    });

    cluster.installHelmChart({
      name: "grafana",
      repository: "https://grafana.github.io/helm-charts",
      chart: "grafana",
      version: "6.55.1",
      createNamespace: false,
      namespace: monitoringNs.metadata.name,
      forceUpdate: true,
      dependencyUpdate: true,
      wait: true,
      values: [Fn.file(grafanaValues.path)],
    });
  }
}

const app = new App();
new SymphonyInfrastructure(app, "infrastructure");
new SymphonyApplication(app, "production");
app.synth();
