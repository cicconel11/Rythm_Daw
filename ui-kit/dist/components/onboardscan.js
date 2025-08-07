import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "./ui/button.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Download } from "lucide-react";
export function OnboardScan({ onSuccess, onNavigate }) {
    const { mutate: downloadApp, isPending } = useMutation({
        mutationFn: async () => {
            const os = detectOS();
            const response = await fetch(`/api/download?os=${os}`);
            if (!response.ok) {
                throw new Error("Failed to download app");
            }
            // Create a blob from the response and trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `RHYTHM-${os}.dmg`; // Will be adjusted based on OS
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            return os;
        },
        onSuccess: (os) => {
            toast.success(`Downloading RHYTHM for ${os}...`);
            // Call onNavigate if provided, otherwise call onSuccess
            if (onNavigate) {
                onNavigate("/connect-device");
            }
            else {
                onSuccess();
            }
        },
        onError: () => {
            toast.error("Failed to start download. Please try again.");
        },
    });
    const handleSkip = () => {
        if (onNavigate) {
            onNavigate("/onboard/device");
        }
        else {
            onSuccess();
        }
    };
    const detectOS = () => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes("Mac"))
            return "mac";
        if (userAgent.includes("Windows"))
            return "windows";
        return "linux";
    };
    return (_jsx("div", { className: "min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex items-center justify-center p-6", children: _jsxs(Card, { className: "w-full max-w-2xl bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-xl font-['JetBrains_Mono']", children: "R" }) }), _jsx(CardTitle, { className: "text-3xl font-bold text-white font-['Inter'] mb-2", children: "Scan your plug-ins" }), _jsx("p", { className: "text-gray-400 text-lg", children: "Download RHYTHM for your DAW to get started" })] }), _jsxs(CardContent, { className: "text-center space-y-6", children: [_jsx("div", { className: "bg-[#0D1126] rounded-lg p-8 border border-gray-700", children: _jsxs("div", { className: "flex items-center justify-center space-x-8", children: [_jsx("div", { className: "w-24 h-16 bg-gradient-to-br from-[#7E4FFF]/20 to-[#6B3FE6]/20 rounded border border-[#7E4FFF]/30 flex items-center justify-center", children: _jsx("span", { className: "text-[#7E4FFF] font-bold text-sm", children: "DAW" }) }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("div", { className: "w-2 h-2 bg-[#7E4FFF] rounded-full animate-pulse" }), _jsx("div", { className: "w-2 h-2 bg-[#7E4FFF] rounded-full animate-pulse", style: { animationDelay: "0.2s" } }), _jsx("div", { className: "w-2 h-2 bg-[#7E4FFF] rounded-full animate-pulse", style: { animationDelay: "0.4s" } })] }), _jsx("div", { className: "w-24 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm font-['JetBrains_Mono']", children: "RHYTHM" }) })] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs(Button, { onClick: () => downloadApp(), disabled: isPending, className: "bg-gradient-to-r from-[#7E4FFF] to-[#6B3FE6] text-white hover:opacity-90 transition-opacity", children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), isPending
                                            ? "Preparing download..."
                                            : `Download for ${detectOS()}`] }), _jsx(Button, { variant: "ghost", onClick: handleSkip, disabled: isPending, className: "text-gray-400 hover:text-white", children: "Skip for now" })] })] })] }) }));
}
