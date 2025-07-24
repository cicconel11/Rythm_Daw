"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceModule = void 0;
const common_1 = require("@nestjs/common");
const presence_service_1 = require("./presence.service");
const presence_controller_1 = require("./presence.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
const presence_gateway_1 = require("./presence.gateway");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
let PresenceModule = class PresenceModule {
};
exports.PresenceModule = PresenceModule;
exports.PresenceModule = PresenceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [presence_controller_1.PresenceController],
        providers: [presence_service_1.PresenceService, presence_gateway_1.PresenceGateway],
        exports: [presence_service_1.PresenceService, presence_gateway_1.PresenceGateway],
    })
], PresenceModule);
//# sourceMappingURL=presence.module.js.map