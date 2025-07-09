import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './modules/files/files.module';
import { RtcModule } from './modules/rtc/rtc.module';
import { WsAdapter } from './ws/ws-adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    FilesModule,
    RtcModule,
  ],
  controllers: [],
  providers: [
    {
      provide: WsAdapter,
      useFactory: (app: INestApplication) => {
        return new WsAdapter(app);
      },
      inject: [INestApplication],
    },
  ],
})
export class AppModule {}
