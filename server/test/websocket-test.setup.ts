import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from '../src/app.module';
import { mockLogger } from './__mocks__/logger';

let app: INestApplication;


export async function setupTestApp() {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  
  // Use WebSocket adapter
  app.useWebSocketAdapter(new WsAdapter(app));
  
  // Apply mock logger
  app.useLogger(mockLogger);
  
  await app.init();
  
  // Start the HTTP server on a random port
  const httpServer = await app.listen(0);
  const port = httpServer.address().port;
  
  return { app, port };
}

export async function teardownTestApp() {
  if (app) {
    await app.close();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for server to close
  }
}
