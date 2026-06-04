import React, { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "edufin_pwa_dismissed";
const INSTALL_KEY   = "edufin_pwa_installed";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isInStandaloneMode() {
  return (
    (window.navigator as any).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner]         = useState(false);
  const [showIOSGuide, setShowIOSGuide]     = useState(false);
  const [installing, setInstalling]         = useState(false);

  useEffect(() => {
    // Jangan tampilkan jika:
    // 1. Sudah diinstall (standalone mode)
    // 2. User sudah dismiss sebelumnya
    // 3. Bukan perangkat mobile
    if (isInStandaloneMode()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (localStorage.getItem(INSTALL_KEY)) return;

    const ua = navigator.userAgent;
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua) ||
      window.innerWidth <= 768;

    if (!isMobileDevice) return;

    // Android/Chrome: tangkap event beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Tunda tampilkan banner 3 detik agar tidak langsung mengganggu
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari: tidak ada event, tampilkan panduan manual
    if (isIOS()) {
      setTimeout(() => setShowBanner(true), 3000);
    }

    // Deteksi jika berhasil diinstall
    window.addEventListener("appinstalled", () => {
      localStorage.setItem(INSTALL_KEY, "1");
      setShowBanner(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem(INSTALL_KEY, "1");
    }
    setInstalling(false);
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShowBanner(false);
    setShowIOSGuide(false);
  };

  if (!showBanner) return null;

  // ── iOS Guide Modal ─────────────────────────────────────────────────────────
  if (showIOSGuide) {
    return (
      <>
        {/* Overlay */}
        <div
          onClick={handleDismiss}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          }}
        />

        {/* Bottom Sheet */}
        <div
          style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            zIndex: 10000, background: "white",
            borderRadius: "24px 24px 0 0",
            padding: "0 20px 32px",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
            animation: "pwaSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: "#E0E0E0" }} />
          </div>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/apple-touch-icon.png" alt="EDUFIN" style={{ width: 44, height: 44, borderRadius: 12 }} />
              <div>
                <p style={{ fontWeight: 800, fontSize: "1rem", color: "#1A1A2E", margin: 0 }}>Pasang EDUFIN</p>
                <p style={{ fontSize: "0.75rem", color: "#8C8C8C", margin: 0 }}>Akses cepat tanpa browser</p>
              </div>
            </div>
            <button onClick={handleDismiss}
              style={{ width: 32, height: 32, borderRadius: "50%", background: "#F5F5F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} color="#595959" />
            </button>
          </div>

          {/* Steps */}
          {[
            {
              icon: <Share size={20} color="#1677FF" />,
              bg: "#EEF4FF",
              title: "Ketuk tombol Bagikan",
              desc: 'Ikon kotak dengan panah ke atas di bar bawah Safari',
            },
            {
              icon: <span style={{ fontSize: "1.1rem" }}>📌</span>,
              bg: "#F6FFED",
              title: 'Pilih "Tambahkan ke Layar Utama"',
              desc: "Scroll ke bawah pada menu yang muncul",
            },
            {
              icon: <span style={{ fontSize: "1.1rem" }}>✅</span>,
              bg: "#FFF7E0",
              title: 'Ketuk "Tambahkan"',
              desc: "EDUFIN akan muncul di Home Screen iPhone Anda",
            },
          ].map((step, i) => (
            <div key={i}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                marginBottom: 14, padding: "12px 14px", borderRadius: 16,
                background: step.bg,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "white", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}>
                {step.icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1A1A2E", margin: "0 0 2px" }}>
                  {step.title}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#595959", margin: 0, lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={handleDismiss}
            style={{
              width: "100%", padding: "14px", marginTop: 4,
              borderRadius: 16, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#1677FF,#108EE9)",
              color: "white", fontWeight: 800, fontSize: "0.95rem",
              boxShadow: "0 4px 16px rgba(22,119,255,0.35)",
            }}
          >
            Mengerti!
          </button>
        </div>

        <style>{`
          @keyframes pwaSlideUp {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        `}</style>
      </>
    );
  }

  // ── Android/Chrome Banner ───────────────────────────────────────────────────
  return (
    <>
      <div
        style={{
          position: "fixed", bottom: 16, left: 12, right: 12,
          zIndex: 9998, borderRadius: 20,
          background: "linear-gradient(135deg,#0D5FD6 0%,#108EE9 100%)",
          boxShadow: "0 8px 32px rgba(13,95,214,0.4)",
          padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
          animation: "pwaSlideUpBanner 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* App icon */}
        <img
          src="/pwa-192x192.png"
          alt="EDUFIN"
          style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }}
        />

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "white", fontWeight: 800, fontSize: "0.88rem", margin: "0 0 1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Pasang EDUFIN di HP kamu!
          </p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem", margin: 0 }}>
            Akses lebih cepat, tanpa browser
          </p>
        </div>

        {/* Install button */}
        <button
          onClick={handleInstall}
          disabled={installing}
          style={{
            flexShrink: 0, padding: "8px 14px", borderRadius: 12,
            background: "white", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
            fontWeight: 800, fontSize: "0.78rem", color: "#0D5FD6",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "transform 0.15s",
          }}
        >
          <Download size={14} />
          {installing ? "..." : "Pasang"}
        </button>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={14} color="white" />
        </button>
      </div>

      <style>{`
        @keyframes pwaSlideUpBanner {
          from { transform: translateY(120%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
