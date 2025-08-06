import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesController (Direct Test)', () => {
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
  const mockAwsS3Service: jest.Mocked<AwsS3Service> = {
    getPresignedPair: jest.fn().mockResolvedValue({
      putUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
      getUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
    }),
  } as unknown;

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

  describe('create', () => {
    it('should return presigned URLs for valid file data', async () => {
      const fileData = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      // Mock the service method
      const expectedResult = {
        putUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
        getUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
      };
      
      jest.spyOn(filesService, 'getPresignedPair').mockResolvedValue(expectedResult);

      const result = await filesController.create(fileData, mockUser);
      
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
      
      // Verify the service method was called with the correct arguments
      expect(filesService.getPresignedPair).toHaveBeenCalledWith(
        fileData,
        mockUser
      );
    });
  });
});
