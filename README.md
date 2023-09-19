![symphony](https://github.com/symphony-collaboration/symphony/assets/68111562/f37a0442-ea1d-475a-ba80-970bbde72197)


## Overview

Symphony is an open source framework designed to make it easy for developers to build collaborative web applications. Symphony handles the complexities of implementing collaboration, including conflict resolution and real-time infrastructure, freeing developers to focus on creating unique and engaging features for their applications.

<TODO: Add Symphony feature image>

Symphony comes batteries included:

- Conflict resolution using CRDTs
- Real-time propagation of state changes
- Monitoring
- Persistence

## Getting Started

### Prerequisites

To use Symphony, you must have the following prerequisites installed on your system:


- [gcloud CLI](https://cloud.google.com/sdk/gcloud)
- [Terraform](https://developer.hashicorp.com/terraform/tutorials/gcp-get-started/install-cli)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Node.js (v16+)](https://nodejs.org/en)
- [npm](https://docs.npmjs.com/getting-started)

Once you have installed these tools, follow the steps below to configure the gcloud CLI tool with your account credentials.

#### Configuring gcloud CLI

1. Run `gcloud init --console-only` in your Terminal
2. Enter your Google account credentials when prompted
3. Press Enter to confirm your input

For further details, consult the [offical docs](https://cloud.google.com/docs/authentication)

Once you have installed the dependencies and configured the AWS CLI tool, you can proceed with the installation of the Symphony CLI tool.

#### Installing the CLI

Before starting a Symphony project, you’ll need to download the Symphony CLI tool from npm.

Run `npm install -g symphony-cli` to install the CLI globally.

Once the installation is complete, you can get started with your first real-time collaborative application powered by Symphony.

#### Creating a Symphony Application

1. Run `symphony compose <projectName>`. This command creates a new `projectName` directory, initializes a new Node project with the required `package.json`, and scaffolds some initial starter files.
2. `cd projectName`
3. run `npm i` within the project directory
4. Modify the `symphony.config.js` file to include your domain name that you want your project to be hosted at.
5. Write your application code using the conflict-free data types provided by Symphony.
6. When you’re done, run the command `symphony deploy` to deploy your application on Google Cloud Platform (GCP).

Once all your infrastructure has been provisioned, you’re ready to go. You’ve just deployed a real-time collaborative application in 5 steps. You can open your developer dashboard on localhost by running `symphony dashboard`.
