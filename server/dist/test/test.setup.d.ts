export declare const mockPrismaService: {
    $connect: jest.Mock<any, any, any>;
    $disconnect: jest.Mock<any, any, any>;
    user: {
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
    };
};
export declare const mockAwsS3Service: {
    getPresignedUrl: jest.Mock<any, any, any>;
};
export declare const mockConfigService: {
    get: jest.Mock<string, [key: string], any>;
};
