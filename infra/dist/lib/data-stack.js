import * as cdk from 'aws-cdk-lib';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { CfnCacheCluster } from 'aws-cdk-lib/aws-elasticache';
export class DataStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new DatabaseInstance(this, 'AppPostgres', {
            engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_14 }),
            vpc: props.vpc,
            instanceType: cdk.aws_ec2.InstanceType.of(cdk.aws_ec2.InstanceClass.BURSTABLE3, cdk.aws_ec2.InstanceSize.MICRO),
            allocatedStorage: 20,
            maxAllocatedStorage: 100,
            multiAz: false,
            publiclyAccessible: false,
            vpcSubnets: { subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_NAT },
            credentials: cdk.aws_rds.Credentials.fromGeneratedSecret('postgres'),
            databaseName: 'appdb',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            deletionProtection: false,
        });
        new CfnCacheCluster(this, 'AppRedis', {
            cacheNodeType: 'cache.t3.micro',
            engine: 'redis',
            numCacheNodes: 1,
            vpcSecurityGroupIds: [], // Add security group IDs as needed
        });
    }
}
