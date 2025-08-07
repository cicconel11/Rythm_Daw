import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Badge } from "./ui/badge.js";
import { Skeleton } from "./ui/skeleton.js";
import { ScrollArea } from "./ui/scroll-area.js";
import { Activity, Cpu, Users, Folder } from "lucide-react";
const stats = [
    {
        label: "Active Plugins",
        value: "12",
        icon: Activity,
        color: "text-[#7E4FFF]",
    },
    { label: "Projects", value: "8", icon: Folder, color: "text-blue-400" },
    { label: "CPU Usage", value: "45%", icon: Cpu, color: "text-green-400" },
    { label: "Collaborators", value: "3", icon: Users, color: "text-orange-400" },
];
const plugins = [
    { name: "Serum", status: "active", cpu: "12%", type: "Synthesizer" },
    { name: "FabFilter Pro-Q 3", status: "active", cpu: "8%", type: "EQ" },
    { name: "Massive X", status: "inactive", cpu: "0%", type: "Synthesizer" },
    { name: "Ozone 10", status: "inactive", cpu: "0%", type: "Mastering" },
    { name: "Battery 4", status: "active", cpu: "15%", type: "Drums" },
];
const activities = [
    { action: "Plugin scan completed", time: "2 minutes ago", type: "system" },
    { action: "Serum preset shared", time: "15 minutes ago", type: "share" },
    { action: "Project exported", time: "1 hour ago", type: "export" },
    {
        action: "Friend request from BeatMaker99",
        time: "2 hours ago",
        type: "social",
    },
];
export function Dashboard({ onNavigate: _onNavigate }) {
    return (_jsx("div", { className: "min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white font-['Inter'] mb-2", children: "Dashboard" }), _jsx("p", { className: "text-gray-400", children: "Welcome back to your music production hub" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((stat, index) => (_jsx(Card, { className: "bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: stat.label }), _jsx("p", { className: `text-2xl font-bold ${stat.color}`, children: stat.value })] }), _jsx(stat.icon, { className: `w-8 h-8 ${stat.color}` })] }) }) }, index))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-2 bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-xl text-white font-['Inter']", children: "Plugins" }) }), _jsx(CardContent, { children: _jsx(ScrollArea, { className: "h-[300px]", children: _jsx("div", { className: "space-y-3", children: plugins.map((plugin, index) => (_jsx("div", { className: "bg-[#0D1126] rounded-lg p-4 border border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${plugin.status === "active" ? "bg-green-400" : "bg-gray-500"}` }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-white", children: plugin.name }), _jsx("p", { className: "text-sm text-gray-400", children: plugin.type })] })] }), _jsxs("div", { className: "text-right", children: [_jsx(Badge, { variant: plugin.status === "active"
                                                                        ? "default"
                                                                        : "secondary", children: plugin.status }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: plugin.cpu })] })] }) }, index))) }) }) })] }), _jsxs(Card, { className: "bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-xl text-white font-['Inter']", children: "Recent Activity" }) }), _jsx(CardContent, { children: _jsx(ScrollArea, { className: "h-[300px]", children: _jsxs("div", { className: "space-y-4", children: [activities.map((activity, index) => (_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-[#7E4FFF] rounded-full mt-2 flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-white", children: activity.action }), _jsx("p", { className: "text-xs text-gray-400", children: activity.time })] })] }, index))), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-full bg-gray-700" }), _jsx(Skeleton, { className: "h-3 w-1/2 bg-gray-700" })] })] }) }) })] })] })] }) }));
}
