"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockAwsS3Service = exports.mockConfigService = exports.mockPrismaService = void 0;
exports.mockPrismaService = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    $on: jest.fn(),
    $transaction: jest.fn((fn) => fn(exports.mockPrismaService)),
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
    },
};
exports.mockConfigService = {
    get: jest.fn((key) => {
        const config = {
            JWT_SECRET: 'test-secret',
            JWT_EXPIRES_IN: '3600s',
            REFRESH_TOKEN_EXPIRES_IN: '7d',
            NODE_ENV: 'test',
            AWS_REGION: 'us-east-1',
            AWS_ACCESS_KEY_ID: 'test-access-key-id',
            AWS_SECRET_ACCESS_KEY: 'test-secret-access-key',
            S3_BUCKET_NAME: 'test-bucket',
        };
        return config[key];
    }),
};
exports.mockAwsS3Service = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
    getFileUrl: jest.fn(),
    getPresignedUrl: jest.fn().mockResolvedValue({
        putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
    }),
};
beforeAll(async () => {
    jest.mock('../src/prisma/prisma.service', () => ({
        PrismaService: jest.fn().mockImplementation(() => exports.mockPrismaService),
    }));
    jest.mock('../src/modules/files/aws-s3.service', () => ({
        AwsS3Service: jest.fn().mockImplementation(() => exports.mockAwsS3Service),
    }));
});
afterEach(() => {
    jest.clearAllMocks();
});
//# sourceMappingURL=test.setup.js.map