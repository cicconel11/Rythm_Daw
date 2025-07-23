"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const throttler_2 = require("@nestjs/throttler");
const root_controller_1 = require("./common/root.controller");
const security_module_1 = require("./common/security.module");
const prisma_module_1 = require("./prisma/prisma.module");
const ioredis_1 = require("ioredis");
const ping_controller_1 = require("./common/ping.controller");
const auth_login_controller_1 = require("./common/auth-login.controller");
const files_upload_controller_1 = require("./common/files-upload.controller");
const plugins_module_1 = require("./modules/plugins/plugins.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    { limit: 100, ttl: 900 },
                ],
            }),
            security_module_1.SecurityModule,
            prisma_module_1.PrismaModule,
            plugins_module_1.PluginsModule,
        ],
        controllers: [
            root_controller_1.RootController,
            ping_controller_1.PingController,
            auth_login_controller_1.AuthLoginController,
            files_upload_controller_1.FilesUploadController,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_2.ThrottlerGuard,
            },
            {
                provide: 'REDIS_CLIENT',
                useFactory: () => {
                    const redis = new ioredis_1.Redis(process.env.REDIS_URL || 'redis://localhost:6379');
                    return redis;
                },
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map