import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "./ui/button.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Input } from "./ui/input.js";
import { Label } from "./ui/label.js";
import { Textarea } from "./ui/textarea.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.js";
import { Switch } from "./ui/switch.js";
import { Progress } from "./ui/progress.js";
// import { Badge } from "./ui/badge.js";
import { User, Upload, RefreshCw,
// Settings as SettingsIcon,
 } from "lucide-react";
import { PluginList } from "./pluginlist.js";
export function SettingsAccount({ onUpdateAccount, onAvatarChange, onRescanPlugins, }) {
    const [displayName, setDisplayName] = useState("DJ Producer");
    const [email] = useState("dj@producer.com");
    const [bio, setBio] = useState("Making beats and collaborating with artists worldwide.");
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [showInactive, setShowInactive] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const handleInputChange = (field, value) => {
        setIsDirty(true);
        if (field === "displayName")
            setDisplayName(value);
        if (field === "bio")
            setBio(value);
    };
    const handleSave = (e) => {
        e.preventDefault();
        onUpdateAccount({ displayName, email, bio });
        setIsDirty(false);
    };
    const handleRescan = () => {
        setIsScanning(true);
        setScanProgress(0);
        const interval = setInterval(() => {
            setScanProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    onRescanPlugins();
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };
    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onAvatarChange(file);
        }
    };
    return (_jsx("div", { className: "p-6 space-y-6 animate-fade-in", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground mb-2", children: "Settings" }), _jsx("p", { className: "text-muted-foreground", children: "Manage your account and plugin library" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-card-foreground flex items-center gap-2", children: [_jsx(User, { className: "w-5 h-5" }), "Account Details"] }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Avatar, { className: "w-20 h-20", children: [_jsx(AvatarImage, { src: "" }), _jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-xl", children: "DJ" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "avatar", className: "text-muted-foreground cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-secondary transition-colors", children: [_jsx(Upload, { className: "w-4 h-4" }), "Upload Avatar"] }) }), _jsx("input", { id: "avatar", type: "file", accept: "image/*", className: "hidden", onChange: handleAvatarUpload }), _jsx("p", { className: "text-xs text-muted-foreground/70 mt-1", children: "Max 2MB, JPG or PNG" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "displayName", className: "text-muted-foreground", children: "Display Name" }), _jsx(Input, { id: "displayName", value: displayName, onChange: (e) => handleInputChange("displayName", e.target.value), className: "bg-background border-border text-foreground placeholder-muted-foreground", placeholder: "Enter your display name" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", className: "text-muted-foreground", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: email, disabled: true, className: "bg-muted border-border text-muted-foreground cursor-not-allowed" }), _jsx("p", { className: "text-xs text-muted-foreground/70", children: "Email cannot be changed" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "bio", className: "text-muted-foreground", children: "Bio" }), _jsx(Textarea, { id: "bio", value: bio, onChange: (e) => handleInputChange("bio", e.target.value), className: "bg-background border-border text-foreground placeholder-muted-foreground min-h-[100px]", placeholder: "Tell us about yourself...", maxLength: 140 }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-xs text-muted-foreground/70", children: [bio.length, "/140 characters"] }), bio.length > 120 && (_jsx("span", { className: "text-xs text-orange-400", children: "Approaching limit" }))] })] }), _jsx(Button, { type: "submit", disabled: !isDirty, className: "w-full disabled:opacity-50 disabled:cursor-not-allowed", children: "Save Changes" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-card-foreground flex items-center gap-2", children: [_jsx(RefreshCw, { className: "w-5 h-5" }), "Plugin Inventory"] }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Plugin Library" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Scan for new and updated plugins" })] }), _jsxs(Button, { onClick: handleRescan, disabled: isScanning, variant: "outline", className: "border-border text-foreground hover:bg-primary/10", children: [_jsx(RefreshCw, { className: `w-4 h-4 mr-2 ${isScanning ? "animate-spin" : ""}` }), isScanning ? "Scanning..." : "Re-scan"] })] }), isScanning && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Scanning plugins..." }), _jsxs("span", { className: "text-primary", children: [scanProgress, "%"] })] }), _jsx(Progress, { value: scanProgress, className: "h-2" })] }))] }), _jsxs("div", { className: "flex items-center justify-between py-3 border-t border-border", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "show-inactive", className: "text-muted-foreground font-medium", children: "Show inactive plugins" }), _jsx("p", { className: "text-xs text-muted-foreground/70", children: "Display plugins that are not currently loaded" })] }), _jsx(Switch, { id: "show-inactive", checked: showInactive, onCheckedChange: setShowInactive })] }), _jsx(PluginList, { showInactive: showInactive })] })] })] })] }) }));
}
