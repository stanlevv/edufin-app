import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  School, Users, BarChart3, Heart, TrendingUp, Activity,
  ArrowRight, AlertTriangle, CheckCircle, Clock, Database,
  Globe, Zap, ShieldCheck
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { SchoolOnboardingModal } from "./modals/SchoolOnboardingModal";
import { ManageSchoolAdminsModal } from "./modals/ManageSchoolAdminsModal";
import { Skeleton } from "../ui/skeleton";

function StatCard({
  label, value, sub, icon, color, bg, trend, isLoading
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; color: string; bg: string; trend?: string; isLoading?: boolean;
}) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"
        style={{ background: bg }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: bg + "20", border: `1px solid ${color}30` }}>
            {icon}
          </div>
          {trend && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "rgba(34,197,94,0.1)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.2)" }}>
              {trend}
            </span>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="h-9 w-24 mb-1" style={{ background: "rgba(255,255,255,0.1)" }} />
        ) : (
          <p className="text-3xl font-black mb-1" style={{ color: "white", letterSpacing: "-1px" }}>{value}</p>
        )}
        <p className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
        {sub && <p className="text-xs" style={{ color }}>{sub}</p>}
      </div>
    </div>
  );
}

export function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalDonors: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    activeCampaigns: 0,
  });
  const [schoolsList, setSchoolsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentLogs] = useState([
    { action: "LOGIN", user: "admin@sdn3malang.sch.id", time: "2 menit lalu", status: "success" },
    { action: "PAYMENT_VERIFIED", user: "system", time: "15 menit lalu", status: "success" },
    { action: "CAMPAIGN_APPROVED", user: "admin@sdn3malang.sch.id", time: "1 jam lalu", status: "success" },
    { action: "LOGIN_FAILED", user: "unknown@example.com", time: "3 jam lalu", status: "warning" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: schools },
          { count: students },
          { count: donors },
          { count: campaigns },
          { data: bills },
          { data: donations },
        ] = await Promise.all([
          supabase.from("schools").select("id", { count: "exact", head: true }),
          supabase.from("students").select("id", { count: "exact", head: true }),
          supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "donatur"),
          supabase.from("campaigns").select("id", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("bills").select("amount").eq("status", "lunas"),
          supabase.from("donations").select("amount").eq("status", "completed"),
          supabase.from("schools").select("id, npsn, name, city, level, status").order("created_at", { ascending: false }),
        ]);

        const totalBills = bills?.reduce((sum: number, b: any) => sum + (b.amount || 0), 0) || 0;
        const totalDonations = donations?.reduce((sum: number, d: any) => sum + (d.amount || 0), 0) || 0;
        const totalRevenue = totalBills + totalDonations;
        const totalTransactionsCount = (bills?.length || 0) + (donations?.length || 0);

        setStats({
          totalSchools: schools || 0,
          totalStudents: students || 0,
          totalDonors: donors || 0,
          totalTransactions: totalTransactionsCount,
          totalRevenue,
          activeCampaigns: campaigns || 0,
        });
        setSchoolsList(schoolsListData || []);
      } catch (err) {
        console.error("Gagal memuat stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  function formatRupiah(n: number) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
    return "Rp " + n.toLocaleString("id-ID");
  }

  return (
    <SuperAdminLayout>
      <div className="p-7">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} color="#60A5FA" />
              <span style={{ color: "#60A5FA", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1px" }}>
                SUPER ADMIN DASHBOARD
              </span>
            </div>
            <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "4px" }}>
              Platform Overview
            </h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem" }}>
              Selamat datang, {user?.name} · {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <Activity size={13} color="#4ADE80" className="animate-pulse" />
              <span style={{ color: "#4ADE80", fontSize: "0.72rem", fontWeight: 700 }}>All Systems Operational</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              + Daftarkan Sekolah Baru
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Sekolah"
            value={stats.totalSchools}
            isLoading={loading}
            sub="Terdaftar di platform"
            icon={<School size={20} color="#60A5FA" />}
            color="#60A5FA" bg="#1E40AF"
            trend="+1 baru"
          />
          <StatCard
            label="Total Siswa"
            value={stats.totalStudents.toLocaleString("id-ID")}
            isLoading={loading}
            sub="Aktif terdaftar"
            icon={<Users size={20} color="#34D399" />}
            color="#34D399" bg="#065F46"
          />
          <StatCard
            label="Total Donatur"
            value={stats.totalDonors.toLocaleString("id-ID")}
            isLoading={loading}
            sub="Pengguna aktif"
            icon={<Heart size={20} color="#F87171" />}
            color="#F87171" bg="#7F1D1D"
          />
          <StatCard
            label="Total Pendapatan"
            value={formatRupiah(stats.totalRevenue)}
            isLoading={loading}
            sub="Kumulatif platform"
            icon={<TrendingUp size={20} color="#FBBF24" />}
            color="#FBBF24" bg="#78350F"
            trend="↑ bulan ini"
          />
          <StatCard
            label="Kampanye Aktif"
            value={stats.activeCampaigns}
            isLoading={loading}
            sub="Sedang berjalan"
            icon={<Zap size={20} color="#A78BFA" />}
            color="#A78BFA" bg="#4C1D95"
          />
          <StatCard
            label="Total Transaksi"
            value={stats.totalTransactions.toLocaleString("id-ID")}
            isLoading={loading}
            sub="Semua waktu"
            icon={<BarChart3 size={20} color="#FB923C" />}
            color="#FB923C" bg="#7C2D12"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Quick Actions */}
          <div className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px" }}>
              Aksi Cepat
            </h3>
            <div className="space-y-2">
              {[
                { label: "Manajemen Sekolah", icon: <School size={15} color="#60A5FA" />, bg: "rgba(22,119,255,0.1)", path: "/superadmin/schools" },
                { label: "Kelola Pengguna", icon: <Users size={15} color="#34D399" />, bg: "rgba(52,211,153,0.1)", path: "/superadmin/users" },
                { label: "Laporan Global", icon: <BarChart3 size={15} color="#FBBF24" />, bg: "rgba(251,191,36,0.1)", path: "/superadmin/reports" },
                { label: "Database Tools", icon: <Database size={15} color="#A78BFA" />, bg: "rgba(167,139,250,0.1)", path: "/superadmin/settings" },
              ].map((item) => (
                <button key={item.label}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontWeight: 600, flex: 1 }}>
                    {item.label}
                  </span>
                  <ArrowRight size={13} color="rgba(255,255,255,0.2)" />
                </button>
              ))}
            </div>
          </div>

          {/* Audit Log */}
          <div className="col-span-2 rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>Audit Log Terbaru</h3>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem" }}>Real-time</span>
            </div>
            <div className="space-y-2">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: log.status === "success" ? "rgba(34,197,94,0.1)" : "rgba(251,191,36,0.1)" }}>
                    {log.status === "success"
                      ? <CheckCircle size={14} color="#4ADE80" />
                      : <AlertTriangle size={14} color="#FBBF24" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", fontWeight: 700 }}>{log.action}</p>
                    <p className="truncate" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem" }}>{log.user}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Clock size={11} color="rgba(255,255,255,0.2)" />
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem" }}>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>
              Log audit lengkap tersedia setelah tabel admin_audit_logs diaktifkan
            </p>
          </div>
        </div>

        {/* Schools List */}
        <div className="mt-5 rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>Daftar Sekolah Terdaftar</h3>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem" }}>{schoolsList.length} Sekolah</span>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }} />
              ))}
            </div>
          ) : schoolsList.length === 0 ? (
            <div className="text-center py-8">
              <School size={32} color="rgba(255,255,255,0.2)" className="mx-auto mb-2" />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Belum ada sekolah yang terdaftar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: "600px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th className="pb-3 px-2 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>NPSN</th>
                    <th className="pb-3 px-2 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Nama Sekolah</th>
                    <th className="pb-3 px-2 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Kota</th>
                    <th className="pb-3 px-2 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Status</th>
                    <th className="pb-3 px-2 text-xs font-semibold text-right" style={{ color: "rgba(255,255,255,0.4)" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolsList.map((sch) => (
                    <tr key={sch.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{sch.npsn}</td>
                      <td className="py-3 px-2 text-sm font-bold" style={{ color: "white" }}>{sch.name}</td>
                      <td className="py-3 px-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{sch.city}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: sch.status === 'active' ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: sch.status === 'active' ? "#4ADE80" : "#EF4444" }}>
                          {sch.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => setSelectedSchool({ id: sch.id, name: sch.name })}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ml-auto"
                          style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.2)" }}
                          title="Kelola Admin Sekolah"
                        >
                          <Users size={12} /> Kelola Admin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="mt-5 rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.8px", marginBottom: "12px" }}>
            SYSTEM STATUS
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Supabase DB", status: "Operational", color: "#4ADE80" },
              { label: "Auth Service", status: "Operational", color: "#4ADE80" },
              { label: "Payment Gateway", status: "Operational", color: "#4ADE80" },
              { label: "Storage", status: "Operational", color: "#4ADE80" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>{s.label}</span>
                <span style={{ color: s.color, fontSize: "0.65rem", fontWeight: 700, marginLeft: "auto" }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <SchoolOnboardingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          window.location.reload();
        }} 
      />

      <ManageSchoolAdminsModal
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
        schoolId={selectedSchool?.id || ""}
        schoolName={selectedSchool?.name || ""}
      />
    </SuperAdminLayout>
  );
}
