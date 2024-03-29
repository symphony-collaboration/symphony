import { scaffoldProject } from "../utils/helpers.js";
import Spinner from "../utils/spinner.js";
import Command from "./AbstractCommand.js";
class Compose extends Command {
    constructor() {
        super("compose", "Creates a new symphony project", [
            ["<project name>", "project name"],
        ], [["--template", "use a pre-defined template", "javascript"]]);
    }
    async action(...args) {
        const [projectName, template] = args;
        const spinner = new Spinner();
        try {
            scaffoldProject(spinner, projectName);
        }
        catch (error) {
            throw new Error(error);
        }
        process.exit();
    }
}
export default Compose;
