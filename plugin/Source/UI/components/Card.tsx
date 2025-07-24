import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-card rounded-xl shadow-inner-md p-4 ${className}`}>
      {children}
    </div>
  );
};
