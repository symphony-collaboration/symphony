import {
  exec,
  assertDependencies,
  assertGCloudAuth,
  scaffoldProject,
} from "../utils/helpers.js";
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

    try {
      await assertDependencies(spinner);
      await assertGCloudAuth(spinner);
      scaffoldProject(spinner, projectName);
    } catch (error) {
      throw new Error(error);
    }

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
