import Command from "./AbstractCommand.js";
import Spinner from "../utils/spinner.js";
import { writeDashboardConfig } from "../utils/symphony.config.js";
class Test extends Command {
    constructor() {
        super("test", "testing", [], []);
    }
    async action(...args) {
        const spinner = new Spinner();
        spinner.start('testing2 \n');
        writeDashboardConfig();
        spinner.succeed('done testing');
    }
}
export default Test;
