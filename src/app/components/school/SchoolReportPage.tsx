import React, { useState } from "react";
import { Download, TrendingUp, Users, DollarSign, AlertCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Cell, PieChart, Pie, Tooltip
} from "recharts";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";

const MONTHLY = [
  { id: "jan", month: "Jan", masuk: 42, total: 50 },
  { id: "feb", month: "Feb", masuk: 45, total: 50 },
  { id: "mar", month: "Mar", masuk: 48, total: 50 },
  { id: "apr", month: "Apr", masuk: 44, total: 50 },
  { id: "mei", month: "Mei", masuk: 35, total: 50 },
];

const STATUS_DATA = [
  { id: "lunas", name: "Lunas", value: 35, color: "#52C41A" },
  { id: "tertunggak", name: "Tertunggak", value: 10, color: "#EA4E0D" },
  { id: "cicilan", name: "Cicilan", value: 5, color: "#FDD504" },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export function SchoolReportPage() {
  const [period, setPeriod] = useState<"bulan" | "tahun">("bulan");

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Laporan Keuangan</h2>
            <p className="text-sm text-gray-500">SDN 3 Malang - Periode Mei 2025</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all">
            <Download size={18} /> Ekspor Laporan
          </button>
        </div>

        <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Terkumpul", value: formatRupiah(29750000), sub: "Mei 2025", icon: <DollarSign size={24} color="#1677FF" />, bg: "#EEF4FF", color: "#1677FF" },
            { label: "Siswa Bayar", value: "35 / 50", sub: "70% tingkat bayar", icon: <Users size={24} color="#52C41A" />, bg: "#F6FFED", color: "#52C41A" },
            { label: "Tertunggak", value: formatRupiah(8500000), sub: "10 siswa", icon: <AlertCircle size={24} color="#EA4E0D" />, bg: "#FFF2EE", color: "#EA4E0D" },
            { label: "Pertumbuhan", value: "+12%", sub: "vs bulan lalu", icon: <TrendingUp size={24} color="#722ED1" />, bg: "#F9F0FF", color: "#722ED1" },
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
              <p className="text-sm text-gray-500">Jumlah siswa per bulan</p>
            </div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY} barSize={30}>
                  <CartesianGrid vertical={false} stroke="#F0F0F0" strokeDasharray="3 3" key="grid" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false}
                    tick={{ fontSize: 12, fill: "#8C8C8C" }} key="xaxis" />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fontSize: 12, fill: "#8C8C8C" }} key="yaxis" />
                  <Tooltip key="tooltip" />
                  <Bar dataKey="masuk" radius={[8, 8, 0, 0]} key="bar-masuk">
                    {MONTHLY.map((item) => (
                      <Cell key={`cell-${item.id}`} fill={item.id === "mei" ? "#FDD504" : "#1677FF"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Distribusi Status Bayar</h3>
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
                <PieChart width={160} height={160}>
                  <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                    dataKey="value" strokeWidth={3} stroke="white" key="pie-status">
                    {STATUS_DATA.map((e) => <Cell key={`cell-${e.id}`} fill={e.color} />)}
                  </Pie>
                  <Tooltip key="tooltip" />
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-2xl font-bold text-gray-800">50</p>
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
                      <div className="h-full rounded-full transition-all" style={{ width: `${(d.value / 50) * 100}%`, background: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rincian Bulan Ini */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Rincian Bulan Ini</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Tagihan Diterbitkan", value: formatRupiah(42500000) },
              { label: "Total Terkumpul", value: formatRupiah(29750000) },
              { label: "Total Tertunggak", value: formatRupiah(8500000) },
              { label: "Dana Cicilan Aktif", value: formatRupiah(4250000) },
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
