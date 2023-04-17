// import { SYMPHONY_DASHBOARD_DIR } from "../utils/constants.js";
import { exec } from "../utils/helpers.js";
import Command from "./AbstractCommand.js";
import Spinner from "../utils/spinner.js";
import { assertBootstrap, writeDashboardConfig, hasAwsCredentials, assertAwsCredentials, readAwsCredentials, confirmUpdateRequest, updateSymphonyConfig } from "../utils/symphony.config.js";
import { SymphonyConfig } from "../types.js";

class Test extends Command {
  constructor() {
    super(
      "update",
      "Update Symphony Configuration",
      [
      ],
      [
        ["--DOMAIN <val>", " update your target domain"],
        ["--API_SUBDOMAIN <val>", " update your api subdomain"],
        ["--AWS_ACCOUNT <val>", " update your account id"],
        ["--AWS_REGION <val>", " update your account region"],
      ]
    );
  }

  public async action(...args: string[]) {
    const [pairs] = args;
    
    let newVals = pairs as SymphonyConfig;
    const spinner = new Spinner();

    spinner.start('Updating Configuration');
    updateSymphonyConfig(newVals);
    spinner.succeed('Updated Configuration');
  }
}

export default Test;
