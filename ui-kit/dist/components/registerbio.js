import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "./ui/button.js";
import { Textarea } from "./ui/textarea.js";
import { Label } from "./ui/label.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Progress } from "./ui/progress.js";
export function RegisterBio({ onSuccess, onNavigate }) {
    const [bio, setBio] = useState("");
    const maxLength = 140;
    const { mutate: updateBio, isPending } = useMutation({
        mutationFn: async (bio) => {
            const response = await fetch("/api/users/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ bio }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to update bio");
            }
            return response.json();
        },
        onSuccess: (_data) => {
            if (onNavigate) {
                onNavigate("/dashboard");
            }
            else {
                onSuccess();
            }
        },
        onError: (error) => {
            toast.error(error.message || "Failed to save bio");
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        updateBio(bio);
    };
    return (_jsx("div", { className: "min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex items-center justify-center p-6", children: _jsxs(Card, { className: "w-full max-w-md bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsxs("div", { className: "mb-4", children: [_jsx(Progress, { value: 100, className: "h-2" }), _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Step 2 of 2" })] }), _jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-xl font-['JetBrains_Mono']", children: "R" }) }), _jsx(CardTitle, { className: "text-2xl font-bold text-white font-['Inter']", children: "Tell us about yourself" }), _jsx("p", { className: "text-gray-400", children: "Write a short bio for your profile" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "bio", className: "text-gray-300", children: "Bio" }), _jsx(Textarea, { id: "bio", value: bio, onChange: (e) => setBio(e.target.value.slice(0, maxLength)), className: "bg-[#0D1126] border-gray-600 text-white min-h-[100px]", placeholder: "Producer from Los Angeles. Love creating ambient and techno tracks..." }), _jsx("div", { className: "flex justify-end mt-1", children: _jsxs("span", { className: `text-sm ${bio.length > maxLength * 0.9 ? "text-orange-400" : "text-gray-500"}`, children: [bio.length, "/", maxLength] }) })] }), _jsx(Button, { type: "submit", className: "w-full bg-gradient-to-r from-[#7E4FFF] to-[#6B3FE6] text-white hover:opacity-90 transition-opacity", disabled: !bio.trim() || isPending, children: isPending ? "Saving..." : "Create Account" })] }) })] }) }));
}
