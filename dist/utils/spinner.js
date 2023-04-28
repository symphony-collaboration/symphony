import ora, { oraPromise } from "ora";
import chalk from "chalk";
class Spinner {
    constructor() {
        this.spinner = ora({ prefixText: `${chalk.blue("[SYMPHONY]")}` });
    }
    start(message) {
        this.spinner.start(`${message}`);
    }
    succeed(message) {
        this.spinner.succeed(message);
    }
    fail(message) {
        this.spinner.fail(message);
    }
    async resolve(action, options) {
        oraPromise(action, options);
    }
}
export default Spinner;
