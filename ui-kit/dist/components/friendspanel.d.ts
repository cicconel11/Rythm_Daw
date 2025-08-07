interface Friend {
    id: number;
    name: string;
    avatar: string;
    status: "online" | "offline" | "away";
    plugins?: string[];
    mutualFriends: number;
    reason?: string;
}
interface FriendsPanelProps {
    friends: Friend[];
    onNavigate?: (path: string) => void;
}
export declare function FriendsPanel({ friends, onNavigate }: FriendsPanelProps): import("react/jsx-runtime.js").JSX.Element;
export {};
//# sourceMappingURL=friendspanel.d.ts.map