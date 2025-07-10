import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
export declare const createTestRtcApp: () => Promise<{
    app: INestApplication;
    moduleFixture: TestingModule;
}>;
export declare const closeTestRtcApp: (app: INestApplication) => Promise<void>;
