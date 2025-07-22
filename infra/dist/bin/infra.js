#!/usr/bin/env node
import 'source-map-support/register.js';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { EcsStack } from '../lib/ecs-stack';
import { DataStack } from '../lib/data-stack';
const app = new cdk.App();
const vpcStack = new VpcStack(app, 'VpcStack');
const dataStack = new DataStack(app, 'DataStack', { vpc: vpcStack.vpc });
new EcsStack(app, 'EcsStack', { vpc: vpcStack.vpc });
