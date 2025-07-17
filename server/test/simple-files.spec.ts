import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesController (Direct Test)', () => {
  let filesController: FilesController;
  let filesService: FilesService;
  let mockAwsS3Service: jest.Mocked<AwsS3Service>;
  
  // Mock user for testing
  const testUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    isApproved: true,
  };

  beforeEach(() => {
    // Create a mock AwsS3Service
    mockAwsS3Service = {
      getPresignedPair: jest.fn().mockResolvedValue({
        uploadUrl: 'https://s3.amazonaws.com/test-bucket/test-user-id/test-file.txt',
        downloadUrl: 'https://s3.amazonaws.com/test-bucket/test-user-id/test-file.txt',
      })
    } as any;
    
    // Create a new instance of FilesService with the mock AwsS3Service
    filesService = new FilesService(mockAwsS3Service);
    
    // Create a new instance of the controller with the service
    filesController = new FilesController(filesService);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getPresignedPair', () => {
    it('should return presigned URLs for valid file data', async () => {
      const fileData = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      // Call the controller method directly with the file data
      // Using the presign endpoint which is the main endpoint
      const result = await filesController.create(fileData, testUser);

      // Verify the result
      expect(result).toEqual({
        uploadUrl: expect.stringContaining('https://s3.amazonaws.com/test-bucket/'),
        downloadUrl: expect.stringContaining('https://s3.amazonaws.com/test-bucket/')
      });
      
      // Verify the service method was called with the correct arguments
      expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(
        `${testUser.id}/${fileData.name}`,
        fileData.mime,
        fileData.size
      );
    });

    it('should handle invalid file data gracefully', async () => {
      // Test with partially invalid data
      const invalidFileData = {
        name: 'test-file.txt',
        // Missing mime and size
      };

      // The controller doesn't validate the DTO, so it will still call the service
      const result = await filesController.create(invalidFileData as any, testUser);
      
      // The service will still be called, but with undefined for missing fields
      expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(
        `${testUser.id}/${invalidFileData.name}`,
        undefined,
        undefined
      );
      
      // We still expect a response with URLs
      expect(result).toEqual({
        uploadUrl: expect.any(String),
        downloadUrl: expect.any(String),
      });
    });
  });
});
