import {
  assertDependencies,
  assertGCloudAuth,
  provisionApplicationInfrastructure,
  provisionBaselineInfrastructure,
} from "../utils/helpers.js";
import Spinner from "../utils/spinner.js";
import Command from "./AbstractCommand.js";

class Deploy extends Command {
  constructor() {
    super(
      "deploy",
      "Deploys symphony infrastructure",
      [["<domain>", "domain name"]],
      []
    );
  }

  public async action(...args: string[]) {
    const [domainName] = args;
    const spinner = new Spinner();

    try {
      await assertDependencies(spinner);
      await assertGCloudAuth(spinner);
      await provisionBaselineInfrastructure(spinner);
      await provisionApplicationInfrastructure(spinner, domainName);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Deploy;
