import { useEffect, useRef, useCallback } from "react";
import { getAuthToken } from "../utils/auth";

export type MessageHandler = (data: unknown) => void;

type EventHandlers = {
  [event: string]: MessageHandler[];
};

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private eventHandlers: EventHandlers = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private isConnecting = false;
  private connectionPromise: Promise<void> | null = null;

  // Track connection status
  public get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  private constructor() {
    this.connect();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.REACT_APP_WS_URL || `${window.location.host}`;
    return `${protocol}//${host}/ws`;
  }

  public connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        return;
      }

      this.isConnecting = true;
      const token = getAuthToken();

      if (!token) {
        reject(new Error("No authentication token available"));
        return;
      }

      try {
        const wsUrl = new URL(this.getWebSocketUrl());
        wsUrl.searchParams.append("token", token);

        this.socket = new WebSocket(wsUrl.toString());

        this.socket.onopen = () => {
          console.log("WebSocket connection established");
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.connectionPromise = null;
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        this.socket.onclose = () => {
          console.log("WebSocket connection closed");
          this.socket = null;
          this.connectionPromise = null;
          this.isConnecting = false;
          this.handleReconnect();
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.socket?.close();
        };
      } catch (error) {
        this.isConnecting = false;
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
      );
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  private handleMessage(message: { event: string; data: unknown }) {
    const { event, data } = message;
    const handlers = this.eventHandlers[event] || [];
    handlers.forEach((handler) => handler(data));
  }

  public on(event: string, handler: MessageHandler): () => void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);

    // Return cleanup function
    return () => this.off(event, handler);
  }

  public off(event: string, handler: MessageHandler): void {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        (h) => h !== handler,
      );
    }
  }

  public emit(event: string, data: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ event, data });
      this.socket.send(message);
    } else {
      console.warn("WebSocket is not connected. Attempting to reconnect...");
      this.connect()
        .then(() => this.emit(event, data))
        .catch((error) => console.error("Failed to reconnect:", error));
    }
  }

  public joinRoom(roomId: string): void {
    this.emit("joinRoom", { roomId });
  }

  public leaveRoom(roomId: string): void {
    this.emit("leaveRoom", { roomId });
  }

  public sendTrackUpdate(trackData: unknown): void {
    this.emit("trackUpdate", trackData);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connectionPromise = null;
      this.eventHandlers = {};
    }
  }
}

export const useWebSocket = () => {
  const wsService = useRef<WebSocketService>();

  useEffect(() => {
    wsService.current = WebSocketService.getInstance();

    return () => {
      // Only disconnect if no other components are using the WebSocket
      // This prevents disconnecting when unmounting a component
      // while others might still need the connection
      // wsService.current?.disconnect();
    };
  }, []);

  const on = useCallback((event: string, handler: MessageHandler) => {
    if (!wsService.current) return () => {};
    return wsService.current.on(event, handler);
  }, []);

  const off = useCallback((event: string, handler: MessageHandler) => {
    wsService.current?.off(event, handler);
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    wsService.current?.emit(event, data);
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    wsService.current?.joinRoom(roomId);
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    wsService.current?.leaveRoom(roomId);
  }, []);

  const sendTrackUpdate = useCallback((trackData: unknown) => {
    wsService.current?.sendTrackUpdate(trackData);
  }, []);

  return {
    on,
    off,
    emit,
    joinRoom,
    leaveRoom,
    sendTrackUpdate,
    isConnected: wsService.current?.isConnected || false,
  };
};

export default WebSocketService.getInstance();
