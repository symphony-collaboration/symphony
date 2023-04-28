import { destroyInfrastructure, exec } from "../utils/helpers.js";
import Spinner from "../utils/spinner.js";
import Command from "./AbstractCommand.js";
import inquirer from "inquirer";
import chalk from "chalk";

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

    try {
      await destroyInfrastructure(spinner);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default Destroy;
