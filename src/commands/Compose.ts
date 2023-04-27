import { exec } from "../utils/helpers.js";
import Spinner from "../utils/spinner.js";
import Command from "./AbstractCommand.js";

class Compose extends Command {
  constructor() {
    super(
      "compose",
      "Creates a new symphony project",
      [
        ["<project name>", "project name"],
        ["<domain>", "domain name"],
      ],
      [["--template", "use a pre-defined template", "javascript"]]
    );
  }

  public async action(...args: string[]) {
    const [projectName, domainName, template] = args;

    const spinner = new Spinner();

    // check dependencies

    spinner.start("Checking dependencies...");

    exec("terraform --version").catch(() => {
      throw new Error(
        "Terraform CLI is not installed. Please install it at https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli"
      );
    });

    exec("cdktf --version").catch(() => {
      throw new Error(
        "Terraform CDKTF is not installed. Please install it at https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install"
      );
    });

    exec("gcloud --version").catch(() => {
      throw new Error(
        "gcloud is not installed. Please install it at https://cloud.google.com/sdk/docs/install"
      );
    });

    exec("gcloud init --console-only").catch(() => {
      throw new Error(
        "Could not authenticate gcloud. Please manually authenticate and try again."
      );
    });

    spinner.succeed("Dependencies Verified");

    // provision cluster

    spinner.start("Creating cluster...");

    try {
      await exec("cdktf plan infra", { cwd: "../../" });
    } catch (error) {
      throw new Error(`Could not create cluster: ${error}`);
    }

    spinner.succeed("Cluster created");

    // deploy application on cluster

    spinner.start("Deploying server and setting permissions...");

    try {
      await exec(`cdktf plan production --var=domainName=${domainName}`, {
        cwd: "../../",
      });
    } catch (error) {
      throw new Error(`Could not deploy server: ${error}`);
    }

    spinner.succeed("Deployment successful");

    // create required scaffold files accounting for template

    /*

  have package.json which has:
     - symphony-client
     - include folder terraform infra

  can optionally initialize a git repo


  */
    process.exit();
  }
}

export default Compose;
