import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesController', () => {
  let filesController: FilesController;
  let filesService: FilesService;
  
  // Mock user
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    isApproved: true,
  };

  // Mock AwsS3Service
  const mockAwsS3Service = {
    getPresignedPair: jest.fn().mockResolvedValue({
      putUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
      getUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
    }),
  };

  beforeEach(() => {
    // Create a new instance of FilesService with the mock AwsS3Service
    filesService = new FilesService(mockAwsS3Service as unknown as AwsS3Service);
    
    // Create a new instance of the controller with the service
    filesController = new FilesController(filesService);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
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

      const result = await filesController.create(fileData, mockUser);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('putUrl');
      expect(result).toHaveProperty('getUrl');
      expect(result.putUrl).toContain('test-file.txt');
      
      // Verify the service method was called with the correct arguments
      // The service should modify the filename to include the user ID and a UUID
      expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`^${mockUser.id}/[a-f0-9-]+-${fileData.name}$`)),
        fileData.mime,
        fileData.size
      );
    });
  });
});
