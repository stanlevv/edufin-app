import React, { useState, useEffect } from "react";
import { Download, TrendingUp, Users, DollarSign, AlertCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Cell, PieChart, Pie, Tooltip
} from "recharts";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Database, Bill } from "../../data/database";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTHS_FULL = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export function SchoolReportPage() {
  const [period, setPeriod] = useState<"bulan" | "tahun">("bulan");
  const [bills, setBills] = useState<Bill[]>([]);
  const [students, setStudents] = useState<ReturnType<typeof Database.getStudents>>([]);

  useEffect(() => {
    setBills(Database.getBills());
    setStudents(Database.getStudents());
  }, []);

  // ─── Hitung statistik dari Database ───────────────────────────────────────
  const now = new Date();
  const currentMonth = MONTHS_FULL[now.getMonth()];
  const currentYear = now.getFullYear();

  // Bills bulan ini
  const billsThisMonth = bills.filter(
    (b) => b.month === currentMonth && b.year === currentYear
  );

  const totalTagihan = billsThisMonth.reduce(
    (s, b) => s + b.items.reduce((si, i) => si + i.amount, 0), 0
  );
  const totalTerkumpul = billsThisMonth
    .filter((b) => b.status === "Lunas")
    .reduce((s, b) => s + b.items.reduce((si, i) => si + i.amount, 0), 0);
  const totalTertunggak = billsThisMonth
    .filter((b) => b.status === "Tertunggak")
    .reduce((s, b) => s + b.items.reduce((si, i) => si + i.amount, 0), 0);
  const totalCicilan = billsThisMonth
    .filter((b) => b.status === "Cicilan")
    .reduce((s, b) => s + b.items.reduce((si, i) => si + i.amount, 0), 0);

  const lunasSiswa = billsThisMonth.filter((b) => b.status === "Lunas").length;
  const tertunggakSiswa = billsThisMonth.filter((b) => b.status === "Tertunggak").length;
  const cicilanSiswa = billsThisMonth.filter((b) => b.status === "Cicilan").length;
  const totalSiswa = students.length || 50;
  const payRate = totalSiswa > 0 ? Math.round((lunasSiswa / totalSiswa) * 100) : 0;

  // Chart bulanan — 5 bulan terakhir
  const MONTHLY = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(currentYear, now.getMonth() - (4 - i), 1);
    const m = MONTHS_FULL[d.getMonth()];
    const y = d.getFullYear();
    const masuk = bills.filter((b) => b.month === m && b.year === y && b.status === "Lunas").length;
    return {
      id: MONTHS_SHORT[d.getMonth()].toLowerCase(),
      month: MONTHS_SHORT[d.getMonth()],
      masuk,
      total: totalSiswa,
      isCurrent: i === 4,
    };
  });

  // Status pie data
  const STATUS_DATA = [
    { id: "lunas", name: "Lunas", value: lunasSiswa, color: "#52C41A" },
    { id: "tertunggak", name: "Tertunggak", value: tertunggakSiswa, color: "#EA4E0D" },
    { id: "cicilan", name: "Cicilan", value: cicilanSiswa, color: "#FDD504" },
  ].filter((d) => d.value > 0);

  // Pertumbuhan vs bulan lalu
  const lastMonth = MONTHS_FULL[now.getMonth() === 0 ? 11 : now.getMonth() - 1];
  const lastYear = now.getMonth() === 0 ? currentYear - 1 : currentYear;
  const lunasBulanLalu = bills.filter(
    (b) => b.month === lastMonth && b.year === lastYear && b.status === "Lunas"
  ).length;
  const growth = lunasBulanLalu > 0
    ? Math.round(((lunasSiswa - lunasBulanLalu) / lunasBulanLalu) * 100)
    : 0;

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Laporan Keuangan</h2>
            <p className="text-sm text-gray-500">
              Periode {currentMonth} {currentYear}
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all">
            <Download size={18} /> Ekspor Laporan
          </button>
        </div>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                label: "Total Terkumpul",
                value: formatRupiah(totalTerkumpul),
                sub: currentMonth + " " + currentYear,
                icon: <DollarSign size={24} color="#1677FF" />,
                bg: "#EEF4FF", color: "#1677FF",
              },
              {
                label: "Siswa Bayar",
                value: `${lunasSiswa} / ${totalSiswa}`,
                sub: `${payRate}% tingkat bayar`,
                icon: <Users size={24} color="#52C41A" />,
                bg: "#F6FFED", color: "#52C41A",
              },
              {
                label: "Tertunggak",
                value: formatRupiah(totalTertunggak),
                sub: `${tertunggakSiswa} siswa`,
                icon: <AlertCircle size={24} color="#EA4E0D" />,
                bg: "#FFF2EE", color: "#EA4E0D",
              },
              {
                label: "Pertumbuhan",
                value: `${growth >= 0 ? "+" : ""}${growth}%`,
                sub: "vs bulan lalu",
                icon: <TrendingUp size={24} color="#722ED1" />,
                bg: "#F9F0FF", color: "#722ED1",
              },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: c.bg }}>
                  {c.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{c.value}</p>
                <p className="text-xs font-semibold mb-1" style={{ color: c.color }}>{c.sub}</p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800">Tren Pembayaran Bulanan</h3>
                <p className="text-sm text-gray-500">Jumlah siswa lunas per bulan</p>
              </div>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY} barSize={30}>
                    <CartesianGrid vertical={false} stroke="#F0F0F0" strokeDasharray="3 3" key="grid" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false}
                      tick={{ fontSize: 12, fill: "#8C8C8C" }} key="xaxis" />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fontSize: 12, fill: "#8C8C8C" }} key="yaxis" />
                    <Tooltip key="tooltip" formatter={(v: number) => [`${v} siswa`, "Lunas"]} />
                    <Bar dataKey="masuk" radius={[8, 8, 0, 0]} key="bar-masuk">
                      {MONTHLY.map((item) => (
                        <Cell key={`cell-${item.id}`} fill={item.isCurrent ? "#FDD504" : "#1677FF"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Distribusi Status Bayar</h3>
              {STATUS_DATA.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-400 text-sm">Belum ada tagihan bulan ini</p>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
                    <PieChart width={160} height={160}>
                      <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                        dataKey="value" strokeWidth={3} stroke="white" key="pie-status">
                        {STATUS_DATA.map((e) => <Cell key={`cell-${e.id}`} fill={e.color} />)}
                      </Pie>
                      <Tooltip key="tooltip" formatter={(v: number) => [`${v} siswa`]} />
                    </PieChart>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-2xl font-bold text-gray-800">{totalSiswa}</p>
                      <p className="text-xs text-gray-500">siswa</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    {STATUS_DATA.map((d) => (
                      <div key={d.name}>
                        <div className="flex justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                            <span className="text-sm font-semibold text-gray-700">{d.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-800">{d.value} siswa</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${(d.value / totalSiswa) * 100}%`, background: d.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rincian Bulan Ini */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rincian {currentMonth} {currentYear}</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Tagihan Diterbitkan", value: formatRupiah(totalTagihan) },
                { label: "Total Terkumpul", value: formatRupiah(totalTerkumpul) },
                { label: "Total Tertunggak", value: formatRupiah(totalTertunggak) },
                { label: "Dana Cicilan Aktif", value: formatRupiah(totalCicilan) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-600">{row.label}</span>
                  <span className="text-sm font-bold text-gray-800">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SchoolDesktopLayout>
  );
}
