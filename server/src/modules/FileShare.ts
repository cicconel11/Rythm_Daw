import { Request, Response } from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

// Types
type PeerConnection = {
  id: string;
  userId: string;
  projectId: string;
  createdAt: Date;
};

type FileMetadata = {
  id: string;
  name: string;
  size: number;
  type: string;
  sha256: string;
  status: 'pending' | 'scanning' | 'clean' | 'infected' | 'error';
  s3Key?: string;
  createdAt: Date;
  createdBy: string;
  projectId: string;
};

// Configuration
const MAX_DIRECT_SIZE = 100 * 1024 * 1024; // 100MB
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const CLAMSCAN_CMD = process.env.CLAMSCAN_CMD || 'clamscan';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// In-memory stores (in production, use Redis or database)
const peerConnections = new Map<string, PeerConnection>();
const fileMetadata = new Map<string, FileMetadata>();

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class FileShare {
  // WebRTC signaling endpoint
  static async handleSignal(req: Request, res: Response) {
    const { type, data, from, to, projectId } = req.body;

    if (!type || !data || !from || !projectId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store/update peer connection
    const peerId = `${projectId}-${from}`;
    if (!peerConnections.has(peerId)) {
      peerConnections.set(peerId, {
        id: peerId,
        userId: from,
        projectId,
        createdAt: new Date(),
      });
    }

    // In a real app, you'd use a message queue or WebSocket for signaling
    // This is a simplified version that just returns the data
    return res.json({
      type,
      data,
      from,
      to,
      projectId,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle file upload (direct or S3)
  static async handleFileUpload(req: Request, res: Response) {
    const { projectId, userId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const fileHash = await this.calculateFileHash(file.path);
    
    const metadata: FileMetadata = {
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
      // Check if file is too large for direct transfer
      if (file.size > MAX_DIRECT_SIZE) {
        // Upload to S3
        const s3Key = `projects/${projectId}/${fileId}-${file.originalname}`;
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: fs.createReadStream(file.path),
            ContentType: file.mimetype,
            Metadata: {
              'x-amz-meta-project-id': projectId,
              'x-amz-meta-uploader-id': userId,
            },
          })
        );

        metadata.s3Key = s3Key;
        metadata.status = 'scanning';
        
        // Start virus scan in background
        this.scanFileForViruses(metadata);
      } else {
        // For small files, scan immediately
        await this.scanFileForViruses(metadata);
      }

      // Store metadata
      fileMetadata.set(fileId, metadata);

      // Clean up temp file
      fs.unlink(file.path, () => {});

      return res.status(202).json({
        fileId,
        status: metadata.status,
        size: file.size,
        name: file.originalname,
      });
    } catch (error) {
      console.error('File upload error:', error);
      return res.status(500).json({ error: 'Failed to process file' });
    }
  }

  // Get file download URL
  static async getFileUrl(req: Request, res: Response) {
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
        // Generate pre-signed URL for S3
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: metadata.s3Key,
          ResponseContentDisposition: `attachment; filename="${metadata.name}"`,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return res.json({ url });
      } else {
        // Serve directly for small files
        const filePath = path.join(UPLOAD_DIR, fileId);
        return res.download(filePath, metadata.name);
      }
    } catch (error) {
      console.error('Error generating download URL:', error);
      return res.status(500).json({ error: 'Failed to generate download URL' });
    }
  }

  // Check file status
  static async checkFileStatus(req: Request, res: Response) {
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

  // Private helper methods
  private static async calculateFileHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (error) => reject(error));
    });
  }

  private static async scanFileForViruses(metadata: FileMetadata): Promise<void> {
    try {
      metadata.status = 'scanning';
      
      // In a real implementation, you would use a proper ClamAV integration
      // This is a simplified example using the clamscan command line
      const filePath = metadata.s3Key 
        ? path.join('/tmp', path.basename(metadata.s3Key))
        : path.join(UPLOAD_DIR, metadata.id);
      
      if (metadata.s3Key) {
        // Download from S3 for scanning
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: metadata.s3Key,
        });
        
        const { Body } = await s3Client.send(command);
        const writeStream = fs.createWriteStream(filePath);
        await new Promise((resolve, reject) => {
          Body!.pipe(writeStream)
            .on('error', reject)
            .on('close', resolve);
        });
      }
      
      // Run virus scan
      await execAsync(`${CLAMSCAN_CMD} --no-summary "${filePath}"`);
      
      // If we get here, the file is clean
      metadata.status = 'clean';
      
      // Clean up temp file if it was downloaded from S3
      if (metadata.s3Key) {
        fs.unlink(filePath, () => {});
      }
    } catch (error) {
      console.error('Virus scan error:', error);
      metadata.status = 'error';
      
      // If the exit code is 1, it means a virus was found
      if (error instanceof Error && 'code' in error && error.code === 1) {
        metadata.status = 'infected';
        
        // Delete infected files
        if (metadata.s3Key) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: metadata.s3Key,
          }));
        } else {
          fs.unlink(path.join(UPLOAD_DIR, metadata.id), () => {});
        }
      }
    } finally {
      // Update metadata
      fileMetadata.set(metadata.id, metadata);
    }
  }
}

// Express middleware for file uploads
import multer from 'multer';
const upload = multer({ 
  dest: UPLOAD_DIR,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB max
  },
});

export const uploadMiddleware = upload.single('file');

// Example Express routes:
/*
app.post('/api/files/upload', 
  authenticateUser, // Your auth middleware
  uploadMiddleware,
  FileShare.handleFileUpload
);

app.get('/api/files/:fileId/url', 
  authenticateUser,
  FileShare.getFileUrl
);

app.get('/api/files/:fileId/status',
  authenticateUser,
  FileShare.checkFileStatus
);

app.post('/webrtc-signal',
  authenticateUser,
  express.json(),
  FileShare.handleSignal
);
*/
