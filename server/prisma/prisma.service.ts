import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// List of all Prisma models in your schema
const modelNames = [
  'User',
  'Session',
  'ActivityLog',
  'Project',
  'ProjectMember',
  'ProjectInvitation',
  'AudioFile',
  'AudioTrack',
  'AudioClip',
  'Snapshot',
  'Tag',
  'ChatMessage',
  'RTCPeerConnection',
  'QoSMetrics',
  'FileTransfer'
] as const;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async clearDatabase() {
    if (process.env.NODE_ENV === 'production') return;
    
    return Promise.all(
      modelNames.map((modelName) => {
        const prismaModelKey = modelName[0].toLowerCase() + modelName.slice(1);
        return (this as any)[prismaModelKey]?.deleteMany?.({});
      }),
    ).then(results => {
      // Filter out undefined results in case some models don't have deleteMany
      return results.filter(Boolean);
    });
  }
}
