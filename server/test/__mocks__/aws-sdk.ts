// Mock AWS SDK
const mockS3 = {
  upload: jest.fn().mockReturnThis(),
  deleteObject: jest.fn().mockReturnThis(),
  getSignedUrl: jest.fn().mockReturnThis(),
  getSignedUrlPromise: jest.fn().mockResolvedValue('https://mock-signed-url'),
  promise: jest.fn().mockResolvedValue({
    Location: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
    Key: 'test-file.txt',
    Bucket: 'test-bucket',
  }),
};

const mockConfig = {
  update: jest.fn(),
};

const mockS3Instance = jest.fn(() => mockS3);

const AWS = {
  config: mockConfig,
  S3: mockS3Instance,
};

module.exports = AWS;
