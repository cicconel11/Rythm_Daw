import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './modules/files/files.module';
import { RtcModule } from './modules/rtc/rtc.module';

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
  providers: [],
})
export class AppModule {}
