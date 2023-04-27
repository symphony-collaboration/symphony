import { promisify } from "util";
import * as child_process from "child_process";
import Spinner from "./spinner.js";

const exec = promisify(child_process.exec);

/*
Dependencies:

- node v16
- Terraform
- Terraform CDK
- gcloud CLI
- kubectl

*/

const dependencies = [
  {
    dependency: "node",
    errorMessage:
      "Node is not installed. For further guidance, see https://nodejs.org/en/download",
  },
  {
    dependency: "npm",
    errorMessage:
      "npm is not installed. For further guidance, see https://docs.npmjs.com/downloading-and-installing-node-js-and-npm",
  },
  {
    dependency: "terraform",
    errorMessage:
      "Terraform CLI is not installed. Please install it at https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli",
  },
  {
    dependency: "cdktf",
    errorMessage:
      "Terraform CDKTF is not installed. Please install it at https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install",
  },
  {
    dependency: "gcloud",
    errorMessage:
      "gcloud is not installed. Please install it at https://cloud.google.com/sdk/docs/install",
  },
];

const assertDependencies = async (spinner: Spinner) => {
  spinner.start("Checking dependencies...");

  await Promise.all(
    dependencies.map(async ({ dependency, errorMessage }) => {
      return exec(dependency).catch(() => {
        throw new Error(errorMessage);
      });
    })
  );

  spinner.succeed("Dependencies Verified");
};

const assertGCloudAuth = async (spinner: Spinner) => {
  spinner.start("Authenticating with Google Cloud...");

  await exec("gcloud init --console-only").catch(() => {
    throw new Error(
      "Could not authenticate gcloud. Please manually authenticate and try again."
    );
  });

  spinner.succeed("Authenticated with Google Cloud");
};

const provisionBaselineInfrastructure = async (spinner: Spinner) => {
  spinner.start("Provisioning symphony infrastructure...");

  try {
    await exec("cdktf plan infra", { cwd: "../../" });
  } catch (error) {
    throw new Error(`Could not create cluster: ${error}`);
  }

  spinner.succeed("Successfully provisioned symphony infrastructure");
};

const provisionApplicationInfrastructure = async (spinner: Spinner, domainName: string) => {
  spinner.start("Deploying server and setting permissions...");

  try {
    await exec(`cdktf plan production --var=domainName=${domainName}`, {
      cwd: "../../",
    });
  } catch (error) {
    throw new Error(`Could not deploy server: ${error}`);
  }

  spinner.succeed("Deployment successful");
};

export {
  exec,
  assertDependencies,
  assertGCloudAuth,
  provisionBaselineInfrastructure,
  provisionApplicationInfrastructure,
};
