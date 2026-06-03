import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronRight, CheckCircle, School } from "lucide-react";

const CAMPAIGNS = [
  { id: 1, title: "Beasiswa Siswa Berprestasi SDN 3 Malang", target: 15000000, collected: 11200000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", school: "SDN 3 Malang", verified: true, daysLeft: 12, category: "Beasiswa" },
  { id: 2, title: "Renovasi Lab Komputer SMP Negeri 5", target: 25000000, collected: 18500000, image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", school: "SMPN 5 Batu", verified: true, daysLeft: 25, category: "Fasilitas" },
  { id: 3, title: "Dana Buku & Alat Tulis Siswa Kurang Mampu", target: 8000000, collected: 6100000, image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", school: "SMA Negeri 2 Kepanjen", verified: false, daysLeft: 8, category: "Perlengkapan" },
  { id: 4, title: "Beasiswa Anak Yatim SMPN 1 Blitar", target: 20000000, collected: 7500000, image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", school: "SMPN 1 Blitar", verified: true, daysLeft: 30, category: "Beasiswa" },
];

function formatK(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}jt`;
  return `${Math.round(n / 1000)}rb`;
}

type CategoryType = "Semua" | "Beasiswa" | "Fasilitas" | "Perlengkapan";

export function DonorCampaignsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryType>("Semua");

  const filtered = CAMPAIGNS.filter((c) => {
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
        {(["Semua", "Beasiswa", "Fasilitas", "Perlengkapan"] as CategoryType[]).map((c) => (
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
        {filtered.map((c) => {
          const pct = Math.round((c.collected / c.target) * 100);
          return (
            <div key={c.id} className="bg-white rounded-2xl overflow-hidden cursor-pointer active:scale-98 transition-all"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              onClick={() => navigate(`/donor/campaign/${c.id}`)}>
              <div className="relative h-36 overflow-hidden">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.5),transparent)" }} />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)" }}>
                  <span style={{ fontSize: "0.62rem", color: "white" }}>{c.daysLeft} hari lagi</span>
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
                </div>
                <div className="w-full h-2 rounded-full mb-1.5" style={{ background: "#F0F0F0" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: "linear-gradient(90deg,#1677FF,#108EE9)" }} />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p style={{ fontWeight: 800, color: "#1677FF", fontSize: "0.9rem" }}>{formatK(c.collected)}</p>
                    <p style={{ color: "#8C8C8C", fontSize: "0.68rem" }}>dari {formatK(c.target)}</p>
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
