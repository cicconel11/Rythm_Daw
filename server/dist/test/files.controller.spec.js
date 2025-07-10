"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_controller_1 = require("../src/modules/files/files.controller");
describe('FilesController', () => {
    let filesController;
    let mockFilesService;
    beforeEach(() => {
        mockFilesService = {
            getPresignedPair: jest.fn().mockResolvedValue({
                putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
                getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
            }),
        };
        filesController = new files_controller_1.FilesController(mockFilesService);
    });
    describe('create', () => {
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
            const result = await filesController.create(fileData, mockUser);
            expect(result).toHaveProperty('putUrl');
            expect(result).toHaveProperty('getUrl');
            expect(mockFilesService.getPresignedPair).toHaveBeenCalledWith(fileData, mockUser);
        });
    });
});
//# sourceMappingURL=files.controller.spec.js.map