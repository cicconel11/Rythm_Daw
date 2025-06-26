"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = exports.FileShare = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const MAX_DIRECT_SIZE = 100 * 1024 * 1024;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const CLAMSCAN_CMD = process.env.CLAMSCAN_CMD || 'clamscan';
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
const peerConnections = new Map();
const fileMetadata = new Map();
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
class FileShare {
    static async handleSignal(req, res) {
        const { type, data, from, to, projectId } = req.body;
        if (!type || !data || !from || !projectId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const peerId = `${projectId}-${from}`;
        if (!peerConnections.has(peerId)) {
            peerConnections.set(peerId, {
                id: peerId,
                userId: from,
                projectId,
                createdAt: new Date(),
            });
        }
        return res.json({
            type,
            data,
            from,
            to,
            projectId,
            timestamp: new Date().toISOString(),
        });
    }
    static async handleFileUpload(req, res) {
        const { projectId, userId } = req.params;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const fileId = (0, uuid_1.v4)();
        const fileHash = await this.calculateFileHash(file.path);
        const metadata = {
            id: fileId,
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            sha256: fileHash,
            status: 'pending',
            createdAt: new Date(),
            createdBy: userId,
            projectId,
        };
        try {
            if (file.size > MAX_DIRECT_SIZE) {
                const s3Key = `projects/${projectId}/${fileId}-${file.originalname}`;
                await s3Client.send(new client_s3_1.PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: s3Key,
                    Body: fs_1.default.createReadStream(file.path),
                    ContentType: file.mimetype,
                    Metadata: {
                        'x-amz-meta-project-id': projectId,
                        'x-amz-meta-uploader-id': userId,
                    },
                }));
                metadata.s3Key = s3Key;
                metadata.status = 'scanning';
                this.scanFileForViruses(metadata);
            }
            else {
                await this.scanFileForViruses(metadata);
            }
            fileMetadata.set(fileId, metadata);
            fs_1.default.unlink(file.path, () => { });
            return res.status(202).json({
                fileId,
                status: metadata.status,
                size: file.size,
                name: file.originalname,
            });
        }
        catch (error) {
            console.error('File upload error:', error);
            return res.status(500).json({ error: 'Failed to process file' });
        }
    }
    static async getFileUrl(req, res) {
        const { fileId } = req.params;
        const metadata = fileMetadata.get(fileId);
        if (!metadata) {
            return res.status(404).json({ error: 'File not found' });
        }
        if (metadata.status !== 'clean') {
            return res.status(403).json({
                error: 'File not available for download',
                status: metadata.status
            });
        }
        try {
            if (metadata.s3Key) {
                const command = new client_s3_1.GetObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: metadata.s3Key,
                    ResponseContentDisposition: `attachment; filename="${metadata.name}"`,
                });
                const url = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 });
                return res.json({ url });
            }
            else {
                const filePath = path_1.default.join(UPLOAD_DIR, fileId);
                return res.download(filePath, metadata.name);
            }
        }
        catch (error) {
            console.error('Error generating download URL:', error);
            return res.status(500).json({ error: 'Failed to generate download URL' });
        }
    }
    static async checkFileStatus(req, res) {
        const { fileId } = req.params;
        const metadata = fileMetadata.get(fileId);
        if (!metadata) {
            return res.status(404).json({ error: 'File not found' });
        }
        return res.json({
            fileId: metadata.id,
            status: metadata.status,
            name: metadata.name,
            size: metadata.size,
            createdAt: metadata.createdAt.toISOString(),
        });
    }
    static async calculateFileHash(filePath) {
        return new Promise((resolve, reject) => {
            const hash = (0, crypto_1.createHash)('sha256');
            const stream = fs_1.default.createReadStream(filePath);
            stream.on('data', (chunk) => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', (error) => reject(error));
        });
    }
    static async scanFileForViruses(metadata) {
        try {
            metadata.status = 'scanning';
            const filePath = metadata.s3Key
                ? path_1.default.join('/tmp', path_1.default.basename(metadata.s3Key))
                : path_1.default.join(UPLOAD_DIR, metadata.id);
            if (metadata.s3Key) {
                const command = new client_s3_1.GetObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: metadata.s3Key,
                });
                const { Body } = await s3Client.send(command);
                const writeStream = fs_1.default.createWriteStream(filePath);
                await new Promise((resolve, reject) => {
                    Body.pipe(writeStream)
                        .on('error', reject)
                        .on('close', resolve);
                });
            }
            await execAsync(`${CLAMSCAN_CMD} --no-summary "${filePath}"`);
            metadata.status = 'clean';
            if (metadata.s3Key) {
                fs_1.default.unlink(filePath, () => { });
            }
        }
        catch (error) {
            console.error('Virus scan error:', error);
            metadata.status = 'error';
            if (error instanceof Error && 'code' in error && error.code === 1) {
                metadata.status = 'infected';
                if (metadata.s3Key) {
                    await s3Client.send(new DeleteObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: metadata.s3Key,
                    }));
                }
                else {
                    fs_1.default.unlink(path_1.default.join(UPLOAD_DIR, metadata.id), () => { });
                }
            }
        }
        finally {
            fileMetadata.set(metadata.id, metadata);
        }
    }
}
exports.FileShare = FileShare;
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    dest: UPLOAD_DIR,
    limits: {
        fileSize: 1024 * 1024 * 1024,
    },
});
exports.uploadMiddleware = upload.single('file');
//# sourceMappingURL=FileShare.js.map