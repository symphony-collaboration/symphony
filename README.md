# Symphony CLI

Symphony is a framework for making real-time collaborative applications.

## Requirements

To use Symphony, you'll need:

- An AWS account
- Use AWS as your DNS Management servers via Hosted Zones
- The AWS CLI tool should be installed and configured.
- Node v19+

## Usage

Installation
`npm install -g symphony-cli`

Symphony's CLI tool is used to setup and teardown the necessary AWS infrastructure.

The infrastructure is deployed in the specified region in 2 availability zones, which can be
modified for your use case. 

The deployment assumes you have an existing hosted zone that holds records for your domain.

The tool will deploy the websocket url endpoint to a subdomain

## Commands

There are 4 main commands: type the command followed by the `-h` flag to display the details and options of each command
  - compose: deploys infrastructure
  - destroy: destroy infrastructure
  - dashboard: deploy local dashboard
  - update: update configurtion variables
