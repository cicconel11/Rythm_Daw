import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../src/modules/auth/auth.module';

export function buildAuthTestImports() {
  return [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ({
        auth: {
          accessToken: {
            secret: 'test-access-secret',
            expiresIn: '15m',
          },
          refreshToken: {
            secret: 'test-refresh-secret',
            expiresIn: '7d',
          },
        },
      })],
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'test-access-secret',
        signOptions: { expiresIn: '15m' },
      }),
    }),
    AuthModule,
  ];
}

export const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password', // In a real test, this should be hashed
  refreshToken: 'test-refresh-token',
  isApproved: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const ADMIN_USER = {
  id: 'admin-user-id',
  email: 'admin@example.com',
  name: 'Admin User',
  password: 'hashed-admin-password',
  refreshToken: 'admin-refresh-token',
  isApproved: true,
  isAdmin: true,
  createdAt: new Date(),
  updatedAt: new Date()
};
