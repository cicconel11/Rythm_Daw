import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LogActivityDto } from './dto/log-activity.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Type for raw activity log from database
type RawActivityLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: any; // Using any to avoid Prisma type issues
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  projectId: string | null;
  createdAt: Date;
};

// Type for activity log with user data
type ActivityWithUser = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: any; // Using any to avoid Prisma type issues
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  userId: string;
  projectId: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

@Injectable()
@WebSocketGateway({ namespace: 'activity' })
export class ActivityLoggerService implements OnModuleInit {
  private readonly logger = new Logger(ActivityLoggerService.name);
  
  @WebSocketServer()
  private server!: Server;

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
  async logActivity(data: LogActivityDto): Promise<ActivityWithUser> {
    const { 
      action, 
      entityId = '', 
      entityType = 'system',
      userId,
      projectId,
      metadata = {},
      ipAddress,
      userAgent
    } = data;

    try {
      // Create activity data
      // Build activity data with optional fields
      const activityData: any = {
        action,
        entityId,
        entityType,
        metadata: metadata as any, // Using any to avoid Prisma type issues
        ...(ipAddress && { ipAddress }),
        ...(userAgent && { userAgent }),
        // userId is optional, only include if provided
        ...(userId && { userId }),
        ...(projectId && { projectId }),
      };

      // Create the activity log with all necessary fields using raw query
      const query = `
        INSERT INTO "ActivityLog" (${Object.keys(activityData).join(', ')})
        VALUES (${Object.keys(activityData).map((_, i) => `$${i + 1}`).join(', ')})
        RETURNING 
          id, action, "entityType" as "entityType", "entityId" as "entityId", 
          metadata, "ipAddress" as "ipAddress", "userAgent" as "userAgent", 
          "userId" as "userId", "projectId" as "projectId", "createdAt" as "createdAt"
      `;
      
      const values = Object.values(activityData);
      const activity = (await this.prisma.$queryRawUnsafe(query, ...values) as RawActivityLog[])[0];
      
      // Fetch user data if userId is provided
      let user: { id: string; name: string | null; email: string } | null = null;
      if (userId) {
        user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
      }

      // Map to our ActivityWithUser type
      const activityWithUser: ActivityWithUser = {
        id: activity.id,
        action: activity.action,
        entityType: activity.entityType,
        entityId: activity.entityId,
        metadata: activity.metadata,
        createdAt: activity.createdAt,
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent,
        userId: activity.userId,
        projectId: activity.projectId,
        user: user,
      };

      // Emit WebSocket event
      if (this.server) {
        const room = projectId ? `project:${projectId}` : `user:${userId || 'system'}`;
        const eventData = {
          ...activityWithUser,
          user: activityWithUser.user || null,
          projectId: activityWithUser.projectId || null,
          userId: activityWithUser.userId || null
        } as const;

        // Emit to the specific room (project or user)
        this.server.to(room).emit('activity', eventData);
        
        // Also emit to the global namespace
        this.server.emit('activity', eventData);
      }
      
      // Emit a system event for other services
      this.eventEmitter.emit('activity.created', activityWithUser);

      this.logger.debug(`Activity logged: ${action} for project ${projectId} by user ${userId}`);
      
      return activityWithUser;
    } catch (error) {
      this.logger.error(`Failed to log activity: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Get recent activities for a project or user
   * @param options Query options
   * @returns List of activity logs with user data
   */
  async getActivities(options: {
    projectId?: string;
    userId?: string | null;
    action?: string;
    entityType?: string;
    entityId?: string;
    limit?: number;
    cursor?: string;
  }): Promise<ActivityWithUser[]> {
    const { 
      projectId, 
      userId, 
      action, 
      entityType,
      entityId,
      limit = 50, 
      cursor 
    } = options;

    // Build the WHERE clause
    const whereClauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (projectId) {
      whereClauses.push(`"projectId" = $${paramIndex++}`);
      params.push(projectId);
    }
    
    if (userId) {
      whereClauses.push(`"userId" = $${paramIndex++}`);
      params.push(userId);
    }
    
    if (action) {
      whereClauses.push(`"action" = $${paramIndex++}`);
      params.push(action);
    }
    
    if (entityType) {
      whereClauses.push(`"entityType" = $${paramIndex++}`);
      params.push(entityType);
    }
    
    if (entityId) {
      whereClauses.push(`"entityId" = $${paramIndex++}`);
      params.push(entityId);
    }
    
    if (cursor) {
      whereClauses.push(`id < $${paramIndex++}`);
      params.push(cursor);
    }

    const whereClause = whereClauses.length > 0 
      ? `WHERE ${whereClauses.join(' AND ')}` 
      : '';

    // Get activities with user data
    const query = `
      SELECT 
        a.id, a.action, a."entityType", a."entityId", a.metadata, 
        a."ipAddress", a."userAgent", a."userId", a."projectId", a."createdAt",
        u.id as "user.id", u.name as "user.name", u.email as "user.email"
      FROM "ActivityLog" a
      LEFT JOIN "User" u ON a."userId" = u.id
      ${whereClause}
      ORDER BY a."createdAt" DESC
      LIMIT $${paramIndex++}
    `;
    
    params.push(limit);
    
    const activities = await this.prisma.$queryRawUnsafe(query, ...params) as Array<RawActivityLog & {
      "user.id"?: string;
      "user.name"?: string | null;
      "user.email"?: string;
    }>;

    // Map the raw results to ActivityWithUser objects
    return activities.map(row => ({
      id: row.id,
      action: row.action,
      entityType: row.entityType,
      entityId: row.entityId,
      metadata: row.metadata,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
      userId: row.userId,
      projectId: row.projectId,
      createdAt: row.createdAt,
      user: row["user.id"] ? {
        id: row["user.id"]!,
        name: row["user.name"] || null,
        email: row["user.email"]!,
      } : null,
    }));
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

    const query = `
      SELECT 
        DATE("createdAt") as date,
        "action" as event,
        COUNT(*) as count
      FROM "ActivityLog"
      WHERE "projectId" = $1
        AND "createdAt" >= $2
      GROUP BY DATE("createdAt"), "action"
      ORDER BY date DESC, count DESC;
    `;

    return this.prisma.$queryRawUnsafe(query, projectId, date);
  }
}
