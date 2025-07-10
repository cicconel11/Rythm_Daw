"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestingApp = createTestingApp;
const testing_1 = require("@nestjs/testing");
const prisma_service_1 = require("../../src/prisma/prisma.service");
const app_module_1 = require("../../src/app.module");
const aws_s3_service_1 = require("../../src/modules/files/aws-s3.service");
const mockPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
    },
};
const mockAwsS3Service = {
    getPresignedUrl: jest.fn(),
};
async function createTestingApp(overrides = {}) {
    jest.clearAllMocks();
    Object.assign(mockPrismaClient, overrides.prisma || {});
    Object.assign(mockAwsS3Service, overrides.awsS3 || {});
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [app_module_1.AppModule],
    })
        .overrideProvider(prisma_service_1.PrismaService)
        .useValue(mockPrismaClient)
        .overrideProvider(aws_s3_service_1.AwsS3Service)
        .useValue(mockAwsS3Service)
        .overrideProvider('IO_SERVER')
        .useValue(null)
        .compile();
    const prisma = moduleFixture.get(prisma_service_1.PrismaService);
    const awsS3 = moduleFixture.get(aws_s3_service_1.AwsS3Service);
    global.prismaMock = prisma;
    global.awsS3Mock = awsS3;
    return moduleFixture;
}
//# sourceMappingURL=create-testing-module.js.map