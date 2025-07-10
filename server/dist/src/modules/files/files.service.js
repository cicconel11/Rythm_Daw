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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const aws_s3_service_1 = require("./aws-s3.service");
let FilesService = class FilesService {
    constructor(awsS3Service) {
        this.awsS3Service = awsS3Service;
    }
    async getPresignedPair(dto, user) {
        const key = `${user.id}/${(0, uuid_1.v4)()}-${dto.name}`;
        return this.awsS3Service.getPresignedPair(key, dto.mime, dto.size);
    }
};
FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_s3_service_1.AwsS3Service])
], FilesService);
exports.FilesService = FilesService;
//# sourceMappingURL=files.service.js.map