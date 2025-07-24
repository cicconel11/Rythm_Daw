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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QosModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("../../prisma/prisma.module");
const qos_controller_1 = require("./qos.controller");
const qos_service_1 = require("./qos.service");
const encryption_service_1 = require("./encryption.service");
let QosModule = class QosModule {
    constructor(qosService) {
        this.qosService = qosService;
    }
    async onModuleInit() {
    }
    async onModuleDestroy() {
        await this.qosService.onModuleDestroy();
    }
};
exports.QosModule = QosModule;
exports.QosModule = QosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            config_1.ConfigModule,
        ],
        controllers: [qos_controller_1.QosController],
        providers: [qos_service_1.QosService, encryption_service_1.EncryptionService],
        exports: [qos_service_1.QosService, encryption_service_1.EncryptionService],
    }),
    __metadata("design:paramtypes", [qos_service_1.QosService])
], QosModule);
//# sourceMappingURL=qos.module.js.map