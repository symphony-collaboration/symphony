import { Construct } from "constructs";
import { App, TerraformStack, TerraformVariable } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CLUSTER_NAME, PRIMARY_REGION, SECONDARY_REGION } from "./config";
import { ProjectService } from "@cdktf/provider-google/lib/project-service";
import { ArtifactRegistryRepository } from "@cdktf/provider-google/lib/artifact-registry-repository";
import { KubernetesCluster } from "./constructs/kubernetes_cluster";
import { NamespaceV1 } from "@cdktf/provider-kubernetes/lib/namespace-v1";

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

  }
}

const app = new App();
new SymphonyInfrastructure(app, "infrastructure");
app.synth();
