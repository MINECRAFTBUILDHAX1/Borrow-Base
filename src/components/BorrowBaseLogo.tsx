
import React from "react";

interface BorrowBaseLogoProps {
  size?: "sm" | "md" | "lg";
}

const BorrowBaseLogo: React.FC<BorrowBaseLogoProps> = ({ size = "md" }) => {
  const getLogoSize = () => {
    switch (size) {
      case "sm":
        return "text-xl";
      case "lg":
        return "text-4xl";
      default:
        return "text-2xl";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-brand-purple rounded-lg p-1 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${size === "sm" ? "h-5 w-5" : size === "lg" ? "h-8 w-8" : "h-6 w-6"}`}
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      </div>
      <span className={`font-bold ${getLogoSize()}`}>
        <span className="text-brand-purple">Borrow</span>
        <span className="text-gray-900">Base</span>
      </span>
    </div>
  );
};

export default BorrowBaseLogo;
