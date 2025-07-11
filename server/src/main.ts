import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WsAdapter } from './ws/ws-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Use WebSocket adapter
  app.useWebSocketAdapter(app.get(WsAdapter));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('RHYTHM API')
    .setDescription('RHYTHM Collaboration Suite API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configure WebSocket engine for test environment
  if (process.env.NODE_ENV === 'test') {
    const io = app.getHttpAdapter().getInstance().io;
    io.engine.opts.wsEngine = 'ws';   // engine-io mock-friendly
  }

  // Start the application
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
