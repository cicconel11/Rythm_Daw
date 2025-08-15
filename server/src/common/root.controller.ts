import { Controller, Get, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import { Redis } from 'ioredis';

@Controller('/')
export class RootController {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  @Get()
  root(@Res() res: Response) {
    // Redirect to the Next.js application
    res.redirect('http://localhost:3000');
  }

  @Get('healthz')
  async healthz() {
    // Check DB
    let db = 'ok';
    try {
      // await this.prisma.$queryRaw`SELECT 1`;
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