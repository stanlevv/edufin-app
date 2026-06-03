import React from "react";
import { Heart, TrendingUp, Award, CheckCircle } from "lucide-react";
import { ModalWrapper } from "../../shared/ModalWrapper";

interface DonationStatsFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATS = {
  totalDonations: 700000,
  campaignsSupported: 4,
  firstDonation: "15 Jan 2025",
  lastDonation: "5 Apr 2026",
  averageDonation: 175000,
  topCategory: "Beasiswa Pendidikan",
};

const MONTHLY_DATA = [
  { month: "Jan", amount: 100000 },
  { month: "Feb", amount: 150000 },
  { month: "Mar", amount: 250000 },
  { month: "Apr", amount: 200000 },
];

const CAMPAIGNS_DONATED = [
  { title: "Beasiswa Siswa Berprestasi SDN 3", amount: 200000, date: "5 Apr 2026", status: "Aktif" },
  { title: "Renovasi Lab Komputer SMPN 5", amount: 150000, date: "15 Mar 2026", status: "Aktif" },
  { title: "Bantuan Seragam Kelas 3A", amount: 100000, date: "1 Feb 2026", status: "Selesai" },
  { title: "Dana Study Tour Museum Sains", amount: 250000, date: "15 Jan 2025", status: "Selesai" },
];

export function DonationStatsForm({ isOpen, onClose }: DonationStatsFormProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Statistik Donasi"
      subtitle={`${STATS.campaignsSupported} kampanye sejak ${STATS.firstDonation}`}
    >

        {/* Hero Stats */}
        <div className="mb-4 p-5 rounded-2xl" style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Heart size={18} color="white" fill="white" />
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>Total Kontribusi</p>
          </div>
          <p style={{ color: "white", fontWeight: 800, fontSize: "2rem" }}>
            Rp{STATS.totalDonations.toLocaleString("id-ID")}
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>
            {STATS.campaignsSupported} kampanye sejak {STATS.firstDonation}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-4 rounded-xl" style={{ background: "#F6FFED" }}>
            <TrendingUp size={18} color="#52C41A" className="mb-2" />
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#242424" }}>
              Rp{STATS.averageDonation.toLocaleString("id-ID")}
            </p>
            <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Rata-rata Donasi</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "#FFF7E6" }}>
            <Award size={18} color="#FD9A16" className="mb-2" />
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#242424" }}>{STATS.topCategory}</p>
            <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Kategori Favorit</p>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="mb-4 p-4 rounded-xl" style={{ background: "#F5F7FA" }}>
          <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>
            Donasi Per Bulan
          </p>
          <div className="flex items-end gap-3 h-32">
            {MONTHLY_DATA.map((data) => {
              const maxAmount = Math.max(...MONTHLY_DATA.map((d) => d.amount));
              const heightPercent = (data.amount / maxAmount) * 100;
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end flex-1">
                    <div
                      className="w-full rounded-t-lg"
                      style={{
                        background: "linear-gradient(135deg, #1677FF, #108EE9)",
                        height: `${heightPercent}%`,
                      }}
                    />
                  </div>
                  <p style={{ color: "#8C8C8C", fontSize: "0.7rem", marginTop: "6px" }}>{data.month}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaigns List */}
        <div>
          <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>
            Kampanye yang Didonasikan
          </p>
          <div className="space-y-2">
            {CAMPAIGNS_DONATED.map((campaign, idx) => (
              <div key={idx} className="p-3 rounded-xl flex items-start gap-3" style={{ background: "#F5F7FA" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: campaign.status === "Aktif" ? "#EEF4FF" : "#F6FFED" }}>
                  {campaign.status === "Aktif" ? (
                    <Heart size={18} color="#1677FF" fill="#1677FF" />
                  ) : (
                    <CheckCircle size={18} color="#52C41A" />
                  )}
                </div>
                <div className="flex-1">
                  <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "#242424" }}>{campaign.title}</p>
                  <p style={{ color: "#8C8C8C", fontSize: "0.7rem" }}>{campaign.date}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#1677FF" }}>
                    {campaign.amount.toLocaleString("id-ID")}
                  </p>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: campaign.status === "Aktif" ? "#EEF4FF" : "#F6FFED",
                      color: campaign.status === "Aktif" ? "#1677FF" : "#52C41A",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                    }}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3.5 rounded-xl font-bold"
          style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", color: "white" }}
        >
          Tutup
        </button>
    </ModalWrapper>
  );
}
