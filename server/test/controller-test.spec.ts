import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: jest.Mocked<FilesService>;

  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    isApproved: true,
  } as User;

  const mockResponse = {
    uploadUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
    downloadUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: {
            getPresignedPair: jest.fn().mockResolvedValue(mockResponse)
          }
        }
      ]
    }).compile();

    controller = module.get<FilesController>(FilesController);
    filesService = module.get(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should return presigned URLs for valid file data', async () => {
      const fileData = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024,
      };

      const result = await controller.uploadFile(fileData, mockUser);
      
      expect(result).toBeDefined();
      expect(result).toEqual(mockResponse);
      expect(filesService.getPresignedPair).toHaveBeenCalledWith(
        fileData,
        mockUser
      );
    });
  });
});
