import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { Badge } from "./ui/badge.js";
import { ScrollArea } from "./ui/scroll-area.js";
import { Send, Search, Music, Info } from "lucide-react";
const friends = [
    {
        id: 1,
        name: "BeatMaker99",
        avatar: "BM",
        status: "online",
        lastMessage: "Check out this new beat!",
        time: "2m",
        unread: 2,
    },
    {
        id: 2,
        name: "ProducerX",
        avatar: "PX",
        status: "offline",
        lastMessage: "What DAW are you using?",
        time: "1h",
        unread: 0,
    },
    {
        id: 3,
        name: "SynthWave2024",
        avatar: "SW",
        status: "online",
        lastMessage: "Thanks for the plugin tip!",
        time: "3h",
        unread: 1,
    },
];
const messages = [
    {
        id: 1,
        sender: "BeatMaker99",
        content: "Hey! Check out this new beat I made",
        time: "10:30 AM",
        isOwn: false,
    },
    {
        id: 2,
        sender: "You",
        content: "That sounds amazing! What plugins did you use?",
        time: "10:32 AM",
        isOwn: true,
    },
    {
        id: 3,
        sender: "BeatMaker99",
        content: "Mostly Serum for the lead and some FabFilter for EQ",
        time: "10:33 AM",
        isOwn: false,
    },
];
const friendPlugins = [
    { id: "serum", name: "Serum", version: "1.365", compatible: true },
    {
        id: "fabfilter",
        name: "FabFilter Pro-Q 3",
        version: "3.24",
        compatible: true,
    },
    { id: "massive", name: "Massive X", version: "1.4.1", compatible: false },
];
const currentUserPlugins = ["serum", "fabfilter"]; // Mock user's plugins
export function ChatPanel({ onNavigate: _onNavigate }) {
    const [selectedFriend, setSelectedFriend] = useState(friends[0]);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("plugins");
    const sendMessage = () => {
        if (message.trim()) {
            console.log("Sending message:", message);
            setMessage("");
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex", children: [_jsxs("div", { className: "w-80 border-r border-gray-700 bg-[#141B33]", children: [_jsxs("div", { className: "p-4 border-b border-gray-700", children: [_jsx("h2", { className: "text-xl font-bold text-white font-['Inter'] mb-3", children: "Messages" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-4 h-4 absolute left-3 top-3 text-gray-400" }), _jsx(Input, { placeholder: "Search conversations...", className: "pl-10 bg-[#0D1126] border-gray-600 text-white" })] })] }), _jsx(ScrollArea, { className: "h-[calc(100vh-120px)]", children: _jsx("div", { className: "p-2", children: friends.map((friend) => (_jsx("div", { onClick: () => setSelectedFriend(friend), className: `p-3 rounded-lg cursor-pointer transition-colors ${selectedFriend.id === friend.id
                                    ? "bg-[#7E4FFF]/20"
                                    : "hover:bg-gray-700/50"}`, children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: friend.avatar }) }), _jsx("div", { className: `absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#141B33] ${friend.status === "online"
                                                        ? "bg-green-400"
                                                        : "bg-gray-500"}` })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-white truncate", children: friend.name }), _jsx("span", { className: "text-xs text-gray-400", children: friend.time })] }), _jsx("p", { className: "text-sm text-gray-400 truncate", children: friend.lastMessage })] }), friend.unread > 0 && (_jsx(Badge, { className: "bg-[#7E4FFF] text-white", children: friend.unread }))] }) }, friend.id))) }) })] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("div", { className: "p-4 border-b border-gray-700 bg-[#141B33]", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: selectedFriend.avatar }) }), _jsx("div", { className: `absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#141B33] ${selectedFriend.status === "online"
                                                ? "bg-green-400"
                                                : "bg-gray-500"}` })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-white", children: selectedFriend.name }), _jsx("p", { className: "text-sm text-gray-400", children: selectedFriend.status })] })] }) }), _jsx(ScrollArea, { className: "flex-1 p-4", children: _jsx("div", { className: "space-y-4", children: messages.map((msg) => (_jsx("div", { className: `flex ${msg.isOwn ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.isOwn
                                        ? "bg-[#7E4FFF] text-white"
                                        : "bg-gray-700 text-white"}`, children: [_jsx("p", { className: "text-sm", children: msg.content }), _jsx("p", { className: "text-xs opacity-70 mt-1", children: msg.time })] }) }, msg.id))) }) }), _jsx("div", { className: "p-4 border-t border-gray-700 bg-[#141B33]", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx(Input, { value: message, onChange: (e) => setMessage(e.target.value), onKeyPress: (e) => e.key === "Enter" && sendMessage(), placeholder: "Type a message...", className: "flex-1 bg-[#0D1126] border-gray-600 text-white" }), _jsx(Button, { onClick: sendMessage, className: "bg-[#7E4FFF] hover:bg-[#6B3FE6]", children: _jsx(Send, { className: "w-4 h-4" }) })] }) })] }), _jsxs("div", { className: "w-80 border-l border-gray-700 bg-[#141B33]", children: [_jsx("div", { className: "p-4 border-b border-gray-700", children: _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: activeTab === "plugins" ? "default" : "outline", size: "sm", onClick: () => setActiveTab("plugins"), className: "flex-1", children: [_jsx(Music, { className: "w-4 h-4 mr-1" }), "Plugins"] }), _jsxs(Button, { variant: activeTab === "details" ? "default" : "outline", size: "sm", onClick: () => setActiveTab("details"), className: "flex-1", children: [_jsx(Info, { className: "w-4 h-4 mr-1" }), "Details"] })] }) }), _jsxs(ScrollArea, { className: "h-[calc(100vh-120px)] p-4", children: [activeTab === "plugins" && (_jsxs("div", { className: "space-y-3", children: [_jsxs("h3", { className: "font-semibold text-white", children: [selectedFriend.name, "'s Plugins"] }), friendPlugins.map((plugin, index) => (_jsxs("div", { className: "bg-[#0D1126] rounded-lg p-3 border border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("h4", { className: "font-medium text-white text-sm", children: plugin.name }), _jsx("div", { className: "flex items-center gap-2", children: currentUserPlugins.includes(plugin.id) && (_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" })) })] }), _jsxs("p", { className: "text-xs text-gray-400", children: ["v", plugin.version] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: plugin.compatible ? "Compatible" : "Not installed" })] }, index)))] })), activeTab === "details" && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "font-semibold text-white", children: "Profile" }), _jsxs("div", { className: "bg-[#0D1126] rounded-lg p-4 border border-gray-700", children: [_jsxs("div", { className: "text-center mb-4", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto flex items-center justify-center mb-2", children: _jsx("span", { className: "text-white font-bold", children: selectedFriend.avatar }) }), _jsx("h4", { className: "font-semibold text-white", children: selectedFriend.name }), _jsx("p", { className: "text-sm text-gray-400", children: "Producer" })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Status:" }), _jsx("span", { className: selectedFriend.status === "online"
                                                                    ? "text-green-400"
                                                                    : "text-gray-400", children: selectedFriend.status })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Mutual friends:" }), _jsx("span", { className: "text-white", children: "5" })] })] })] })] }))] })] })] }));
}
