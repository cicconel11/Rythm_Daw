interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    type: "text" | "plugin" | "file";
}
interface Friend {
    id: string;
    username: string;
    avatar: string;
    status: "online" | "offline";
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount: number;
}
interface ChatState {
    friends: Friend[];
    messages: Record<string, Message[]>;
    activeFriend: string | null;
    setActiveFriend: (friendId: string) => void;
    sendMessage: (friendId: string, content: string) => void;
    markAsRead: (friendId: string) => void;
}
export declare const useChatStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ChatState>>;
export {};
//# sourceMappingURL=useChatStore.d.ts.map