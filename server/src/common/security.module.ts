import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import helmet from 'helmet';

@Module({})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        helmet({
          contentSecurityPolicy: {
            useDefaults: true,
            directives: {
              "default-src": ["'self'"],
              "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
              "object-src": ["'none'"],
              "img-src": ["'self'", "data:", "blob:"],
              "style-src": ["'self'", "'unsafe-inline'"],
              "frame-ancestors": ["'none'"],
            },
          },
          frameguard: { action: 'deny' },
          hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
          hidePoweredBy: true,
        })
      )
      .forRoutes('*');
  }
} 