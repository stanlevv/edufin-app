import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronRight, CheckCircle, School } from "lucide-react";
import { supabase } from "../../lib/supabase";

function formatK(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}jt`;
  return `${Math.round(n / 1000)}rb`;
}

type CategoryType = "Semua" | "Beasiswa" | "Fasilitas" | "Perlengkapan" | "Ujian";

export function DonorCampaignsPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryType>("Semua");

  useEffect(() => {
    async function loadCampaigns() {
      const { data } = await supabase.from('campaigns').select('*').eq('status', 'active');
      if (data) {
        setCampaigns(data.map(c => ({
          id: c.id,
          title: c.title,
          school: "SDN 3 Malang", // Fallback
          category: c.category,
          target: c.target_amount,
          collected: c.collected_amount,
          donors: c.donors_count,
          endDate: c.end_date,
          image: c.image_url,
          status: c.status,
          urgent: c.is_urgent,
          verified: true
        })));
      }
    }
    loadCampaigns();
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.school.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Semua" || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F3F6FB" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}>
        <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem", marginBottom: "12px" }}>Kampanye Donasi</h1>
        <div className="flex items-center gap-2 px-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kampanye atau sekolah..."
            className="flex-1 py-3 bg-transparent outline-none"
            style={{ color: "white", fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-5 py-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {(["Semua", "Beasiswa", "Fasilitas", "Perlengkapan", "Ujian"] as CategoryType[]).map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className="px-4 py-1.5 rounded-xl flex-shrink-0 transition-all"
            style={{
              background: category === c ? "#1677FF" : "white",
              color: category === c ? "white" : "#595959",
              fontWeight: 600, fontSize: "0.78rem",
              boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-5 flex-1 pb-32 space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <Search size={40} color="#D9D9D9" />
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Kampanye tidak ditemukan</p>
          </div>
        )}
        {filtered.map((c) => {
          const pct = Math.round((c.collected / c.target) * 100);
          const endDate = new Date(c.endDate || new Date());
          const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          return (
            <div key={c.id} className="bg-white rounded-2xl overflow-hidden cursor-pointer active:scale-98 transition-all"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              onClick={() => navigate(`/donor/campaign/${c.id}`)}>
              <div className="relative h-36 overflow-hidden">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.5),transparent)" }} />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)" }}>
                  <span style={{ fontSize: "0.62rem", color: "white" }}>{daysLeft} hari lagi</span>
                </div>
                <div className="absolute bottom-2 left-3">
                  <span className="px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(22,119,255,0.85)", fontSize: "0.62rem", color: "white", fontWeight: 600 }}>
                    {c.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem", lineHeight: "1.35", marginBottom: "2px" }}
                  className="line-clamp-2">{c.title}</p>
                <div className="flex items-center gap-1 mb-2.5" style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>
                  <School size={12} />
                  <span>{c.school}</span>
                  {c.verified && <CheckCircle size={11} color="#52C41A" className="ml-1" />}
                </div>
                <div className="w-full h-2 rounded-full mb-1.5" style={{ background: "#F0F0F0" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${Math.min(pct, 100)}%`, background: "linear-gradient(90deg,#1677FF,#108EE9)" }} />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p style={{ fontWeight: 800, color: "#1677FF", fontSize: "0.9rem" }}>{formatK(c.collected)}</p>
                    <p style={{ color: "#8C8C8C", fontSize: "0.68rem" }}>dari {formatK(c.target)} ({pct}%)</p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
                    style={{ background: "#1677FF", color: "white", fontWeight: 700, fontSize: "0.75rem" }}>
                    Donasi <ChevronRight size={13} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
