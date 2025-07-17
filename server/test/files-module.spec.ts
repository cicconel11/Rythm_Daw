import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from '../src/modules/files/files.controller';
import { FilesService } from '../src/modules/files/files.service';
import { User } from '../src/modules/users/entities/user.entity';

describe('FilesModule', () => {
  let filesController: FilesController;
  let filesService: FilesService;

  const mockResponse = {
    uploadUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
    downloadUrl: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
  };

  const mockFilesService = {
    getPresignedPair: jest.fn().mockResolvedValue(mockResponse),
  } as Partial<FilesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    filesController = module.get<FilesController>(FilesController);
    filesService = module.get<FilesService>(FilesService) as jest.Mocked<FilesService>;
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filesController).toBeDefined();
    expect(filesService).toBeDefined();
  });

  it('should generate presigned URLs', async () => {
    const fileData = {
      name: 'test-file.txt',
      mime: 'text/plain',
      size: 1024,
    };
    const user = { id: 'test-user' } as User;

    // Mock the service method to return our test response
    (filesService.getPresignedPair as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await filesController.uploadFile(fileData, user);

    expect(result).toEqual(mockResponse);
    expect(filesService.getPresignedPair).toHaveBeenCalledWith(
      fileData,
      user
    );
  });
});
