#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import CoreStack from '../lib/sym-auto-core-stack';

import * as dotenv from "dotenv"
dotenv.config();

const project = process.env.PROJECT || "SymphonyDefault";
const app = new cdk.App();

new CoreStack(app, project, {
  env: {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_REGION,
  },
});

