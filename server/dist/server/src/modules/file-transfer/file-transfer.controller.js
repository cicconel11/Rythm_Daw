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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTransferController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const file_transfer_service_1 = require("./file-transfer.service");
const dto_1 = require("./dto");
let FileTransferController = class FileTransferController {
    constructor(service) {
        this.service = service;
    }
    async presign(dto, user) {
        return this.service.presign(dto, user.id);
    }
    async getTransfers(user) {
        return this.service.getTransfers(user.id);
    }
    async accept(id, user, dto) {
        return this.service.accept(id, user.id, dto);
    }
    async decline(id, user, dto) {
        return this.service.decline(id, user.id, dto);
    }
    async download(id, user) {
        return this.service.download(id, user.id);
    }
};
exports.FileTransferController = FileTransferController;
__decorate([
    (0, common_1.Post)('presign'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PresignDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FileTransferController.prototype, "presign", null);
__decorate([
    (0, common_1.Get)('transfers'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FileTransferController.prototype, "getTransfers", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User,
        dto_1.AcceptDto]),
    __metadata("design:returntype", Promise)
], FileTransferController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)(':id/decline'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User,
        dto_1.DeclineDto]),
    __metadata("design:returntype", Promise)
], FileTransferController.prototype, "decline", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FileTransferController.prototype, "download", null);
exports.FileTransferController = FileTransferController = __decorate([
    (0, common_1.Controller)('files'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [file_transfer_service_1.FileTransferService])
], FileTransferController);
//# sourceMappingURL=file-transfer.controller.js.map