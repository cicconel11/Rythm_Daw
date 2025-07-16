import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { io, Socket as ClientSocket } from 'socket.io-client';
import { AppModule } from '../src/app.module';

// Test WebSocket Gateway to verify server events
@WebSocketGateway()
class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
}

describe('WebSocket Heartbeat (Integration)', () => {
  let app: INestApplication;
  let httpServer: any;
  let clientSocket: ClientSocket;
  const port = 3001;
  const testTimeout = 10000; // 10 seconds

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TestGateway],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Enable CORS for testing
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    // Initialize the app
    await app.init();
    
    // Start HTTP server
    httpServer = await app.listen(port);
    
    console.log(`Test WebSocket server running on port ${port}`);
  }, 30000);

  afterAll(async () => {
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
    await app.close();
  });

  function createClient() {
    return io(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      autoConnect: true,
      forceNew: true,
      timeout: 5000,
    });
  }

  it('should establish WebSocket connection', (done) => {
    clientSocket = createClient();

    const timeout = setTimeout(() => {
      clientSocket.disconnect();
      done.fail('Test timed out waiting for connection');
    }, testTimeout);

    clientSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      clearTimeout(timeout);
      clientSocket.disconnect();
      done();
    });

    clientSocket.on('connect_error', (error) => {
      clearTimeout(timeout);
      done.fail(`Failed to connect: ${error.message}`);
    });
  }, 15000);

  it('should receive and respond to ping', (done) => {
    clientSocket = createClient();
    let pingReceived = false;

    const timeout = setTimeout(() => {
      clientSocket.disconnect();
      done.fail('Test timed out waiting for ping');
    }, testTimeout);

    clientSocket.on('connect', () => {
      console.log('Connected, waiting for ping...');
    });

    clientSocket.on('ping', (data) => {
      console.log('Received ping:', data);
      pingReceived = true;
      
      // Respond to ping
      clientSocket.emit('pong', { timestamp: data.timestamp });
      
      // Wait a moment to ensure the pong is processed
      setTimeout(() => {
        clearTimeout(timeout);
        clientSocket.disconnect();
        if (pingReceived) {
          done();
        } else {
          done.fail('Did not receive ping');
        }
      }, 1000);
    });

    clientSocket.on('connect_error', (error) => {
      clearTimeout(timeout);
      done.fail(`Connection error: ${error.message}`);
    });
  }, 15000);

  it('should be disconnected after missing pongs', (done) => {
    clientSocket = createClient();
    let disconnected = false;

    const timeout = setTimeout(() => {
      if (!disconnected) {
        clientSocket.disconnect();
        done.fail('Test timed out waiting for disconnection');
      }
    }, 40000); // Longer timeout for this test

    clientSocket.on('connect', () => {
      console.log('Connected, will not respond to pings...');
    });

    clientSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      disconnected = true;
      clearTimeout(timeout);
      
      // Verify the disconnection was due to missed pongs
      if (reason === 'transport close' || reason === 'ping timeout') {
        done();
      } else {
        done.fail(`Unexpected disconnect reason: ${reason}`);
      }
    });

    clientSocket.on('ping', (data) => {
      console.log('Received ping (not responding):', data);
      // Intentionally not responding to pings to trigger disconnection
    });

    clientSocket.on('connect_error', (error) => {
      clearTimeout(timeout);
      done.fail(`Connection error: ${error.message}`);
    });
  }, 45000); // Even longer timeout for this test

  it('should handle multiple connections', (done) => {
    const client1 = createClient();
    const client2 = createClient();
    let client1Pinged = false;
    let client2Pinged = false;

    const timeout = setTimeout(() => {
      client1.disconnect();
      client2.disconnect();
      done.fail('Test timed out waiting for pings');
    }, testTimeout);

    const checkDone = () => {
      if (client1Pinged && client2Pinged) {
        clearTimeout(timeout);
        client1.disconnect();
        client2.disconnect();
        done();
      }
    };

    client1.on('ping', (data) => {
      console.log('Client 1 received ping');
      client1Pinged = true;
      client1.emit('pong', { timestamp: data.timestamp });
      checkDone();
    });

    client2.on('ping', (data) => {
      console.log('Client 2 received ping');
      client2Pinged = true;
      client2.emit('pong', { timestamp: data.timestamp });
      checkDone();
    });

    client1.on('connect_error', (error) => {
      clearTimeout(timeout);
      client2.disconnect();
      done.fail(`Client 1 connection error: ${error.message}`);
    });

    client2.on('connect_error', (error) => {
      clearTimeout(timeout);
      client1.disconnect();
      done.fail(`Client 2 connection error: ${error.message}`);
    });
  }, 20000);
});
