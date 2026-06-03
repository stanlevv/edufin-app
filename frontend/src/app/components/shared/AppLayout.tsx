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

  const showNav =
    !!user &&
    !NO_NAV_PATHS.includes(location.pathname) &&
    (location.pathname.startsWith("/student") ||
      location.pathname.startsWith("/school") ||
      location.pathname.startsWith("/donor"));

  const role =
    user?.role === "sekolah"
      ? "sekolah"
      : user?.role === "donatur"
      ? "donatur"
      : "siswa";

  const isSchoolAdmin = user?.role === "sekolah";

  // Desktop layout for school admin, mobile for others
  if (isSchoolAdmin) {
    return (
      <div className="min-h-screen" style={{ background: "#F5F7FA", paddingBottom: showNav ? "120px" : "0" }}>
        <Outlet />
        {showNav && <BottomNav role={role} />}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-start justify-center"
      style={{ background: "linear-gradient(135deg, #EEF4FF 0%, #E6F7FF 100%)" }}
    >
      <div
        className="relative w-full max-w-[430px] shadow-2xl"
        style={{ minHeight: "100dvh", background: "white", paddingBottom: showNav ? "120px" : "0" }}
      >
        <div className="min-h-full">
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