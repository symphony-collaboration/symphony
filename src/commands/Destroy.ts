import { exec } from "../utils/helpers.js";
import Spinner from "../utils/spinner.js";
import Command from "./AbstractCommand.js";
const inquirer = require("inquirer");
const chalk = require("chalk");

class Destroy extends Command {
  constructor() {
    super(
      "destroy",
      "Destroys symphony infrastructure",
      [],
      [
        [
          "-p, --project",
          "name of project to destroy",
          process.env.npm_package_name,
        ],
      ]
    );
  }

  public async action(...args: string[]) {
    const projectName = args[0];
    const { shouldDelete } = await inquirer.prompt([
      {
        type: "input",
        name: "shouldDelete",
        message: chalk.red(
          "This action is irreversible. Are you sure you want to continue? (y/N)"
        ),
        filter: (input: string) => input.toLowerCase() === "y",
      },
    ]);

    if (!shouldDelete) {
      return;
    }

    const spinner = new Spinner();

    spinner.start(`Destroying cluster for project ${projectName}`);

    try {
      await exec("cdktf destroy infra && cdktf destroy production", {
        cwd: "../",
      });
    } catch (error) {
      throw new Error("Deployment could not be destroyed");
    }

    spinner.succeed("Deployment destroyed");
  }
}

export default Destroy;
