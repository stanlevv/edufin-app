/**
 * InstallPWAButton
 * Tombol install PWA yang muncul di header siswa/donatur setelah login.
 * Hanya tampil jika browser mendukung PWA install dan belum diinstall.
 */
import React, { useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { usePWAInstall } from "../../hooks/usePWAInstall";

interface InstallPWAButtonProps {
  variant?: "icon" | "banner"; // icon = kecil di navbar, banner = banner bawah
}

export function InstallPWAButton({ variant = "icon" }: InstallPWAButtonProps) {
  const { canInstall, isInstalled, isInstalling, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Jangan tampilkan jika sudah install, tidak bisa install, atau di-dismiss
  if (!canInstall || isInstalled || dismissed) return null;

  if (variant === "banner") {
    return (
      <div
        className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl p-4 flex items-center gap-3 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #0A2463, #1677FF)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <Smartphone size={20} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ color: "white", fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.2 }}>
            Pasang di HP kamu
          </p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem", marginTop: "2px" }}>
            Akses EDUFIN lebih cepat dari layar utama
          </p>
        </div>
        <button
          onClick={install}
          disabled={isInstalling}
          className="flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95"
          style={{ background: "white", color: "#1677FF" }}
        >
          {isInstalling ? "..." : "Pasang"}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded-lg"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  // Variant: icon di navbar/header
  return (
    <div className="relative">
      <button
        id="pwa-install-btn"
        onClick={async () => {
          const success = await install();
          if (!success) setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000);
        }}
        disabled={isInstalling}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
        style={{ background: "#EEF4FF", color: "#1677FF" }}
        title="Pasang Aplikasi EDUFIN"
      >
        <Download size={18} />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute right-0 top-11 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap z-50 shadow-lg"
          style={{ background: "#1677FF", color: "white" }}
        >
          Tambahkan ke layar utama HP kamu! 📱
          <div
            className="absolute -top-1.5 right-3 w-3 h-3 rotate-45"
            style={{ background: "#1677FF" }}
          />
        </div>
      )}
    </div>
  );
}
