import { Module, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
      useFactory: (app: INestApplication) => new WsAdapter(app),
      inject: [APP_INTERCEPTOR],
    },
  ],
})
export class AppModule {}
