import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

type UserPresence = {
  userId: string;
  lastSeen: Date;
};

@Injectable()
export class PresenceService implements OnModuleDestroy {
  private readonly userPresence = new Map<string, UserPresence>();
  private readonly HEARTBEAT_INTERVAL = 25000; // 25 seconds
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up disconnected users every minute
    this.cleanupInterval = setInterval(
      () => this.cleanupDisconnectedUsers(),
      this.HEARTBEAT_INTERVAL * 3,
    );
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  updateUserPresence(userId: string): void {
    this.userPresence.set(userId, {
      userId,
      lastSeen: new Date(),
    });
  }

  removeUserPresence(userId: string): void {
    this.userPresence.delete(userId);
  }

  isOnline(userId: string): boolean {
    const presence = this.userPresence.get(userId);
    if (!presence) return false;

    const now = new Date();
    const lastSeen = presence.lastSeen.getTime();
    const timeDiff = now.getTime() - lastSeen;
    
    // Consider user online if seen within last 30 seconds (heartbeat is 25s)
    return timeDiff < 30000;
  }

  @Interval(30000) // Run every 30 seconds
  private cleanupDisconnectedUsers() {
    const now = new Date();
    const offlineThreshold = now.getTime() - 30000; // 30 seconds

    for (const [userId, presence] of this.userPresence.entries()) {
      if (presence.lastSeen.getTime() < offlineThreshold) {
        this.userPresence.delete(userId);
      }
    }
  }

  async updateHeartbeat(userId: string, _dto: unknown): Promise<void> {
    this.updateUserPresence(userId);
  }

  async getUserPresence(userId: string): Promise<boolean> {
    return this.isOnline(userId);
  }

  async getProjectPresence(_projectId: string): Promise<Array<{ userId: string; isOnline: boolean }>> {
    // This is a simplified implementation. In a real app, you would check which users have access to the project
    const result: Array<{ userId: string; isOnline: boolean }> = [];
    for (const [userId] of this.userPresence.entries()) {
      result.push({
        userId,
        isOnline: this.isOnline(userId),
      });
    }
    return result;
  }
}
