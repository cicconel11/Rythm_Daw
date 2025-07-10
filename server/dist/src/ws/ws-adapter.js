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
const ws_1 = require("ws");
let WsAdapter = WsAdapter_1 = class WsAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app) {
        super(app);
        this.logger = new common_1.Logger(WsAdapter_1.name);
    }
    create(port, options) {
        if (!this.httpServer) {
            this.httpServer = (0, http_1.createServer)();
        }
        const io = new socket_io_1.Server(this.httpServer, {
            ...options,
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        this.wsServer = new ws_1.Server({
            server: this.httpServer,
            path: '/socket.io/',
        });
        if (port && typeof port === 'number') {
            this.httpServer.listen(port);
            this.logger.log(`WebSocket server listening on port ${port}`);
        }
        io.httpServer = this.httpServer;
        io.wsServer = this.wsServer;
        return io;
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
        if (this.wsServer) {
            await new Promise((resolve) => {
                this.wsServer.close(() => {
                    this.logger.log('WebSocket server closed');
                    resolve();
                });
            });
        }
        if (this.httpServer) {
            await new Promise((resolve) => {
                this.httpServer.close(() => {
                    this.logger.log('HTTP server closed');
                    resolve();
                });
            });
        }
    }
};
exports.WsAdapter = WsAdapter;
exports.WsAdapter = WsAdapter = WsAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], WsAdapter);
//# sourceMappingURL=ws-adapter.js.map