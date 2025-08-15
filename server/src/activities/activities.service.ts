import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivitiesDto } from './dto/query-activities.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateActivityDto) {
    return this.prisma.activity.create({ 
      data: {
        ...dto,
        payload: dto.payload ?? {}
      }
    });
  }

  async list(q: QueryActivitiesDto) {
    const take = Math.min(Number(q.take ?? 30), 100);
    const where: any = {};
    if (q.type?.length) where.type = { in: q.type };
    if (q.userId) where.userId = q.userId;
    if (q.actorId) where.actorId = q.actorId;
    if (q.projectId) where.projectId = q.projectId;
    if (q.start || q.end) {
      where.createdAt = {};
      if (q.start) where.createdAt.gte = new Date(q.start);
      if (q.end) where.createdAt.lte = new Date(q.end);
    }

    const cursor = q.cursor ? { id: q.cursor } : undefined;

    const items = await this.prisma.activity.findMany({
      where,
      take: take + 1,
      ...(cursor ? { cursor, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });

    const nextCursor = items.length > take ? items[take].id : null;
    return { items: items.slice(0, take), nextCursor };
  }
}
