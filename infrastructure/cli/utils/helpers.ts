import { promisify } from "util";
import * as child_process from "child_process";
const exec = promisify(child_process.exec);

/*

input: command


*/

export { exec }
