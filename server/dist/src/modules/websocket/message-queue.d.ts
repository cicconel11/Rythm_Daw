import { Socket } from 'socket.io';
export interface QueuedMessage {
    event: string;
    payload: any;
}
export declare class MessageQueue {
    private queue;
    private isProcessing;
    private client;
    private isActive;
    constructor(client: Socket);
    enqueue(event: string, payload: any): void;
    private processQueue;
    stop(): void;
    get size(): number;
    get processing(): boolean;
}
