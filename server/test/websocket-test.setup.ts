import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { createServer, Server as HttpServer } from 'http';
import { AppModule } from '../src/app.module';

const logger = new Logger('WsTestSetup');

export interface WsTestContext {
  app: INestApplication;
  httpServer: HttpServer;
  module: TestingModule;
  serverUrl: string;
}

/**
 * Creates a test application with WebSocket support
 */
export async function createWsTestApp(): Promise<WsTestContext> {
  const expressApp = express();
  const httpServer = createServer(expressApp);

  // Create testing module with required dependencies
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  // Create Nest application with Express adapter
  const app = moduleRef.createNestApplication(
    new ExpressAdapter(expressApp as any),
    { logger: ['error', 'warn', 'log'] }
  ) as INestApplication;

  // Configure WebSocket adapter
  const ioAdapter = new IoAdapter(httpServer);
  app.useWebSocketAdapter(ioAdapter);
  
  try {
    // Initialize the application
    await app.init();
    
    // Start the HTTP server on a random port
    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        logger.log(`Test server listening on port ${httpServer.address().port}`);
        resolve();
      });
    });
    
    // Get the server URL
    const address = httpServer.address();
    let port: number;
    
    if (address === null) {
      port = 0;
    } else if (typeof address === 'string') {
      port = parseInt(address.split(':').pop() || '0', 10);
    } else {
      port = address.port || 0;
    }
    
    return { 
      app, 
      httpServer, 
      module: moduleRef,
      serverUrl: `http://localhost:${port}`
    };
  } catch (error) {
    logger.error('Failed to create test app', error);
    await teardownTestApp(app, httpServer);
    throw error;
  }
}

/**
 * Tears down the test application and releases resources
 */
export async function teardownTestApp(
  app: INestApplication | null | undefined, 
  httpServer: HttpServer | null | undefined
): Promise<void> {
  try {
    // Close the HTTP server if it exists
    if (httpServer) {
      await new Promise<void>((resolve) => {
        if (httpServer.listening) {
          httpServer.close(() => {
            logger.log('Test HTTP server closed');
            resolve();
          });
        } else {
          resolve();
        }
      });
    }
    
    // Close the Nest application if it exists
    if (app) {
      await app.close();
      logger.log('Nest application closed');
    }
  } catch (error) {
    logger.error('Error during test teardown', error);
    throw error;
  }
}
