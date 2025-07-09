export declare enum MetricCategory {
    CONNECTION = "connection",
    QUALITY = "quality",
    NETWORK = "network",
    MEDIA = "media",
    OTHER = "other"
}
export declare class WebRtcMetricDto {
    userId: string;
    projectId?: string;
    peerConnectionId?: string;
    rttMs?: number;
    jitterMs?: number;
    packetLoss?: number;
    category: MetricCategory;
    value: number;
    networkType?: string;
    effectiveType?: string;
    downlinkMbps?: number;
    createdAt?: Date;
    metadata?: Record<string, any>;
    iceCandidatePairId?: string;
    localCandidateId?: string;
    remoteCandidateId?: string;
}
