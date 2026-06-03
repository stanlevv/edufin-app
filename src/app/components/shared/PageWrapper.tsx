import React, { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex items-start justify-center"
      style={{ background: "linear-gradient(135deg, #EEF4FF 0%, #E6F7FF 100%)" }}>
      <div
        className="relative w-full max-w-[430px] min-h-screen bg-white shadow-2xl overflow-hidden"
        style={{ minHeight: "100dvh" }}
      >
        {children}
      </div>
    </div>
  );
}
