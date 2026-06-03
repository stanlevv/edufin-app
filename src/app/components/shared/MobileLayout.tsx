import React, { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className = "" }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div
        className={`relative w-full max-w-[430px] min-h-screen bg-white overflow-hidden shadow-xl ${className}`}
        style={{ minHeight: "100dvh" }}
      >
        {children}
      </div>
    </div>
  );
}
