import { exec } from "../utils/helpers.js";
import Spinner from "../utils/spinner.js";
import Command from "./AbstractCommand.js";
import inquirer from "inquirer";
import chalk from "chalk";
class Destroy extends Command {
    constructor() {
        super("destroy", "Destroys symphony infrastructure", [], [
            [
                "-p, --project",
                "name of project to destroy",
                process.env.npm_package_name,
            ],
        ]);
    }
    async action(...args) {
        const projectName = args[0];
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
        spinner.start(`Destroying cluster for project ${projectName}`);
        try {
            await exec("cdktf destroy infra && cdktf destroy production", {
                cwd: "../",
            });
        }
        catch (error) {
            throw new Error("Deployment could not be destroyed");
        }
        spinner.succeed("Deployment destroyed");
    }
}
export default Destroy;
