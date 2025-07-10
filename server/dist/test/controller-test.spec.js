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
    let controller;
    let filesService;
    beforeEach(() => {
        filesService = new files_service_1.FilesService(mockAwsS3Service);
        controller = new files_controller_1.FilesController(filesService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(filesService).toBeDefined();
    });
    describe('create', () => {
        it('should return presigned URLs for valid file data', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const user = {
                id: 'test-user-id',
                email: 'test@example.com',
                name: 'Test User',
                isApproved: true,
            };
            const result = await controller.create(fileData, user);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('putUrl');
            expect(result).toHaveProperty('getUrl');
            expect(result.putUrl).toContain('test-file.txt');
            expect(result.putUrl).toContain('test-user-id');
        });
    });
});
//# sourceMappingURL=controller-test.spec.js.map