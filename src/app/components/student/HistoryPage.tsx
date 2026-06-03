import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowUpRight, Receipt, CreditCard, Heart } from "lucide-react";
import { formatRupiah, STUDENT_STYLES } from "../../styles/studentStyles";
import { useAuth } from "../../context/AuthContext";
import { Database, Transaction } from "../../data/database";

const HISTORY = [
  { id: 1, type: "out", title: "Pembayaran SPP", desc: "April 2025 · QRIS", amount: 725000, date: "10 Apr 2025", category: "SPP", status: "Berhasil" },
  { id: 2, type: "out", title: "Cicilan SPP (2/3)", desc: "Maret 2025 · Transfer Bank BCA", amount: 200000, date: "8 Apr 2025", category: "Cicilan" },
  { id: 3, type: "out", title: "Donasi Kampanye", desc: "Beasiswa Siswa Berprestasi SDN 3", amount: 100000, date: "5 Apr 2025", category: "Donasi", status: "Berhasil" },
  { id: 4, type: "out", title: "Pembayaran SPP", desc: "Maret 2025 · Virtual Account", amount: 600000, date: "12 Mar 2025", category: "SPP", status: "Berhasil" },
  { id: 5, type: "out", title: "Cicilan SPP (1/3)", desc: "Maret 2025 · QRIS GoPay", amount: 200000, date: "10 Mar 2025", category: "Cicilan" },
  { id: 6, type: "out", title: "Donasi Kampanye", desc: "Renovasi Lab Komputer SMPN 5", amount: 250000, date: "2 Mar 2025", category: "Donasi", status: "Berhasil" },
  { id: 7, type: "out", title: "Pembayaran SPP", desc: "Februari 2025 · QRIS", amount: 600000, date: "15 Feb 2025", category: "SPP", status: "Berhasil" },
];

const CATS = ["Semua", "SPP", "Cicilan", "Donasi"];

export function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeCat, setActiveCat] = useState("Semua");

  useEffect(() => {
    if (!user) return;
    const data = Database.getTransactionsByUserId(user.id);
    // Urutkan terbaru dulu
    setTransactions([...data].sort((a, b) => b.date.localeCompare(a.date)));
  }, [user]);

  const filtered = transactions.filter((h) => activeCat === "Semua" || h.category === activeCat);
  const totalOut = transactions.filter((t) => t.type === "out").reduce((s, h) => s + h.amount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with Gradient */}
      <div className={`${STUDENT_STYLES.padding.page} py-6 md:py-8`} style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <h1 className={`${STUDENT_STYLES.text.pageTitle} text-white mb-1`}>Riwayat Transaksi</h1>
        <p className={`${STUDENT_STYLES.text.caption} text-white/70`}>SPP, cicilan, dan donasi Anda</p>

        {/* Summary Card */}
        <div className={`${STUDENT_STYLES.radius.medium} ${STUDENT_STYLES.padding.card} mt-4`} style={{ background: "rgba(255,255,255,0.15)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <ArrowUpRight size={STUDENT_STYLES.icon.small} color="rgba(255,255,255,0.7)" />
            <span className={`${STUDENT_STYLES.text.caption} text-white/70`}>Total Pengeluaran</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{formatRupiah(totalOut)}</p>
          <p className={`${STUDENT_STYLES.text.small} text-white/60 mt-0.5`}>{transactions.length} transaksi</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className={`${STUDENT_STYLES.padding.page} py-4 overflow-x-auto flex ${STUDENT_STYLES.gap.small} bg-white scrollbar-hide`}>
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`flex-shrink-0 px-4 md:px-5 py-2 md:py-2.5 ${STUDENT_STYLES.radius.full} transition-all ${STUDENT_STYLES.touchTarget.min}`}
            style={{
              background: activeCat === c ? STUDENT_STYLES.colors.primary : STUDENT_STYLES.colors.gray[50],
              color: activeCat === c ? "white" : STUDENT_STYLES.colors.gray[600],
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className={`flex-1 ${STUDENT_STYLES.padding.page} py-4 overflow-y-auto space-y-3`}>
        {filtered.map((h) => (
          <div key={h.id} className={`bg-white ${STUDENT_STYLES.radius.medium} ${STUDENT_STYLES.padding.card} ${STUDENT_STYLES.shadow.sm} flex items-start gap-3 md:gap-4`}>
            {/* Icon */}
            <div
              className={`w-12 h-12 md:w-14 md:h-14 ${STUDENT_STYLES.radius.small} flex items-center justify-center flex-shrink-0`}
              style={{
                background: h.category === "SPP" ? STUDENT_STYLES.colors.primaryLight : h.category === "Cicilan" ? "#FFF7E6" : "#FFF2F0"
              }}
            >
              {h.category === "SPP"
                ? <Receipt size={STUDENT_STYLES.icon.large} color={STUDENT_STYLES.colors.primary} />
                : h.category === "Cicilan"
                  ? <CreditCard size={STUDENT_STYLES.icon.large} color={STUDENT_STYLES.colors.warning} />
                  : <Heart size={STUDENT_STYLES.icon.large} color={STUDENT_STYLES.colors.error} fill={STUDENT_STYLES.colors.error} />
              }
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`${STUDENT_STYLES.text.cardTitle} text-gray-900 truncate`}>{h.title}</p>
              <p className={`${STUDENT_STYLES.text.caption} text-gray-500 truncate mt-0.5`}>{h.description}</p>
              <p className={`${STUDENT_STYLES.text.small} text-gray-400 mt-1`}>{new Date(h.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>

            {/* Amount & Status */}
            <div className="text-right flex-shrink-0">
              <p className={`${STUDENT_STYLES.text.body} font-bold text-red-500`}>
                -{formatRupiah(h.amount)}
              </p>
              <span
                className={`inline-block px-2 py-0.5 ${STUDENT_STYLES.radius.full} mt-1`}
                style={{
                  background: h.status === "Berhasil" ? "#F6FFED" : "#FFF2F0",
                  color: h.status === "Berhasil" ? STUDENT_STYLES.colors.success : STUDENT_STYLES.colors.gray[500],
                  fontSize: "0.7rem",
                  fontWeight: 600
                }}
              >
                {h.status || "Pending"}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <Receipt size={40} color="#D9D9D9" />
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Belum ada riwayat transaksi</p>
          </div>
        )}
      </div>
    </div>
  );
}