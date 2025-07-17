"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WsExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let WsExceptionFilter = WsExceptionFilter_1 = class WsExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(WsExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToWs();
        const client = ctx.getClient();
        let error;
        let status = 'error';
        if (exception instanceof websockets_1.WsException) {
            error = exception.getError();
            status = 'ws_error';
        }
        else {
            error = exception.message || 'Internal server error';
            this.logger.error(`WebSocket error: ${exception.message}`, exception.stack);
        }
        const errorResponse = {
            status,
            timestamp: new Date().toISOString(),
            message: error,
            error: exception.name || 'WebSocketError',
        };
        client.emit('error', errorResponse);
        if (!(exception instanceof websockets_1.WsException)) {
            this.logger.error(`WebSocket error for client ${client.id}: ${exception.message}`, exception.stack);
        }
    }
};
exports.WsExceptionFilter = WsExceptionFilter;
exports.WsExceptionFilter = WsExceptionFilter = WsExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(websockets_1.WsException, Error)
], WsExceptionFilter);
//# sourceMappingURL=ws-exception.filter.js.map