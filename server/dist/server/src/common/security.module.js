"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityModule = void 0;
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
let SecurityModule = class SecurityModule {
    configure(consumer) {
        consumer
            .apply((0, helmet_1.default)({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    "default-src": ["'self'"],
                    "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    "object-src": ["'none'"],
                    "img-src": ["'self'", "data:", "blob:"],
                    "style-src": ["'self'", "'unsafe-inline'"],
                    "frame-ancestors": ["'none'"],
                },
            },
            frameguard: { action: 'deny' },
            hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
            hidePoweredBy: true,
        }))
            .forRoutes('*');
    }
};
exports.SecurityModule = SecurityModule;
exports.SecurityModule = SecurityModule = __decorate([
    (0, common_1.Module)({})
], SecurityModule);
//# sourceMappingURL=security.module.js.map