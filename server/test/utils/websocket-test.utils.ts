import { io, Socket } from 'socket.io-client';
import { WsTestContext } from '../websocket-test.setup';

export interface TestSocketClient extends Socket {
  testId: string;
  userId?: string;
  projectId?: string;
}

export interface TestSocketOptions {
  auth?: {
    token?: string;
    userId?: string;
  };
  query?: Record<string, string>;
  autoConnect?: boolean;
}

/**
 * Creates a test WebSocket client
 */
export function createTestSocket(
  context: WsTestContext,
  options: TestSocketOptions = {}
): TestSocketClient {
  const { auth = {}, query = {}, autoConnect = true } = options;
  
  // Build query string with auth if provided
  const queryParams = new URLSearchParams(query);
  if (auth.token) {
    queryParams.set('token', auth.token);
  }
  if (auth.userId) {
    queryParams.set('userId', auth.userId);
  }

  // Create socket client
  const client = io(context.serverUrl, {
    path: '/ws',
    transports: ['websocket'],
    autoConnect,
    forceNew: true,
    reconnection: false,
    query: Object.fromEntries(queryParams),
  }) as TestSocketClient;

  // Add test ID for debugging
  client.testId = `test-${Math.random().toString(36).substring(2, 8)}`;
  
  // Add user ID if provided
  if (auth.userId) {
    client.userId = auth.userId;
  }

  return client;
}

/**
 * Waits for a socket connection to be established
 */
export function waitForConnection(client: Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    if (client.connected) {
      return resolve();
    }

    const timeout = setTimeout(() => {
      client.off('connect', onConnect);
      client.off('connect_error', onError);
      reject(new Error('Connection timeout'));
    }, 5000);

    const onConnect = () => {
      clearTimeout(timeout);
      client.off('connect_error', onError);
      resolve();
    };

    const onError = (err: Error) => {
      clearTimeout(timeout);
      client.off('connect', onConnect);
      reject(err);
    };

    client.once('connect', onConnect);
    client.once('connect_error', onError);
  });
}

/**
 * Waits for a specific event on a socket
 */
export function waitForEvent<T = any>(
  client: Socket,
  event: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.off(event, onEvent);
      reject(new Error(`Timeout waiting for event: ${event}`));
    }, 5000);

    const onEvent = (data: T) => {
      clearTimeout(timeout);
      resolve(data);
    };

    client.once(event, onEvent);
  });
}

/**
 * Disconnects all test clients
 */
export async function disconnectAllClients(...clients: Socket[]): Promise<void> {
  await Promise.all(
    clients.map(
      (client) =>
        new Promise<void>((resolve) => {
          if (client.connected) {
            client.once('disconnect', () => resolve());
            client.disconnect();
          } else {
            resolve();
          }
        })
    )
  );
}

/**
 * Creates multiple test clients
 */
export function createTestClients(
  context: WsTestContext,
  count: number,
  options: TestSocketOptions = {}
): TestSocketClient[] {
  return Array.from({ length: count }, (_, i) =>
    createTestSocket(context, {
      ...options,
      auth: {
        ...options.auth,
        userId: options.auth?.userId || `test-user-${i + 1}`,
      },
    })
  );
}
