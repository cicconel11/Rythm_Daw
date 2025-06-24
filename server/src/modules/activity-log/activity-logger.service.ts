import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LogActivityDto } from './dto/log-activity.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
@WebSocketGateway({ namespace: 'activity' })
export class ActivityLoggerService implements OnModuleInit {
  private readonly logger = new Logger(ActivityLoggerService.name);
  
  @WebSocketServer()
  private server: Server;

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  onModuleInit() {
    this.logger.log('Activity Logger Service initialized');
  }

  /**
   * Log an activity and emit a WebSocket event
   * @param data Activity data to log
   * @returns The created activity log
   */
  async logActivity(data: LogActivityDto) {
    try {
      const { projectId, userId, event, payload, ipAddress, userAgent } = data;
      
      // Create the activity log
      const activity = await this.prisma.activityLog.create({
        data: {
          event,
          payload: payload || {},
          ipAddress,
          userAgent,
          project: projectId ? { connect: { id: projectId } } : undefined,
          user: userId ? { connect: { id: userId } } : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      });

      // Emit WebSocket event
      const room = projectId ? `project:${projectId}` : `user:${userId}`;
      const eventData = {
        ...activity,
        user: activity.user, // Include user data
        projectId: activity.projectId,
        userId: activity.userId
      };

      // Emit to the specific room (project or user)
      this.server.to(room).emit('activity', eventData);
      
      // Also emit to the global namespace
      this.server.emit('activity', eventData);
      
      // Emit a system event for other services
      this.eventEmitter.emit('activity.created', eventData);

      this.logger.debug(`Activity logged: ${event} for project ${projectId} by user ${userId}`);
      
      return activity;
    } catch (error) {
      this.logger.error(`Failed to log activity: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get recent activities for a project or user
   * @param options Query options
   * @returns List of activity logs
   */
  async getActivities(options: {
    projectId?: string;
    userId?: string;
    event?: string;
    limit?: number;
    cursor?: string;
  }) {
    const { projectId, userId, event, limit = 50, cursor } = options;
    
    return this.prisma.activityLog.findMany({
      where: {
        projectId,
        userId,
        event,
        id: cursor ? { lt: cursor } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get a summary of recent activities
   * @param projectId Project ID
   * @param days Number of days to look back
   * @returns Activity summary
   */
  async getActivitySummary(projectId: string, days = 7) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        "event",
        COUNT(*) as count
      FROM "ActivityLog"
      WHERE "projectId" = ${projectId}
        AND "createdAt" >= ${date}
      GROUP BY DATE("createdAt"), "event"
      ORDER BY date DESC, count DESC;
    `;
  }
}
