import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, CheckCircle, Clock, XCircle, ChevronRight, Lightbulb, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Database, Loan, LoanInstallment } from "../../data/database";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const LOAN_PURPOSES = [
  "Pembayaran SPP",
  "Pembelian buku & alat tulis",
  "Biaya ujian / les tambahan",
  "Seragam sekolah",
  "Transportasi",
  "Lainnya",
];

export function LoanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"active" | "apply">("active");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [period, setPeriod] = useState("3");
  const [step, setStep] = useState<"form" | "submitted">("form");
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [installments, setInstallments] = useState<LoanInstallment[]>([]);

  useEffect(() => {
    if (!user) return;
    const student = Database.getStudentByUserId(user.id);
    if (!student) return;
    // Ambil pinjaman aktif (status Disetujui atau Menunggu)
    const loans = Database.getLoansByStudentId(student.id);
    const active = loans.find((l) => l.status === "Disetujui" || l.status === "Menunggu");
    setActiveLoan(active ?? null);
    if (active) {
      setInstallments(Database.getInstallmentsByLoanId(active.id));
    }
  }, [user, step]);

  const handleSubmit = () => {
    if (!amount || !purpose || !user) return;
    const student = Database.getStudentByUserId(user.id);
    if (!student) return;
    const loanAmount = parseInt(amount);
    const periods = parseInt(period);

    // Simpan pinjaman baru ke database
    const loanId = `PJM-${Date.now()}`;
    const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const now = new Date();

    const newLoan: Loan = {
      id: loanId,
      studentId: student.id,
      amount: loanAmount,
      purpose,
      status: "Menunggu",
      appliedAt: now.toISOString(),
      approvedAt: null,
      installmentCount: periods,
    };
    Database.saveLoan(newLoan);

    // Buat jadwal cicilan
    for (let i = 0; i < periods; i++) {
      const dueDate = new Date(now);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      const monthName = MONTHS_ID[dueDate.getMonth()];
      const installment: LoanInstallment = {
        id: `INST-${loanId}-${i + 1}`,
        loanId,
        month: `${monthName} ${dueDate.getFullYear()}`,
        amount: Math.ceil(loanAmount / periods),
        status: "Belum Bayar",
        dueDate: dueDate.toISOString(),
        paidAt: null,
      };
      Database.saveInstallment(installment);
    }

    // Kirim notifikasi ke siswa
    Database.saveNotification({
      id: `notif-loan-${Date.now()}`,
      userId: user.id,
      title: "Pengajuan Pinjaman Dikirim",
      message: `Pengajuan pinjaman ${formatRupiah(loanAmount)} untuk "${purpose}" sedang diproses. Estimasi 1-2 hari kerja.`,
      type: "system",
      read: false,
      createdAt: new Date().toISOString(),
    });

    setStep("submitted");
  };

  // Status badge helper
  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
      "Disetujui": { bg: "#F6FFED", color: "#52C41A", icon: <CheckCircle size={14} color="#52C41A" /> },
      "Menunggu":  { bg: "#FFF7E6", color: "#FD9A16", icon: <Clock size={14} color="#FD9A16" /> },
      "Ditolak":   { bg: "#FFF2F0", color: "#F95654", icon: <XCircle size={14} color="#F95654" /> },
    };
    const s = map[status] ?? map["Menunggu"];
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: s.bg }}>
        {s.icon}
        <span style={{ color: s.color, fontSize: "0.78rem", fontWeight: 600 }}>{status}</span>
      </div>
    );
  };

  // Sisa tagihan: cicilan yang belum dibayar
  const remainingAmount = installments
    .filter((i) => i.status === "Belum Bayar")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <button onClick={() => navigate("/student")} className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Pinjaman Mikro</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Dana cepat untuk kebutuhan pendidikan</p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[{ key: "active", label: "Pinjaman Aktif" }, { key: "apply", label: "Ajukan Pinjaman" }].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "active" | "apply")}
              className="px-4 py-1.5 rounded-full transition-all"
              style={{
                background: tab === t.key ? "white" : "rgba(255,255,255,0.2)",
                color: tab === t.key ? "#1677FF" : "white",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 py-5 overflow-y-auto pb-24">
        {tab === "active" && (
          <div>
            {activeLoan ? (
              <>
                {/* Active Loan Card */}
                <div className="bg-white rounded-3xl p-5 mb-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>ID Pinjaman</p>
                      <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem" }}>{activeLoan.id}</p>
                    </div>
                    {statusBadge(activeLoan.status)}
                  </div>

                  <div className="h-px mb-4" style={{ background: "#F0F0F0" }} />

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl p-3" style={{ background: "#EEF4FF" }}>
                      <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>Jumlah Pinjaman</p>
                      <p style={{ fontWeight: 800, color: "#1677FF", fontSize: "1rem" }}>{formatRupiah(activeLoan.amount)}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: "#FFF7E6" }}>
                      <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>Sisa Tagihan</p>
                      <p style={{ fontWeight: 800, color: "#FD9A16", fontSize: "1rem" }}>{formatRupiah(remainingAmount)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between mb-1">
                    <span style={{ color: "#8C8C8C", fontSize: "0.82rem" }}>Tujuan</span>
                    <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.82rem" }}>{activeLoan.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#8C8C8C", fontSize: "0.82rem" }}>Tanggal Pengajuan</span>
                    <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.82rem" }}>
                      {new Date(activeLoan.appliedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Installments */}
                <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Jadwal Cicilan</p>
                <div className="space-y-3">
                  {installments.length === 0 && (
                    <p style={{ color: "#8C8C8C", textAlign: "center", padding: "16px 0" }}>
                      Jadwal cicilan akan tersedia setelah pinjaman disetujui
                    </p>
                  )}
                  {installments.map((inst, i) => (
                    <div key={inst.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: inst.status === "Lunas" ? "#F6FFED" : "#EEF4FF" }}>
                          {inst.status === "Lunas"
                            ? <CheckCircle size={18} color="#52C41A" />
                            : <Clock size={18} color="#1677FF" />}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "#242424", fontSize: "0.88rem" }}>{inst.month}</p>
                          <p style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>{formatRupiah(inst.amount)}</p>
                        </div>
                      </div>
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: inst.status === "Lunas" ? "#F6FFED" : "#FFF7E6",
                            color: inst.status === "Lunas" ? "#52C41A" : "#FD9A16",
                          }}>
                          {inst.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Tidak ada pinjaman aktif */
              <div className="flex flex-col items-center py-16">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "#EEF4FF" }}>
                  <AlertCircle size={40} color="#1677FF" />
                </div>
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "1.1rem", marginBottom: "8px" }}>
                  Belum Ada Pinjaman Aktif
                </p>
                <p style={{ color: "#8C8C8C", textAlign: "center", fontSize: "0.88rem", marginBottom: "24px" }}>
                  Kamu belum memiliki pinjaman aktif. Ajukan pinjaman mikro untuk kebutuhan pendidikanmu.
                </p>
                <button
                  onClick={() => setTab("apply")}
                  className="px-6 py-3 rounded-2xl text-white"
                  style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700 }}>
                  Ajukan Sekarang
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "apply" && (
          <div>
            {step === "submitted" ? (
              <div className="flex flex-col items-center py-12">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "#FFF7E6" }}>
                  <Clock size={48} color="#FD9A16" />
                </div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#242424", textAlign: "center", marginBottom: "8px" }}>
                  Pengajuan Terkirim!
                </h2>
                <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "24px", fontSize: "0.9rem" }}>
                  Pengajuan pinjaman kamu sedang ditinjau oleh tim EDUFIN. Biasanya diproses dalam 1-2 hari kerja.
                </p>
                <div className="w-full rounded-2xl p-4 mb-6" style={{ background: "#FFF7E6", border: "1px solid #FFD591" }}>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Jumlah</span>
                    <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.85rem" }}>{formatRupiah(parseInt(amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Tujuan</span>
                    <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Cicilan</span>
                    <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{period} bulan</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/student")}
                  className="w-full py-4 rounded-2xl text-white"
                  style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700 }}>
                  Kembali ke Beranda
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Info Card */}
                <div className="rounded-2xl p-4 flex gap-2" style={{ background: "#EEF4FF" }}>
                  <Lightbulb size={18} color="#1677FF" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p style={{ fontWeight: 700, color: "#1677FF", fontSize: "0.9rem", marginBottom: "4px" }}>
                      Tentang Pinjaman Mikro EDUFIN
                    </p>
                    <p style={{ color: "#595959", fontSize: "0.82rem", lineHeight: "1.5" }}>
                      Pinjaman tanpa bunga untuk kebutuhan pendidikan. Maksimal Rp 3.000.000 dengan cicilan 3-12 bulan.
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#242424", display: "block", marginBottom: "8px" }}>
                    Jumlah Pinjaman
                  </label>
                  <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm" style={{ border: "1.5px solid", borderColor: amount ? "#1677FF" : "transparent" }}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#8C8C8C", fontWeight: 600 }}>Rp</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 bg-transparent outline-none"
                        style={{ fontSize: "1rem", color: "#242424" }}
                        max={3000000}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[500000, 1000000, 1500000, 2000000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setAmount(String(v))}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: amount === String(v) ? "#1677FF" : "#F5F7FA", color: amount === String(v) ? "white" : "#595959" }}>
                        {v / 1000}rb
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#242424", display: "block", marginBottom: "8px" }}>
                    Tujuan Penggunaan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LOAN_PURPOSES.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPurpose(p)}
                        className="py-2.5 px-3 rounded-xl text-left transition-all"
                        style={{
                          background: purpose === p ? "#EEF4FF" : "white",
                          border: "1.5px solid",
                          borderColor: purpose === p ? "#1677FF" : "#F0F0F0",
                          color: purpose === p ? "#1677FF" : "#595959",
                          fontSize: "0.8rem",
                          fontWeight: purpose === p ? 600 : 400,
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period */}
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#242424", display: "block", marginBottom: "8px" }}>
                    Periode Cicilan
                  </label>
                  <div className="flex gap-2">
                    {["3", "6", "9", "12"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className="flex-1 py-3 rounded-xl font-semibold transition-all"
                        style={{
                          background: period === p ? "#1677FF" : "white",
                          color: period === p ? "white" : "#595959",
                          border: "1.5px solid",
                          borderColor: period === p ? "#1677FF" : "#F0F0F0",
                        }}>
                        {p} bln
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview cicilan */}
                {amount && parseInt(amount) > 0 && (
                  <div className="rounded-2xl p-4" style={{ background: "#F6FFED", border: "1px solid #B7EB8F" }}>
                    <p style={{ fontWeight: 700, color: "#52C41A", fontSize: "0.85rem", marginBottom: "4px" }}>
                      Estimasi Cicilan per Bulan
                    </p>
                    <p style={{ fontWeight: 800, color: "#242424", fontSize: "1.2rem" }}>
                      {formatRupiah(Math.ceil(parseInt(amount) / parseInt(period)))}
                    </p>
                    <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>
                      {period} cicilan · tanpa bunga
                    </p>
                  </div>
                )}

                {/* Upload */}
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#242424", display: "block", marginBottom: "8px" }}>
                    Dokumen Pendukung
                  </label>
                  <div className="rounded-2xl p-5 flex flex-col items-center justify-center"
                    style={{ border: "2px dashed #D9D9D9", background: "#FAFAFA" }}>
                    <Upload size={28} color="#BFBFBF" />
                    <p style={{ color: "#8C8C8C", fontSize: "0.85rem", marginTop: "8px", textAlign: "center" }}>
                      Unggah kartu pelajar atau tagihan sekolah
                    </p>
                    <button className="mt-3 px-4 py-2 rounded-xl"
                      style={{ background: "#EEF4FF", color: "#1677FF", fontSize: "0.82rem", fontWeight: 600 }}>
                      Pilih File
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!amount || !purpose}
                  className="w-full py-4 rounded-2xl text-white disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}>
                  Ajukan Pinjaman
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
