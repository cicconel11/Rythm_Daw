import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { AddressInfo } from 'net';

// Simple smoke test to verify the testing environment works
// This doesn't test the actual RTC functionality, just the test setup

describe('Basic Test Environment', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    console.log('1. Creating test module...');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    console.log('2. Creating Nest application...');
    app = moduleFixture.createNestApplication();
    
    // Basic HTTP server for testing
    httpServer = require('http').createServer();
    
    console.log('3. Starting HTTP server...');
    await new Promise<void>((resolve) => {
      httpServer.listen(0, '127.0.0.1', () => {
        console.log(`HTTP server listening on port ${(httpServer.address() as AddressInfo).port}`);
        resolve();
      });
    });
  });

  afterAll(async () => {
    console.log('Cleaning up...');
    if (httpServer) {
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    }
    if (app) {
      await app.close();
    }
    console.log('Cleanup complete');
  });

  it('should pass a basic test', () => {
    console.log('Running basic test...');
    expect(true).toBe(true);
  });

  it('should make an HTTP request', async () => {
    console.log('Testing HTTP request...');
    const port = (httpServer.address() as AddressInfo).port;
    const response = await new Promise<{ statusCode?: number }>((resolve) => {
      require('http').get(`http://127.0.0.1:${port}`, (res: unknown) => {
        let data = '';
        res.on('data', (chunk: string) => (data += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      }).on('error', (e: Error) => resolve({ error: e.message }));
    });

    // We expect a 404 since we didn't set up any routes
    expect(response.statusCode).toBe(404);
  });
});
