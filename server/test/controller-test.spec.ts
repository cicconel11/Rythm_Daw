import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';

// Mock AwsS3Service
const mockAwsS3Service = {
  getPresignedPair: jest.fn().mockImplementation((key: string, mime: string, size: number) => {
    return Promise.resolve({
      putUrl: `https://s3.amazonaws.com/test-bucket/${key}`,
      getUrl: `https://s3.amazonaws.com/test-bucket/${key}`,
    });
  })
} as unknown as AwsS3Service;

describe('FilesController (Direct Test)', () => {
  let controller: FilesController;
  let filesService: FilesService;

  beforeEach(() => {
    // Create a new instance of FilesService with the mock AwsS3Service
    filesService = new FilesService(mockAwsS3Service);
    
    // Create a new instance of the controller with the service
    controller = new FilesController(filesService);
    
    // Clear all mocks before each test
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
