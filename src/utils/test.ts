import fs from 'fs';
import path from 'path';

console.log(import.meta.url)
console.log(process.cwd());


// copies src directory recursively to target path
const rCopy = (srcPath: string, targetPath: string) => {
  fs.mkdirSync(targetPath, { recursive: true });
  fs.readdirSync(srcPath).forEach((item) => {
    const stat = fs.statSync(path.resolve(srcPath, item));
    if (stat.isDirectory()) {
      fs.mkdirSync(path.resolve(targetPath, item));
      rCopy(path.resolve(srcPath, item), path.resolve(targetPath, item));
    } else {
      fs.copyFileSync(
        path.resolve(srcPath, item),
        path.resolve(targetPath, item)
      );
    }
  });
};

rCopy('/Users/yusuf/Documents/Documents/Yusuf/Programming/capstone/symphony-cli/src/utils', '/Users/yusuf/Documents/Documents/Yusuf/Programming/capstone/symphony-cli/src/utils1')

