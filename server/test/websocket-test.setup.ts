import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from '../src/app.module';
import { mockLogger } from './__mocks__/logger';
import * as http from 'http';
import * as io from 'socket.io';
import { ExpressAdapter } from '@nestjs/platform-express';

export interface TestAppContext {
  app: INestApplication;
  httpServer: http.Server;
  port: number;
}

let testAppContext: TestAppContext | null = null;

/**
 * Creates a test application with WebSocket support
 * @returns {Promise<TestAppContext>} The test application context
 */
export async function createWsTestApp(): Promise<TestAppContext> {
  if (testAppContext) {
    return testAppContext;
  }

  // Create Express app and HTTP server
  const express = require('express');
  const server = express();
  const httpServer = http.createServer(server);
  
  // Create Socket.IO server
  const ioServer = new io.Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  
  // Create testing module
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  // Create app with Express adapter
  const app = moduleFixture.createNestApplication(new ExpressAdapter(server));
  
  // Use IoAdapter with the Socket.IO server
  app.useWebSocketAdapter(new IoAdapter(ioServer));
  
  // Apply mock logger
  app.useLogger(mockLogger);
  
  try {
    // Initialize the app
    await app.init();
    
    // Start listening on a random port
    const port = await new Promise<number>((resolve, reject) => {
      const listener = httpServer.listen(0, '0.0.0.0', () => {
        const address = listener.address();
        const port = typeof address === 'string' ? parseInt(address.split(':').pop() || '0', 10) : address?.port || 0;
        console.log(`Test server listening on port ${port}`);
        resolve(port);
      });
      listener.on('error', reject);
    });
    
    testAppContext = { app, httpServer, port };
    return testAppContext;
  } catch (error) {
    await app.close();
    httpServer.close();
    throw error;
  }
}

export async function teardownTestApp(): Promise<void> {
  if (!testAppContext) {
    return;
  }

  const { app, httpServer } = testAppContext;
  
  try {
    if (app) {
      await app.close();
    }
  } catch (error) {
    console.error('Error closing app:', error);
  }

  try {
    if (httpServer) {
      await new Promise<void>((resolve) => {
        httpServer.close(() => {
          console.log('Test server closed');
          resolve();
        });
      });
    }
  } catch (error) {
    console.error('Error closing HTTP server:', error);
  }

  testAppContext = null;
  await new Promise(resolve => setTimeout(resolve, 500)); // Short delay for cleanup
}
