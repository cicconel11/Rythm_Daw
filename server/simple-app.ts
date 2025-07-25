import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Logger, OnModuleInit, Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response, NextFunction } from 'express';

// Enable source map support for better error stack traces
import 'source-map-support/register';

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

@Controller()
@Injectable()
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);

  onModuleInit(): void {
    this.logger.log('AppController initialized');
  }

  @Get()
  getHello(): { message: string } {
    this.logger.log('GET / request received');
    return { message: 'Hello from simple app!' };
  }

  @Get('health')
  healthCheck(): { status: string; timestamp: string } {
    this.logger.log('Health check endpoint called');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('env')
  getEnv(): Record<string, string> {
    return {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || '3007',
      // Add other environment variables as needed
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: Logger,
      useValue: new Logger('Application'),
    },
  ],
})
class AppModule {}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('=== Starting Simple Application ===');
  
  try {
    // Log environment info
    logger.log(`Node.js version: ${process.version}`);
    logger.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`PORT: ${process.env.PORT || '3007'}`);
    logger.log(`CORS_ORIGINS: ${process.env.CORS_ORIGINS || '*'}`);
    logger.log('Creating NestJS application instance...');
    
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      abortOnError: false,
    });
    
    // Enable CORS
    app.enableCors({
      origin: process.env.CORS_ORIGINS?.split(',') || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    
    // Add request logging
    app.use((req: Request, res: Response, next: NextFunction) => {
      logger.debug(`[${req.method}] ${req.originalUrl}`);
      next();
    });
    
    // Set global prefix
    app.setGlobalPrefix('api');
    logger.log('NestJS application instance created successfully');
    
    // Start the application
    const port = parseInt(process.env.PORT || '3007', 10);
    const host = '0.0.0.0';
    
    logger.log(`Starting to listen on ${host}:${port}...`);
    
    try {
      // Create HTTP server explicitly for better control
      const httpServer = app.getHttpServer();
      
      // Handle server errors
      httpServer.on('error', (error: NodeJS.ErrnoException) => {
        if (error.syscall !== 'listen') {
          throw error;
        }

        const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        // Handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            logger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            logger.error(bind + ' is already in use');
            process.exit(1);
            break;
          default:
            throw error;
        }
      });

      // Start listening
      await app.listen(port, host);
      
      const server = httpServer;
      const actualPort = (server.address() as unknown as { port: number }).port;
      
      logger.log(`✅ Application is running on: http://${host}:${actualPort}`);
      logger.log(`✅ Application is accessible at: http://localhost:${actualPort}`);
      logger.log(`✅ Health check endpoint: http://localhost:${actualPort}/health`);
      
      // Log registered routes
      const serverInstance = app.getHttpServer();
      
      // Get the underlying HTTP server instance
      const httpServerInstance = (serverInstance as unknown as { sockets?: { server: any } }).sockets ? 
        (serverInstance as unknown as { sockets: { server: any } }).sockets.server : serverInstance;
      
      // Safely access the router
      const router = (httpServerInstance as unknown as { _events?: { request?: { _router: any } } })?._events?.request?._router;
      
      if (router?.stack) {
        const availableRoutes: Array<{
          path: string;
          methods: string[];
        }> = [];
        
        router.stack.forEach((layer: unknown) => {
          if ((layer as any)?.route?.path) {
            availableRoutes.push({
              path: (layer as any).route.path,
              methods: (layer as any).route.methods 
                ? Object.keys((layer as any).route.methods).filter(
                    (method) => (layer as any).route.methods[method]
                  )
                : [],
            });
          }
        });
        
        if (availableRoutes.length > 0) {
          logger.log('\n🚀 Available Routes:');
          availableRoutes.forEach((route) => {
            logger.log(`- [${route.methods.join(', ').toUpperCase()}] ${route.path}`);
          });
          logger.log('');
        } else {
          logger.warn('No routes found in the router');
        }
      } else {
        logger.warn('Could not access router to list routes');
      }
      
      return { app, server };
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${port} is already in use. Please specify a different port using the PORT environment variable.`);
        logger.error('You can also try closing the application using the port or killing it with:');
        logger.error(`  lsof -i :${port} # Find the process using the port`);
        logger.error(`  kill -9 <PID>    # Replace <PID> with the process ID from the command above`);
      } else {
        logger.error('❌ Failed to start the application:', error);
      }
      throw error;
    }
    
    return app;
  } catch (error) {
    logger.error('❌ Simple application failed to start:', error);
    process.exit(1);
  }
}

bootstrap();
