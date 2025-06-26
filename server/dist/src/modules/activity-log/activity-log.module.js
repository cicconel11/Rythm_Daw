"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogModule = void 0;
const common_1 = require("@nestjs/common");
const activity_logger_service_1 = require("./activity-logger.service");
const prisma_module_1 = require("../../prisma/prisma.module");
const event_emitter_1 = require("@nestjs/event-emitter");
let ActivityLogModule = class ActivityLogModule {
};
ActivityLogModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            event_emitter_1.EventEmitterModule.forRoot(),
        ],
        providers: [activity_logger_service_1.ActivityLoggerService],
        exports: [activity_logger_service_1.ActivityLoggerService],
    })
], ActivityLogModule);
exports.ActivityLogModule = ActivityLogModule;
//# sourceMappingURL=activity-log.module.js.map