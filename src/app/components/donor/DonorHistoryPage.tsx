import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Database, Donation } from "../../data/database";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export function DonorHistoryPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    if (!user) return;
    const data = Database.getDonationsByDonorId(user.id).filter((d) => d.status === "success");
    // Urutkan terbaru dulu
    setDonations([...data].sort((a, b) => b.donatedAt.localeCompare(a.donatedAt)));
  }, [user]);

  // Ambil judul kampanye dari DB
  const campaignTitles: Record<string, string> = {};
  Database.getCampaigns().forEach((c) => { campaignTitles[c.id] = c.title; });

  const totalDonasi = donations.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F3F6FB" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}>
        <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem" }}>Riwayat Donasi</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", marginBottom: "12px" }}>Kontribusimu untuk pendidikan</p>
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem" }}>Total Donasi</p>
          <p style={{ color: "white", fontWeight: 900, fontSize: "1.8rem", letterSpacing: "-0.5px" }}>{formatRupiah(totalDonasi)}</p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.72rem" }}>{donations.length} kali transaksi</p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 space-y-2.5">
        <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem", marginBottom: "4px" }}>Semua Transaksi</p>
        {donations.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <CheckCircle size={40} color="#D9D9D9" />
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Belum ada riwayat donasi</p>
          </div>
        )}
        {donations.map((item) => {
          const campaignTitle = campaignTitles[item.campaignId] ?? "Kampanye";
          const dateFormatted = new Date(item.donatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
          return (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-3"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#F6FFED" }}>
                <CheckCircle size={20} color="#52C41A" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontWeight: 700, color: "#242424", fontSize: "0.85rem" }}>
                  {item.isAnonymous ? "Donasi Anonim" : campaignTitle}
                </p>
                <p style={{ color: "#8C8C8C", fontSize: "0.7rem" }}>{dateFormatted} · {item.method}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p style={{ fontWeight: 800, color: "#1677FF", fontSize: "0.88rem" }}>{formatRupiah(item.amount)}</p>
                <span className="px-2 py-0.5 rounded-full inline-block mt-1"
                  style={{ background: "#F6FFED", color: "#52C41A", fontSize: "0.65rem", fontWeight: 600 }}>
                  Berhasil
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
