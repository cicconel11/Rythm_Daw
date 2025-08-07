import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./ui/button.js";
export const NotFound = ({ onNavigate }) => {
    const handleGoHome = () => {
        if (onNavigate) {
            onNavigate();
        }
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-[#0D1126] text-white p-4", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "404 - Page Not Found" }), _jsx("p", { className: "text-xl mb-8 text-gray-300", children: "The page you're looking for doesn't exist or has been moved." }), _jsx(Button, { onClick: handleGoHome, className: "bg-[#7E4FFF] hover:bg-[#6B3FE7] text-white font-bold py-2 px-6 rounded-full transition-colors", children: "Go to Home" })] }));
};
export default NotFound;
