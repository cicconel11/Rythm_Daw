import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { Label } from "./ui/label.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
export function LoginPage({ onLogin, onCreateAccount, onForgotPassword, }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const isValid = email.includes("@") && password.length >= 1;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) {
            onLogin({ email, password });
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-radial from-navyDeep to-navy flex items-center justify-center p-6", children: _jsxs(Card, { className: "w-full max-w-md bg-gradient-to-br from-navy to-[#1A2142] border-border", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-purple to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-xl font-['JetBrains_Mono']", children: "R" }) }), _jsx(CardTitle, { className: "text-2xl font-bold text-foreground font-['Inter']", children: "Welcome Back" }), _jsx("p", { className: "text-muted-foreground", children: "Sign in to your RHYTHM account" })] }), _jsxs(CardContent, { children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "email", className: "text-foreground", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "bg-background border-border text-foreground", placeholder: "your@email.com", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "password", className: "text-foreground", children: "Password" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "bg-background border-border text-foreground", placeholder: "Enter your password", required: true })] }), _jsx(Button, { type: "submit", disabled: !isValid, className: "w-full bg-purple hover:bg-[#976BFF] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold", children: "Sign In" })] }), _jsxs("div", { className: "mt-6 text-center space-y-4", children: [_jsx("button", { onClick: onForgotPassword, className: "text-purple hover:text-[#976BFF] text-sm underline", children: "Forgot password?" }), _jsxs("div", { className: "text-muted-foreground text-sm", children: ["Don't have an account?", " ", _jsx("button", { onClick: onCreateAccount, className: "text-purple hover:text-[#976BFF] underline", children: "Create account" })] })] })] })] }) }));
}
