"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WsAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
process.on('uncaughtException', (error) => {
    console.error('WebSocket uncaught exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('WebSocket unhandled rejection at:', promise, 'reason:', reason);
});
let WsAdapter = WsAdapter_1 = class WsAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app) {
        super(app);
        this.logger = new common_1.Logger(WsAdapter_1.name);
        this.httpServer = null;
        this.wsServer = null;
        this.app = app;
        this.createHttpServer();
    }
    createHttpServer() {
        if (!this.httpServer) {
            this.logger.log('Creating HTTP server for WebSockets');
            this.httpServer = (0, http_1.createServer)((req, res) => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('RHYTHM WebSocket Server');
            });
            this.httpServer.on('error', (error) => {
                this.logger.error('HTTP server error:', error);
            });
            this.httpServer.on('listening', () => {
                const address = this.httpServer?.address();
                this.logger.log(`HTTP server listening on ${typeof address === 'string' ? address : address?.port}`);
            });
        }
    }
    createIOServer(port, options) {
        try {
            this.logger.log(`Creating Socket.IO server on port ${port}`);
            if (!this.httpServer) {
                throw new Error('HTTP server not initialized');
            }
            const io = new socket_io_1.Server(this.httpServer, {
                ...options,
                cors: {
                    origin: process.env.CORS_ORIGINS?.split(',') || '*',
                    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                    credentials: true,
                },
                pingTimeout: 60000,
                pingInterval: 25000,
                maxHttpBufferSize: 1e8,
            });
            io.on('connection', (socket) => {
                this.logger.log(`Client connected: ${socket.id}`);
                socket.on('disconnect', (reason) => {
                    this.logger.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
                });
                socket.on('error', (error) => {
                    this.logger.error(`Socket error (${socket.id}):`, error);
                });
            });
            io.engine.on('connection_error', (error) => {
                this.logger.error('Socket.IO connection error:', error);
            });
            return io;
        }
        catch (error) {
            this.logger.error('Failed to create Socket.IO server:', error);
            throw error;
        }
    }
    create(port, options) {
        try {
            this.logger.log(`Creating WebSocket server on port ${port}`);
            this.createHttpServer();
            if (!this.httpServer) {
                throw new Error('Failed to create HTTP server');
            }
            if (this.httpServer.listening) {
                this.logger.log('HTTP server is already running, closing it first...');
                this.close();
            }
            return new Promise((resolve, reject) => {
                if (!this.httpServer) {
                    return reject(new Error('HTTP server not initialized'));
                }
                const errorHandler = (error) => {
                    this.logger.error(`Failed to bind to port ${port}:`, error);
                    reject(error);
                };
                this.httpServer.once('error', errorHandler);
                this.httpServer.listen(port, () => {
                    this.httpServer?.removeListener('error', errorHandler);
                    this.logger.log(`WebSocket server bound to port ${port}`);
                    try {
                        const io = this.createIOServer(port, options);
                        this.io = io;
                        process.on('SIGTERM', () => this.close());
                        process.on('SIGINT', () => this.close());
                        resolve(io);
                    }
                    catch (error) {
                        this.logger.error('Failed to create Socket.IO server:', error);
                        reject(error);
                    }
                });
            });
        }
        catch (error) {
            this.logger.error('Failed to create WebSocket server:', error);
            throw error;
        }
    }
    updateCors(app, origin = '*') {
        const io = app.getHttpServer().io;
        if (io?.engine) {
            io.opts.cors = {
                origin,
                methods: ['GET', 'POST']
            };
        }
    }
    async close() {
        try {
            this.logger.log('Closing WebSocket server...');
            if (this.io) {
                await new Promise((resolve) => {
                    this.io.close(() => {
                        this.logger.log('Socket.IO server closed');
                        resolve();
                    });
                });
            }
            if (this.wsServer) {
                this.wsServer.close(() => {
                    this.logger.log('WebSocket server closed');
                });
                this.wsServer = null;
            }
            if (this.httpServer) {
                await new Promise((resolve) => {
                    this.httpServer?.close((err) => {
                        if (err) {
                            this.logger.error('Error closing HTTP server:', err);
                        }
                        else {
                            this.logger.log('HTTP server closed');
                        }
                        resolve();
                    });
                });
                this.httpServer = null;
            }
            this.logger.log('WebSocket server shutdown complete');
        }
        catch (error) {
            this.logger.error('Error during WebSocket server shutdown:', error);
            throw error;
        }
    }
};
exports.WsAdapter = WsAdapter;
exports.WsAdapter = WsAdapter = WsAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], WsAdapter);
//# sourceMappingURL=ws-adapter.js.map