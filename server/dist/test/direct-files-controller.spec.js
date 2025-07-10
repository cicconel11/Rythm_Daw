"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_controller_1 = require("../src/modules/files/files.controller");
const files_service_1 = require("../src/modules/files/files.service");
describe('FilesController (Direct Test)', () => {
    let filesController;
    let filesService;
    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        isApproved: true,
    };
    const mockAwsS3Service = {
        getPresignedPair: jest.fn().mockResolvedValue({
            putUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
            getUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
        }),
    };
    beforeEach(() => {
        filesService = new files_service_1.FilesService(mockAwsS3Service);
        filesController = new files_controller_1.FilesController(filesService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(filesController).toBeDefined();
        expect(filesService).toBeDefined();
    });
    describe('create', () => {
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
            jest.spyOn(filesService, 'getPresignedPair').mockResolvedValue(expectedResult);
            const result = await filesController.create(fileData, mockUser);
            expect(result).toBeDefined();
            expect(result).toEqual(expectedResult);
            expect(filesService.getPresignedPair).toHaveBeenCalledWith(fileData, mockUser);
        });
    });
});
//# sourceMappingURL=direct-files-controller.spec.js.map