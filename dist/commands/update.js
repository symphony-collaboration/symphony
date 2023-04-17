import Command from "./AbstractCommand.js";
import Spinner from "../utils/spinner.js";
import { updateSymphonyConfig } from "../utils/symphony.config.js";
class Test extends Command {
    constructor() {
        super("update", "Update Symphony Configuration", [], [
            ["--DOMAIN <val>", " update your target domain"],
            ["--API_SUBDOMAIN <val>", " update your api subdomain"],
            ["--AWS_ACCOUNT <val>", " update your account id"],
            ["--AWS_REGION <val>", " update your account region"],
        ]);
    }
    async action(...args) {
        const [pairs] = args;
        let newVals = pairs;
        const spinner = new Spinner();
        spinner.start('Updating Configuration');
        updateSymphonyConfig(newVals);
        spinner.succeed('Updated Configuration');
    }
}
export default Test;
