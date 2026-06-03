import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, Download, ChevronRight, Building2, Smartphone, Store, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Database, Bill } from "../../data/database";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Midtrans Service ────────────────────────────────────────────────────────────────

// Declare Midtrans snap globally (loaded via CDN in index.html)
declare global {
  interface Window {
    snap?: {
      pay: (
        snapToken: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY as string;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/** Load Midtrans Snap.js script dynamically */
function loadMidtransSnap(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) { resolve(); return; }
    const scriptId = "midtrans-snap-js";
    if (document.getElementById(scriptId)) { resolve(); return; }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY || "");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap"));
    document.head.appendChild(script);
  });
}

async function createMidtransTransaction(
  billIds: number[],
  amount: number,
  customerName: string,
  customerEmail: string
): Promise<{ snapToken: string; orderId: string }> {
  const orderId = `BILL-${billIds.join("-")}-${Date.now()}`;
  // Di lingkungan produksi (Vercel), kita cukup memanggil endpoint /api
  // yang akan dilayani oleh Vercel Serverless Functions.
  const serverBase = "/api/midtrans-create-transaction";

  if (!serverBase) throw new Error("Server URL tidak tersedia.");

  const response = await fetch(serverBase, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ orderId, amount, customerName, customerEmail, billId: billIds[0] }),
  });

  const data = await response.json();
  if (!response.ok || !data.snapToken) {
    throw new Error(data.message || "Gagal membuat transaksi.");
  }
  return { snapToken: data.snapToken, orderId };
}

const PAYMENT_METHODS = [
  { id: "bca", label: "Transfer Bank BCA", Icon: Building2, note: "No. Rek: 1234-5678-9012" },
  { id: "bni", label: "Virtual Account BNI", Icon: Building2, note: "VA otomatis dikirim via notifikasi" },
  { id: "qris", label: "QRIS (GoPay / OVO / DANA)", Icon: Smartphone, note: "Scan QR di halaman berikutnya" },
  { id: "indomaret", label: "Indomaret / Alfamart", Icon: Store, note: "Kode bayar dikirim via SMS" },
];

type CicilanOption = "penuh" | "2x" | "3x";
type Step = "list" | "checkout" | "confirm" | "success";

