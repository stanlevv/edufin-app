import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Bell, Heart, Star, TrendingUp, ChevronRight, Flame, CheckCircle, School, MapPin, Clock, HandHeart, Receipt } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { NotificationDropdown } from "../shared/NotificationDropdown";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}



const CATEGORIES = ["Semua", "Beasiswa", "Fasilitas", "Perlengkapan", "Ujian"];

export function DonorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    async function loadData() {
      // 1. Load active campaigns
      const { data: camps } = await supabase.from("campaigns").select("*").eq("status", "active");
      if (camps) {
        setCampaigns(camps.map(c => ({
          id: c.id,
          title: c.title,
          school: "SDN 3 Malang", // Fallback for UI
          schoolId: c.school_id,
          category: c.category,
          target: c.target_amount,
          collected: c.collected_amount,
          donors: c.donors_count,
          endDate: c.end_date,
          image: c.image_url,
          status: c.status,
          urgent: c.is_urgent,
          location: "Malang",
        })));
      }

      if (user?.id) {
        // 2. Load notifications
        const { data: notifs } = await supabase.from("notifications").select("*").eq("user_id", user.id).order('created_at', { ascending: false });
        if (notifs) {
          setNotifications(notifs.map(n => ({
            id: n.id,
            userId: n.user_id,
            title: n.title,
            message: n.message,
            type: n.type,
            read: n.read,
            createdAt: n.created_at
          })));
        }

        // 3. Load donations
        const { data: dons } = await supabase.from("donations").select("*").eq("donor_id", user.id);
        if (dons) {
          setMyDonations(dons.map(d => ({
            id: d.id,
            donorId: d.donor_id,
            campaignId: d.campaign_id,
            amount: d.amount,
            status: d.status,
            date: d.created_at
          })));
        }
      }
    }
    loadData();
  }, [user]);

  // Hitung statistik dari donasi di DB
  const totalDonated = myDonations.filter((d) => d.status === "success").reduce((s, d) => s + d.amount, 0);
  const campaignsSupported = new Set(myDonations.filter((d) => d.status === "success").map((d) => d.campaignId)).size;

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.school.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Semua" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  // Helper: hitung days left dari endDate
  function getDaysLeft(endDate: string): number {
    if (!endDate) return 0;
    return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ background: "rgba(255,255,255,0.25)", fontSize: "1.2rem", fontWeight: 700 }}>
              {user?.name?.[0] ?? "R"}
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>Halo Donatur,</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{user?.name}</p>
            </div>
          </div>
          <NotificationDropdown
            notifications={notifications.map((n) => ({ id: n.id, text: n.message, time: new Date(n.createdAt).toLocaleDateString("id-ID"), unread: !n.read }))}
            unreadCount={notifications.filter((n) => !n.read).length}
            onNotificationClick={async (id) => {
              await supabase.from("notifications").update({ read: true }).eq('id', id);
              if (user?.id) {
                const { data: notifs } = await supabase.from("notifications").select("*").eq("user_id", user.id).order('created_at', { ascending: false });
                if (notifs) {
                  setNotifications(notifs.map(n => ({
                    id: n.id,
                    userId: n.user_id,
                    title: n.title,
                    message: n.message,
                    type: n.type,
                    read: n.read,
                    createdAt: n.created_at
                  })));
                }
              }
            }}
          />
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <HandHeart size={13} color="rgba(255,255,255,0.7)" />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Total Donasi</span>
            </div>
            <p style={{ color: "white", fontWeight: 700 }}>{formatRupiah(totalDonated)}</p>
          </div>
          <div className="flex-1 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={13} color="rgba(255,255,255,0.7)" />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Kampanye Didukung</span>
            </div>
            <p style={{ color: "white", fontWeight: 700 }}>{campaignsSupported} kampanye</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <Search size={18} color="rgba(255,255,255,0.7)" />
          <input
            type="text"
            placeholder="Cari kampanye pendidikan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: "white", fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 overflow-x-auto flex gap-2 bg-white" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full transition-all"
            style={{
              background: activeCategory === cat ? "#1677FF" : "#F5F7FA",
              color: activeCategory === cat ? "white" : "#595959",
              fontWeight: 600,
              fontSize: "0.82rem",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Urgent Banner */}
      <div className="px-6 py-3" style={{ background: "#FFF7E6" }}>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} color="#FD9A16" />
          <span style={{ color: "#FD9A16", fontWeight: 600, fontSize: "0.82rem" }}>
            1 kampanye butuh perhatian segera — hanya 8 hari tersisa!
          </span>
        </div>
      </div>

      {/* Campaign List */}
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-4 space-y-4" style={{ background: "#F5F7FA" }}>
        {filtered.map((c) => {
          const pct = Math.round((c.collected / c.target) * 100);
          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm"
              onClick={() => navigate(`/donor/campaign/${c.id}`)}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }} />
                {c.urgent && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: "#FD9A16" }}>
                    <Flame size={11} color="white" />
                    <span style={{ fontSize: "0.65rem", color: "white", fontWeight: 700 }}>MENDESAK</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(255,255,255,0.9)", color: "#1677FF" }}>
                    {c.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.95rem", lineHeight: "1.3", marginBottom: "4px" }}>
                  {c.title}
                </p>
                <div className="flex items-center gap-2 mb-2.5" style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>
                  <div className="flex items-center gap-1">
                    <School size={12} />
                    <span>{c.school}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{c.location}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{getDaysLeft(c.endDate)} hari lagi</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full mb-1.5" style={{ background: "#F0F0F0" }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      background: pct >= 80 ? "linear-gradient(90deg, #52C41A, #389E0D)" : "linear-gradient(90deg, #1677FF, #108EE9)"
                    }} />
                </div>
                <div className="flex justify-between mb-3">
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1677FF" }}>{formatRupiah(c.collected)}</span>
                  <span style={{ fontSize: "0.78rem", color: "#8C8C8C" }}>{pct}% dari {formatRupiah(c.target)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <HandHeart size={13} color="#1677FF" />
                    <span style={{ fontSize: "0.78rem", color: "#8C8C8C" }}>{c.donors} donatur</span>
                  </div>
                  <button
                    className="px-5 py-2 rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 600, fontSize: "0.82rem" }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/donor/campaign/${c.id}`); }}
                  >
                    Donasi Sekarang
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <Search size={48} color="#D9D9D9" />
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Kampanye tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
