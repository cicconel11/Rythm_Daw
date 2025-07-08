import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

    // First, get the user to include in the response
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Use the correct composite key for the where clause
    const where: Prisma.UserPresenceWhereUniqueInput = {
      id: userId, // Using id as the primary key since it's the @id field in the schema
    };

    // Update or create presence
    const presence = await this.prisma.userPresence.upsert({
      where,
      update: {
        status: dto.status as any, // Type assertion to handle Prisma enum mapping
        lastSeen: now,
        expiresAt,
        projectId: dto.projectId || null,
      },
      create: {
        userId,
        status: dto.status as any, // Type assertion to handle Prisma enum mapping
        lastSeen: now,
        expiresAt,
        projectId: dto.projectId || null,
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
        user: user, // Use the user we fetched earlier
      });
    }

    return presence;
  }

  async getUserPresence(userId: string) {
    const presences = await this.prisma.userPresence.findMany({
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
    
    // Return the most recent presence or null if none found
    return presences.length > 0 
      ? presences.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())[0]
      : null;
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

  async removePresence(userId: string, projectId?: string) {
    if (projectId) {
      // First find all presence records for the user
      const presences = await this.prisma.userPresence.findMany({
        where: { userId },
        select: { id: true },
      });

      // Delete each presence record by ID
      for (const presence of presences) {
        try {
          await this.prisma.userPresence.delete({
            where: { id: presence.id },
          });
        } catch (error) {
          // Ignore not found errors
          if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')) {
            throw error;
          }
        }
      }
    } else {
      // Remove all presences for the user
      await this.prisma.userPresence.deleteMany({
        where: { userId },
      });
    }
  }
}
