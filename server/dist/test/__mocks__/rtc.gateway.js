"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    emitToUser: jest.fn().mockReturnValue(true),
    testServer: { to: jest.fn().mockReturnThis(), emit: jest.fn() },
};
//# sourceMappingURL=rtc.gateway.js.map