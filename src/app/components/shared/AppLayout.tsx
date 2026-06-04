import React from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import { AuthProvider, useAuth, UserRole } from "../../context/AuthContext";
import { BottomNav } from "./BottomNav";

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
/**
 * Enforces authentication and role-based access control (RBAC).
 * 1. Not authenticated → redirect to /login
 * 2. Wrong role → redirect to own dashboard
 * 3. Correct role → render children
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
      <div className="flex items-center justify-center min-h-screen"
        style={{ background: "linear-gradient(135deg, #EEF4FF 0%, #E6F7FF 100%)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl animate-spin"
            style={{ border: "3px solid #E6F0FF", borderTopColor: "#1677FF" }} />
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

const NO_NAV_PATHS = ["/", "/login", "/register"];

function AppLayoutInner() {
  const { user } = useAuth();
  const location = useLocation();

  const isSchoolAdmin = user?.role === "sekolah";

  const showNav =
    !!user &&
    !NO_NAV_PATHS.includes(location.pathname) &&
    !isSchoolAdmin &&
    (location.pathname.startsWith("/student") ||
      location.pathname.startsWith("/donor"));

  const role =
    user?.role === "sekolah"
      ? "sekolah"
      : user?.role === "donatur"
      ? "donatur"
      : "siswa";

  // Desktop layout for school admin, mobile for others
  if (isSchoolAdmin) {
    return (
      <div className="min-h-screen" style={{ background: "#F5F7FA" }}>
        <Outlet />
      </div>
    );
  }

  // Mobile-in-desktop layout: centered phone container
  return (
    <div
      className="min-h-screen flex items-start justify-center"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)",
        minHeight: "100dvh",
      }}
    >
      {/* Desktop decorative dots / grid in background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Phone container - scrollable internally */}
      <div
        className="relative w-full max-w-[430px] flex flex-col"
        style={{
          height: "100dvh",
          background: "white",
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: "0 0 80px rgba(0,0,0,0.5), 0 0 160px rgba(22,119,255,0.1)",
          scrollbarWidth: "none",
        }}
      >
        <style>{`
          .phone-inner::-webkit-scrollbar { display: none; }
        `}</style>
        {/* Content area grows to fill */}
        <div style={{ flex: "1 0 auto" }}>
          <Outlet />
        </div>
        {showNav && <BottomNav role={role} />}
      </div>
    </div>
  );

}


export function AppLayout() {
  return (
    <AuthProvider>
      <AppLayoutInner />
    </AuthProvider>
  );
}