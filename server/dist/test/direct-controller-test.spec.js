"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_controller_1 = require("../src/modules/files/files.controller");
const files_service_1 = require("../src/modules/files/files.service");
describe('FilesController (Direct Test)', () => {
    let controller;
    let filesService;
    const mockAwsS3Service = {
        getPresignedPair: jest.fn().mockResolvedValue({
            putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
            getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        }),
    };
    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        isApproved: true,
    };
    beforeEach(() => {
        filesService = new files_service_1.FilesService(mockAwsS3Service);
        controller = new files_controller_1.FilesController(filesService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should return presigned URLs for valid file data', async () => {
            const fileData = {
                name: 'test-file.txt',
                mime: 'text/plain',
                size: 1024,
            };
            const result = await controller.create(fileData, mockUser);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('putUrl');
            expect(result).toHaveProperty('getUrl');
            expect(result.putUrl).toContain('test-file.txt');
        });
    });
});
//# sourceMappingURL=direct-controller-test.spec.js.map