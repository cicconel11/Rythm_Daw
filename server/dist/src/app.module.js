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
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const files_module_1 = require("./modules/files/files.module");
const rtc_module_1 = require("./modules/rtc/rtc.module");
const ws_adapter_1 = require("./ws/ws-adapter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            files_module_1.FilesModule,
            rtc_module_1.RtcModule,
        ],
        controllers: [],
        providers: [
            {
                provide: ws_adapter_1.WsAdapter,
                useFactory: (app) => {
                    return new ws_adapter_1.WsAdapter(app);
                },
                inject: [common_2.INestApplication],
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map