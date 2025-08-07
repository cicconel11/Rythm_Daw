import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../lib/utils.js";
export const Badge = ({ variant = "primary", className, ...props }) => (_jsx("span", { ...props, className: cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", variant === "secondary"
        ? "bg-gray-100 text-gray-800"
        : "bg-blue-600 text-white", className) }));
