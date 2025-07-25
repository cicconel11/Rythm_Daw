// Enable verbose logging for debugging
process.env.DEBUG = 'socket.io*,engine*,jest*';
process.env.NODE_ENV = 'test';
process.env.JEST_DEBUG = 'true';

// Mock the WsThrottlerGuard
jest.mock('@nestjs/throttler', () => ({
  ThrottlerGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { Server, Socket } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';

describe('RtcGateway Simple Test', () => {
  let gateway: RtcGateway;
  let app: INestApplication;
  let io: Server;
  
  // Mock services
  const mockJwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
  };

  const mockThrottlerStorage = {
    getRecord: jest.fn().mockResolvedValue({ totalHits: 0, timeToExpire: 0 }),
    addRecord: jest.fn().mockResolvedValue(undefined),
  };

  const mockThrottlerOptions = {
    limit: 10,
    ttl: 60,
  };

  beforeAll(async () => {
    try {
      console.log('1. Setting up test module...');
      
      // Log environment
      console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        DEBUG: process.env.DEBUG,
        JEST_VERSION: require('jest/package.json').version,
        CWD: process.cwd()
      });
      
      // Log Node.js version and platform
      console.log('Node.js version:', process.version);
      console.log('Platform:', process.platform);
      
      // List files in the test directory for debugging
      const fs = require('fs');
      const path = require('path');
      
      const listFiles = (dir: string, indent = '') => {
        try {
          const files = fs.readdirSync(dir);
          console.log(`${indent}Directory: ${dir}`);
          files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              listFiles(fullPath, indent + '  ');
            } else {
              console.log(`${indent}  - ${file} (${stat.size} bytes)`);
            }
          });
        } catch (error) {
          console.error(`Error listing directory ${dir}:`, error);
        }
      };
      
      console.log('Current directory structure:');
      listFiles(process.cwd());
      
      // Create test module
      console.log('Creating test module...');
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RtcGateway,
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
          {
            provide: 'THROTTLER:MODULE_OPTIONS',
            useValue: mockThrottlerOptions,
          },
          {
            provide: 'ThrottlerStorage',
            useValue: mockThrottlerStorage,
          },
          {
            provide: 'Reflector',
            useValue: {
              getAllAndOverride: jest.fn(),
            },
          },
        ],
      })
      .setLogger({
        log: (message) => console.log(`[Nest] ${message}`),
        error: (message, trace) => console.error(`[Nest] ERROR: ${message}`, trace),
        warn: (message) => console.warn(`[Nest] WARN: ${message}`),
        debug: (message) => console.debug(`[Nest] DEBUG: ${message}`),
        verbose: (message) => console.log(`[Nest] VERBOSE: ${message}`)
      })
      .compile();

      console.log('2. Creating Nest application...');
      app = module.createNestApplication();
      
      console.log('3. Setting up WebSocket adapter...');
      app.useWebSocketAdapter(new IoAdapter(app));
      
      console.log('4. Initializing application...');
      await app.init();
      
      console.log('5. Getting RtcGateway instance...');
      gateway = module.get<RtcGateway>(RtcGateway);
      
      console.log('6. Creating HTTP server...');
      const httpServer = createServer();
      
      console.log('7. Creating Socket.IO server...');
      io = new Server(httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });
      
      // Use reflection to set the private server property for testing
      console.log('8. Assigning server to gateway...');
      // Using bracket notation to access private property
      (gateway as unknown as { server: Server })['server'] = io;
      
      // Start listening on a random port
      await new Promise<void>((resolve) => {
        httpServer.listen(0, () => {
          const port = (httpServer.address() as AddressInfo).port;
          console.log(`Test server listening on port ${port}`);
          resolve();
        });
      });
      
      console.log('9. Test setup complete');
    } catch (error) {
      console.error('Error during test setup:', error);
      throw error;
    }
  });

  afterAll(async () => {
    console.log('Cleaning up test...');
    try {
      if (io) {
        console.log('Closing Socket.IO server...');
        io.close();
      }
      
      if (app) {
        console.log('Closing Nest application...');
        await app.close();
      }
      console.log('Test teardown complete');
    } catch (error) {
      console.error('Error during test teardown:', error);
      throw error;
    }
  });

  it('should be defined and handle WebSocket connections', async () => {
    console.log('\n=== Starting test ===');
    
    try {
      // Basic assertions
      console.log('1. Verifying gateway and server instances...');
      expect(gateway).toBeDefined();
      expect(io).toBeDefined();
      
      const serverAddress = io.httpServer?.address();
      if (!serverAddress) {
        throw new Error('Server not listening');
      }
      
      const port = typeof serverAddress === 'string' 
        ? serverAddress.split(':').pop() 
        : serverAddress.port;
      
      console.log(`2. Server listening on port: ${port}`);
      
      // Create a simple HTTP server for the test
      const http = require('http');
      const server = http.createServer();
      
      // Test basic HTTP server
      const httpTest = new Promise<void>((resolve, reject) => {
        server.listen(0, '127.0.0.1', () => {
          const httpPort = server.address().port;
          console.log(`Test HTTP server running on port ${httpPort}`);
          
          http.get(`http://127.0.0.1:${httpPort}`, (res: unknown) => {
            console.log(`HTTP GET status: ${res.statusCode}`);
            server.close();
            resolve();
          }).on('error', (err: unknown) => {
            console.error('HTTP request failed:', err);
            server.close();
            reject(err);
          });
        });
      });
      
      await httpTest;
      
      // Test WebSocket connection
      console.log('3. Testing WebSocket connection...');
      const socketClient = require('socket.io-client');
      
      const wsTest = new Promise<void>((resolve, reject) => {
        console.log('4. Creating WebSocket client...');
        
        const client = socketClient(`http://localhost:${port}`, {
          transports: ['websocket'],
          reconnection: false,
          timeout: 5000
        });
        
        console.log('5. Setting up WebSocket event handlers...');
        
        client.on('connect', () => {
          console.log('6. WebSocket client connected successfully');
          client.disconnect();
          resolve();
        });
        
        client.on('connect_error', (err: unknown) => {
          console.error('7. WebSocket connection error:', err);
          reject(err);
        });
        
        client.on('error', (err: unknown) => {
          console.error('8. WebSocket error:', err);
          reject(err);
        });
        
        client.on('disconnect', (reason: string) => {
          console.log(`9. WebSocket disconnected: ${reason}`);
        });
        
        // Timeout if connection takes too long
        setTimeout(() => {
          if (client.connected) return;
          console.error('10. WebSocket connection timeout');
          client.close();
          reject(new Error('Connection timeout'));
        }, 10000);
      });
      
      console.log('11. Waiting for WebSocket connection...');
      await wsTest;
      
      console.log('12. Test completed successfully');
    } catch (error) {
      console.error('Test failed with error:', error);
      
      // Additional debug info
      console.log('\n=== Debug Info ===');
      console.log('Process ID:', process.pid);
      console.log('Node Version:', process.version);
      console.log('Platform:', process.platform);
      console.log('Current directory:', process.cwd());
      
      // List open handles (Node.js internal API, not available in TypeScript types)
      const nodeProcess = process as any;
      if (typeof nodeProcess._getActiveHandles === 'function') {
        console.log('\nActive handles:', nodeProcess._getActiveHandles().length);
      }
      
      throw error;
    }
  });
});
