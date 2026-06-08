import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import { AuthProvider, useAuth, UserRole } from "../../context/AuthContext";
import { BottomNav } from "./BottomNav";
import { PWAInstallBanner } from "./PWAInstallBanner";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

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
      superadmin: "/superadmin/dashboard",
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
  // Redirect user yang sudah login dari halaman publik ke dashboard
  if (user && NO_NAV_PATHS.includes(location.pathname)) {
    const dashboardByRole: Record<string, string> = {
      siswa: "/student",
      sekolah: "/school",
      donatur: "/donor",
      superadmin: "/superadmin/dashboard",
    };
    return <Navigate to={dashboardByRole[user.role] ?? "/"} replace />;
  }

  const isSchoolAdmin = user?.role === "sekolah";

  // Supabase Realtime Subscription untuk notifikasi baru
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newNotif = payload.new;
          toast(newNotif.title, {
            description: newNotif.message,
            position: "top-center"
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

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
  // CASE 2: SISWA & DONATUR (CSS Responsif)
  // Menggunakan max-width untuk desktop, melebar penuh 100% di HP
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
      {/* Phone container */}
      <div
        className="w-full max-w-[480px] min-h-[100dvh] relative flex flex-col bg-white shadow-2xl phone-scroll-container"
        style={{
          borderLeft: "1px solid #E8E8E8",
          borderRight: "1px solid #E8E8E8",
          overflowX: "hidden",
        }}
      >
        <div style={{ flex: "1 0 auto", paddingBottom: showNav ? "100px" : "0" }}>
          <Outlet />
        </div>
        {showNav && <BottomNav role={role} />}
        <PWAInstallBanner />
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