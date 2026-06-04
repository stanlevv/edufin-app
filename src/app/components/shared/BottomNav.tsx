import React from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, ClipboardList, Heart, User, BarChart2, HandHeart, Receipt } from "lucide-react";

type Role = "siswa" | "sekolah" | "donatur";

const NAV_ITEMS: Record<Role, { icon: React.ReactNode; iconActive: React.ReactNode; label: string; key: string; route: string }[]> = {
  siswa: [
    {
      icon: <Home size={20} strokeWidth={2} />,
      iconActive: <Home size={20} strokeWidth={2.5} fill="rgba(22,119,255,0.12)" />,
      label: "Beranda",
      key: "home",
      route: "/student",
    },
    {
      icon: <Receipt size={20} strokeWidth={2} />,
      iconActive: <Receipt size={20} strokeWidth={2.5} />,
      label: "SPP",
      key: "spp",
      route: "/student/spp",
    },
    {
      icon: <HandHeart size={20} strokeWidth={2} />,
      iconActive: <HandHeart size={20} strokeWidth={2.5} fill="rgba(22,119,255,0.12)" />,
      label: "Donasi",
      key: "fundraising",
      route: "/student/fundraising",
    },
    {
      icon: <User size={20} strokeWidth={2} />,
      iconActive: <User size={20} strokeWidth={2.5} fill="rgba(22,119,255,0.12)" />,
      label: "Profil",
      key: "profile",
      route: "/student/profile",
    },
  ],
  sekolah: [
    {
      icon: <Home size={20} strokeWidth={2} />,
      iconActive: <Home size={20} strokeWidth={2.5} fill="rgba(22,119,255,0.12)" />,
      label: "Beranda",
      key: "home",
      route: "/school",
    },
    {
      icon: <Receipt size={20} strokeWidth={2} />,
      iconActive: <Receipt size={20} strokeWidth={2.5} />,
      label: "Tagihan",
      key: "bills",
      route: "/school/bills",
    },
    {
      icon: <BarChart2 size={20} strokeWidth={2} />,
      iconActive: <BarChart2 size={20} strokeWidth={2.5} />,
      label: "Laporan",
      key: "report",
      route: "/school/report",
    },
    {
      icon: <User size={20} strokeWidth={2} />,
      iconActive: <User size={20} strokeWidth={2.5} fill="rgba(22,119,255,0.12)" />,
      label: "Profil",
      key: "profile",
      route: "/school/profile",
    },
  ],
  donatur: [
    {
      icon: <Home size={20} strokeWidth={2} />,
      iconActive: <Home size={20} strokeWidth={2.5} fill="rgba(22,119,255,0.12)" />,
      label: "Beranda",
      key: "home",
      route: "/donor",
    },
    {
      icon: <HandHeart size={20} strokeWidth={2} />,
      iconActive: <HandHeart size={20} strokeWidth={2.5} fill="rgba(22,119,255,0.12)" />,
      label: "Kampanye",
      key: "campaigns",
      route: "/donor/campaigns",
    },
    {
      icon: <Receipt size={20} strokeWidth={2} />,
      iconActive: <Receipt size={20} strokeWidth={2.5} />,
      label: "Riwayat",
      key: "history",
      route: "/donor/history",
    },
    {
      icon: <User size={20} strokeWidth={2} />,
      iconActive: <User size={20} strokeWidth={2.5} fill="rgba(22,119,255,0.12)" />,
      label: "Profil",
      key: "profile",
      route: "/donor/profile",
    },
  ],
};

interface BottomNavProps {
  role: Role;
}

export function BottomNav({ role }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = NAV_ITEMS[role];

  // Auto-detect active tab from current path
  const getActiveKey = () => {
    const path = location.pathname;
    // Exact match first
    const exact = items.find((i) => i.route === path);
    if (exact) return exact.key;
    // Prefix match (for nested routes like /student/spp, /student/fundraising)
    const prefix = items
      .filter((i) => i.route !== "/student" && i.route !== "/school" && i.route !== "/donor")
      .find((i) => path.startsWith(i.route));
    if (prefix) return prefix.key;
    // Default to home
    return items[0].key;
  };

  const active = getActiveKey();

  // Theme colors per role - semua menggunakan tema biru (bayar SPP)
  const activeColor = "#1677FF";
  const activeGradient = "linear-gradient(90deg, #1677FF, #108EE9)";
  const activeBg = "linear-gradient(135deg, rgba(22,119,255,0.12), rgba(22,119,255,0.08))";

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-4"
      style={{
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        background: "transparent",
      }}
    >
      {/* Rounded floating container */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px) saturate(1.8)",
          WebkitBackdropFilter: "blur(20px) saturate(1.8)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-2xl transition-all active:scale-90"
                style={{
                  color: isActive ? activeColor : "#9CA3AF",
                  minWidth: "64px",
                  position: "relative",
                }}
              >
                {/* Active indicator - floating pill above */}
                {isActive && (
                  <span
                    className="absolute -top-0.5 left-1/2 w-8 h-1 rounded-full"
                    style={{
                      transform: "translateX(-50%)",
                      background: activeGradient,
                    }}
                  />
                )}

                {/* Icon with better active state */}
                <span
                  className="flex items-center justify-center rounded-xl transition-all"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: isActive ? activeBg : "transparent",
                  }}
                >
                  {isActive ? item.iconActive : item.icon}
                </span>

                {/* Label with better typography */}
                <span
                  className="text-[11px] transition-all"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
