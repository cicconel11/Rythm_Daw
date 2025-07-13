import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

type ModelName = Prisma.ModelName;

// Get all model names from Prisma
const modelNames: ModelName[] = Object.values(Prisma.ModelName) as ModelName[];

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
        const prismaModelKey = modelName[0].toLowerCase() + modelName.slice(1) as Uncapitalize<typeof modelName>;
        return (this as any)[prismaModelKey]?.deleteMany?.({});
      }),
    ).then(results => {
      // Filter out undefined results in case some models don't have deleteMany
      return results.filter(Boolean);
    });
  }
}
