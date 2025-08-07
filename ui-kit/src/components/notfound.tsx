import React from "react";
import { Button } from "./ui/button.js";

interface NotFoundProps {
  onNavigate?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1126] text-white p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8 text-gray-300">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        onClick={handleGoHome}
        className="bg-[#7E4FFF] hover:bg-[#6B3FE7] text-white font-bold py-2 px-6 rounded-full transition-colors"
      >
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;
