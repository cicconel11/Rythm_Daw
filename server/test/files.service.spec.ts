import { FilesService } from '../src/modules/files/files.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { FileMetaDto } from '../src/modules/files/dto/file-meta.dto';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesService', () => {
  let filesService: FilesService;
  let mockAwsS3Service: jest.Mocked<AwsS3Service>;

  beforeEach(() => {
    // Create a mock AwsS3Service
    mockAwsS3Service = {
      getPresignedPair: jest.fn().mockResolvedValue({
        putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
      }),
    } as unknown;

    // Create an instance of the service with the mock
    filesService = new FilesService(mockAwsS3Service);
  });

  describe('getPresignedPair', () => {
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

      const result = await filesService.getPresignedPair(fileData, mockUser);

      expect(result).toHaveProperty('putUrl');
      expect(result).toHaveProperty('getUrl');
      expect(mockAwsS3Service.getPresignedPair).toHaveBeenCalled();
      
      // Check that the key includes the user ID and file name
      const call = mockAwsS3Service.getPresignedPair.mock.calls[0];
      const key = call[0];
      expect(key).toContain(mockUser.id);
      expect(key).toContain(fileData.name);
    });
  });
});
