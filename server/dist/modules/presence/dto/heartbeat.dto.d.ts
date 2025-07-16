export declare enum UserStatus {
    ONLINE = "online",
    IN_DAW = "in-daw",
    RECORDING = "recording",
    IDLE = "idle"
}
export declare class HeartbeatDto {
    status: UserStatus;
    projectId?: string;
    sessionId?: string;
}
