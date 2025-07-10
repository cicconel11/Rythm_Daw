"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_service_1 = require("../src/modules/files/files.service");
describe('FilesService', () => {
    let filesService;
    let mockAwsS3Service;
    beforeEach(() => {
        mockAwsS3Service = {
            getPresignedPair: jest.fn().mockResolvedValue({
                putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
                getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
            }),
        };
        filesService = new files_service_1.FilesService(mockAwsS3Service);
    });
    describe('getPresignedPair', () => {
        it('should return presigned URLs for valid file data', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
            };
            const result = await filesService.getPresignedPair(fileData, mockUser);
            expect(result).toHaveProperty('putUrl');
            expect(result).toHaveProperty('getUrl');
            expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalled();
            const call = mockAwsS3Service.getPresignedPair.mock.calls[0];
            const key = call[0];
            expect(key).toContain(mockUser.id);
            expect(key).toContain(fileData.name);
        });
    });
});
//# sourceMappingURL=files.service.spec.js.map