// @ts-ignore
import { testRequest } from '../jest.e2e.setup';

describe('Plugin API E2E', () => {
  describe('GET /api/releases/latest', () => {
    it('should return latest release information', async () => {
      const response = await testRequest.get('/api/releases/latest');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('au');
      expect(response.body).toHaveProperty('vst3');
      
      const au = response.body.au;
      const vst3 = response.body.vst3;

      expect(au).toHaveProperty('url');
      expect(au).toHaveProperty('sha256');
      expect(vst3).toHaveProperty('url');
      expect(vst3).toHaveProperty('sha256');
    });
  });

  describe('Download endpoints', () => {
    it('should return valid download URLs', async () => {
      const response = await testRequest.get('/api/releases/latest');
      
      const auResponse = await testRequest.get(response.body.au.url);
      expect(auResponse.status).toBe(200);
      expect(auResponse.headers['content-type']).toBe('application/x-apple-diskimage');

      const vst3Response = await testRequest.get(response.body.vst3.url);
      expect(vst3Response.status).toBe(200);
      expect(vst3Response.headers['content-type']).toBe('application/zip');
    });
  });
});
