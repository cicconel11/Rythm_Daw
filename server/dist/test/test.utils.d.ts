import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
export declare const createTestApp: () => Promise<{
    app: INestApplication;
    moduleFixture: TestingModule;
}>;
export declare const closeTestApp: (app: INestApplication) => Promise<void>;
export declare const getAuthToken: (app: INestApplication, email: string, password: string) => Promise<string>;
export declare const createTestUser: (app: INestApplication, userData: {
    email: string;
    password: string;
    name?: string;
}) => Promise<import("superagent/lib/node/response")>;
