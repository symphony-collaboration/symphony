import Spinner from "../utils/spinner.js";
import Command from "./AbstractCommand.js";
// const inquirer = require("inquirer");
// const chalk = require("chalk");
import inquirer from "inquirer";
import chalk from "chalk";
import { destroyInfrastructure, readDeploymentConfig } from "../utils/symphony.config.js";
class Destroy extends Command {
    constructor() {
        super("destroy", "Destroys symphony infrastructure", [], []);
    }
    async action() {
        const { PROJECT } = readDeploymentConfig();
        const { shouldDelete } = await inquirer.prompt([
            {
                type: "input",
                name: "shouldDelete",
                message: chalk.red("This action is irreversible. Are you sure you want to continue? (y/N)"),
                filter: (input) => input.toLowerCase() === "y",
            },
        ]);
        if (!shouldDelete) {
            return;
        }
        const spinner = new Spinner();
        spinner.start(`Destroying Infrastructure for project ${PROJECT}`);
        await destroyInfrastructure(spinner);
        spinner.succeed("Deployment destroyed");
    }
}
export default Destroy;
