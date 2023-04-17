import { camelCamse, exec } from "../utils/helpers.js";
import Spinner from "../utils/spinner.js";
import { 
  assertConfig, 
  assertDependencies,
  assertAssets,
  deployInfrastructure
 
} from "../utils/symphony.config.js";
import Command from "./AbstractCommand.js";

class Compose extends Command {
  constructor() {
    super(
      "compose",
      "Creates a new symphony project",
      [
        ["<project name>", "project name"],
      ],
      [["--template", "use a pre-defined template", "javascript"]]
    );
  }

  public async action(...args: string[]) {
    const [projectName, template] = args;    
    const spinner = new Spinner();
    
    try {
      await assertAssets(spinner);
      await assertDependencies(spinner);
      await assertConfig(spinner);

      await deployInfrastructure(spinner, projectName);
    } catch(error) {
      console.log({error})
    }
  }
}

export default Compose;
