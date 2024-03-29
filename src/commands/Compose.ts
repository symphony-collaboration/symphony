import chalk from "chalk";
import { generateAsciiLogo, scaffoldProject } from "../utils/helpers.js";
import Spinner from "../utils/spinner.js";
import Command from "./AbstractCommand.js";

class Compose extends Command {
  constructor() {
    super(
      "compose",
      "Creates a new symphony project",
      [
        ["<project name>", "project name"],
      ],
      [["--template", "use a pre-defined template", "javascript"]]
    );
  }

  public async action(...args: string[]) {
    const [projectName, template] = args;

    const spinner = new Spinner();

    try {
      console.log(chalk.blue(generateAsciiLogo()))
      scaffoldProject(spinner, projectName);
    } catch (error: any) {
      throw new Error(error);
    }

    process.exit();
  }
}

export default Compose;