export function PaySPP() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("list");
  const [cicilanOption, setCicilanOption] = useState<CicilanOption>("penuh");
  const [payMethod, setPayMethod] = useState("");
  const [midtransLoading, setMidtransLoading] = useState(false);
  const [midtransError, setMidtransError] = useState("");

  // Load bills dari database berdasarkan user yang login
  useEffect(() => {
    if (!user) return;
    const student = Database.getStudentByUserId(user.id);
    if (!student) return;
    const studentBills = Database.getBillsByStudentId(student.id);
    // Urutkan: Tertunggak dulu, lalu berdasarkan tahun+bulan terbaru
    const MONTH_ORDER: Record<string, number> = {
      Januari: 1, Februari: 2, Maret: 3, April: 4, Mei: 5, Juni: 6,
      Juli: 7, Agustus: 8, September: 9, Oktober: 10, November: 11, Desember: 12,
    };
    const sorted = [...studentBills].sort((a, b) => {
      if (a.status === "Tertunggak" && b.status !== "Tertunggak") return -1;
      if (b.status === "Tertunggak" && a.status !== "Tertunggak") return 1;
      if (b.year !== a.year) return b.year - a.year;
      return (MONTH_ORDER[b.month] ?? 0) - (MONTH_ORDER[a.month] ?? 0);
    });
    setBills(sorted);
    // Auto-select tagihan Tertunggak pertama
    const firstUnpaid = sorted.find((b) => b.status === "Tertunggak");
    if (firstUnpaid) setSelected([firstUnpaid.id]);
  }, [user]);

  // ─── Midtrans Payment Handler ───────────────────────────────────────────────
  const handleMidtransPayment = async () => {
    setMidtransLoading(true);
    setMidtransError("");
    try {
      // 1. Load Snap.js dynamically
      await loadMidtransSnap();

      // 2. Get snap token from backend
      const { snapToken } = await createMidtransTransaction(
        selectedBills.map((b) => b.id),
        firstPayment,
        user?.name || "Siswa",
        user?.email || "siswa@edufin.id"
      );

      // 3. Open Midtrans Snap popup
      if (!window.snap) {
        throw new Error("Midtrans Snap tidak tersedia. Periksa koneksi internet.");
      }

      window.snap.pay(snapToken, {
        onSuccess: (_result) => {
          setMidtransLoading(false);
          setStep("success"); // show receipt
        },
        onPending: (_result) => {
          setMidtransLoading(false);
          setMidtransError("Pembayaran pending — selesaikan di aplikasi bank/e-wallet kamu.");
        },
        onError: (_result) => {
          setMidtransLoading(false);
          setMidtransError("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          setMidtransLoading(false);
        },
      });
    } catch (err: any) {
      setMidtransLoading(false);
      setMidtransError(err.message || "Gagal memulai pembayaran. Coba lagi.");
    }
  };

  const unpaid = bills.filter((b) => b.status === "Tertunggak");
  const selectedBills = bills.filter((b) => selected.includes(b.id));
  const subtotal = selectedBills.reduce((acc, b) => acc + b.items.reduce((s, i) => s + i.amount, 0), 0);

  // Hitung nominal bayar sekarang berdasarkan opsi cicilan
  const firstPayment =
    cicilanOption === "penuh"
      ? subtotal
      : cicilanOption === "2x"
      ? Math.ceil(subtotal / 2)
      : Math.ceil(subtotal / 3);

  const now = new Date();
  const receiptNo = "EDU" + now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + "0053";

  const toggleSelect = (id: string) => {
    if (bills.find((b) => b.id === id)?.status === "Lunas") return;
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === payMethod);

  // ─── SUCCESS ───────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: "#F6FFED" }}>
            <CheckCircle size={52} color="#52C41A" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#242424", marginBottom: "8px", textAlign: "center" }}>
            {cicilanOption === "penuh" ? "Pembayaran Berhasil!" : "Cicilan Pertama Berhasil!"}
          </h2>
          <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "32px", fontSize: "0.9rem" }}>
            {cicilanOption === "penuh"
              ? "SPP kamu telah berhasil dibayarkan secara penuh"
              : `Cicilan 1/${cicilanOption === "2x" ? "2" : "3"} berhasil. Tagihan berikutnya akan muncul otomatis.`}
          </p>

          {/* E-Receipt */}
          <div className="w-full rounded-3xl overflow-hidden shadow-md" style={{ border: "1px solid #F0F0F0" }}>
            <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>No. Kwitansi</p>
              <p style={{ color: "white", fontWeight: 700 }}>{receiptNo}</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Nama Siswa</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>NISN</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{user?.nisn}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Bulan Bayar</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>
                  {selectedBills.map((b) => b.month).join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Jenis Bayar</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>
                  {cicilanOption === "penuh" ? "Penuh" : `Cicilan ${cicilanOption} (Gratis)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Metode</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>
                  {selectedMethod?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Waktu</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>
                  {now.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="h-px" style={{ background: "#F0F0F0" }} />
              <div className="flex justify-between">
                <span style={{ fontWeight: 700, color: "#242424" }}>
                  {cicilanOption === "penuh" ? "Total Dibayar" : "Bayar Sekarang"}
                </span>
                <span style={{ fontWeight: 800, color: "#1677FF" }}>{formatRupiah(firstPayment)}</span>
              </div>
              {cicilanOption !== "penuh" && (
                <div className="flex justify-between">
                  <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Total Tagihan</span>
                  <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{formatRupiah(subtotal)}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full mt-4 py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: "#F5F7FA", color: "#1677FF", fontWeight: 600 }}
          >
            <Download size={18} />
            Unduh E-Receipt (PDF)
          </button>
          <button
            onClick={() => navigate("/student")}
            className="w-full mt-3 py-3.5 rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700 }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // ─── CONFIRM ───────────────────────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="px-6 pt-12 pb-4">
          <button
            onClick={() => setStep("checkout")}
            className="w-10 h-10 rounded-full flex items-center justify-center mb-6"
            style={{ background: "#F5F7FA" }}
          >
            <ArrowLeft size={20} color="#242424" />
          </button>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#242424" }}>Konfirmasi Pembayaran</h1>
        </div>

        <div className="flex-1 px-6 overflow-y-auto space-y-4 pb-52">
          {/* Rincian tagihan */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
            {selectedBills.map((b) => (
              <div key={b.id}>
                <div className="px-4 py-3" style={{ background: "#EEF4FF" }}>
                  <p style={{ fontWeight: 700, color: "#1677FF", fontSize: "0.9rem" }}>{b.month}</p>
                </div>
                {b.items.map((item) => (
                  <div key={item.name} className="flex justify-between px-4 py-2.5" style={{ borderBottom: "1px solid #F5F7FA" }}>
                    <span style={{ color: "#595959", fontSize: "0.85rem" }}>{item.name}</span>
                    <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{formatRupiah(item.amount)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Opsi cicilan & metode */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "#F5F7FA" }}>
            <div className="flex justify-between">
              <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Jenis Pembayaran</span>
              <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>
                {cicilanOption === "penuh" ? "Penuh" : `Cicilan ${cicilanOption} (Gratis)`}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Metode</span>
              <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{selectedMethod?.label}</span>
            </div>
            {cicilanOption !== "penuh" && (
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Total Tagihan</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{formatRupiah(subtotal)}</span>
              </div>
            )}
          </div>

          {/* Info cicilan */}
          {cicilanOption !== "penuh" && (
            <div className="rounded-2xl p-4" style={{ background: "#FFF7E6", border: "1px solid #FFD591" }}>
              <p style={{ fontWeight: 700, color: "#FD9A16", fontSize: "0.85rem", marginBottom: "4px" }}>
                Info Cicilan {cicilanOption}
              </p>
              <p style={{ color: "#595959", fontSize: "0.82rem", lineHeight: "1.5" }}>
                {cicilanOption === "2x"
                  ? `Bayar ${formatRupiah(Math.ceil(subtotal / 2))} sekarang, sisanya ${formatRupiah(subtotal - Math.ceil(subtotal / 2))} otomatis tagih tanggal 15.`
                  : `Bayar ${formatRupiah(Math.ceil(subtotal / 3))} sekarang. Sisanya akan tagih secara otomatis tanggal 10 & 20.`}
                {" "}Cicilan gratis tanpa biaya tambahan.
              </p>
            </div>
          )}
        </div>

        {/* Sticky Bottom */}
        <div className="fixed bottom-[72px] left-1/2 w-full max-w-[430px] px-6 py-4"
          style={{ transform: "translateX(-50%)", background: "white", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
          <div className="flex justify-between mb-1">
            <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>
              {cicilanOption === "penuh" ? "Total Pembayaran" : "Bayar Sekarang"}
            </span>
            <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.1rem" }}>{formatRupiah(firstPayment)}</span>
          </div>
          {cicilanOption !== "penuh" && (
            <p style={{ color: "#BFBFBF", fontSize: "0.75rem", marginBottom: "8px" }}>
              dari total {formatRupiah(subtotal)}
            </p>
          )}
          {/* Midtrans Error */}
          {midtransError && (
            <div className="mb-3 px-4 py-3 rounded-2xl"
              style={{ background: "#FFF2EE", border: "1px solid #FFBDAD" }}>
              <p style={{ color: "#EA4E0D", fontSize: "0.82rem" }}>⚠️ {midtransError}</p>
            </div>
          )}
          <button
            onClick={handleMidtransPayment}
            disabled={midtransLoading}
            className="w-full py-4 rounded-2xl text-white disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
          >
            {midtransLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Membuka Pembayaran...</>
            ) : (
              "Bayar via Midtrans"
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── CHECKOUT ──────────────────────────────────────────────────────────────
  if (step === "checkout") {
    const CICILAN_OPTIONS: { key: CicilanOption; label: string; sub: string; badge?: string }[] = [
      {
        key: "penuh",
        label: "Bayar Penuh",
        sub: `${formatRupiah(subtotal)} (1x bayar)`,
      },
      {
        key: "2x",
        label: "Cicilan 2x",
        sub: `${formatRupiah(Math.ceil(subtotal / 2))} × 2 kali · tgl 1 & 15`,
        badge: "Gratis",
      },
      {
        key: "3x",
        label: "Cicilan 3x",
        sub: `${formatRupiah(Math.ceil(subtotal / 3))} × 3 kali · tgl 1, 10 & 20`,
        badge: "Gratis",
      },
    ];

    return (
      <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
        <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
          <button
            onClick={() => setStep("list")}
            className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <ArrowLeft size={20} color="white" />
          </button>
          <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Pilih Cara Bayar</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
            Tagihan: {formatRupiah(subtotal)}
          </p>
        </div>

        <div className="flex-1 px-6 py-5 overflow-y-auto pb-52 space-y-5">
          {/* Opsi Cicilan */}
          <div>
            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Jenis Pembayaran</p>
            <div className="space-y-3">
              {CICILAN_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setCicilanOption(opt.key)}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white shadow-sm transition-all active:scale-[0.98]"
                  style={{
                    border: "2px solid",
                    borderColor: cicilanOption === opt.key ? "#1677FF" : "transparent",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: cicilanOption === opt.key ? "#1677FF" : "#D9D9D9",
                      background: cicilanOption === opt.key ? "#1677FF" : "transparent",
                    }}
                  >
                    {cicilanOption === opt.key && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem" }}>{opt.label}</p>
                      {opt.badge && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: "#F6FFED", color: "#52C41A" }}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ color: "#8C8C8C", fontSize: "0.8rem" }}>{opt.sub}</p>
                  </div>
                  {cicilanOption === opt.key && <ChevronRight size={16} color="#1677FF" />}
                </button>
              ))}
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Metode Pembayaran</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => {
                const MethodIcon = m.Icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white shadow-sm transition-all active:scale-[0.98]"
                    style={{
                      border: "1.5px solid",
                      borderColor: payMethod === m.id ? "#1677FF" : "transparent",
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: payMethod === m.id ? "#EEF4FF" : "#F5F7FA" }}>
                      <MethodIcon size={20} color={payMethod === m.id ? "#1677FF" : "#595959"} />
                    </div>
                    <div className="flex-1 text-left">
                      <p style={{ fontWeight: 600, color: "#242424", fontSize: "0.88rem" }}>{m.label}</p>
                      <p style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>{m.note}</p>
                    </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: payMethod === m.id ? "#1677FF" : "#D9D9D9" }}
                  >
                    {payMethod === m.id && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1677FF" }} />
                    )}
                  </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="fixed bottom-[72px] left-1/2 w-full max-w-[430px] px-6 py-4"
          style={{ transform: "translateX(-50%)", background: "white", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}
        >
          <div className="flex justify-between mb-3">
            <span style={{ color: "#8C8C8C", fontSize: "0.9rem" }}>
              {cicilanOption === "penuh" ? "Total Bayar" : "Bayar Sekarang"}
            </span>
            <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.05rem" }}>
              {formatRupiah(firstPayment)}
            </span>
          </div>
          <button
            onClick={() => setStep("confirm")}
            disabled={!payMethod}
            className="w-full py-4 rounded-2xl text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
          >
            Lanjutkan
          </button>
        </div>
      </div>
    );
  }

  // ─── LIST (default) ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <button
          onClick={() => navigate("/student")}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <ArrowLeft size={20} color="white" />
        </button>
        <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Pembayaran SPP</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{user?.school}</p>
      </div>

      <div className="flex-1 px-6 py-5 overflow-y-auto pb-52">
        {/* Warning Banner */}
        {unpaid.length > 0 && (
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-2xl mb-5"
            style={{ background: "#FFF2F0", border: "1px solid #FFCCC7" }}
          >
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <div>
              <p style={{ color: "#CF1322", fontWeight: 700, fontSize: "0.85rem" }}>Tagihan Tertunggak</p>
              <p style={{ color: "#CF1322", fontSize: "0.8rem" }}>
                {unpaid.length} tagihan belum dibayar ·{" "}
                Total {formatRupiah(unpaid.reduce((s, b) => s + b.items.reduce((a, i) => a + i.amount, 0), 0))}
              </p>
            </div>
          </div>
        )}

        {/* Bill List */}
        <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Pilih Tagihan</p>
        <div className="space-y-3">
          {bills.length === 0 && (
            <p style={{ color: "#8C8C8C", textAlign: "center", padding: "24px 0" }}>Belum ada tagihan</p>
          )}
          {bills.map((bill) => {
            const subtotalBill = bill.items.reduce((a, i) => a + i.amount, 0);
            const isSelected = selected.includes(bill.id);
            const isPaid = bill.status === "Lunas";
            const dueDateFormatted = new Date(bill.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
            return (
              <div
                key={bill.id}
                onClick={() => toggleSelect(bill.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all"
                style={{
                  border: "2px solid",
                  borderColor: isSelected && !isPaid ? "#1677FF" : "transparent",
                  opacity: isPaid ? 0.7 : 1,
                  cursor: isPaid ? "default" : "pointer",
                }}
              >
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ background: isPaid ? "#F6FFED" : "#FFF2F0" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: isPaid ? "#52C41A" : isSelected ? "#1677FF" : "#D9D9D9",
                        background: isPaid ? "#52C41A" : isSelected ? "#1677FF" : "transparent",
                      }}
                    >
                      {(isPaid || isSelected) && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem" }}>{bill.month}</p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: isPaid ? "rgba(82,196,26,0.15)" : "rgba(249,86,84,0.15)",
                      color: isPaid ? "#52C41A" : "#F95654",
                    }}
                  >
                    {bill.status}
                  </span>
                </div>
                <div className="px-4 py-3">
                  {bill.items.map((item) => (
                    <div key={item.name} className="flex justify-between py-1">
                      <span style={{ color: "#8C8C8C", fontSize: "0.82rem" }}>{item.name}</span>
                      <span style={{ color: "#595959", fontSize: "0.82rem" }}>{formatRupiah(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 mt-1" style={{ borderTop: "1px solid #F0F0F0" }}>
                    <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>Subtotal</span>
                    <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>{formatRupiah(subtotalBill)}</span>
                  </div>
                  <p style={{ color: "#BFBFBF", fontSize: "0.75rem", marginTop: "2px" }}>
                    Jatuh tempo: {dueDateFormatted}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom */}
      {selected.length > 0 && (
        <div
          className="fixed bottom-[72px] left-1/2 w-full max-w-[430px] px-6 py-4"
          style={{ transform: "translateX(-50%)", background: "white", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}
        >
          <div className="flex justify-between mb-3">
            <span style={{ color: "#8C8C8C", fontSize: "0.9rem" }}>Total {selected.length} tagihan</span>
            <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.05rem" }}>{formatRupiah(subtotal)}</span>
          </div>
          <button
            onClick={() => setStep("checkout")}
            className="w-full py-4 rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
          >
            Pilih Cara Bayar →
          </button>
        </div>
      )}
    </div>
  );
}