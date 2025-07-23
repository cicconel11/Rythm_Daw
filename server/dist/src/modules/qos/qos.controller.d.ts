import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { QosService } from './qos.service';
import { WebRtcMetricDto } from './dto/webrtc-metric.dto';
import { CrashReportDto } from './dto/crash-report.dto';
import type { Request } from 'express';
export declare class QosController {
    private readonly qosService;
    constructor(qosService: QosService);
    recordWebRtcMetrics(dto: WebRtcMetricDto, user: JwtPayload): Promise<{
        success: boolean;
        message: string;
    }>;
    recordCrashReport(dto: CrashReportDto, user: JwtPayload, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
