import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Shield, LogOut, HeadphonesIcon, User, BarChart3, Bell, Headphones } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ITSupportForm } from "../shared/ITSupportForm";
import { DonorPersonalDataForm } from "./modals/DonorPersonalDataForm";
import { DonationStatsForm } from "./modals/DonationStatsForm";
import { DonorNotificationSettings } from "./modals/DonorNotificationSettings";
import { supabase } from "../../lib/supabase";

export function DonorProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showITSupport, setShowITSupport] = useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const [showDonationStats, setShowDonationStats] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const [stats, setStats] = useState({ total: 0, campaignsCount: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from("donations")
          .select("amount, campaign_id")
          .eq("donor_id", user.id)
          .eq("status", "completed");

        if (error) throw error;
        
        if (data) {
          const total = data.reduce((sum, d) => sum + (d.amount || 0), 0);
          const uniqueCampaigns = new Set(data.map(d => d.campaign_id)).size;
          setStats({ total, campaignsCount: uniqueCampaigns });
        }
      } catch (err) {
        console.error("Error fetching donation stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, [user?.id]);

  const MENUS = [
    { icon: User, label: "Data Pribadi", sub: "Nama, email, nomor HP", action: () => setShowPersonalData(true) },
    { icon: BarChart3, label: "Statistik Donasi", sub: "Ringkasan kontribusimu", action: () => setShowDonationStats(true) },
    { icon: Bell, label: "Notifikasi", sub: "Pengaturan pemberitahuan", action: () => setShowNotification(true) },
    { icon: Headphones, label: "Hubungi Tim IT", sub: "Bantuan teknis aplikasi", action: () => setShowITSupport(true) },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F3F6FB" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6" style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-white"
            style={{ background: "rgba(255,255,255,0.25)", fontSize: "1.8rem", fontWeight: 900 }}>
            {user?.name?.[0] ?? "D"}
          </div>
          <div>
            <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.1rem" }}>{user?.name ?? "Donatur"}</h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>Donatur Umum</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {[
            { label: "Total Donasi", value: loadingStats ? "..." : `Rp ${(stats.total / 1000).toFixed(0)}k` },
            { label: "Kampanye", value: loadingStats ? "..." : stats.campaignsCount.toString() },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)" }}>
              <p style={{ color: "white", fontWeight: 800, fontSize: "0.95rem" }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 space-y-3">
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          {MENUS.map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-3.5 transition-all active:bg-gray-50"
                style={{ borderBottom: i < MENUS.length - 1 ? "1px solid #F5F7FA" : "none" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F5F7FA" }}>
                  <Icon size={18} color="#595959" />
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontWeight: 600, color: "#242424", fontSize: "0.88rem" }}>{item.label}</p>
                  <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{item.sub}</p>
                </div>
                <ChevronRight size={16} color="#BFBFBF" />
              </button>
            );
          })}
        </div>

        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{ background: "#FFF2EE", color: "#EA4E0D", fontWeight: 700 }}>
          <LogOut size={17} /> Keluar dari Akun
        </button>
      </div>

      {/* Modals */}
      <DonorPersonalDataForm isOpen={showPersonalData} onClose={() => setShowPersonalData(false)} />
      <DonationStatsForm isOpen={showDonationStats} onClose={() => setShowDonationStats(false)} />
      <DonorNotificationSettings isOpen={showNotification} onClose={() => setShowNotification(false)} />
      <ITSupportForm isOpen={showITSupport} onClose={() => setShowITSupport(false)} />
    </div>
  );
}
