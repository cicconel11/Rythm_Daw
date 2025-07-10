import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { FileMetaDto } from '../src/modules/files/dto/file-meta.dto';

// Mock the uuid module
const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
jest.mock('uuid', () => ({
  v4: () => mockUuid,
}));

// Mock User interface for testing
interface User {
  id: string;
  email: string;
  name: string;
  isApproved: boolean;
}

// Mock User for testing
const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  isApproved: true,
};

describe('FilesService', () => {
  let service: FilesService;
  let mockAwsS3Service: {
    getPresignedPair: jest.Mock;
  };

  beforeEach(() => {
    // Create a mock for AwsS3Service
    mockAwsS3Service = {
      getPresignedPair: jest.fn().mockResolvedValue({
        putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
      })
    };
    
    // Create a new instance of FilesService with the mock AwsS3Service
    service = new FilesService(mockAwsS3Service as unknown as AwsS3Service);
  });

  describe('getPresignedPair', () => {
    it('should return pre-signed URLs for file upload', async () => {
      const fileData: FileMetaDto = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      const result = await service.getPresignedPair(fileData, mockUser);

      // Verify the result has the expected structure
      expect(result).toHaveProperty('putUrl');
      expect(result).toHaveProperty('getUrl');
      
      // Verify the AWS S3 service was called with the correct parameters
      expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(
        `${mockUser.id}/${mockUuid}-${fileData.name}`,
        fileData.mime,
        fileData.size
      );
      
      // Verify the URLs match the mock response
      expect(result.putUrl).toBe('https://s3.amazonaws.com/test-bucket/test-file.txt');
      expect(result.getUrl).toBe('https://s3.amazonaws.com/test-bucket/test-file.txt');
    });

    it('should handle special characters in file names', async () => {
      const fileData: FileMetaDto = {
        name: 'test file with spaces & special chars_@#$%.txt',
        mime: 'text/plain',
        size: 2048,
      };

      await service.getPresignedPair(fileData, mockUser);
      
      // Verify the AWS S3 service was called with the encoded file name
      expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(
        expect.stringContaining(mockUser.id),
        fileData.mime,
        fileData.size
      );
    });

    it('should handle empty file name', async () => {
      const fileData: FileMetaDto = {
        name: '',
        mime: 'application/octet-stream',
        size: 0,
      };

      // Mock a different response for this test case
      mockAwsS3Service.getPresignedPair.mockResolvedValueOnce({
        putUrl: 'https://s3.amazonaws.com/test-bucket/empty-file',
        getUrl: 'https://s3.amazonaws.com/test-bucket/empty-file',
      });

      const result = await service.getPresignedPair(fileData, mockUser);
      
      expect(result.putUrl).toBe('https://s3.amazonaws.com/test-bucket/empty-file');
      expect(result.getUrl).toBe('https://s3.amazonaws.com/test-bucket/empty-file');
    });

    it('should handle AWS S3 service errors', async () => {
      const fileData: FileMetaDto = {
        name: 'error-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      // Mock a rejected promise to simulate an AWS S3 error
      const error = new Error('AWS S3 Service Error');
      mockAwsS3Service.getPresignedPair.mockRejectedValueOnce(error);

      // Verify the error is propagated
      await expect(service.getPresignedPair(fileData, mockUser))
        .rejects
        .toThrow('AWS S3 Service Error');
    });

    it('should handle large file sizes', async () => {
      const largeFileData: FileMetaDto = {
        name: 'large-video.mp4',
        mime: 'video/mp4',
        size: 2 * 1024 * 1024 * 1024, // 2GB
      };

      // Mock a different response for large files
      const largeFileResponse = {
        putUrl: 'https://s3.amazonaws.com/test-bucket/large-file-upload',
        getUrl: 'https://s3.amazonaws.com/test-bucket/large-file',
      };
      mockAwsS3Service.getPresignedPair.mockResolvedValueOnce(largeFileResponse);

      const result = await service.getPresignedPair(largeFileData, mockUser);
      
      // Verify the service handles large files correctly
      expect(result).toEqual(largeFileResponse);
      expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalledWith(
        expect.stringContaining(mockUser.id),
        largeFileData.mime,
        largeFileData.size
      );
    });
  });
});
