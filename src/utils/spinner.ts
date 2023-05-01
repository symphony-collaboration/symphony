import ora, { oraPromise } from "ora";
import chalk from "chalk";

interface ResolveOptions {
  successText: string;
  failureText: string;
}

class Spinner {
  private spinner: any;

  constructor() {
    this.spinner = ora({ prefixText: `${chalk.blue("[SYMPHONY]")}` });
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

  async resolve(action: Promise<any>, options: ResolveOptions) {
    oraPromise(action, options);
  }
}

export default Spinner;
