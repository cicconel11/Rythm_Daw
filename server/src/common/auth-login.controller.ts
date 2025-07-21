import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthLoginController {
  @Post('login')
  login(@Res() res: Response) {
    // Set a dummy JWT cookie for test
    res.cookie('accessToken', 'dummy.jwt.token', { httpOnly: true });
    res.status(201).send({ user: { id: 'test-user-id', email: 'test@example.com' } });
  }
} 