import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesController (Direct Test)', () => {
  let controller: FilesController;
  let filesService: jest.Mocked<FilesService>;

  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    isApproved: true,
  } as User;

  beforeEach(() => {
    // Create a mock FilesService
    filesService = {
      getPresignedPair: jest.fn().mockResolvedValue({
        uploadUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        downloadUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
      }),
    } as unknown as jest.Mocked<FilesService>;
    
    // Create a new instance of the controller with the mock service
    controller = new FilesController(filesService);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return presigned URLs for valid file data', async () => {
      const fileData = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      const result = await controller.create(fileData, mockUser);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('uploadUrl');
      expect(result).toHaveProperty('downloadUrl');
      expect(result.uploadUrl).toContain('test-file.txt');
      
      // Verify the service was called with the correct parameters
      expect(filesService.getPresignedPair).toHaveBeenCalledWith(
        fileData,
        mockUser
      );
    });
  });
});
