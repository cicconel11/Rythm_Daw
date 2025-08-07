import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation.js";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { Label } from "./ui/label.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
export function RegisterCredentials({ onContinue }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        displayName: "",
    });
    const [isPending, setIsPending] = useState(false);
    const isValid = formData.email.includes("@") &&
        formData.password.length >= 8 &&
        formData.displayName.length >= 2;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid)
            return;
        setIsPending(true);
        sessionStorage.setItem("rtm_reg_creds", JSON.stringify(formData));
        onContinue();
        router.push("/register/bio");
    };
    return (_jsx("div", { className: "min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex items-center justify-center p-6", children: _jsxs(Card, { className: "w-full max-w-md bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-xl font-['JetBrains_Mono']", children: "R" }) }), _jsx(CardTitle, { className: "text-2xl font-bold text-white font-['Inter']", children: "Create Account" }), _jsx("p", { className: "text-gray-400", children: "Join the RHYTHM community" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "email", className: "text-gray-300", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "bg-[#0D1126] border-gray-600 text-white", placeholder: "your@email.com", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "password", className: "text-gray-300", children: "Password" }), _jsx(Input, { id: "password", type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), className: "bg-[#0D1126] border-gray-600 text-white", placeholder: "8+ characters", required: true, minLength: 8 })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "displayName", className: "text-gray-300", children: "Display Name" }), _jsx(Input, { id: "displayName", type: "text", value: formData.displayName, onChange: (e) => setFormData({ ...formData, displayName: e.target.value }), className: "bg-[#0D1126] border-gray-600 text-white", placeholder: "Your producer name", required: true, minLength: 2 })] }), _jsx(Button, { type: "submit", disabled: !isValid || isPending, className: "w-full bg-[#7E4FFF] hover:bg-[#6B3FE6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold", children: isPending ? "Saving…" : "Continue" })] }) })] }) }));
}
