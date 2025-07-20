// Type declarations for socket.io v4.8.1 with @types/socket.io v3.0.2
declare module 'socket.io' {
  import { Server as HttpServer } from 'http';
  import { Server as HttpsServer } from 'https';
  import { Server as NetServer } from 'net';
  import { EventEmitter } from 'events';

  interface Server extends EventEmitter {
    // Server methods
    attach(srv: HttpServer | HttpsServer | number, opts?: any): Server;
    attachApp(app: any, opts?: any): void;
    listen(srv: HttpServer | HttpsServer | number, opts?: any): Server;
    bind(srv: NetServer): void;
    onconnection(socket: any): void;
    of(nsp: string): Namespace;
    close(callback?: () => void): void;
    
    // Socket.IO v4 methods
    to(room: string | string[]): Server;
    in(room: string | string[]): Server;
    except(room: string | string[]): Server;
    socketsJoin(room: string | string[]): void;
    socketsLeave(room: string | string[]): void;
    disconnectSockets(close?: boolean): void;
    fetchSockets(): Promise<Socket[]>;
    serverSideEmit(ev: string, ...args: any[]): void;
    
    // Properties
    engine: any;
    nsps: { [namespace: string]: Namespace };
    sockets: Namespace;
  }

  interface Namespace extends EventEmitter {
    name: string;
    connected: { [id: string]: Socket };
    sockets: Map<string, Socket>;
    adapter: any;
    
    to(room: string): Namespace;
    in(room: string): Namespace;
    use(fn: (socket: Socket, next: (err?: Error) => void) => void): Namespace;
    emit(ev: string, ...args: any[]): boolean;
    send(...args: any[]): Namespace;
    write(...args: any[]): Namespace;
    clients(...args: any[]): Namespace;
    compress(compress: boolean): Namespace;
  }

  interface Socket extends EventEmitter {
    id: string;
    connected: boolean;
    disconnected: boolean;
    handshake: any;
    rooms: Set<string>;
    data: any;
    
    // Custom properties
    user?: {
      id: string;
      email: string;
      name?: string;
      [key: string]: any;
    };
    
    // Socket.IO v4 methods
    join(room: string | string[]): Promise<string[]>;
    leave(room: string): void;
    to(room: string | string[]): Socket;
    in(room: string | string[]): Socket;
    except(room: string | string[]): Socket;
    send(...args: any[]): Socket;
    emit(ev: string, ...args: any[]): boolean;
    broadcast: Socket;
    
    // Event handling
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    removeListener(event: string, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string): this;
    disconnect(close?: boolean): Socket;
  }

  interface ServerOptions {
    path?: string;
    serveClient?: boolean;
    connectTimeout?: number;
    cors?: {
      origin: string | string[] | ((origin: string, callback: (err: Error | null, success: boolean) => void) => void);
      methods?: string[];
      allowedHeaders?: string[];
      credentials?: boolean;
    };
    allowEIO3?: boolean;
    pingTimeout?: number;
    pingInterval?: number;
    maxHttpBufferSize?: number;
    httpCompression?: boolean | object;
    transports?: string[];
    allowUpgrades?: boolean;
    perMessageDeflate?: boolean | object;
    cookie?: string | boolean | object;
    // Add other options as needed
  }

  function listen(srv: HttpServer | HttpsServer | number, opts?: ServerOptions): Server;
  function listen(port: number, opts?: ServerOptions): Server;
  function listen(port: number, opts?: any, fn?: () => void): Server;
  
  export const Server: {
    (srv?: any, opts?: ServerOptions): Server;
    new (srv?: any, opts?: ServerOptions): Server;
  };
}
