"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_service_1 = require("../src/modules/files/files.service");
describe('FilesService (Direct Test)', () => {
    let filesService;
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
                putUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
                getUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
            }),
        };
        filesService = new files_service_1.FilesService(mockAwsS3Service);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(filesService).toBeDefined();
    });
    describe('getPresignedPair', () => {
        it('should return presigned URLs for valid file data', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const expectedResult = {
                putUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
                getUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
            };
            const result = await filesService.getPresignedPair(fileData, mockUser);
            expect(result).toBeDefined();
            expect(result).toEqual(expectedResult);
            expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`^${mockUser.id}/[a-f0-9-]+-${fileData.name}$`)), fileData.mime, fileData.size);
        });
        it('should handle errors from AwsS3Service', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const error = new Error('Failed to generate presigned URL');
            mockAwsS3Service.getPresignedPair.mockRejectedValueOnce(error);
            await expect(filesService.getPresignedPair(fileData, mockUser))
                .rejects
                .toThrow('Failed to generate presigned URL');
        });
    });
});
//# sourceMappingURL=direct-files-service.spec.js.map