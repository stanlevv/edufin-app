import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { LayoutDashboard, School, Users, BarChart3, Settings, LogOut, Terminal, Activity, Menu, X, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { path: "/superadmin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/superadmin/schools", icon: School, label: "Sekolah" },
  { path: "/superadmin/users", icon: Users, label: "Pengguna" },
  { path: "/superadmin/reports", icon: BarChart3, label: "Laporan" },
  { path: "/superadmin/settings", icon: Settings, label: "Pengaturan" },
];

export function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/superadmin");
  };

  return (
    <div className="flex h-screen bg-[#0B0F1A]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>

        {/* Logo */}
        <div className="p-5 border-b border-[rgba(255,255,255,0.06)] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1239A0, #1677FF)" }}>
              <Terminal size={18} color="white" />
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 900, fontSize: "0.9rem", letterSpacing: "1px" }}>EDUFIN</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", letterSpacing: "0.5px" }}>SUPER ADMIN</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-1 rounded-md text-slate-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                style={{
                  background: isActive ? "rgba(22,119,255,0.15)" : "transparent",
                  color: isActive ? "#60A5FA" : "rgba(255,255,255,0.4)",
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? "1px solid rgba(22,119,255,0.2)" : "1px solid transparent",
                }}
              >
                <Icon size={17} />
                <span style={{ fontSize: "0.85rem" }}>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#60A5FA" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3 mb-3 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
              {user?.name?.[0] || "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ color: "white", fontSize: "0.8rem", fontWeight: 700 }}>{user?.name}</p>
              <p className="truncate" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem" }}>Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#FCA5A5", fontSize: "0.8rem", fontWeight: 700 }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-14 flex items-center justify-between px-4 lg:px-7"
          style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-400"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <Activity size={14} color="#60A5FA" className="animate-pulse" />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", letterSpacing: "0.3px" }}>
              Platform Management Console
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22C55E" }} />
            <span style={{ color: "#22C55E", fontSize: "0.65rem", fontWeight: 700 }}>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
