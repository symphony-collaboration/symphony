const ora = require("ora");
const chalk = require("chalk");

interface ResolveOptions {
  successText: string;
  failureText: string;
}

class Spinner {
  private spinner: any;

  constructor() {
    this.spinner = ora({ prefixText: `${chalk.blue("[SYMPHONY]")}`});
  }

  start(message?: string) {
    this.spinner.start(`${message}`);
  }

  succeed(message: string) {
    this.spinner.succeed(message);
  }

  fail(message: string) {
    this.spinner.fail(message);
  }

  info(message: string) {
    this.spinner.info(message)
  }

  async resolve(action: Promise<any>, options: ResolveOptions) {
    ora.oraPromise(action, options);
  }
}

export default Spinner;
