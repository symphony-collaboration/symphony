import Command from "./AbstractCommand"

class Status extends Command {
  constructor() {
    super("status", "Returns the status of the deployment", [], [])
  }

  public async action() {

  }
}

export default Status
