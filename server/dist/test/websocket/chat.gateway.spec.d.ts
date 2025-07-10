declare module 'socket.io' {
    interface Socket {
        userId?: string;
        projectId?: string;
        isAlive: boolean;
        sendMessage: (data: any) => Promise<void>;
    }
}
export {};
