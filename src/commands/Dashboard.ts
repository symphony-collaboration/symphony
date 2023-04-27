import { exec } from "../utils/helpers.js";
import Command from "./AbstractCommand.js";

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

  public async action(...args: string[]) {
    const port = args[0];

    console.log(`Exposing dashboard on localhost:${port}...`);

    exec(
      `kubectl port-forward svc/dashboard -n dashboard ${port}:8080`
    ).catch((error) => {
      throw new Error(`Dashboard could not be exposed: ${error}`);
    });
  }
}

export default Dashboard;

// port-forward to localhost
// remove kubectl dependency by adding dashboard route to ingress
