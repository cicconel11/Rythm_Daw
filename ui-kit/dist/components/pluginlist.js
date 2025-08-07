import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "./ui/badge.js";
import { ScrollArea } from "./ui/scroll-area.js";
import { CheckCircle, AlertTriangle, XCircle, Music } from "lucide-react";
const mockPlugins = [
    {
        id: "1",
        name: "Serum",
        vendor: "Xfer Records",
        version: "1.365",
        status: "up-to-date",
        active: true,
        category: "Synthesizer",
    },
    {
        id: "2",
        name: "FabFilter Pro-Q 3",
        vendor: "FabFilter",
        version: "3.24",
        status: "up-to-date",
        active: true,
        category: "EQ",
    },
    {
        id: "3",
        name: "Waves SSL G-Master",
        vendor: "Waves",
        version: "14.0",
        status: "version-mismatch",
        active: true,
        category: "Compressor",
    },
    {
        id: "4",
        name: "Native Instruments Massive X",
        vendor: "Native Instruments",
        version: "1.4.1",
        status: "missing",
        active: false,
        category: "Synthesizer",
    },
    {
        id: "5",
        name: "Valhalla VintageVerb",
        vendor: "Valhalla DSP",
        version: "3.0.1",
        status: "up-to-date",
        active: false,
        category: "Reverb",
    },
    {
        id: "6",
        name: "Soundtoys Decapitator",
        vendor: "Soundtoys",
        version: "5.5.4",
        status: "up-to-date",
        active: true,
        category: "Distortion",
    },
];
const getStatusIcon = (status) => {
    switch (status) {
        case "up-to-date":
            return _jsx(CheckCircle, { className: "w-4 h-4 text-green-400" });
        case "version-mismatch":
            return _jsx(AlertTriangle, { className: "w-4 h-4 text-orange-400" });
        case "missing":
            return _jsx(XCircle, { className: "w-4 h-4 text-red-400" });
    }
};
const getStatusBadge = (status) => {
    switch (status) {
        case "up-to-date":
            return (_jsx(Badge, { variant: "secondary", className: "bg-green-500/20 text-green-400 border-green-500/30", children: "Up to date" }));
        case "version-mismatch":
            return (_jsx(Badge, { variant: "secondary", className: "bg-orange-500/20 text-orange-400 border-orange-500/30", children: "Update available" }));
        case "missing":
            return (_jsx(Badge, { variant: "secondary", className: "bg-red-500/20 text-red-400 border-red-500/30", children: "Missing" }));
    }
};
export function PluginList({ showInactive }) {
    const filteredPlugins = showInactive
        ? mockPlugins
        : mockPlugins.filter((p) => p.active);
    const hasPlugins = filteredPlugins.length > 0;
    if (!hasPlugins) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Music, { className: "w-8 h-8 text-white" }) }), _jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "No plugins found" }), _jsx("p", { className: "text-gray-400 text-sm mb-4", children: showInactive
                        ? "No plugins detected in your system."
                        : "No active plugins found." }), _jsx("p", { className: "text-gray-500 text-xs", children: "Try running a plugin scan to detect installed plugins." })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-semibold text-white", children: ["Plugins (", filteredPlugins.length, ")"] }), _jsxs("div", { className: "flex gap-2 text-xs", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full" }), _jsxs("span", { className: "text-gray-400", children: [mockPlugins.filter((p) => p.status === "up-to-date").length, " ", "Active"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-orange-400 rounded-full" }), _jsxs("span", { className: "text-gray-400", children: [mockPlugins.filter((p) => p.status === "version-mismatch")
                                                .length, " ", "Updates"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-red-400 rounded-full" }), _jsxs("span", { className: "text-gray-400", children: [mockPlugins.filter((p) => p.status === "missing").length, " Missing"] })] })] })] }), _jsx(ScrollArea, { className: "h-64", children: _jsx("div", { className: "space-y-3", children: filteredPlugins.map((plugin) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-[#0D1126] border border-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [getStatusIcon(plugin.status), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-white font-medium", children: plugin.name }), !plugin.active && (_jsx(Badge, { variant: "outline", className: "text-xs border-gray-600 text-gray-400", children: "Inactive" }))] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-400", children: [_jsx("span", { children: plugin.vendor }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: plugin.category }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["v", plugin.version] })] })] })] }), _jsx("div", { className: "flex items-center gap-2", children: getStatusBadge(plugin.status) })] }, plugin.id))) }) })] }));
}
