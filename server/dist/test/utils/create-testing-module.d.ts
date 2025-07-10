import { TestingModule } from '@nestjs/testing';
interface PrismaOverrides {
    $connect?: jest.Mock;
    $disconnect?: jest.Mock;
    user?: {
        findUnique?: jest.Mock;
        create?: jest.Mock;
        update?: jest.Mock;
        findMany?: jest.Mock;
        delete?: jest.Mock;
    };
}
interface AwsS3Overrides {
    getPresignedUrl?: jest.Mock;
}
interface TestingOverrides {
    prisma?: Partial<PrismaOverrides>;
    awsS3?: Partial<AwsS3Overrides>;
}
export declare function createTestingApp(overrides?: TestingOverrides): Promise<TestingModule>;
export {};
