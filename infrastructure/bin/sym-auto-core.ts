#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SymAutoCoreStack } from '../lib/sym-auto-core-stack';

import * as dotenv from "dotenv"
dotenv.config();

const app = new cdk.App();
const coreStack = new SymAutoCoreStack(app, 'SymAutoCoreStack', {
  env: {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_REGION,
  },
});

