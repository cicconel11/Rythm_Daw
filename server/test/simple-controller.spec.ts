import { BadRequestException } from '@nestjs/common';
import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { User } from '../src/modules/users/entities/user.entity';
import { FileMetaDto } from '../src/modules/files/dto/file-meta.dto';

describe('FilesController (Simple)', () => {
  let controller: FilesController;
  let mockFilesService: Partial<FilesService>;
  let mockAwsS3Service: Partial<AwsS3Service>;

  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    isApproved: true,
  };

  beforeEach(() => {
    // Create mock implementations
    mockAwsS3Service = {
      getPresignedPair: jest.fn().mockResolvedValue({
        putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
      }),
    };

    mockFilesService = {
      getPresignedPair: jest.fn().mockImplementation((dto, user) => ({
        putUrl: `https://s3.amazonaws.com/test-bucket/${user.id}/${dto.name}`,
        getUrl: `https://s3.amazonaws.com/test-bucket/${user.id}/${dto.name}`,
      })),
    };

    // Manually instantiate the controller with the mock service
    controller = new FilesController(mockFilesService as FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const testFileData: FileMetaDto = {
      name: 'test-file.txt',
      mime: 'text/plain',
      size: 1024,
    };

    it('should return presigned URLs for valid file data', async () => {
      const result = await controller.create(testFileData, mockUser);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('putUrl');
      expect(result).toHaveProperty('getUrl');
      expect(result.putUrl).toContain('test-file.txt');
      expect(result.putUrl).toContain('test-user-id');
      
      // Verify the service method was called with the correct arguments
      expect(mockFilesService.getPresignedPair).toHaveBeenCalledWith(
        testFileData,
        mockUser
      );
    });

    it('should handle empty file name', async () => {
      const invalidFileData = { ...testFileData, name: '' };
      
      // Mock the service to throw an error for invalid data
      (mockFilesService.getPresignedPair as jest.Mock).mockRejectedValueOnce(
        new BadRequestException('File name cannot be empty')
      );

      await expect(controller.create(invalidFileData, mockUser)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should handle missing mime type', async () => {
      const { mime, ...fileDataWithoutMime } = testFileData;
      
      // Mock the service to handle missing mime type
      (mockFilesService.getPresignedPair as jest.Mock).mockImplementationOnce((dto, user) => ({
        putUrl: `https://s3.amazonaws.com/test-bucket/${user.id}/${dto.name}`,
        getUrl: `https://s3.amazonaws.com/test-bucket/${user.id}/${dto.name}`,
      }));

      const result = await controller.create(fileDataWithoutMime as unknown, mockUser);
      
      expect(result).toBeDefined();
      expect(result.putUrl).toContain(testFileData.name);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'S3 Service Unavailable';
      
      // Mock the service to throw an error
      (mockFilesService.getPresignedPair as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(controller.create(testFileData, mockUser)).rejects.toThrow(
        errorMessage
      );
    });
  });
});
