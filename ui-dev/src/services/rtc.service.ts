import { io, Socket } from "socket.io-client";
import { getAuthToken } from "../utils/auth";
import { ClientEvents, ServerEvents } from "../types/websocket.types";

type EventCallback<T = unknown> = (data: T) => void;

export class RtcService {
  private static instance: RtcService;
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Set<EventCallback>> = new Map();
  private connectionPromise: Promise<void> | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private pingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.connect();
  }

  public static getInstance(): RtcService {
    if (!RtcService.instance) {
      RtcService.instance = new RtcService();
    }
    return RtcService.instance;
  }

  private getSocketUrl(): string {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.REACT_APP_WS_URL || window.location.host;
    return `${protocol}//${host}`;
  }

  public connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    if (this.socket?.connected) {
      return Promise.resolve();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      if (this.isConnecting) {
        return;
      }

      this.isConnecting = true;
      const token = getAuthToken();

      if (!token) {
        const error = new Error("No authentication token available");
        this.handleConnectionError(error);
        return reject(error);
      }

      try {
        this.socket = io(this.getSocketUrl(), {
          path: "/socket.io",
          transports: ["websocket"],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectInterval,
          auth: { token },
          query: {
            clientType: "web",
            version: process.env.REACT_APP_VERSION || "1.0.0",
          },
          timeout: 10000,
        });

        this.setupEventListeners();
        this.setupPingPong();

        this.socket.on("connect", () => {
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.emitEvent(ServerEvents.CONNECT, {
            message: "Connected to RTC server",
            timestamp: new Date().toISOString(),
          });
          resolve();
        });

        this.socket.on("connect_error", (error) => {
          this.handleConnectionError(error);
          reject(error);
        });
      } catch (error) {
        this.handleConnectionError(error);
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Handle built-in events
    Object.values(ServerEvents).forEach((event) => {
      this.socket?.on(event, (data: unknown) => {
        this.emitEvent(event, data);
      });
    });

    // Handle disconnection
    this.socket.on("disconnect", (reason) => {
      this.emitEvent("disconnect", { reason });
      this.cleanup();

      // Attempt to reconnect if not explicitly disconnected
      if (reason !== "io client disconnect") {
        this.reconnect();
      }
    });
  }

  private setupPingPong() {
    // Clear existing interval if any
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Send ping every 25 seconds (server timeout is 30s)
    this.pingInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.emit(ClientEvents.PING, { timestamp: Date.now() });
      }
    }, 25000);
  }

  private handleConnectionError(error: unknown) {
    console.error("WebSocket connection error:", error);
    this.isConnecting = false;
    this.connectionPromise = null;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      this.emitEvent("error", {
        type: "connection_error",
        message: "Failed to connect to RTC server",
        error: (error as Error)?.message || "Unknown error",
      });
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.cleanup();
    }
  }

  private cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.connectionPromise = null;
    this.isConnecting = false;
  }

  public emit<T = unknown>(event: string, data?: T): void {
    if (!this.socket?.connected) {
      console.warn(`Cannot emit ${event}: WebSocket not connected`);
      return;
    }
    this.socket.emit(event, data);
  }

  public on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    const handlers = this.eventHandlers.get(event)!;
    handlers.add(callback);

    // Return unsubscribe function
    return () => {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    };
  }

  public off(event: string, callback: EventCallback): void {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event)!;
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }

  private emitEvent(event: string, data: unknown) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event)!;
      handlers.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  // RTC-specific methods
  public joinRoom(
    roomId: string,
  ): Promise<{ success: boolean; roomId: string }> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        return reject(new Error("Not connected to WebSocket server"));
      }

      this.socket.emit(
        ClientEvents.JOIN_ROOM,
        { roomId },
        (response: unknown) => {
          if ((response as unknown as { error?: string })?.error) {
            reject(new Error((response as unknown as { error?: string }).error));
          } else {
            resolve(response as { success: boolean; roomId: string });
          }
        },
      );
    });
  }

  public leaveRoom(
    roomId: string,
  ): Promise<{ success: boolean; roomId: string }> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        return reject(new Error("Not connected to WebSocket server"));
      }

      this.socket.emit(
        ClientEvents.LEAVE_ROOM,
        { roomId },
        (response: unknown) => {
          if ((response as unknown as { error?: string })?.error) {
            reject(new Error((response as unknown as { error?: string }).error));
          } else {
            resolve(response as { success: boolean; roomId: string });
          }
        },
      );
    });
  }
  public sendTrackUpdate(update: unknown): void {
    this.emit(ClientEvents.TRACK_UPDATE, update);
  }

  public sendSignal(signal: unknown): void {
    this.emit(ClientEvents.SIGNAL, signal);
  }
}

export const rtcService = RtcService.getInstance();

export default rtcService;
