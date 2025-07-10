"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_controller_1 = require("../src/modules/files/files.controller");
const files_service_1 = require("../src/modules/files/files.service");
const mockAwsS3Service = {
    getPresignedPair: jest.fn().mockResolvedValue({
        putUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
        getUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
    }),
};
describe('FilesModule', () => {
    let filesController;
    let filesService;
    beforeEach(() => {
        filesService = new files_service_1.FilesService(mockAwsS3Service);
        filesController = new files_controller_1.FilesController(filesService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(filesController).toBeDefined();
        expect(filesService).toBeDefined();
    });
    it('should generate presigned URLs', async () => {
        const fileData = {
            name: 'test-file.txt',
            mime: 'text/plain',
            size: 1024,
        };
        const result = await filesController.create(fileData, { id: 'test-user' });
        expect(result).toEqual({
            putUrl: expect.any(String),
            getUrl: expect.any(String),
        });
        expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(expect.any(String), fileData.mime, fileData.size);
    });
});
//# sourceMappingURL=files-module.spec.js.map