import { io, type Socket } from 'socket.io-client';
import type { Server } from 'socket.io';
import { fork, type ChildProcess } from 'child_process';
import { join } from 'path';
import { AddressInfo } from 'net';

interface ServerMessage {
  port: number;
}

describe('Standalone WebSocket Server', () => {
  let serverProcess: ChildProcess | null = null;
  let port: number;
  const TEST_TIMEOUT = 5000;

  beforeAll((done) => {
    try {
      // Start the standalone WebSocket server as a child process
      serverProcess = fork(join(__dirname, 'standalone-ws-server.ts'), [], {
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
        execArgv: ['-r', 'ts-node/register/transpile-only']
      });

      if (!serverProcess) {
        throw new Error('Failed to start WebSocket server process');
      }

      // Get the port from the child process
      serverProcess.on('message', (message: unknown) => {
        try {
          const { port: serverPort } = message as ServerMessage;
          console.log(`WebSocket server started on port ${serverPort}`);
          port = serverPort;
          done();
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          console.error('Failed to parse server message:', error);
          done(error);
        }
      });

      // Log server output
      serverProcess.stdout?.on('data', (data: Buffer) => {
        console.log(`[Test Server] ${data.toString().trim()}`);
      });
      
      serverProcess.stderr?.on('data', (data: Buffer) => {
        console.error(`[Test Server Error] ${data.toString().trim()}`);
      });

      // Handle process errors
      serverProcess.on('error', (err) => {
        console.error('WebSocket server process error:', err);
        done(err);
      });

      // Handle unexpected exit
      serverProcess.on('exit', (code) => {
        if (code !== 0) {
          const error = new Error(`Test server process exited with code ${code}`);
          console.error(error.message);
          if (code === null) {
            done(new Error('Test server process failed to start'));
          }
        }
      });

      // Set a timeout for server startup
      const startupTimeout = setTimeout(() => {
        console.error('WebSocket server startup timed out');
        done(new Error('Server startup timed out'));
      }, 10000);

      // Clean up timeout on success
      serverProcess.once('message', () => {
        clearTimeout(startupTimeout);
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Failed to start WebSocket server:', error);
      done(error);
    }
  }, 15000); // Increased timeout for server startup

  afterAll((done) => {
    if (!serverProcess) {
      return done();
    }

    const cleanup = () => {
      if (serverProcess) {
        serverProcess.removeAllListeners();
        serverProcess.kill();
        serverProcess = null;
      }
      done();
    };

    // Set a timeout to force cleanup if server doesn't shut down gracefully
    const cleanupTimeout = setTimeout(() => {
      console.warn('Forcing WebSocket server cleanup');
      cleanup();
    }, 5000);

    // Try to shut down gracefully
    if (serverProcess.connected) {
      serverProcess.once('close', () => {
        clearTimeout(cleanupTimeout);
        cleanup();
      });
      serverProcess.send({ type: 'shutdown' });
      
      // Force kill after a short delay if not already done
      setTimeout(() => {
        if (serverProcess) {
          serverProcess.kill('SIGKILL');
        }
      }, 3000);
    } else {
      cleanup();
    }
  });

  it('should connect to the WebSocket server', (done) => {
    if (!port) {
      return done(new Error('Server port not available'));
    }
    
    const socket: Socket = io(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 5000
    });

    // Set up event handlers
    const onConnect = () => {
      try {
        expect(socket.connected).toBe(true);
        socket.off('connect', onConnect);
        socket.off('connect_error', onError);
        socket.disconnect();
        done();
      } catch (err) {
        socket.disconnect();
        done(err as Error);
      }
    };

    const onError = (err: Error) => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      socket.disconnect();
      done(err);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onError);

    // Set a timeout in case the socket doesn't connect
    const timeout = setTimeout(() => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      socket.disconnect();
      done(new Error('Connection timeout'));
    }, TEST_TIMEOUT);

    // Clean up the timeout if the test completes
    socket.once('disconnect', () => {
      clearTimeout(timeout);
    });
  }, TEST_TIMEOUT * 2);

  it('should echo messages', (done) => {
    if (!port) {
      return done(new Error('Server port not available'));
    }
    
    const socket: Socket = io(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 5000
    });

    const onConnect = () => {
      const testMessage = { test: 'data' };
      
      const responseHandler = (response: any) => {
        try {
          expect(response).toHaveProperty('test', 'data');
          expect(response).toHaveProperty('timestamp');
          expect(typeof response.timestamp).toBe('number');
          
          // Clean up
          socket.off('connect', onConnect);
          socket.off('connect_error', onError);
          socket.disconnect();
          clearTimeout(timeout);
          done();
        } catch (err) {
          socket.disconnect();
          done(err as Error);
        }
      };

      // Send the echo request
      socket.emit('echo', testMessage, responseHandler);
    };

    const onError = (err: Error) => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      socket.disconnect();
      clearTimeout(timeout);
      done(err);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onError);

    // Set a timeout for the test
    const timeout = setTimeout(() => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      socket.disconnect();
      done(new Error('Test timeout'));
    }, TEST_TIMEOUT);
  }, TEST_TIMEOUT * 2);

  it('should handle disconnection', (done) => {
    if (!port) {
      return done(new Error('Server port not available'));
    }
    
    const socket: Socket = io(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 5000
    });

    const onConnect = () => {
      expect(socket.connected).toBe(true);
      
      const onDisconnect = (reason: string) => {
        try {
          expect(socket.connected).toBe(false);
          
          // Clean up
          socket.off('connect', onConnect);
          socket.off('connect_error', onError);
          socket.off('disconnect', onDisconnect);
          clearTimeout(timeout);
          done();
        } catch (err) {
          done(err as Error);
        }
      };
      
      socket.on('disconnect', onDisconnect);
      
      // Initiate disconnection
      socket.disconnect();
    };

    const onError = (err: Error) => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      socket.disconnect();
      clearTimeout(timeout);
      done(err);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onError);

    // Set a timeout for the test
    const timeout = setTimeout(() => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      socket.disconnect();
      done(new Error('Test timeout'));
    }, TEST_TIMEOUT);
  }, TEST_TIMEOUT * 2);
});
