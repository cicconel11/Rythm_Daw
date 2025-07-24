import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../server/src/app.module";
import { PrismaService } from "../../server/src/modules/prisma/prisma.service";

export async function createTestingApp(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService) // ✅ mock DB
    .useValue({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      /* add methods you actually call in tests */
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
      // Add other Prisma models as needed
    })
    .compile();
}
