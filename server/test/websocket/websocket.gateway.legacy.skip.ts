import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsTestContext, createWsTestApp, teardownTestApp } from '../websocket-test.setup';
import { createTestSocket, waitForConnection, waitForEvent, disconnectAllClients } from '../utils/websocket-test.utils';
import { AppModule } from '../../src/app.module';

describe('WebSocket Gateway (e2e)', () => {
  let context: WsTestContext;
  let clients: unknown[] = [];

  beforeAll(async () => {
    // Create test application with WebSocket support
    context = await createWsTestApp();
  });

  afterAll(async () => {
    // Disconnect all test clients
    await disconnectAllClients(...clients);
    
    // Clean up the test application
    await teardownTestApp(context.app, context.httpServer);
  });

  afterEach(async () => {
    // Disconnect all clients after each test
    await disconnectAllClients(...clients);
    clients = [];
  });

  describe('Connection', () => {
    it('should connect to WebSocket server', async () => {
      // Create a test client
      const client = createTestSocket(context, {
        auth: { userId: 'test-user-1' },
      });
      clients.push(client);

      // Wait for connection
      await expect(waitForConnection(client)).resolves.not.toThrow();
      expect(client.connected).toBe(true);
    });

    it('should reject connection without authentication', async () => {
      // Create a test client without authentication
      const client = createTestSocket(context, { autoConnect: false });
      clients.push(client);

      // Connection should be rejected
      await expect(waitForConnection(client)).rejects.toThrow();
      expect(client.connected).toBe(false);
    });
  });

  describe('Messaging', () => {
    it('should send and receive messages', async () => {
      // Create two test clients
      const client1 = createTestSocket(context, { auth: { userId: 'test-user-1' } });
      const client2 = createTestSocket(context, { auth: { userId: 'test-user-2' } });
      clients.push(client1, client2);

      // Wait for both clients to connect
      await Promise.all([
        waitForConnection(client1),
        waitForConnection(client2),
      ]);

      // Join the same room
      const testRoom = 'test-room';
      client1.emit('join-room', { room: testRoom });
      client2.emit('join-room', { room: testRoom });

      // Wait for join confirmation
      await Promise.all([
        waitForEvent(client1, 'room-joined'),
        waitForEvent(client2, 'room-joined'),
      ]);

      // Send a message from client1
      const testMessage = { text: 'Hello from test', timestamp: new Date().toISOString() };
      client1.emit('send-message', { 
        room: testRoom, 
        message: testMessage 
      });

      // Client2 should receive the message
      const receivedMessage = await waitForEvent(client2, 'new-message');
      expect(receivedMessage).toMatchObject({
        room: testRoom,
        message: testMessage,
        sender: 'test-user-1',
      });
    });
  });

  describe('Presence', () => {
    it('should track user presence', async () => {
      const userId = 'presence-test-user';
      
      // Connect first client
      const client1 = createTestSocket(context, { 
        auth: { userId },
        query: { deviceId: 'device-1' }
      });
      clients.push(client1);
      await waitForConnection(client1);

      // Join a room
      const testRoom = 'presence-room';
      client1.emit('join-room', { room: testRoom });
      await waitForEvent(client1, 'room-joined');

      // Check presence
      client1.emit('get-presence', { room: testRoom });
      const presence = await waitForEvent(client1, 'presence-update');
      
      expect(presence).toMatchObject({
        room: testRoom,
        users: expect.arrayContaining([
          expect.objectContaining({
            userId,
            online: true,
            devices: ['device-1']
          })
        ])
      });

      // Connect second device
      const client2 = createTestSocket(context, { 
        auth: { userId },
        query: { deviceId: 'device-2' }
      });
      clients.push(client2);
      await waitForConnection(client2);

      // Both devices should be online
      client2.emit('get-presence', { room: testRoom });
      const updatedPresence = await waitForEvent(client2, 'presence-update');
      
      const userPresence = updatedPresence.users.find((u: unknown) => u.userId === userId);
      expect(userPresence.devices).toHaveLength(2);
      expect(userPresence.devices).toEqual(expect.arrayContaining(['device-1', 'device-2']));
    });
  });

  describe('Disconnection', () => {
    it('should handle client disconnection', async () => {
      const client = createTestSocket(context, { 
        auth: { userId: 'disconnect-test-user' } 
      });
      clients.push(client);
      
      await waitForConnection(client);
      
      // Disconnect the client
      const disconnectPromise = new Promise<void>((resolve) => {
        client.once('disconnect', () => resolve());
      });
      
      client.disconnect();
      await disconnectPromise;
      
      expect(client.connected).toBe(false);
    });
  });
});
