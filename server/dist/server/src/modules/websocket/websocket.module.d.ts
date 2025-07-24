import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
export declare class WebSocketModule implements OnModuleInit, OnModuleDestroy {
    private readonly gateway;
    constructor(gateway: ChatGateway);
    onModuleInit(): void;
    onModuleDestroy(): void;
}
