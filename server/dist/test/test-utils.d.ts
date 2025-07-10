import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
export declare function createTestingModule(providers?: any[]): Promise<{
    app: INestApplication;
    module: TestingModule;
}>;
export declare function createMockSocket(token?: string, user?: any): any;
