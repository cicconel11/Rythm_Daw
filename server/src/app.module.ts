import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RootController } from './common/root.controller';
import { SecurityModule } from './common/security.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { PrismaModule } from './prisma/prisma.module';
// import { FilesModule } from './modules/files/files.module';
// import { RtcModule } from './modules/rtc/rtc.module';
import { Redis } from 'ioredis';
import { PingController } from './common/ping.controller';
import { AuthLoginController } from './common/auth-login.controller';
// import { FilesUploadController } from './common/files-upload.controller';
import { PluginsModule } from './modules/plugins/plugins.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '(public)'),
      exclude: ['/api*'],
    }),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: '.env',
    // }),
    ThrottlerModule.forRoot({
      throttlers: [
        { limit: 100, ttl: 900 },
      ],
    }),
    SecurityModule,
    // PrismaModule,
    // AuthModule,
    // FilesModule,
    // RtcModule,
    // PluginsModule,
  ],
  controllers: [
    RootController,
    PingController,
    AuthLoginController,
    // FilesUploadController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        return redis;
      },
    },
  ],
})
export class AppModule {}
