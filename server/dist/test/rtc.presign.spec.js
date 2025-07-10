"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_service_1 = require("../src/modules/files/files.service");
const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
jest.mock('uuid', () => ({
    v4: () => mockUuid,
}));
const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    isApproved: true,
};
describe('FilesService', () => {
    let service;
    let mockAwsS3Service;
    beforeEach(() => {
        mockAwsS3Service = {
            getPresignedPair: jest.fn().mockResolvedValue({
                putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
                getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
            })
        };
        service = new files_service_1.FilesService(mockAwsS3Service);
    });
    describe('getPresignedPair', () => {
        it('should return pre-signed URLs for file upload', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const result = await service.getPresignedPair(fileData, mockUser);
            expect(result).toHaveProperty('putUrl');
            expect(result).toHaveProperty('getUrl');
            expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(`${mockUser.id}/${mockUuid}-${fileData.name}`, fileData.mime, fileData.size);
            expect(result.putUrl).toBe('https://s3.amazonaws.com/test-bucket/test-file.txt');
            expect(result.getUrl).toBe('https://s3.amazonaws.com/test-bucket/test-file.txt');
        });
        it('should handle special characters in file names', async () => {
            const fileData = {
                name: 'test file with spaces & special chars_@#$%.txt',
                mime: 'text/plain',
                size: 2048,
            };
            await service.getPresignedPair(fileData, mockUser);
            expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(expect.stringContaining(mockUser.id), fileData.mime, fileData.size);
        });
        it('should handle empty file name', async () => {
            const fileData = {
                name: '',
                mime: 'application/octet-stream',
                size: 0,
            };
            mockAwsS3Service.getPresignedPair.mockResolvedValueOnce({
                putUrl: 'https://s3.amazonaws.com/test-bucket/empty-file',
                getUrl: 'https://s3.amazonaws.com/test-bucket/empty-file',
            });
            const result = await service.getPresignedPair(fileData, mockUser);
            expect(result.putUrl).toBe('https://s3.amazonaws.com/test-bucket/empty-file');
            expect(result.getUrl).toBe('https://s3.amazonaws.com/test-bucket/empty-file');
        });
        it('should handle AWS S3 service errors', async () => {
            const fileData = {
                name: 'error-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const error = new Error('AWS S3 Service Error');
            mockAwsS3Service.getPresignedPair.mockRejectedValueOnce(error);
            await expect(service.getPresignedPair(fileData, mockUser))
                .rejects
                .toThrow('AWS S3 Service Error');
        });
        it('should handle large file sizes', async () => {
            const largeFileData = {
                name: 'large-video.mp4',
                mime: 'video/mp4',
                size: 2 * 1024 * 1024 * 1024,
            };
            const largeFileResponse = {
                putUrl: 'https://s3.amazonaws.com/test-bucket/large-file-upload',
                getUrl: 'https://s3.amazonaws.com/test-bucket/large-file',
            };
            mockAwsS3Service.getPresignedPair.mockResolvedValueOnce(largeFileResponse);
            const result = await service.getPresignedPair(largeFileData, mockUser);
            expect(result).toEqual(largeFileResponse);
            expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(expect.stringContaining(mockUser.id), largeFileData.mime, largeFileData.size);
        });
    });
});
//# sourceMappingURL=rtc.presign.spec.js.map