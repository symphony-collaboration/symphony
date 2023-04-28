import { Construct } from "constructs";
import { App, TerraformStack, TerraformVariable } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CLUSTER_NAME, PRIMARY_REGION, SECONDARY_REGION } from "./config";
import { ProjectService } from "@cdktf/provider-google/lib/project-service";
import { ArtifactRegistryRepository } from "@cdktf/provider-google/lib/artifact-registry-repository";

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
  }
}

const app = new App();
new SymphonyInfrastructure(app, "infrastructure");
app.synth();
