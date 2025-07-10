"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_controller_1 = require("../src/modules/files/files.controller");
const files_service_1 = require("../src/modules/files/files.service");
const mockAwsS3Service = {
    getPresignedPair: jest.fn().mockImplementation((key, mime, size) => {
        return Promise.resolve({
            putUrl: `https://s3.amazonaws.com/test-bucket/${key}`,
            getUrl: `https://s3.amazonaws.com/test-bucket/${key}`,
        });
    })
};
describe('FilesController (Direct Test)', () => {
    let filesController;
    let filesService;
    const testUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        isApproved: true,
    };
    beforeEach(() => {
        filesService = new files_service_1.FilesService(mockAwsS3Service);
        filesController = new files_controller_1.FilesController(filesService);
        jest.clearAllMocks();
    });
    describe('getPresignedPair', () => {
        it('should return presigned URLs for valid file data', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const result = await filesController.create(fileData, testUser);
            expect(result).toEqual({
                putUrl: expect.stringContaining('https://s3.amazonaws.com/test-bucket/'),
                getUrl: expect.stringContaining('https://s3.amazonaws.com/test-bucket/')
            });
            expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`^${testUser.id}/[a-f0-9-]+-${fileData.name}$`)), fileData.mime, fileData.size);
        });
        it('should handle invalid file data gracefully', async () => {
            const invalidFileData = {
                name: 'test-file.txt',
            };
            const result = await filesController.create(invalidFileData, testUser);
            expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`^${testUser.id}/[a-f0-9-]+-${invalidFileData.name}$`)), undefined, undefined);
            expect(result).toEqual({
                putUrl: expect.any(String),
                getUrl: expect.any(String),
            });
        });
    });
});
//# sourceMappingURL=simple-files.spec.js.map