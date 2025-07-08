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
exports.TagsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../../common/decorators/get-user.decorator");
const tags_service_1 = require("./tags.service");
const update_tags_dto_1 = require("./dto/update-tags.dto");
let TagsController = class TagsController {
    constructor(tagsService) {
        this.tagsService = tagsService;
    }
    async updateEntityTags(entityType, entityId, user, updateTagsDto) {
        return this.tagsService.updateEntityTags(entityType, entityId, user.sub, updateTagsDto);
    }
    getEntityTags(entityType, entityId) {
        return this.tagsService.getEntityTags(entityType, entityId);
    }
    async findAll(search, limit) {
        return this.tagsService.findAll({
            search,
            limit: limit ? Number(limit) : undefined,
        });
    }
    deleteTag(tagId, force = false) {
        return this.tagsService.deleteTag(tagId, force);
    }
};
__decorate([
    (0, common_1.Put)(':entityType/:entityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tags for an entity' }),
    (0, swagger_1.ApiParam)({ name: 'entityType', description: 'Type of the entity (e.g., project, file, snapshot)' }),
    (0, swagger_1.ApiParam)({ name: 'entityId', description: 'ID of the entity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tags updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, update_tags_dto_1.UpdateTagsDto]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "updateEntityTags", null);
__decorate([
    (0, common_1.Get)(':entityType/:entityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tags for an entity' }),
    (0, swagger_1.ApiParam)({ name: 'entityType', description: 'Type of the entity' }),
    (0, swagger_1.ApiParam)({ name: 'entityId', description: 'ID of the entity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the tags for the entity' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Entity not found' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "getEntityTags", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tags with counts' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search term for tag names' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Limit the number of results' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all tags with their usage counts' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':tagId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a tag' }),
    (0, swagger_1.ApiParam)({ name: 'tagId', description: 'ID of the tag to delete' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tag deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete tag in use' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tag not found' }),
    __param(0, (0, common_1.Param)('tagId')),
    __param(1, (0, common_1.Query)('force')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "deleteTag", null);
TagsController = __decorate([
    (0, swagger_1.ApiTags)('tags'),
    (0, common_1.Controller)('api/tags'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [tags_service_1.TagsService])
], TagsController);
exports.TagsController = TagsController;
//# sourceMappingURL=tags.controller.js.map