import React, { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "430px",
}: ModalWrapperProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full mx-4 bg-white rounded-3xl shadow-2xl animate-scale-in"
        style={{
          maxWidth,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button - Always Visible */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            backdropFilter: "blur(8px)",
          }}
        >
          <X size={20} color="#595959" strokeWidth={2.5} />
        </button>

        {/* Header - Fixed at Top */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <h2 style={{ fontWeight: 800, fontSize: "1.2rem", color: "#242424", paddingRight: "40px" }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: "0.8rem", color: "#8C8C8C", marginTop: "4px" }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto px-6 pb-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#D9D9D9 transparent",
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
