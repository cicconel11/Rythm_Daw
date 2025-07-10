import { Test } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { FileMetaDto } from '../src/modules/files/dto/file-meta.dto';

// Mock the FilesService
const mockFilesService = {
  getPresignedPair: jest.fn(),
};

// Mock the AwsS3Service
const mockAwsS3Service = {
  getPresignedPair: jest.fn(),
};

describe('FilesController', () => {
  let filesController: FilesController;

  const mockUser = { 
    id: 'test-user-id', 
    email: 'test@example.com',
    isApproved: true
  };

  const mockPresignedUrls = {
    putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
    getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
  };

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of the controller with mocked services
    filesController = new FilesController(
      mockFilesService as any,
    );
    
    // Setup default mock implementations
    mockFilesService.getPresignedPair.mockResolvedValue(mockPresignedUrls);
    mockAwsS3Service.getPresignedPair.mockResolvedValue(mockPresignedUrls);
  });

  describe('create', () => {
    it('should return presigned URLs for valid file data', async () => {
      const fileData: FileMetaDto = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      const result = await filesController.create(fileData, mockUser);

      expect(result).toEqual(mockPresignedUrls);
      expect(mockFilesService.getPresignedPair).toHaveBeenCalledWith(fileData, mockUser);
    });

    it('should handle errors from the service', async () => {
      const fileData: FileMetaDto = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      const error = new Error('Failed to generate presigned URLs');
      mockFilesService.getPresignedPair.mockRejectedValueOnce(error);

      await expect(filesController.create(fileData, mockUser)).rejects.toThrow(error);
    });
  });
});
