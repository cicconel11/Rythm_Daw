import { Controller, Get, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Redis } from 'ioredis';

@Controller('/')
export class RootController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  @Get()
  root() {
    return 'OK';
  }

  @Get('healthz')
  async healthz() {
    // Check DB
    let db = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      db = 'fail';
    }
    // Check Redis
    let redis = 'ok';
    try {
      await this.redis.ping();
    } catch (e) {
      redis = 'fail';
    }
    return {
      status: db === 'ok' && redis === 'ok' ? 'ok' : 'fail',
      db,
      redis,
      uptime: process.uptime(),
    };
  }
} 