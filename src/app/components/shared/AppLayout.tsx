import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import { AuthProvider, useAuth, UserRole } from "../../context/AuthContext";
import { BottomNav } from "./BottomNav";
import { PWAInstallBanner } from "./PWAInstallBanner";

// ─── useIsMobileTouchDevice ───────────────────────────────────────────────────
/**
 * Deteksi perangkat LAYAR SENTUH nyata menggunakan pointer:coarse media query.
 * - pointer:coarse = HP/tablet (jari) → true
 * - pointer:fine   = desktop/laptop (mouse) → false
 *
 * Jauh lebih andal dari window.innerWidth karena tidak tertipu developer tools.
 * HANYA digunakan untuk siswa & donatur. Admin sekolah SELALU desktop.
 */
function useIsMobileTouchDevice(): boolean {
  const detect = (): boolean => {
    if (typeof window === "undefined") return false;
    // pointer:coarse = layar sentuh asli
    if (window.matchMedia("(pointer: coarse)").matches) return true;
    // Fallback user-agent untuk browser lama
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const [isMobile, setIsMobile] = useState<boolean>(detect);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const handler = () => setIsMobile(detect());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
/**
 * RBAC guard:
 * 1. Belum login → redirect /login
 * 2. Role salah → redirect dashboard sendiri
 * 3. Role benar → render children
 */
export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "linear-gradient(135deg, #EEF4FF 0%, #E6F7FF 100%)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl animate-spin"
            style={{ border: "3px solid #E6F0FF", borderTopColor: "#1677FF" }}
          />
          <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const dashboardByRole: Record<UserRole, string> = {
      siswa: "/student",
      sekolah: "/school",
      donatur: "/donor",
    };
    return <Navigate to={dashboardByRole[user.role] ?? "/"} replace />;
  }

  return <>{children}</>;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NO_NAV_PATHS = ["/", "/login", "/register"];

// ─── AppLayoutInner ───────────────────────────────────────────────────────────
function AppLayoutInner() {
  const { user } = useAuth();
  const location = useLocation();
  // Hook SELALU dipanggil (Rules of Hooks) — role filter dilakukan di render
  const isMobileDevice = useIsMobileTouchDevice();

  // Redirect user yang sudah login dari halaman publik ke dashboard
  if (user && NO_NAV_PATHS.includes(location.pathname)) {
    const dashboardByRole: Record<string, string> = {
      siswa: "/student",
      sekolah: "/school",
      donatur: "/donor",
    };
    return <Navigate to={dashboardByRole[user.role] ?? "/"} replace />;
  }

  const isSchoolAdmin = user?.role === "sekolah";

  const showNav =
    !!user &&
    !NO_NAV_PATHS.includes(location.pathname) &&
    !isSchoolAdmin &&
    (location.pathname.startsWith("/student") ||
      location.pathname.startsWith("/donor"));

  const role: "siswa" | "sekolah" | "donatur" =
    user?.role === "sekolah"
      ? "sekolah"
      : user?.role === "donatur"
      ? "donatur"
      : "siswa";

  // ────────────────────────────────────────────────────────────────────────────
  // CASE 1: ADMIN SEKOLAH
  // SELALU desktop penuh — tidak peduli HP/tablet/ukuran layar
  // ────────────────────────────────────────────────────────────────────────────
  if (isSchoolAdmin) {
    return (
      <div className="min-h-screen" style={{ background: "#F5F7FA" }}>
        <Outlet />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // CASE 2: SISWA & DONATUR di MOBILE NYATA (pointer: coarse = layar sentuh)
  // Full-width mengikuti layar HP, tanpa container pembatas
  // ────────────────────────────────────────────────────────────────────────────
  if (isMobileDevice) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "white",
          overflowX: "hidden",
        }}
      >
        <div style={{ flex: "1 0 auto", paddingBottom: showNav ? "80px" : "0" }}>
          <Outlet />
        </div>
        {showNav && <BottomNav role={role} />}
        {/* Banner PWA install — hanya mobile, hanya siswa & donatur */}
        <PWAInstallBanner />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // CASE 3: SISWA & DONATUR di DESKTOP (pointer: fine = mouse/trackpad)
  // Tampilan "phone mockup" — container 390px di tengah layar
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "#F0F2F5",
      }}
    >
      {/* Label preview mode */}
      <div
        style={{
          position: "fixed",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: 99,
          padding: "5px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#52C41A" }} />
        <span style={{ color: "white", fontSize: "0.68rem", fontWeight: 600 }}>
          Preview Mode · Buka di HP untuk tampilan mobile
        </span>
      </div>

      {/* Phone container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "390px",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: "white",
          overflowY: "auto",
          overflowX: "hidden",
          borderLeft: "1px solid #E8E8E8",
          borderRight: "1px solid #E8E8E8",
          boxShadow: "0 0 60px rgba(0,0,0,0.12)",
          scrollbarWidth: "none",
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        <div style={{ flex: "1 0 auto", paddingBottom: "100px" }}>
          <Outlet />
        </div>
        {showNav && <BottomNav role={role} />}
      </div>
    </div>
  );
}

// ─── AppLayout (root) ─────────────────────────────────────────────────────────
export function AppLayout() {
  return (
    <AuthProvider>
      <AppLayoutInner />
    </AuthProvider>
  );
}