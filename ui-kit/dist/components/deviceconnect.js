import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Progress } from "./ui/progress.js";
export function DeviceConnect({ onSuccess, onNavigate }) {
    const queryClient = useQueryClient();
    const [code, setCode] = useState("");
    const [progress, setProgress] = useState(0);
    // Generate a random pairing code
    useEffect(() => {
        setCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    }, []);
    // Mutation for device pairing
    const { mutate: pairDevice, isPending } = useMutation({
        mutationFn: async () => {
            const response = await fetch("/api/plugins/pair", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ code }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to pair device");
            }
            // Long polling for pairing completion
            return new Promise((resolve, reject) => {
                const checkStatus = async () => {
                    try {
                        const statusResponse = await fetch(`/api/plugins/pair/status?code=${code}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        });
                        if (!statusResponse.ok)
                            throw new Error("Status check failed");
                        const data = await statusResponse.json();
                        if (data.status === "paired") {
                            resolve(data);
                        }
                        else if (data.status === "pending") {
                            setProgress((prev) => Math.min(prev + 10, 90)); // Cap at 90% until fully paired
                            setTimeout(checkStatus, 2000); // Check again after 2 seconds
                        }
                        else {
                            reject(new Error("Pairing failed"));
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                };
                checkStatus();
            });
        },
        onSuccess: () => {
            setProgress(100);
            queryClient.invalidateQueries({ queryKey: ["devices"] });
            if (onNavigate) {
                onNavigate("/dashboard");
            }
            else {
                onSuccess();
            }
        },
        onError: (error) => {
            toast.error(error.message || "Failed to pair device");
            setProgress(0);
        },
    });
    // Start pairing process when component mounts
    useEffect(() => {
        if (code) {
            pairDevice();
        }
    }, [code, pairDevice]);
    return (_jsx("div", { className: "min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex items-center justify-center p-6", children: _jsxs(Card, { className: "w-full max-w-2xl bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-xl font-['JetBrains_Mono']", children: "R" }) }), _jsx(CardTitle, { className: "text-3xl font-bold text-white font-['Inter'] mb-2", children: "Connect your device" }), _jsx("p", { className: "text-gray-400 text-lg", children: "Enter this code in the RHYTHM plug-in to link this browser" })] }), _jsxs(CardContent, { className: "text-center space-y-8", children: [_jsxs("div", { className: "bg-[#0D1126] rounded-lg p-8 border border-gray-700", children: [_jsx("div", { className: "text-6xl font-bold text-[#7E4FFF] font-['JetBrains_Mono'] tracking-wider mb-4", children: code }), _jsx("div", { className: "w-32 h-32 bg-white rounded-lg mx-auto p-4", children: _jsx("div", { className: "w-full h-full bg-gray-900 rounded grid grid-cols-8 gap-1", children: Array.from({ length: 64 }).map((_, i) => (_jsx("div", { className: `rounded-sm ${Math.random() > 0.5 ? "bg-white" : "bg-gray-900"}` }, i))) }) })] }), _jsxs("div", { className: "w-full max-w-md mx-auto", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-400 mb-1", children: [_jsx("span", { children: isPending ? "Waiting for device..." : "Ready to pair" }), _jsxs("span", { children: [progress, "%"] })] }), _jsx(Progress, { value: progress, className: "h-2" }), !isPending && (_jsx("button", { onClick: () => pairDevice(), className: "mt-4 text-sm text-[#7E4FFF] hover:underline", children: "Retry connection" }))] })] })] }) }));
}
