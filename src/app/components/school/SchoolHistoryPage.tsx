import React, { useState, useEffect } from "react";
import { ArrowDownLeft, Filter, Receipt, Wallet } from "lucide-react";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Transaction } from "../../data/database";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch { return iso; }
}

const CATS = ["Semua", "SPP", "Donasi"];

export function SchoolHistoryPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState("Semua");

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      const { data: adminData } = await supabase.from("school_admins").select("school_id").eq("user_id", user.id).single();
      if (!adminData?.school_id) return;

      const { data } = await supabase
        .from("vw_transactions")
        .select("*")
        .eq("school_id", adminData.school_id)
        .order("created_at", { ascending: false });
        
      if (data) {
        const schoolTxns = data.filter((t: any) => t.type === "in");
        setTransactions(schoolTxns.map((t: any) => ({
          id: t.id,
          userId: t.user_id,
          type: t.type,
          category: t.category,
          amount: t.amount,
          description: t.description,
          date: t.created_at,
          title: t.category === "SPP" ? `Pembayaran SPP` : `Donasi Kampanye`,
          status: "Berhasil"
        })));
      }
    }
    loadData();
  }, [user]);

  const filtered = transactions.filter((h) => activeCat === "Semua" || h.category === activeCat);
  const totalIn = filtered.reduce((s, h) => s + h.amount, 0);
  const sppTotal = transactions.filter((t) => t.category === "SPP").reduce((s, t) => s + t.amount, 0);
  const donasiTotal = transactions.filter((t) => t.category === "Donasi").reduce((s, t) => s + t.amount, 0);

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Riwayat Transaksi</h2>
          <p className="text-sm text-gray-500">Penerimaan SPP dan pencairan dana kampanye</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownLeft size={18} />
              <span className="text-sm opacity-90">Total Penerimaan</span>
            </div>
            <p className="text-3xl font-bold mb-1">{formatRupiah(sppTotal + donasiTotal)}</p>
            <p className="text-sm opacity-75">{transactions.length} transaksi tercatat</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Receipt size={18} color="#1677FF" />
              <span className="text-sm text-gray-500">Penerimaan SPP</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatRupiah(sppTotal)}</p>
            <p className="text-xs text-gray-400 mt-1">{transactions.filter((t) => t.category === "SPP").length} transaksi</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={18} color="#52C41A" />
              <span className="text-sm text-gray-500">Pencairan Donasi</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatRupiah(donasiTotal)}</p>
            <p className="text-xs text-gray-400 mt-1">{transactions.filter((t) => t.category === "Donasi").length} transaksi</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <Filter size={16} color="#8C8C8C" />
            <span className="text-sm font-semibold text-gray-600">Kategori:</span>
            <div className="flex gap-2">
              {CATS.map((c) => (
                <button key={c} onClick={() => setActiveCat(c)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: activeCat === c ? "#1677FF" : "#F5F7FA", color: activeCat === c ? "white" : "#595959" }}>
                  {c}
                </button>
              ))}
            </div>
            {activeCat !== "Semua" && (
              <span className="ml-auto text-sm text-gray-500">{filtered.length} transaksi · {formatRupiah(totalIn)}</span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Transaksi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.id} className="border-t border-gray-100 hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: h.category === "SPP" ? "#EEF4FF" : "#F6FFED" }}>
                        {h.category === "SPP" ? <Receipt size={18} color="#1677FF" /> : <Wallet size={18} color="#52C41A" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{h.title}</p>
                        <p className="text-xs text-gray-400">{h.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      h.category === "SPP" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                      {h.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(h.date)}</td>
                  <td className="px-6 py-4 font-bold text-green-600 text-sm">+{formatRupiah(h.amount)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">{h.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Receipt size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">Tidak ada transaksi untuk kategori ini</p>
            </div>
          )}
        </div>
      </div>
    </SchoolDesktopLayout>
  );
}
