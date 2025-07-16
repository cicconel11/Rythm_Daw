import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from '../../src/modules/auth/auth.module';

type User = {
  id: string;
  email: string;
  name: string | null;
  password: string;
  isApproved: boolean;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const buildAuthTestModuleImports = () => [
  ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
  JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '15m' } }),
  AuthModule,
];

type PrismaClientWithUser = Omit<PrismaClient, 'user'> & {
  user: {
    findUnique: jest.Mock<Promise<User | null>, any>;
    update: jest.Mock<Promise<User>, any>;
    create: jest.Mock<Promise<User>, any>;
    findFirst: jest.Mock<Promise<User | null>, any>;
  };
};

export const prismaMock: PrismaClientWithUser = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
  },
} as unknown as PrismaClientWithUser;
