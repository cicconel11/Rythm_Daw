import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { QosService } from './qos.service';
export declare class QosModule implements OnModuleInit, OnModuleDestroy {
    private readonly qosService;
    constructor(qosService: QosService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
