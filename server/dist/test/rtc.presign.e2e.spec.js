"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_controller_1 = require("../src/modules/files/files.controller");
const mockFilesService = {
    getPresignedPair: jest.fn(),
};
const mockAwsS3Service = {
    getPresignedPair: jest.fn(),
};
describe('FilesController', () => {
    let filesController;
    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        isApproved: true
    };
    const mockPresignedUrls = {
        putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
    };
    beforeEach(async () => {
        jest.clearAllMocks();
        filesController = new files_controller_1.FilesController(mockFilesService);
        mockFilesService.getPresignedPair.mockResolvedValue(mockPresignedUrls);
        mockAwsS3Service.getPresignedPair.mockResolvedValue(mockPresignedUrls);
    });
    describe('create', () => {
        it('should return presigned URLs for valid file data', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const result = await filesController.create(fileData, mockUser);
            expect(result).toEqual(mockPresignedUrls);
            expect(mockFilesService.getPresignedPair).toHaveBeenCalledWith(fileData, mockUser);
        });
        it('should handle errors from the service', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const error = new Error('Failed to generate presigned URLs');
            mockFilesService.getPresignedPair.mockRejectedValueOnce(error);
            await expect(filesController.create(fileData, mockUser)).rejects.toThrow(error);
        });
    });
});
//# sourceMappingURL=rtc.presign.e2e.spec.js.map