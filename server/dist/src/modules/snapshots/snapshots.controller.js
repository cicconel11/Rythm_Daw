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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const snapshots_service_1 = require("./snapshots.service");
let SnapshotsController = class SnapshotsController {
    constructor(snapshotsService) {
        this.snapshotsService = snapshotsService;
    }
    async create(req, file, createSnapshotDto) {
        let metadata = {};
        if (createSnapshotDto.metadata) {
            try {
                metadata = JSON.parse(createSnapshotDto.metadata);
            }
            catch (e) {
                metadata = createSnapshotDto.metadata;
            }
        }
        const dto = {
            projectId: createSnapshotDto.projectId,
            name: createSnapshotDto.name,
            description: createSnapshotDto.description,
            metadata,
        };
        const userId = req.user.sub;
        return this.snapshotsService.createSnapshot(userId, dto, file);
    }
    async findAll(req, projectId) {
        const userId = req.user.sub;
        return this.snapshotsService.getProjectSnapshots(projectId, userId);
    }
    async findOne(req, projectId, snapshotId) {
        const userId = req.user.sub;
        return this.snapshotsService.getSnapshotById(projectId, snapshotId, userId);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new project snapshot' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['projectId', 'name'],
            properties: {
                projectId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the project this snapshot belongs to'
                },
                name: {
                    type: 'string',
                    description: 'Name of the snapshot'
                },
                description: {
                    type: 'string',
                    description: 'Optional description of the snapshot',
                    nullable: true
                },
                metadata: {
                    type: 'string',
                    description: 'JSON string of metadata',
                    nullable: true
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'ZIP file containing project files (optional)',
                    nullable: true
                },
            },
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Snapshot created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], SnapshotsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all snapshots for a project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of snapshots' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SnapshotsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':projectId/:snapshotId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific snapshot' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Snapshot details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Snapshot not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('snapshotId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SnapshotsController.prototype, "findOne", null);
SnapshotsController = __decorate([
    (0, swagger_1.ApiTags)('snapshots'),
    (0, common_1.Controller)('api/snapshots'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [snapshots_service_1.SnapshotsService])
], SnapshotsController);
exports.SnapshotsController = SnapshotsController;
//# sourceMappingURL=snapshots.controller.js.map