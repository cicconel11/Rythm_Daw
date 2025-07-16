import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Logger } from '@nestjs/common';

@Controller()
class AppController {
  @Get()
  getHello(): string {
    return 'Hello from test app!';
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

async function bootstrap() {
  console.log('=== Starting Test Application ===');
  const logger = new Logger('TestApp');
  
  try {
    logger.log('Creating NestJS application instance...');
    
    // Create a minimal app with our test module
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    // Enable CORS for testing
    app.enableCors();
    
    logger.log('NestJS application instance created successfully');
    
    // Start the application
    const port = 3005; // Using a different port
    const host = '0.0.0.0'; // Listen on all network interfaces
    
    logger.log(`Starting to listen on ${host}:${port}...`);
    
    await app.listen(port, host);
    logger.log(`✅ Test application is running on: http://${host}:${port}`);
    logger.log(`✅ Test application is accessible at: http://localhost:${port}`);
    
  } catch (error) {
    console.error('❌ Test application failed to start:', error);
    process.exit(1);
  }
}

bootstrap();
