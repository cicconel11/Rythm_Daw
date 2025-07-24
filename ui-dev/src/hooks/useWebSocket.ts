import { useCallback, useEffect, useRef } from "react";
import {
  WebSocketService,
  MessageHandler,
} from "../services/websocket.service";

interface UseWebSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const wsService = useRef<WebSocketService>();
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const eventHandlersRef = useRef<Array<() => void>>([]);

  // Initialize WebSocket service
  useEffect(() => {
    wsService.current = WebSocketService.getInstance();

    const handleConnect = () => {
      reconnectAttemptsRef.current = 0;
      onConnect?.();
    };

    const handleDisconnect = () => {
      onDisconnect?.();

      if (autoReconnect && reconnectAttemptsRef.current < reconnectAttempts) {
        reconnectAttemptsRef.current++;
        console.log(
          `Attempting to reconnect (${reconnectAttemptsRef.current}/${reconnectAttempts})...`,
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          wsService.current?.connect().catch(console.error);
        }, reconnectInterval);
      }
    };

    const handleError = (error: Event) => {
      console.error("WebSocket error:", error);
      onError?.(error);
    };

    // Set up event listeners
    const cleanupConnect = wsService.current.on("connect", handleConnect);
    const cleanupDisconnect = wsService.current.on(
      "disconnect",
      handleDisconnect,
    );
    const cleanupError = wsService.current.on("error", handleError);

    // Connect to WebSocket
    wsService.current.connect().catch(console.error);

    // Clean up on unmount
    return () => {
      cleanupConnect();
      cleanupDisconnect();
      cleanupError();

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Clean up any registered event handlers
      eventHandlersRef.current.forEach((cleanup) => cleanup());
      eventHandlersRef.current = [];
    };
  }, [
    autoReconnect,
    onConnect,
    onDisconnect,
    onError,
    reconnectAttempts,
    reconnectInterval,
  ]);

  // Helper to subscribe to events
  const on = useCallback((event: string, handler: MessageHandler) => {
    if (!wsService.current) return () => {};

    const cleanup = wsService.current.on(event, handler);
    eventHandlersRef.current.push(cleanup);

    return () => {
      cleanup();
      eventHandlersRef.current = eventHandlersRef.current.filter(
        (cb) => cb !== cleanup,
      );
    };
  }, []);

  // Helper to send messages
  const emit = useCallback((event: string, data: any) => {
    wsService.current?.emit(event, data);
  }, []);

  // Room management
  const joinRoom = useCallback((roomId: string) => {
    wsService.current?.joinRoom(roomId);
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    wsService.current?.leaveRoom(roomId);
  }, []);

  // Audio track updates
  const sendTrackUpdate = useCallback((trackData: any) => {
    wsService.current?.sendTrackUpdate(trackData);
  }, []);

  // Connection status
  const isConnected = wsService.current?.isConnected || false;

  return {
    on,
    emit,
    joinRoom,
    leaveRoom,
    sendTrackUpdate,
    isConnected,
  };
};

// Example usage in a component:
/*
const MyComponent = () => {
  const { on, emit, isConnected } = useWebSocket({
    onConnect: () => console.log('Connected to WebSocket'),
    onDisconnect: () => console.log('Disconnected from WebSocket'),
  });

  useEffect(() => {
    // Subscribe to track updates
    const cleanup = on('trackUpdate', (data) => {
      console.log('Received track update:', data);
      // Update your component state here
    });

    return cleanup;
  }, [on]);

  const handleTrackChange = (trackData) => {
    emit('trackUpdate', trackData);
  };

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <button onClick={() => handleTrackChange({ volume: 0.8 })}>
        Update Track
      </button>
    </div>
  );
};
*/
