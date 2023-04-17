import fs from "fs";
import * as dotenv from "dotenv";
import { SYMPHONY_GLOBAL_DIR, SYMPHONY_ENV, SYMPHONY_DEPLOY_REPO, SYMPHONY_DEPLOY_DIR, SYMPHONY_DASHBOARD_REPO, SYMPHONY_DASHBOARD_DIR, SYMPHONY_DEPLOYMENT_ENV, HIDE_CDK_OUTPUT, AWS_DIR, HOME } from "./constants.js";
import { prompt, exec, camelCamse } from "./helpers.js";
dotenv.config({ path: SYMPHONY_GLOBAL_DIR });
const assertSymphonyDirectory = async (spinner) => {
    if (!fs.existsSync(SYMPHONY_GLOBAL_DIR)) {
        try {
            spinner.start("Creating Symphony global directory...");
            fs.mkdirSync(SYMPHONY_GLOBAL_DIR);
            fs.writeFileSync(HIDE_CDK_OUTPUT, "");
            spinner.succeed("Symphony global directory created");
        }
        catch (err) {
            throw err;
        }
    }
    else {
        spinner.succeed("Existing Symphony global directory");
    }
};
const assertDeployRepo = async (spinner) => {
    process.chdir(SYMPHONY_GLOBAL_DIR);
    if (fs.existsSync(SYMPHONY_DEPLOY_DIR)) {
        spinner.succeed("Existing Symphony Deploy Directory");
        return;
    }
    spinner.start("Cloning Deploy Repo...");
    await exec(`git clone -q '${SYMPHONY_DEPLOY_REPO}' ~/.symphony/deploy`);
    spinner.succeed(`Symphony Deploy Repo Successfully Cloned`);
};
const assertDashboardRepo = async (spinner) => {
    process.chdir(SYMPHONY_GLOBAL_DIR);
    if (fs.existsSync(SYMPHONY_DASHBOARD_DIR)) {
        spinner.succeed("Existing Symphony Dashboard Directory");
        return;
    }
    spinner.start("Cloning Dashboard Repo...");
    await exec(`git clone -q '${SYMPHONY_DASHBOARD_REPO}' ~/.symphony/dashboard`);
    spinner.succeed("Symphony Dashboard Repo Successfully Cloned");
};
const hasAwsCredentials = () => {
    const content = fs.readFileSync(AWS_DIR + "/credentials");
    const contentStr = content.toString();
    const vals = { accessKey: false, secretKey: false };
    contentStr.split("\n").forEach(line => {
        if (line.startsWith('aws_access_key_id = ')) {
            const val = line.split(" = ")[1];
            vals.accessKey = !!val;
        }
        if (line.startsWith('aws_secret_access_key = ')) {
            const val = line.split(" = ")[1];
            vals.secretKey = !!val;
        }
    });
    return vals.accessKey && vals.secretKey;
};
const assertAwsCredentials = async (spinner) => {
    const existingCredentials = fs.existsSync(AWS_DIR) && fs.existsSync(AWS_DIR + "/credentials") && hasAwsCredentials();
    if (!existingCredentials) {
        try {
            const awsAccessKey = prompt("Enter your AWS Access Key ID: ");
            await exec(`aws configure set aws_access_key_id ${awsAccessKey}`);
            const awsSecretKey = prompt("Enter your AWS Secret Key: ");
            await exec(`aws configure set aws_secret_access_key ${awsSecretKey}`);
        }
        catch {
            throw new Error("Failed to set AWS credentials");
        }
    }
};
const writeConfig = (newConfig) => {
    if ((newConfig.AWS_ACCOUNT || newConfig.AWS_REGION) && fs.existsSync(SYMPHONY_DEPLOY_DIR + "/.env")) {
        const currentDeploymentConfig = readDeploymentConfig();
        const AWS_ACCOUNT = newConfig.AWS_ACCOUNT || currentDeploymentConfig.AWS_ACCOUNT;
        const AWS_REGION = newConfig.AWS_REGION || currentDeploymentConfig.AWS_REGION;
        const mergedConfig = { ...currentDeploymentConfig, AWS_ACCOUNT, AWS_REGION };
        writeDeploymentConfig(mergedConfig);
    }
    const config = Object.entries(newConfig).map(pair => pair.join("=")).join("\n");
    fs.writeFileSync(SYMPHONY_ENV, config);
};
const readDeploymentConfig = () => {
    const content = fs.readFileSync(SYMPHONY_DEPLOY_DIR + "/.env");
    const contentStr = content.toString();
    const vals = {};
    contentStr.split("\n").forEach(line => {
        const [key, val] = line.split("=");
        if (!key)
            return;
        if (!val) {
            console.log({ key }, "is missing value");
            return;
        }
        vals[key] = val;
    });
    return vals;
};
const writeDeploymentConfig = (newConfig) => {
    const config = Object.entries(newConfig).map(pair => pair.join("=")).join("\n");
    fs.writeFileSync(SYMPHONY_DEPLOY_DIR + "/.env", config);
};
const writeDashboardConfig = () => {
    const DOMAIN_FILE = SYMPHONY_DASHBOARD_DIR + "/app/domain.ts";
    const { DOMAIN, API_SUBDOMAIN } = readConfig();
    const newContent = `export const DOMAIN="${API_SUBDOMAIN}.${DOMAIN}"`;
    fs.writeFileSync(DOMAIN_FILE, newContent);
};
const assertSymphonyConfig = async (spinner) => {
    const config = readConfig();
    let changed = false;
    if (!config.AWS_ACCOUNT) {
        const AWS_ACCOUNT = prompt("Enter your AWS Account ID: ");
        config.AWS_ACCOUNT = AWS_ACCOUNT;
        changed = true;
    }
    if (!config.AWS_REGION) {
        const AWS_REGION = prompt("Enter the AWS region to deploy symphony infrastructure: ");
        config.AWS_REGION = AWS_REGION;
        changed = true;
    }
    if (!config.DOMAIN) {
        const DOMAIN = prompt("Enter the domain: ");
        config.DOMAIN = DOMAIN;
        changed = true;
    }
    if (!config.API_SUBDOMAIN) {
        const API_SUBDOMAIN = prompt("Enter the subdomain to serve as the API endpoints: ");
        config.API_SUBDOMAIN = API_SUBDOMAIN;
        changed = true;
    }
    if (!changed) {
        spinner.succeed("Existing Symphony configuration");
    }
    else {
        writeConfig(config);
        spinner.succeed("Saved Symphony configuration");
    }
};
const confirmUpdateRequest = (prop) => {
    const confirmation = prompt(`Do you want to update ${prop}? (type y to confirm)`);
    if (confirmation.toLowerCase() === "y") {
        const newVal = prompt(`New value for ${prop}: `);
        return newVal;
    }
    else {
        return;
    }
};
const updateSymphonyConfig = async (newConfig) => {
    const oldConfig = readConfig();
    const config = { ...oldConfig, ...newConfig };
    const configStr = Object.entries(config).map(pair => pair.join("=")).join("\n");
    fs.writeFileSync(SYMPHONY_ENV, configStr);
};
const installAwsCLI = async (spinner) => {
    try {
        spinner.start("Installing AWS CLI...");
        process.chdir(HOME);
        await exec(`curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"`);
        await exec("unzip -o awscliv2.zip");
        await exec("sudo ./aws/install");
        await exec('aws --version');
        spinner.succeed("Successfully installed AWS CLI");
    }
    catch (err) {
        throw new Error("AWS CLI could not be installed. For further guidance, see https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html");
    }
};
const assertAwsCli = async (spinner) => {
    try {
        await exec('aws --version');
        spinner.succeed('AWS CLI already installed');
    }
    catch {
        await installAwsCLI(spinner);
    }
};
const installCDK = async (spinner) => {
    spinner.start("Installing AWS CDK...");
    await exec("sudo npm install -g aws-cdk");
    spinner.succeed("AWS CDK successfully installed");
};
const assertAwsCdk = async (spinner) => {
    try {
        await exec("cdk --version");
        spinner.succeed("AWS CDK already installed");
    }
    catch (e) {
        try {
            await installCDK(spinner);
        }
        catch {
            throw new Error("Aws CDK could not be installed. For further guidance, see https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html");
        }
    }
};
const deployInfrastructure = async (spinner, project = "Symphony") => {
    process.chdir(SYMPHONY_DEPLOY_DIR);
    const config = readConfig();
    if (!fs.existsSync('package-lock.json')) {
        spinner.start("Installing Deployment Dependencies...");
        await exec('npm install');
        spinner.succeed("Installed Deployment Dependencies");
    }
    if (!fs.existsSync(SYMPHONY_DEPLOY_DIR + "/.env")) {
        const deploymentEnv = { ...SYMPHONY_DEPLOYMENT_ENV, ...config };
        const envStr = Object.entries(deploymentEnv).map(pair => pair.join("=")).join("\n");
        fs.writeFileSync(SYMPHONY_DEPLOY_DIR + "/.env", envStr);
    }
    const deploymentEnv = {
        ...SYMPHONY_DEPLOYMENT_ENV,
        ...config,
        PROJECT: project,
        SYM_METADATA_DB_NAME: `${camelCamse(project)}Metadata`,
    };
    const deploymentEnvStr = Object.entries(deploymentEnv).map(pair => pair.join("=")).join("\n");
    fs.writeFileSync(SYMPHONY_DEPLOY_DIR + "/.env", deploymentEnvStr);
    const bootstrapped = await assertBootstrap(config.AWS_REGION);
    if (!bootstrapped) {
        spinner.start("Bootstrapping AWS CDK...");
        await exec(`cdk bootstrap aws://${config.AWS_ACCOUNT}/${config.AWS_REGION}`);
        spinner.succeed("Bootstrap complete");
    }
    spinner.start("Deploying AWS infrastructure with CDK. Grab a coffee ☕️. This process may take some time...");
    await exec(`cdk deploy --outputs-file ${HIDE_CDK_OUTPUT} --require-approval never`);
    spinner.succeed("AWS infrastructure successfully deployed");
};
const readAwsCredentials = () => {
    const content = fs.readFileSync(AWS_DIR + "/credentials");
    const contentStr = content.toString();
    const vals = {};
    contentStr.split("\n").forEach(line => {
        if (line.startsWith('aws_access_key_id = ')) {
            const val = line.split(" = ")[1];
            vals.AWS_ACCESS_KEY_ID = val;
        }
        if (line.startsWith('aws_secret_access_key = ')) {
            const val = line.split(" = ")[1];
            vals.AWS_SECRET_ACCESS_KEY = val;
        }
    });
    return vals;
};
const readConfig = () => {
    if (!fs.existsSync(SYMPHONY_ENV))
        return {};
    const content = fs.readFileSync(SYMPHONY_ENV);
    const config = content.toString();
    const vars = config.split("\n");
    const vals = {};
    vars.forEach(pair => {
        const [key, val] = pair.split("=");
        if (!key)
            return;
        if (!val) {
            console.log("Missing Value for Key:", { key });
            return;
        }
        vals[key] = val;
    });
    return vals;
};
const assertAssets = async (spinner) => {
    await assertSymphonyDirectory(spinner);
    await assertDeployRepo(spinner);
    await assertDashboardRepo(spinner);
};
const assertConfig = async (spinner) => {
    await assertAwsCredentials(spinner);
    await assertSymphonyConfig(spinner);
};
const assertDependencies = async (spinner) => {
    await exec("node --version").catch(() => {
        throw new Error("Node is not installed. For further guidance, see https://nodejs.org/en/download");
    });
    await exec("npm --version").catch(() => {
        throw new Error("npm is not installed. For further guidance, see https://docs.npmjs.com/downloading-and-installing-node-js-and-npm");
    });
    await assertAwsCli(spinner);
    await assertAwsCdk(spinner);
};
const assertBootstrap = async (region) => {
    try {
        await exec(`aws cloudformation describe-stacks --stack-name CDKToolkit --region ${region}`);
        return true;
    }
    catch {
        return false;
    }
};
const destroyInfrastructure = async (spinner) => {
    try {
        process.chdir(SYMPHONY_DEPLOY_DIR);
        await exec(`cdk destroy --force`);
    }
    catch {
        try {
            await exec(`cdk destroy --force`);
        }
        catch (destroyError) {
            console.log({ destroyError });
            throw new Error("Unable to destroy infrastructure");
        }
    }
};
export { assertSymphonyDirectory, assertAssets, assertDependencies, assertConfig, confirmUpdateRequest, hasAwsCredentials, assertAwsCredentials, assertSymphonyConfig, assertDeployRepo, assertDashboardRepo, assertAwsCli, assertAwsCdk, deployInfrastructure, readConfig, readAwsCredentials, readDeploymentConfig, writeDeploymentConfig, writeDashboardConfig, assertBootstrap, destroyInfrastructure, updateSymphonyConfig, };
