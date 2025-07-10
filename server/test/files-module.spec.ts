import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';

// Mock the AwsS3Service
const mockAwsS3Service = {
  getPresignedPair: jest.fn().mockResolvedValue({
    putUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
    getUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
  }),
} as unknown as AwsS3Service;

describe('FilesModule', () => {
  let filesController: FilesController;
  let filesService: FilesService;

  beforeEach(() => {
    // Create a new instance of FilesService with the mock AwsS3Service
    filesService = new FilesService(mockAwsS3Service);
    
    // Create a new instance of the controller with the service
    filesController = new FilesController(filesService);
    
    // Clear all mocks before each test
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

    // Call the controller method directly
    const result = await filesController.create(fileData, { id: 'test-user' } as any);

    // Verify the result
    expect(result).toEqual({
      putUrl: expect.any(String),
      getUrl: expect.any(String),
    });
    
    // Verify the service method was called with the correct arguments
    expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(
      expect.any(String), // The filename will have a UUID and user ID
      fileData.mime,
      fileData.size
    );
  });
});
