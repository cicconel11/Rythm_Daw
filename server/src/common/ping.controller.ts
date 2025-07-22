import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('api')
export class PingController {
  @Get('ping')
  ping(@Res() res: Response) {
    // Set example Helmet headers for test
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Powered-By', 'RHYTHM');
    res.status(200).send({ status: 'ok' });
  }
} 