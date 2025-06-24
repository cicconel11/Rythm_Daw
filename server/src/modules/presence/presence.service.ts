import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HeartbeatDto, UserStatus } from './dto/heartbeat.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PresenceService implements OnModuleInit {
  private readonly logger = new Logger(PresenceService.name);
  private readonly HEARTBEAT_TIMEOUT_MS = 15_000; // 15 seconds
  private readonly STALE_PRESENCE_MS = 60_000; // 60 seconds

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    this.logger.log('Presence service initialized');
  }

  async updateHeartbeat(userId: string, dto: HeartbeatDto) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.HEARTBEAT_TIMEOUT_MS);

    // Update or create presence
    const presence = await this.prisma.userPresence.upsert({
      where: { userId },
      update: {
        status: dto.status,
        lastSeen: now,
        expiresAt,
        projectId: dto.projectId,
        sessionId: dto.sessionId,
      },
      create: {
        userId,
        status: dto.status,
        lastSeen: now,
        expiresAt,
        projectId: dto.projectId,
        sessionId: dto.sessionId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Emit presence update event
    this.eventEmitter.emit('presence.updated', {
      userId,
      status: dto.status,
      projectId: dto.projectId,
      timestamp: now,
    });

    // Broadcast to WebSocket room if in a project
    if (dto.projectId) {
      this.eventEmitter.emit('project.presence', {
        projectId: dto.projectId,
        userId,
        status: dto.status,
        user: presence.user,
      });
    }

    return presence;
  }

  async getUserPresence(userId: string) {
    return this.prisma.userPresence.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getProjectPresence(projectId: string) {
    return this.prisma.userPresence.findMany({
      where: {
        projectId,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        lastSeen: 'desc',
      },
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async cleanupStalePresence() {
    const threshold = new Date(Date.now() - this.STALE_PRESENCE_MS);
    
    try {
      const result = await this.prisma.userPresence.deleteMany({
        where: {
          expiresAt: {
            lt: threshold,
          },
        },
      });
      
      if (result.count > 0) {
        this.logger.log(`Cleaned up ${result.count} stale presence records`);
      }
      
      return result;
    } catch (error) {
      this.logger.error('Failed to clean up stale presence', error);
      throw error;
    }
  }
}
