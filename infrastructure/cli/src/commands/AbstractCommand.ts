abstract class Command {
  public readonly name: string;
  public readonly description: string;
  public readonly args: [string, string][];
  public readonly options: any;

  constructor(
    name: string,
    description: string,
    args: [string, string][],
    options: any
  ) {
    this.name = name;
    this.description = description;
    this.args = args;
    this.options = options;
  }

  public async action() {
    throw new Error("An action must be implemented for a command")
  }
}

export default Command
