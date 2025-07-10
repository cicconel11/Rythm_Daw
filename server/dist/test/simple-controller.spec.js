"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const files_controller_1 = require("../src/modules/files/files.controller");
describe('FilesController (Simple)', () => {
    let controller;
    let mockFilesService;
    let mockAwsS3Service;
    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        isApproved: true,
    };
    beforeEach(() => {
        mockAwsS3Service = {
            getPresignedPair: jest.fn().mockResolvedValue({
                putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
                getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
            }),
        };
        mockFilesService = {
            getPresignedPair: jest.fn().mockImplementation((dto, user) => ({
                putUrl: `https://s3.amazonaws.com/test-bucket/${user.id}/${dto.name}`,
                getUrl: `https://s3.amazonaws.com/test-bucket/${user.id}/${dto.name}`,
            })),
        };
        controller = new files_controller_1.FilesController(mockFilesService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        const testFileData = {
            name: 'test-file.txt',
            mime: 'text/plain',
            size: 1024,
        };
        it('should return presigned URLs for valid file data', async () => {
            const result = await controller.create(testFileData, mockUser);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('putUrl');
            expect(result).toHaveProperty('getUrl');
            expect(result.putUrl).toContain('test-file.txt');
            expect(result.putUrl).toContain('test-user-id');
            expect(mockFilesService.getPresignedPair).toHaveBeenCalledWith(testFileData, mockUser);
        });
        it('should handle empty file name', async () => {
            const invalidFileData = { ...testFileData, name: '' };
            mockFilesService.getPresignedPair.mockRejectedValueOnce(new common_1.BadRequestException('File name cannot be empty'));
            await expect(controller.create(invalidFileData, mockUser)).rejects.toThrow(common_1.BadRequestException);
        });
        it('should handle missing mime type', async () => {
            const { mime, ...fileDataWithoutMime } = testFileData;
            mockFilesService.getPresignedPair.mockImplementationOnce((dto, user) => ({
                putUrl: `https://s3.amazonaws.com/test-bucket/${user.id}/${dto.name}`,
                getUrl: `https://s3.amazonaws.com/test-bucket/${user.id}/${dto.name}`,
            }));
            const result = await controller.create(fileDataWithoutMime, mockUser);
            expect(result).toBeDefined();
            expect(result.putUrl).toContain(testFileData.name);
        });
        it('should handle service errors', async () => {
            const errorMessage = 'S3 Service Unavailable';
            mockFilesService.getPresignedPair.mockRejectedValueOnce(new Error(errorMessage));
            await expect(controller.create(testFileData, mockUser)).rejects.toThrow(errorMessage);
        });
    });
});
//# sourceMappingURL=simple-controller.spec.js.map