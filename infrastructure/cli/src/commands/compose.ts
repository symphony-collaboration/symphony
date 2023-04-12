import { exec } from "../utils/helpers";
import Spinner from "../utils/spinner";
import Command from "./AbstractCommand";

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

    exec("aws --version").catch(() => {
      throw new Error(
        "AWS CLI is not installed. For further guidance, see https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
      );
    });

    exec("aws configure").catch((error) => {
      throw new Error(`Could not configure AWS: ${error}`);
    });

    exec("node --version").catch(() => {
      throw new Error(
        "Node is not installed. For further guidance, see https://nodejs.org/en/download"
      );
    });
    exec("npm --version").catch(() => {
      throw new Error(
        "npm is not installed. For further guidance, see https://docs.npmjs.com/downloading-and-installing-node-js-and-npm"
      );
    });

    exec("npm ci", { cwd: "../" })
      .then(({ stdout }) => {
        console.log(stdout);
      })
      .catch((error) => {
        throw new Error(`Could not install dependencies: ${error}`);
      });

    spinner.succeed("Dependencies verified");

    // set up bootstrap infra

    spinner.start("Preparing to deploy Symphony...");

    try {
      await exec("cdk --version", { cwd: "../" });
    } catch (error) {
      throw new Error(`Deployment preparation failed: ${error}`);
    }

    spinner.succeed("Deployment preparations complete");

    // deploy application on cluster

    spinner.start("Deploying server and setting permissions...");
    console.log("Grab a coffee ☕️. This process may take some time...");

    try {
      await exec('cdk synth', { cwd: "../" });
    } catch (error) {
      throw new Error(`Deployment failed: ${error}`);
    }

    spinner.succeed("Deployment successful");


    process.exit();
  }
}

export default Compose;
