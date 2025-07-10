import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
interface MockSocket {
    id: string;
    handshake: {
        auth: {
            token?: string;
        };
    };
    data: Record<string, any>;
    join: jest.Mock;
    leave: jest.Mock;
    emit: jest.Mock;
    to: jest.Mock;
    disconnect: jest.Mock;
}
export declare function createTestingModule({ providers, imports, controllers, }?: {
    providers?: any[];
    imports?: any[];
    controllers?: any[];
}): Promise<{
    app: INestApplication<any>;
    module: TestingModule;
    mocks: {
        jwtService: {
            sign: jest.Mock<any, any, any>;
            verify: jest.Mock<any, any, any>;
            decode: jest.Mock<any, any, any>;
        };
        configService: {
            get: jest.Mock<any, [key: string], any>;
        };
        prismaService: {
            $connect: jest.Mock<any, any, any>;
            $disconnect: jest.Mock<any, any, any>;
            user: {
                findUnique: jest.Mock<any, any, any>;
                create: jest.Mock<any, any, any>;
                update: jest.Mock<any, any, any>;
                delete: jest.Mock<any, any, any>;
            };
        };
    };
}>;
export declare function createMockSocket(token?: string, user?: any): MockSocket;
export {};
