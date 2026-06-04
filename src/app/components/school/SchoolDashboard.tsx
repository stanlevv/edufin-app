import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Users, CheckCircle, XCircle, Plus, TrendingUp, AlertCircle, FileText, Megaphone, Heart, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Database, Student, Campaign } from "../../data/database";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];
const MONTHS_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export function SchoolDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "campaigns">("overview");

  useEffect(() => {
    async function loadData() {
      const s = await Database.fetchStudentsSupabase();
      setStudents(s);
      const p = await Database.fetchPaymentsSupabase();
      setPayments(p);
      const c = await Database.fetchCampaignsSupabase();
      setCampaigns(c);
      const t = await Database.fetchTransactionsSupabase();
      setTransactions(t);
    }
    loadData();
  }, []);

  // Stats
  const totalStudents = students.filter((s) => s.status === "active").length;
  // Filter tagihan bulan ini
  const currentMonthFull = MONTHS_FULL[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const paymentsThisMonth = payments.filter((p) => p.month === currentMonthFull && p.year === currentYear);
  const lunas = paymentsThisMonth.filter((p) => p.status === "completed").length;
  const belumBayar = totalStudents - lunas; // Yang belum lunas berarti selisih siswa aktif dan yang sudah bayar
  
  // Hitung total penerimaan dari transactions
  const totalPenerimaan = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + t.amount, 0);
  const totalSPP = transactions.filter(t => t.category === 'SPP').reduce((acc, t) => acc + t.amount, 0);

  // Chart: hitung pembayaran Lunas per bulan
  const chartData = MONTHS_FULL.slice(0, 6).map((monthFull, i) => {
    const monthPayments = payments.filter((p) => p.month === monthFull);
    const paid = monthPayments.filter((p) => p.status === "completed").length;
    const total = totalStudents || 1; // Asumsi total tagihan sama dengan total siswa
    return {
      id: `chart-month-${i}-${MONTHS_SHORT[i]}`,
      month: MONTHS_SHORT[i],
      pct: Math.round((paid / total) * 100),
      index: i
    };
  });

  // Pending campaigns
  const pendingCampaigns = campaigns.filter((c) => !c.verified && c.status === "active");

  const handleApproveCampaign = async (id: string) => {
    const c = campaigns.find(x => x.id === id);
    if (c) { 
      await Database.updateCampaignSupabase({ ...c, verified: true }); 
      setCampaigns(await Database.fetchCampaignsSupabase()); 
    }
  };
  const handleRejectCampaign = async (id: string) => {
    const c = campaigns.find(x => x.id === id);
    if (c) { 
      await Database.updateCampaignSupabase({ ...c, verified: false, status: "cancelled" }); 
      setCampaigns(await Database.fetchCampaignsSupabase()); 
    }
  };

  const statusColor: Record<string, string> = { completed: "#52C41A", failed: "#EA4E0D", pending: "#D4A017" };

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
    .slice(0, 6);

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        {/* Welcome */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Selamat datang, {user?.name?.split(" ")[0]} 👋</h2>
            <p className="text-sm text-gray-500 mt-1">{user?.school || "Panel Administrasi"}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/school/bills")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm text-sm">
              <Plus size={16} /> Buat Pembayaran
            </button>
            <button onClick={() => navigate("/school/students")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm">
              <Users size={16} /> Tambah Siswa
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {[
            { label: "Siswa Aktif", value: totalStudents, sub: `${students.length} terdaftar`, icon: <Users size={22} color="#1677FF" />, bg: "#EEF4FF", color: "#1677FF", path: "/school/students" },
            { label: "SPP Bulan Ini (Lunas)", value: lunas, sub: "Siswa sudah bayar", icon: <CheckCircle size={22} color="#52C41A" />, bg: "#F6FFED", color: "#52C41A", path: "/school/bills" },
            { label: "SPP Bulan Ini (Belum)", value: belumBayar, sub: "Siswa tertunggak", icon: <AlertCircle size={22} color="#EA4E0D" />, bg: "#FFF2EE", color: "#EA4E0D", path: "/school/bills" },
            { label: "Total Kas SPP Masuk", value: formatRupiah(totalSPP), sub: "Berdasarkan transaksi", icon: <FileText size={22} color="#D4A017" />, bg: "#FFFBE6", color: "#D4A017", path: "/school/history" },
          ].map((c) => (
            <button key={c.label} onClick={() => navigate(c.path)}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-left hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>{c.icon}</div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-400 mt-1 transition-colors" />
              </div>
              <p className="text-xl font-bold text-gray-800 mb-0.5">{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: c.color }}>{c.sub}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {(["overview","students","campaigns"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: activeTab === t ? "white" : "transparent", color: activeTab === t ? "#1677FF" : "#595959", boxShadow: activeTab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
              {t === "overview" ? "Overview" : t === "students" ? "Siswa" : "Kampanye"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Chart */}
            <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-800">Persentase Kepatuhan SPP</h3>
                  <p className="text-xs text-gray-500 mt-0.5">6 bulan terakhir</p>
                </div>
                <TrendingUp size={18} color="#52C41A" />
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} key="grid" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8C8C8C" }} axisLine={false} tickLine={false} key="xaxis" />
                    <YAxis tick={{ fontSize: 12, fill: "#8C8C8C" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} key="yaxis" />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Pembayaran"]} key="tooltip" />
                    <Bar dataKey="pct" fill="#1677FF" radius={[6, 6, 0, 0]} key="bar-pct" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Total Kas Keuangan</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Pemasukan Keseluruhan</span>
                    <span className="text-sm font-bold text-green-600">{formatRupiah(totalPenerimaan)}</span>
                  </div>
                  <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Jumlah Siswa Belum Bayar Bulan Ini</span>
                    <span className="text-sm font-bold text-red-500">{belumBayar} Siswa</span>
                  </div>
                  <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Total Kampanye</span>
                    <span className="text-sm font-bold text-blue-600">{campaigns.length}</span>
                  </div>
                  <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Pending Approval</span>
                    <span className="text-sm font-bold text-orange-500">{pendingCampaigns.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick nav */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">Aksi Cepat</h3>
                <div className="space-y-2">
                  {[
                    { label: "Kelola Tagihan", icon: <FileText size={16} color="#1677FF" />, bg: "#EEF4FF", path: "/school/bills" },
                    { label: "Data Siswa", icon: <Users size={16} color="#52C41A" />, bg: "#F6FFED", path: "/school/students" },
                    { label: "Kelola Kampanye", icon: <Megaphone size={16} color="#722ED1" />, bg: "#F9F0FF", path: "/school/campaigns" },
                    { label: "Data Donatur", icon: <Heart size={16} color="#EA4E0D" />, bg: "#FFF2EE", path: "/school/donors" },
                  ].map((a) => (
                    <button key={a.label} onClick={() => navigate(a.path)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-all text-left">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: a.bg }}>{a.icon}</div>
                      <span className="text-sm font-semibold text-gray-700">{a.label}</span>
                      <ArrowRight size={14} className="ml-auto text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Daftar Siswa</h3>
              <button onClick={() => navigate("/school/students")} className="text-xs text-blue-600 font-semibold flex items-center gap-1">Lihat semua <ArrowRight size={12} /></button>
            </div>
            <div className="divide-y divide-gray-50">
              {students.slice(0, 8).map((s) => {
                const studentPayments = payments.filter((p) => p.studentId === s.id);
                const latestPayment = studentPayments.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())[0];
                const status = latestPayment?.status ?? "pending";
                return (
                  <div key={s.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-all">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {s.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.class}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${statusColor[status]}18`, color: statusColor[status] }}>
                      {status}
                    </span>
                  </div>
                );
              })}
              {students.length === 0 && <p className="text-center text-gray-400 text-sm py-12">Belum ada siswa terdaftar</p>}
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="space-y-4">
            {/* Pending Campaigns */}
            {pendingCampaigns.length > 0 && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle size={18} color="#F97316" />
                  <h3 className="font-bold text-orange-700">Menunggu Persetujuan ({pendingCampaigns.length})</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {pendingCampaigns.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Megaphone size={18} color="#F97316" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{c.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{c.school} · {c.category}</p>
                          <p className="text-xs font-semibold text-blue-600 mt-0.5">Target: {formatRupiah(c.target)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleRejectCampaign(c.id)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all">Tolak</button>
                        <button onClick={() => handleApproveCampaign(c.id)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-600 hover:bg-green-100 transition-all">Setujui</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All campaigns */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Semua Kampanye</h3>
                <button onClick={() => navigate("/school/campaigns")} className="text-xs text-blue-600 font-semibold flex items-center gap-1">Kelola <ArrowRight size={12} /></button>
              </div>
              <div className="divide-y divide-gray-50">
                {campaigns.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Megaphone size={18} color="#722ED1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.school} · {formatRupiah(c.collected)} / {formatRupiah(c.target)}</p>
                      <div className="mt-1 h-1 bg-gray-100 rounded-full w-40">
                        <div className="h-1 rounded-full bg-blue-500" style={{ width: `${Math.min((c.collected / c.target) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{ background: c.verified ? "#F6FFED" : "#FFF7E6", color: c.verified ? "#52C41A" : "#D4A017" }}>
                      {c.verified ? "Terverifikasi" : "Pending"}
                    </span>
                  </div>
                ))}
                {campaigns.length === 0 && <p className="text-center text-gray-400 text-sm py-12">Belum ada kampanye</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </SchoolDesktopLayout>
  );
}
