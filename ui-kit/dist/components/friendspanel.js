import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent } from "./ui/card.js";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { ScrollArea } from "./ui/scroll-area.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "./ui/dialog.js";
import { Search, UserPlus, MessageSquare, Users } from "lucide-react";
// Temporary mock hooks until we fix the shared imports
const useFriendRequests = () => ({
    data: [],
    isLoading: false,
    error: null,
});
const useAcceptRequest = () => ({
    mutate: (requestId) => {
        console.log("Accepting request:", requestId);
    },
});
// Mock data for development
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockFriends = [
    {
        id: 1,
        name: "BeatMaker99",
        avatar: "/avatars/1.png",
        status: "online",
        plugins: ["Serum", "Massive"],
        mutualFriends: 12,
    },
    {
        id: 2,
        name: "SynthMaster",
        avatar: "/avatars/2.png",
        status: "offline",
        plugins: ["Serum", "Sylenth1"],
        mutualFriends: 8,
    },
    {
        id: 3,
        name: "DrumLord",
        avatar: "/avatars/3.png",
        status: "away",
        plugins: ["Serum", "Massive"],
        mutualFriends: 5,
    },
    {
        id: 4,
        name: "DrumMachine",
        avatar: "/avatars/4.png",
        status: "online",
        plugins: ["Battery 4", "Superior"],
        mutualFriends: 15,
    },
];
// Mock pending friend requests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _pendingRequests = [
    {
        id: "1",
        name: "NewProducer",
        avatar: "/avatars/5.png",
        mutualFriends: 2,
        status: "pending",
        from: "NewProducer",
    },
    {
        id: "2",
        name: "VocalMaster",
        avatar: "/avatars/6.png",
        mutualFriends: 1,
        status: "pending",
        from: "VocalMaster",
    },
];
const suggested = [
    {
        id: 1,
        name: "ElectroWiz",
        avatar: "/avatars/7.png",
        mutualFriends: 8,
        reason: "Uses similar plugins",
        from: "ElectroWiz",
        status: "pending",
    },
    {
        id: 2,
        name: "BassMaster",
        avatar: "/avatars/8.png",
        mutualFriends: 3,
        reason: "Friend of ProducerX",
        from: "BassMaster",
        status: "pending",
    },
];
// Type guard for FriendRequest
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isFriendRequest(item) {
    return (typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        Array.isArray(item.plugins));
}
export function FriendsPanel({ friends, onNavigate }) {
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [addFriendInput, setAddFriendInput] = useState("");
    const { data: friendRequests } = useFriendRequests();
    const { mutate: acceptRequest } = useAcceptRequest();
    const handleAccept = (requestId) => {
        // TODO: Implement accept request
        console.log("Accept request", requestId);
        acceptRequest(requestId);
    };
    const handleReject = (requestId) => {
        // TODO: Implement reject request
        console.log("Reject request", requestId);
    };
    const handleAddFriend = (e) => {
        if (typeof e !== "string") {
            e.preventDefault();
        }
        const friendId = typeof e === "string" ? e : addFriendInput.trim();
        if (!friendId)
            return;
        // Implementation for adding a friend
        console.log("Adding friend:", addFriendInput);
        if (typeof e !== "string") {
            setAddFriendInput("");
        }
    };
    const handleChat = (friendId) => {
        // TODO: Implement chat
        console.log("Start chat with", friendId);
        if (onNavigate) {
            onNavigate(`/chat/${friendId}`);
        }
    };
    const filteredFriends = (friends || []).filter((friend) => friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (friend.plugins || []).some((plugin) => plugin.toLowerCase().includes(searchTerm.toLowerCase())));
    const filteredRequests = (friendRequests || []).filter((request) => request.status === "pending" &&
        (request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.reason?.toLowerCase().includes(searchTerm.toLowerCase())));
    const filteredSuggested = suggested.filter((friend) => friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.reason?.toLowerCase().includes(searchTerm.toLowerCase()));
    const _getTabContent = (tab) => {
        switch (tab) {
            case "pending":
                return filteredRequests;
            case "suggested":
                return filteredSuggested;
            case "online":
                return filteredFriends.filter((friend) => friend.status === "online");
            case "all":
            default:
                return [...filteredFriends];
        }
    };
    const tabs = [
        { key: "all", label: "All" },
        { key: "online", label: "Online" },
        {
            key: "pending",
            label: `Pending (${friendRequests?.filter((request) => request.status === "pending").length || 0})`,
        },
        { key: "suggested", label: "Suggested" },
    ];
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    return (_jsx("div", { className: "min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white font-['Inter'] mb-2", children: "Friends" }), _jsx("p", { className: "text-gray-400", children: "Connect with fellow music producers" })] }), _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("button", { className: "px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-[#7E4FFF] to-[#6B3FE6] text-white rounded-md hover:from-[#6B3FE6] hover:to-[#5A34C2] transition-colors", onClick: handleAddFriend, children: "Add Friend" }) }), _jsxs(DialogContent, { className: "bg-[#141B33] border-gray-700", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-white", children: "Add Friend" }) }), _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { placeholder: "Enter username or email...", value: addFriendInput, onChange: (e) => setAddFriendInput(e.target.value), className: "bg-[#0D1126] border-gray-600 text-white" }), _jsx(Button, { onClick: handleAddFriend, className: "w-full bg-[#7E4FFF] hover:bg-[#6B3FE6]", children: "Send Friend Request" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { className: "bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Total Friends" }), _jsx("p", { className: "text-2xl font-bold text-[#7E4FFF]", children: friends.length })] }), _jsx(Users, { className: "w-8 h-8 text-[#7E4FFF]" })] }) }) }), _jsx(Card, { className: "bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Online Now" }), _jsx("p", { className: "text-2xl font-bold text-green-400", children: friends.filter((f) => f.status === "online").length })] }), _jsx("div", { className: "w-3 h-3 bg-green-400 rounded-full" })] }) }) }), _jsx(Card, { className: "bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Pending" }), _jsx("p", { className: "text-2xl font-bold text-orange-400", children: friendRequests?.filter((request) => request.status === "pending")?.length || 0 })] }), _jsx(UserPlus, { className: "w-8 h-8 text-orange-400" })] }) }) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx("div", { className: "flex space-x-2", children: tabs.map((tab) => (_jsx("button", { onClick: () => handleTabClick(tab.key), className: `px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === tab.key
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-700"}`, children: tab.label }, tab.key))) }), _jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "w-4 h-4 absolute left-3 top-3 text-gray-400" }), _jsx(Input, { placeholder: "Search friends...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 bg-[#141B33] border-gray-600 text-white" })] })] }), _jsx(Card, { className: "bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: _jsx(CardContent, { className: "p-6", children: _jsx(ScrollArea, { className: "h-[500px]", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: _getTabContent(activeTab).map((item) => {
                                    const isFriend = "status" in item &&
                                        typeof item.status === "string" &&
                                        ["online", "offline", "away"].includes(item.status);
                                    const friendItem = isFriend ? item : null;
                                    const requestItem = !isFriend
                                        ? item
                                        : null;
                                    const name = friendItem?.name || requestItem?.from || "Unknown";
                                    const id = friendItem?.id?.toString() || requestItem?.id || "";
                                    const avatar = friendItem?.avatar || requestItem?.avatar || "";
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    const mutualFriends = friendItem?.mutualFriends ||
                                        requestItem?.mutualFriends ||
                                        0;
                                    const plugins = friendItem?.plugins || [];
                                    return (_jsxs("div", { className: "bg-[#0D1126] rounded-lg p-4 border border-gray-700 group hover:border-[#7E4FFF]/50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [avatar ? (_jsx("img", { src: avatar, alt: name, className: "w-12 h-12 rounded-full object-cover" })) : (_jsx("div", { className: "w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold", children: name.charAt(0) })), friendItem?.status === "online" && (_jsx("div", { className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900", title: "Online" }))] }), _jsxs("div", { className: "flex-1 overflow-auto", children: [_jsx("h3", { className: "font-semibold text-white", children: name }), friendItem && (_jsx("p", { className: `text-sm ${friendItem.status === "online"
                                                                    ? "text-green-400"
                                                                    : friendItem.status === "away"
                                                                        ? "text-yellow-400"
                                                                        : "text-gray-400"}`, children: friendItem.status })), requestItem?.reason && (_jsx("p", { className: "text-xs text-gray-400", children: requestItem.reason }))] })] }), plugins
                                                .slice(0, 2)
                                                .map((plugin, idx) => (_jsx("span", { children: plugin }, idx))), _jsx("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: activeTab === "pending" ? (_jsxs(_Fragment, { children: [_jsx("button", { className: "px-2 py-1 text-sm text-green-500 rounded hover:bg-green-500/10 hover:text-green-400", onClick: () => handleAccept(String(item.id)), children: "Accept" }), _jsx("button", { className: "px-2 py-1 text-sm text-red-500 rounded hover:bg-red-500/10 hover:text-red-400", onClick: () => handleReject(String(item.id)), children: "Reject" })] })) : activeTab === "suggested" ? (_jsxs("button", { className: "px-2 py-1 text-sm text-blue-500 rounded hover:bg-blue-500/10 hover:text-blue-400", onClick: () => handleAddFriend(String(item.id)), children: [_jsx(UserPlus, { className: "w-3 h-3 mr-1" }), "Add"] })) : (_jsxs("button", { className: "px-2 py-1 text-sm text-blue-500 rounded hover:bg-blue-500/10 hover:text-blue-400", onClick: () => handleChat(item.id), children: [_jsx(MessageSquare, { className: "w-3 h-3 mr-1" }), "Chat"] })) })] }, id));
                                }) }) }) }) })] }) }));
}
