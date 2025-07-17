import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesController', () => {
  let filesController: FilesController;
  let filesService: jest.Mocked<FilesService>;
  
  // Mock user
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    isApproved: true,
  } as User;

  // Mock response
  const mockResponse = {
    uploadUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
    downloadUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
  };

  beforeEach(() => {
    // Create a mock FilesService
    filesService = {
      getPresignedPair: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as jest.Mocked<FilesService>;
    
    // Create a new instance of the controller with the mock service
    filesController = new FilesController(filesService);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filesController).toBeDefined();
    expect(filesService).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should return presigned URLs for valid file data', async () => {
      const fileData = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      // Call the controller method directly (bypassing the HTTP layer)
      const result = await filesController.uploadFile(fileData, mockUser);
      
      expect(result).toBeDefined();
      expect(result).toEqual(mockResponse);
      
      // Verify the service method was called with the correct arguments
      expect(filesService.getPresignedPair).toHaveBeenCalledWith(
        fileData,
        mockUser
      );
    });
  });
});
