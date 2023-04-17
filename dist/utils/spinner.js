// const ora = require("ora");
// const chalk = require("chalk");
import ora from "ora";
import { oraPromise } from "ora";
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
    info(message) {
        this.spinner.info(message);
    }
    async resolve(action, options) {
        oraPromise(action, options);
    }
}
export default Spinner;
