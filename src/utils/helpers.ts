import { promisify } from "util";
import * as childProcess from "child_process";

import fs from "fs";
import { spawn } from "child_process";

import promptSync from 'prompt-sync';

const exec = promisify(childProcess.exec);

const camelCamse = (str: string) => {
  const upperCase = str.split(/[-_]/).map((str, idx) => idx ? str.toUpperCase() : str)
  return upperCase.join("");
} 

const prompt = (msg): string => {
  const prompt = promptSync({sigint: true});

  let res: string;
  
  while (!res) {
    res = prompt(msg)
  }

  return res;
}

export { exec, prompt, spawnChild, camelCamse}


const spawnChild = async (command, args) => {
  return new Promise((resolve, reject) => {
    let child = spawn(command, args);
    child.on("close", (data) => {
      resolve(data);
    });
    child.on("exit", (data) => {
      resolve(data);
    });
  });
};
