import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RootController } from './common/root.controller';
import { SecurityModule } from './common/security.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './modules/files/files.module';
import { RtcModule } from './modules/rtc/rtc.module';
import { PingController } from './common/ping.controller';
// import { AuthLoginController } from './common/auth-login.controller';
// import { FilesUploadController } from './common/files-upload.controller';
import { PluginsModule } from './modules/plugins/plugins.module';
import { ActivitiesModule } from './activities/activities.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RedisService } from './common/redis.service';
import { UpstashRedisService } from './common/upstash-redis.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'app', '(public)'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { limit: 100, ttl: 900 },
      ],
    }),
    SecurityModule,
    PrismaModule,
    AuthModule,
    FilesModule,
    RtcModule,
    PluginsModule,
    ActivitiesModule,
  ],
  controllers: [
    RootController,
    PingController,
    // AuthLoginController,
    // FilesUploadController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    RedisService,
    UpstashRedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (redisService: RedisService, upstashService: UpstashRedisService) => {
        // Prefer Upstash Redis if configured, otherwise fall back to regular Redis
        if (upstashService.isConfigured()) {
          console.log('Using Upstash Redis service');
          return upstashService;
        } else {
          console.log('Using regular Redis service');
          return redisService.getClient();
        }
      },
      inject: [RedisService, UpstashRedisService],
    },
  ],
})
export class AppModule {}
