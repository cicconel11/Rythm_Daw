import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async modelExists(table: string): Promise<boolean> {
    const rows = await this.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM sqlite_master
      WHERE type = 'table' AND name = ${table}
    `;
    return rows.length > 0;
  }
}
