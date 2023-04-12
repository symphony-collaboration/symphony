import { exec } from "../utils/helpers";
import Command from "./AbstractCommand";

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
      `kubectl port-forward service/dashboard -n dashboard ${port}:8080`
    ).catch((error) => {
      throw new Error(`Dashboard could not be exposed: ${error}`);
    });
  }
}

export default Dashboard;
