import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, Heart, School, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Database, Campaign } from "../../data/database";
import { CampaignSubmissionForm } from "../shared/CampaignSubmissionForm";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const CATEGORIES = ["Semua", "Beasiswa", "Fasilitas", "Perlengkapan", "Ujian"];

export function FundraisingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await Database.fetchCampaignsSupabase();
      const active = data.filter((c: any) => c.status === "active");
      setCampaigns(active);
    }
    loadData();
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.school.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Semua" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <button onClick={() => navigate("/student")} className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Galang Dana</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Kampanye pendidikan aktif</p>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mt-4"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <Search size={18} color="rgba(255,255,255,0.7)" />
          <input
            type="text"
            placeholder="Cari kampanye atau sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: "white", fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4 overflow-x-auto flex gap-2" style={{ scrollbarWidth: "none", background: "white" }}>
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

          {/* Campaign List */}
      <div className="flex-1 px-6 py-4 overflow-y-auto pb-32 space-y-4">
        {filtered.map((c) => {
          const pct = Math.round((c.collected / c.target) * 100);
          const endDate = new Date(c.endDate);
          const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm"
              onClick={() => navigate(`/student/campaign/${c.id}`)}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)" }}>
                  <span style={{ fontSize: "0.7rem", color: "white" }}>{daysLeft} hari lagi</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "#EEF4FF", color: "#1677FF" }}>{c.category}</span>
                </div>
              </div>
              <div className="p-4">
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.95rem", lineHeight: "1.3", marginBottom: "4px" }}>
                  {c.title}
                </p>
                <div className="flex items-center gap-2 mb-3" style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>
                  <div className="flex items-center gap-1">
                    <School size={12} />
                    <span>{c.school}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{c.location}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="w-full h-2 rounded-full mb-2" style={{ background: "#F0F0F0" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(pct, 100)}%`, background: "linear-gradient(90deg, #1677FF, #108EE9)" }} />
                </div>
                <div className="flex justify-between mb-3">
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1677FF" }}>
                    {formatRupiah(c.collected)}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#8C8C8C" }}>dari {formatRupiah(c.target)} ({pct}%)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Heart size={13} color="#F95654" fill="#F95654" />
                    <span style={{ fontSize: "0.78rem", color: "#8C8C8C" }}>{c.donors} donatur</span>
                  </div>
                  <button
                    className="px-4 py-2 rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 600, fontSize: "0.82rem" }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/student/campaign/${c.id}`); }}
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