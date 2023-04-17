#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathToCommands = path.join(__dirname, "./commands");
const program = new Command();
program.version("0.0.1");
const setCommands = async () => {
    const commands = await Promise.all(fs
        .readdirSync(pathToCommands)
        .filter((file) => file !== 'AbstractCommand.js')
        .map((file) => import(`./commands/${file}`)));
    commands.forEach((importedClass) => {
        const c = new importedClass.default;
        const command = program.command(c.name).description(c.description);
        c.args.forEach((arg) => command.argument(arg[0], arg[1]));
        c.options.forEach((option) => command.option([option[0], option[1]].join(","), option[2], option[3]));
        command.action(c.action);
    });
};
setCommands().then(() => program.parseAsync());
