import { testRequest } from '../jest.e2e.setup';

describe('Auth E2E', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  describe('Signup', () => {
    it('should create a new user', async () => {
      const response = await testRequest
        .post('/auth/signup')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });

  describe('Login', () => {
    it('should login with existing credentials', async () => {
      const response = await testRequest
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });

  describe('Refresh', () => {
    it('should refresh tokens', async () => {
      const loginResponse = await testRequest
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const refreshResponse = await testRequest
        .post('/auth/refresh')
        .send({
          refreshToken: loginResponse.body.refreshToken,
        });

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body).toHaveProperty('accessToken');
    });
  });

  describe('Logout', () => {
    it('should invalidate refresh token', async () => {
      const loginResponse = await testRequest
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const logoutResponse = await testRequest
        .post('/auth/logout')
        .send({
          refreshToken: loginResponse.body.refreshToken,
        });

      expect(logoutResponse.status).toBe(200);
    });
  });
});
