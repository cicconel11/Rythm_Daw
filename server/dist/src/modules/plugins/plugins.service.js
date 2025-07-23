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
exports.PluginsService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("@nestjs/config");
let PluginsService = class PluginsService {
    constructor(config) {
        this.config = config;
        this.s3 = new client_s3_1.S3Client({ region: this.config.get('AWS_REGION') });
    }
    async getLatest(platform = 'mac') {
        const Key = 'installers/Rythm-0.9.3.dmg';
        const Bucket = this.config.get('PLUGIN_BUCKET');
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({ Bucket, Key }), { expiresIn: 60 });
        return { url, filename: 'Rythm-0.9.3.dmg' };
    }
};
exports.PluginsService = PluginsService;
exports.PluginsService = PluginsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PluginsService);
//# sourceMappingURL=plugins.service.js.map