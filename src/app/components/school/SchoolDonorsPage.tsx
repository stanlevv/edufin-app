import React, { useState, useEffect } from "react";
import { Search, Trash2, Heart, TrendingUp, Users, DollarSign, X } from "lucide-react";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Database, Donation, Campaign } from "../../data/database";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch { return iso; }
}

const METHOD_CFG: Record<string, { color: string; bg: string }> = {
  QRIS: { color: "#722ED1", bg: "#F9F0FF" },
  "Transfer Bank": { color: "#1677FF", bg: "#EEF4FF" },
  "Virtual Account": { color: "#52C41A", bg: "#F6FFED" },
  "Virtual Account BCA": { color: "#52C41A", bg: "#F6FFED" },
};

interface DonationRow extends Donation {
  campaignTitle: string;
}

export function SchoolDonorsPage() {
  const [donations, setDonations] = useState<DonationRow[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState("");
  const [filterCampaign, setFilterCampaign] = useState("Semua");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [detailDonation, setDetailDonation] = useState<DonationRow | null>(null);

  const load = async () => {
    const allCampaigns = await Database.fetchCampaignsSupabase();
    setCampaigns(allCampaigns);
    const allDonations = await Database.fetchDonationsSupabase();
    allDonations.sort((a: any, b: any) => new Date(b.donatedAt).getTime() - new Date(a.donatedAt).getTime());
    setDonations(allDonations);
  };

  useEffect(() => { load(); }, []);

  const filtered = donations.filter((d) => {
    const ms = d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      d.campaignTitle.toLowerCase().includes(search.toLowerCase());
    const mc = filterCampaign === "Semua" || d.campaignId === filterCampaign;
    return ms && mc;
  });

  const handleDelete = (id: string) => {
    alert("Delete donation from Admin is disabled in read-only mode");
    setDeleteConfirm(null);
  };

  const stats = {
    totalDonors: new Set(donations.filter((d) => !d.isAnonymous).map((d) => d.donorId)).size,
    totalDonations: donations.length,
    totalAmount: donations.filter((d) => d.status === "completed" || d.status === "success").reduce((s, d) => s + d.amount, 0),
    avgAmount: donations.length ? Math.round(donations.reduce((s, d) => s + d.amount, 0) / donations.length) : 0,
  };

  const getTopDonors = () => {
    const map = new Map();
    donations.filter(d => d.status === "completed" || d.status === "success").forEach(d => {
      const key = d.isAnonymous ? `anon-${d.donorId}` : d.donorId;
      if (!map.has(key)) map.set(key, { id: key, name: d.donorName, totalDonated: 0, donationCount: 0 });
      const donor = map.get(key);
      donor.totalDonated += d.amount;
      donor.donationCount += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.totalDonated - a.totalDonated).slice(0, 5);
  };
  const topDonors = getTopDonors();

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Manajemen Donatur</h2>
          <p className="text-sm text-gray-500">Pantau semua donasi dan kelola data donatur</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Donatur Unik", value: stats.totalDonors, icon: <Users size={22} color="#1677FF" />, bg: "#EEF4FF", color: "#1677FF" },
            { label: "Total Donasi", value: stats.totalDonations, icon: <Heart size={22} color="#EA4E0D" />, bg: "#FFF2EE", color: "#EA4E0D" },
            { label: "Total Terkumpul", value: formatRupiah(stats.totalAmount), icon: <DollarSign size={22} color="#52C41A" />, bg: "#F6FFED", color: "#52C41A" },
            { label: "Rata-rata Donasi", value: formatRupiah(stats.avgAmount), icon: <TrendingUp size={22} color="#722ED1" />, bg: "#F9F0FF", color: "#722ED1" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <p className="font-bold text-gray-800" style={{ fontSize: typeof s.value === "string" ? "14px" : "22px" }}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Top Donors */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart size={16} color="#EA4E0D" /> Top Donatur
            </h3>
            <div className="space-y-3">
              {topDonors.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: i === 0 ? "#FFF7E6" : i === 1 ? "#F5F5F5" : "#FFF2EE", color: i === 0 ? "#D4A017" : i === 1 ? "#8C8C8C" : "#C97100" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{d.name}</p>
                    <p className="text-xs text-gray-400">{d.donationCount}x donasi</p>
                  </div>
                  <p className="text-sm font-bold text-green-600 flex-shrink-0">{formatRupiah(d.totalDonated)}</p>
                </div>
              ))}
              {topDonors.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Belum ada donatur</p>}
            </div>
          </div>

          {/* Campaign Breakdown */}
          <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={16} color="#1677FF" /> Donasi per Kampanye
            </h3>
            <div className="space-y-3">
              {campaigns.map((c) => {
                const campDonations = donations.filter((d) => d.campaignId === c.id && d.status === "success");
                const total = campDonations.reduce((s, d) => s + d.amount, 0);
                const pct = c.target ? Math.min(Math.round((c.collected / c.target) * 100), 100) : 0;
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-700 truncate max-w-xs">{c.title}</p>
                        <span className="text-xs font-semibold text-blue-600 flex-shrink-0 ml-2">{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{campDonations.length} donasi · {formatRupiah(c.collected)} / {formatRupiah(c.target)}</p>
                    </div>
                  </div>
                );
              })}
              {campaigns.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Belum ada kampanye</p>}
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex gap-3 items-center">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <Search size={17} color="#8C8C8C" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama donatur atau kampanye..." className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <select value={filterCampaign} onChange={(e) => setFilterCampaign(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white min-w-[200px]">
            <option value="Semua">Semua Kampanye</option>
            {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title.slice(0, 40)}...</option>)}
          </select>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Donatur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kampanye</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Metode</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const mc = METHOD_CFG[d.method] || { color: "#595959", bg: "#F5F5F5" };
                return (
                  <tr key={d.id} className="border-t border-gray-100 hover:bg-gray-50 transition-all cursor-pointer" onClick={() => setDetailDonation(d)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: d.isAnonymous ? "#F5F5F5" : "#FFF2EE" }}>
                          {d.isAnonymous ? <span className="text-gray-400 text-xs">?</span> : <Heart size={15} color="#EA4E0D" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{d.donorName}</p>
                          {d.isAnonymous && <p className="text-xs text-gray-400">Anonim</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-xs truncate">{d.campaignTitle}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600 text-sm">{formatRupiah(d.amount)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: mc.bg, color: mc.color }}>{d.method}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(d.donatedAt)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: d.status === "success" ? "#F6FFED" : "#FFF7E6", color: d.status === "success" ? "#52C41A" : "#F97316" }}>
                        {d.status === "success" ? "Berhasil" : d.status === "pending" ? "Pending" : "Gagal"}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setDeleteConfirm(d.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Heart size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">Tidak ada data donasi</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailDonation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetailDonation(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Detail Donasi</h3>
              <button onClick={() => setDetailDonation(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <Heart size={24} color="#EA4E0D" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{detailDonation.donorName}</p>
                  <p className="text-xs text-gray-500">{detailDonation.isAnonymous ? "Donasi Anonim" : "Donatur Terdaftar"}</p>
                </div>
              </div>
              {[
                { label: "Kampanye", value: detailDonation.campaignTitle },
                { label: "Jumlah", value: formatRupiah(detailDonation.amount) },
                { label: "Metode", value: detailDonation.method },
                { label: "Tanggal", value: formatDate(detailDonation.donatedAt) },
                { label: "ID Donasi", value: detailDonation.id },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
                  <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
                </div>
              ))}
              {detailDonation.message && (
                <div className="px-4 py-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">Pesan</p>
                  <p className="text-sm text-gray-700 italic">"{detailDonation.message}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} color="#EF4444" /></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Donasi?</h3>
            <p className="text-sm text-gray-500 mb-6">Data donasi ini akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </SchoolDesktopLayout>
  );
}
