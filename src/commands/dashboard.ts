import { SYMPHONY_DASHBOARD_DIR } from "../utils/constants.js";
import { exec } from "../utils/helpers.js";
import Command from "./AbstractCommand.js";

import fs from "fs";
import { readConfig, writeDashboardConfig } from "../utils/symphony.config.js";
import Spinner from "../utils/spinner.js";
class Dashboard extends Command {
  constructor() {
    super(
      "dashboard",
      "Exposes the development on localhost",
      [],
      [
        [
          "-p, --port <PORT>",
          "specify the localhost port to view the dashboard",
          "8999",
        ],
      ]
    );
  }

  public async action(...args: any) {
    const {port} = args[0];
    const { DOMAIN, API_SUBDOMAIN } = readConfig();

    if (!DOMAIN || !port) {
      process.exit();
    }

    process.chdir(SYMPHONY_DASHBOARD_DIR);
    const spinner = new Spinner();

    if (!fs.existsSync("package-lock.json")) {
      spinner.start("Installing dashboard dependencies...");
      await exec("npm install");
      spinner.succeed("Installed dashboard dependencies");
    }
    
    spinner.start(`Exposing dashboard on localhost:${port}`);
    
    writeDashboardConfig();
    
    exec(
      `PORT=${port} npm run dev`
    ).catch((error) => {
      throw new Error(`Dashboard could not be exposed: ${error}`);
    });

    spinner.succeed(`Dashboard running on port ${port}`);
    
  }
}

export default Dashboard;
