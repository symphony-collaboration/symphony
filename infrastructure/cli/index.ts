import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

const pathToCommands = path.join(__dirname, "./commands");
const program = new Command();
program.version("0.0.1");

const setCommands = async () => {
  const commands = await Promise.all(
    fs
      .readdirSync(pathToCommands)
      .filter((file: string) => file !== 'AbstractCommand.ts')
      .map((file: string) => import(`./commands/${file}`))
  );

  commands.forEach((importedClass) => {
    const c = new importedClass.default

    const command = program.command(c.name).description(c.description);

    c.args.forEach((arg: [string, string]) =>
      command.argument(arg[0], arg[1])
    );
    c.options.forEach((option: [string, string, string, string]) =>
      command.option([option[0], option[1]].join(","), option[2], option[3])
    );
    command.action(c.action);
  });
};

setCommands().then(() => program.parseAsync());
