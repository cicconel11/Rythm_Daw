import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesService (Direct Test)', () => {
  let filesService: FilesService;
  let mockAwsS3Service: jest.Mocked<AwsS3Service>;
  
  // Mock user
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    isApproved: true,
  };

  beforeEach(() => {
    // Create a mock AwsS3Service
    mockAwsS3Service = {
      getPresignedPair: jest.fn().mockResolvedValue({
        putUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
        getUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
      }),
    } as unknown;
    
    // Create a new instance of FilesService with the mock AwsS3Service
    filesService = new FilesService(mockAwsS3Service);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filesService).toBeDefined();
  });

  describe('getPresignedPair', () => {
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

      // Call the method
      const result = await filesService.getPresignedPair(fileData, mockUser);
      
      // Verify the result
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
      
      // Verify the AwsS3Service method was called with the correct arguments
      // The service should modify the filename to include the user ID and a UUID
      expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`^${mockUser.id}/[a-f0-9-]+-${fileData.name}$`)),
        fileData.mime,
        fileData.size
      );
    });

    it('should handle errors from AwsS3Service', async () => {
      const fileData = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      // Mock the AwsS3Service to throw an error
      const error = new Error('Failed to generate presigned URL');
      mockAwsS3Service.getPresignedPair.mockRejectedValueOnce(error);

      // Expect the error to be thrown
      await expect(filesService.getPresignedPair(fileData, mockUser))
        .rejects
        .toThrow('Failed to generate presigned URL');
    });
  });
});
