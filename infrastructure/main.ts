import { Construct } from "constructs";
import { App, TerraformStack, TerraformVariable } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CLUSTER_NAME, PRIMARY_REGION, SECONDARY_REGION } from "./config";
import { ProjectService } from "@cdktf/provider-google/lib/project-service";
import { ArtifactRegistryRepository } from "@cdktf/provider-google/lib/artifact-registry-repository";
import { KubernetesCluster } from "./constructs/kubernetes_cluster";
import { NamespaceV1 } from "@cdktf/provider-kubernetes/lib/namespace-v1";
import { RoleV1 } from "@cdktf/provider-kubernetes/lib/role-v1";
import { RoleBindingV1 } from "@cdktf/provider-kubernetes/lib/role-binding-v1";

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
  }
}

const app = new App();
new SymphonyInfrastructure(app, "infrastructure");
app.synth();
