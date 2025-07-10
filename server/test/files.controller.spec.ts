import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { FileMetaDto } from '../src/modules/files/dto/file-meta.dto';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesController', () => {
  let filesController: FilesController;
  let mockFilesService: jest.Mocked<FilesService>;

  beforeEach(() => {
    // Create a mock FilesService
    mockFilesService = {
      getPresignedPair: jest.fn().mockResolvedValue({
        putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
      }),
    } as any;

    // Create an instance of the controller with the mock service
    filesController = new FilesController(mockFilesService);
  });

  describe('create', () => {
    it('should return presigned URLs for valid file data', async () => {
      const fileData: FileMetaDto = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      } as User;

      // The CurrentUser decorator will pass the user directly
      const result = await filesController.create(fileData, mockUser);

      expect(result).toHaveProperty('putUrl');
      expect(result).toHaveProperty('getUrl');
      expect(mockFilesService.getPresignedPair).toHaveBeenCalledWith(fileData, mockUser);
    });
  });
});
