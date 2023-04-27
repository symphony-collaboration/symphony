import { promisify } from "util";
import * as child_process from "child_process";
import Spinner from "./spinner.js";
import fs from "fs";
import path from "path";

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
      "Terraform CLI is not installed. For further guidance, see https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli",
  },
  {
    dependency: "cdktf",
    errorMessage:
      "Terraform CDKTF is not installed. For further guidance, see https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install",
  },
  {
    dependency: "gcloud",
    errorMessage:
      "gcloud is not installed. For further guidance, see https://cloud.google.com/sdk/docs/install",
  },
  {
    dependency: "kubectl",
    errorMessage:
      "kubectl is not installed. For further guidance, see https://kubernetes.io/docs/tasks/tools/",
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

const provisionApplicationInfrastructure = async (
  spinner: Spinner,
  domainName: string
) => {
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

/*

- create new directory
- copy all files in template to new directory
    - for each item in template
        - copy file to target

*/

const scaffoldProject = (spinner: Spinner, projectName: string) => {
  spinner.start("Scaffolding symphony project...");

  const scaffoldDir = path.join(process.cwd(), projectName);
  const templateDir = path.resolve(
    import.meta.url,
    "../..",
    "template-vanilla"
  );
  const templateFiles = fs.readdirSync(templateDir);

  fs.mkdirSync(scaffoldDir, { recursive: true });

  templateFiles.forEach((file) => {
    copy(path.join(templateDir, file), path.join(scaffoldDir, file));
  });

  spinner.succeed("Symphony project composition successfull");
};

const copy = (srcPath: string, targetPath: string) => {
  const stat = fs.statSync(srcPath);

  if (stat.isDirectory()) {
    copyDir(srcPath, targetPath);
  } else {
    fs.copyFileSync(srcPath, targetPath);
  }
};

const copyDir = (srcPath: string, targetPath: string) => {
  fs.mkdirSync(targetPath, { recursive: true });

  fs.readdirSync(srcPath).forEach((file) => {
    copy(path.resolve(srcPath, file), path.resolve(targetPath, file));
  });
};

export {
  exec,
  assertDependencies,
  assertGCloudAuth,
  provisionBaselineInfrastructure,
  provisionApplicationInfrastructure,
  scaffoldProject,
};
