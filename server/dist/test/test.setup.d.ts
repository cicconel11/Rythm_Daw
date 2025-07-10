interface MockPrismaService {
    $connect: jest.Mock;
    $disconnect: jest.Mock;
    $on: jest.Mock;
    $transaction: jest.Mock;
    user: {
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        findMany: jest.Mock;
        delete: jest.Mock;
    };
}
export declare const mockPrismaService: MockPrismaService;
interface MockConfigService {
    get: jest.Mock;
}
export declare const mockConfigService: MockConfigService;
interface MockAwsS3Service {
    uploadFile: jest.Mock;
    deleteFile: jest.Mock;
    getFileUrl: jest.Mock;
    getPresignedUrl: jest.Mock;
}
export declare const mockAwsS3Service: MockAwsS3Service;
export {};
