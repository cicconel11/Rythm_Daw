import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WsAdapter } from './ws/ws-adapter';

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function bootstrap() {
  console.log('=== Starting Bootstrap Process ===');
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('Creating NestJS application instance...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    logger.log('NestJS application instance created successfully');
    
    // Enable CORS
    app.enableCors({
      origin: process.env.CORS_ORIGINS?.split(',') || '*',
      credentials: true,
    });
    
    // Enable global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    );

    // Use WebSocket adapter
    try {
      const wsAdapter = new WsAdapter(app);
      app.useWebSocketAdapter(wsAdapter);
      logger.log('WebSocket adapter initialized');
    } catch (error) {
      logger.error('Failed to initialize WebSocket adapter:', error);
      throw error;
    }

    // Swagger documentation
    if (process.env.NODE_ENV !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('RHYTHM API')
        .setDescription('RHYTHM Collaboration Suite API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
      
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);
      logger.log('Swagger documentation available at /api');
    }

    // Start the application
    const port = parseInt(process.env.PORT || '3001', 10);
    logger.log(`Starting to listen on port ${port}...`);
    
    try {
      await app.listen(port);
      logger.log(`✅ Application is running on: http://localhost:${port}`);
      logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Log all registered routes
      const server = app.getHttpServer();
      const router = server._events.request._router;
      const routes = router.stack
        .map(layer => {
          if (layer.route) {
            return {
              route: {
                path: layer.route.path,
                methods: layer.route.methods
              }
            };
          }
        })
        .filter(item => item !== undefined);
      
      logger.log('Registered routes:', JSON.stringify(routes, null, 2));
      
      return app;
    } catch (error) {
      logger.error(`❌ Failed to start application on port ${port}:`, error);
      throw error;
    }
  } catch (error) {
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}

// Start the application
bootstrap()
  .then(() => {
    console.log('Application started successfully');
  })
  .catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
  });
