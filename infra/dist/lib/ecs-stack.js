import * as cdk from 'aws-cdk-lib';
import { Cluster, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
export class EcsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const cluster = new Cluster(this, 'AppCluster', { vpc: props.vpc });
        const taskRole = new Role(this, 'TaskRole', {
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')],
        });
        const execRole = new Role(this, 'ExecRole', {
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')],
        });
        new FargateTaskDefinition(this, 'AppTaskDef', {
            taskRole,
            executionRole: execRole,
        });
    }
}
