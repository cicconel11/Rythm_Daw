// Mock AWS SDK
const mockGetPresignedUrl = jest.fn().mockReturnValue('https://s3.amazonaws.com/test-bucket/test-file.txt');
const mockUpload = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({ Location: 'https://s3.amazonaws.com/test-bucket/test-file.txt' })
});

const S3 = jest.fn().mockImplementation(() => ({
  getSignedUrlPromise: mockGetPresignedUrl,
  upload: mockUpload,
  config: {},
}));

export { S3 };
export default { S3 };
