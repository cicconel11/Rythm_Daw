"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_controller_1 = require("../src/modules/files/files.controller");
const files_service_1 = require("../src/modules/files/files.service");
describe('FilesController', () => {
    let filesController;
    let filesService;
    let awsS3Service;
    const mockAwsS3Service = {
        getPresignedPair: jest.fn().mockResolvedValue({
            putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
            getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        }),
    };
    const mockConfigService = {
        get: jest.fn().mockImplementation((key) => {
            switch (key) {
                case 'aws':
                    return {
                        region: 'us-east-1',
                        accessKeyId: 'test-access-key',
                        secretAccessKey: 'test-secret-key',
                        s3: {
                            bucket: 'test-bucket',
                        },
                    };
                case 'jwt':
                    return {
                        secret: 'test-secret',
                        expiresIn: '1h',
                    };
                default:
                    return null;
            }
        }),
    };
    const mockPrisma = {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    };
    beforeEach(() => {
        filesService = new files_service_1.FilesService(mockAwsS3Service);
        filesController = new files_controller_1.FilesController(filesService);
        awsS3Service = mockAwsS3Service;
    });
    describe('create', () => {
        it('should return pre-signed URLs for file upload', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const user = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                isApproved: true,
                password: 'hashedpassword',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const result = await filesController.create(fileData, user);
            expect(result).toHaveProperty('putUrl');
            expect(result).toHaveProperty('getUrl');
            expect(awsS3Service.getPresignedPair).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`^${user.id}/[a-f0-9-]+-${fileData.name}$`)), fileData.mime, fileData.size);
        });
        it('should handle invalid file data', async () => {
            const invalidFileData = {
                mime: 'text/plain',
            };
            const user = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                isApproved: true,
                password: 'hashedpassword',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            awsS3Service.getPresignedPair.mockImplementation(() => {
                throw new Error('Invalid file data');
            });
            await expect(filesController.create(invalidFileData, user)).rejects.toThrow('Invalid file data');
        });
    });
});
//# sourceMappingURL=rtc.presign.fixed.spec.js.map