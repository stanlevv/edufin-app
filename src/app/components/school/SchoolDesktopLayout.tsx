import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, FileText, DollarSign, History, Settings, LogOut, Bell, User, Users, Receipt, Megaphone, Heart, ShieldCheck, GraduationCap, LayoutDashboard, CreditCard, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NotificationDropdown } from "../shared/NotificationDropdown";

const NAV_ITEMS = [
  { path: "/school", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/school/students", icon: Users, label: "Siswa" },
  { path: "/school/bills", icon: FileText, label: "Tagihan" },
  { path: "/school/scholarships", icon: GraduationCap, label: "Beasiswa" },
  { path: "/school/campaigns", icon: Megaphone, label: "Kampanye" },
  { path: "/school/donors", icon: Heart, label: "Donatur" },
  { path: "/school/notifications", icon: Bell, label: "Notifikasi" },
  { path: "/school/report", icon: DollarSign, label: "Laporan" },
  { path: "/school/history", icon: History, label: "Riwayat" },
  { path: "/school/profile", icon: Settings, label: "Pengaturan" },
];

const SCHOOL_NOTIFICATIONS = [
  { id: 1, text: "3 siswa baru melakukan pembayaran SPP bulan Mei 2025", time: "30 menit lalu", unread: true },
  { id: 2, text: "Kampanye 'Bantuan Buku Pelajaran Kelas XII' menunggu persetujuan Anda", time: "2 jam lalu", unread: true },
  { id: 3, text: "Reminder: 15 siswa belum melunasi tagihan SPP bulan ini", time: "1 hari lalu", unread: false },
  { id: 4, text: "Laporan pembayaran bulanan telah dibuat. Lihat detail di menu Laporan.", time: "2 hari lalu", unread: false },
];

export function SchoolDesktopLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-md border-r border-gray-100 flex flex-col transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-sm">
              <Receipt size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-600">EDUFIN</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 pb-3 pt-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-100 inline-flex">
            <ShieldCheck size={13} color="#1677FF" />
            <span className="text-xs font-semibold text-blue-600">Administrator</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
                style={{
                  background: isActive ? "#EEF4FF" : "transparent",
                  color: isActive ? "#1677FF" : "#595959",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
              {user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.school}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all border border-red-100"
          >
            <LogOut size={16} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg lg:text-xl font-bold text-gray-800 hidden sm:block">
              {NAV_ITEMS.find((n) => n.path === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <NotificationDropdown
              notifications={SCHOOL_NOTIFICATIONS}
              unreadCount={SCHOOL_NOTIFICATIONS.filter((n) => n.unread).length}
              variant="light"
              onNotificationClick={() => navigate("/school/notifications")}
            />
            <button
              onClick={() => navigate("/school/profile")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              <User size={20} color="#595959" />
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
