import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, Download, ChevronRight, Building2, Smartphone, Store, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Database, Bill } from "../../data/database";
import { supabase } from "../../lib/supabase";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Xendit Service ───────────────────────────────────────────────────────────
// Xendit menggunakan model redirect (bukan popup JS seperti Midtrans Snap).
// Alur: Buat invoice → User di-redirect ke halaman Xendit → Bayar →
// Xendit redirect kembali ke success/failed URL yang kita tentukan.

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * Buat Xendit Invoice melalui Simulasi API.
 * Di dunia nyata, ini akan memanggil backend/Edge Function yang meneruskan ke Xendit.
 */
async function createXenditInvoice(
  billIds: string[],
  amount: number,
  customerName: string,
  customerEmail: string,
  description?: string
): Promise<{ invoiceId: string; invoiceUrl: string; externalId: string }> {
  const shortRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
  // Gunakan billId pertama sebagai referensi webhook
  const externalId = `BILL-${billIds[0]}`;

  // SIMULASI WEBHOOK: Kita memanggil Edge Function payment-webhook secara manual
  // seolah-olah Xendit yang memanggilnya setelah user bayar.
  // Catatan: Karena kita menjalankan front-end secara lokal tanpa serve Edge Function,
  // kita cukup melakukan mock update langsung jika invoke gagal.
  try {
    // Jalankan secara asynchronous di background
    supabase.functions.invoke("payment-webhook", {
      body: { external_id: externalId, status: "PAID", payment_method: "Simulasi Xendit" }
    }).catch(console.error);
  } catch (e) {
    console.error(e);
  }

  // Kembalikan URL redirect yang akan otomatis memicu halaman sukses
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        invoiceId: `inv_${shortRandom}`,
        invoiceUrl: `/student/spp?status=success`, // Langsung kembali sukses
        externalId: externalId
      });
    }, 1500);
  });
}

const PAYMENT_METHODS = [
  { id: "bca", label: "Transfer Bank BCA", Icon: Building2, note: "No. Rek: 1234-5678-9012" },
  { id: "bni", label: "Virtual Account BNI", Icon: Building2, note: "VA otomatis dikirim via notifikasi" },
  { id: "qris", label: "QRIS (GoPay / OVO / DANA)", Icon: Smartphone, note: "Scan QR di halaman berikutnya" },
  { id: "indomaret", label: "Indomaret / Alfamart", Icon: Store, note: "Kode bayar dikirim via SMS" },
];

type CicilanOption = "penuh" | "2x" | "3x";
type Step = "list" | "checkout" | "confirm" | "success" | "failed";

// Data order yang disimpan saat redirect ke Xendit
type PendingOrder = {
  externalId: string;
  amount: number;
  bills: { id: string; month: string; year: number }[];
  studentId: string;
  paymentMethod: string;
  timestamp: number;
};

export function PaySPP() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("list");
  const [cicilanOption, setCicilanOption] = useState<CicilanOption>("penuh");
  const [payMethod, setPayMethod] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [loadingBills, setLoadingBills] = useState(true);
  const [studentId, setStudentId] = useState<string>("");
  const [sppAmount, setSppAmount] = useState<number>(750000);
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);

  // ─── Handle redirect balik dari Xendit ──────────────────────────────────────
  // Xendit me-redirect kembali ke: /student/spp?status=success atau ?status=failed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const xenditStatus = params.get("status");

    if (xenditStatus === "success" || xenditStatus === "failed") {
      // Bersihkan query param dari URL agar tidak loop jika refresh
      window.history.replaceState({}, document.title, window.location.pathname);

      // Ambil data order dari sessionStorage
      const savedOrder = sessionStorage.getItem("xendit_pending_order");
      if (savedOrder) {
        try {
          const order: PendingOrder = JSON.parse(savedOrder);
          setPendingOrder(order);
          sessionStorage.removeItem("xendit_pending_order");
        } catch (_) {}
      }

      // Langsung set step ke success atau failed
      setStep(xenditStatus === "success" ? "success" : "failed");
    }
  }, []);

  // ── Load Bills dengan fallback berlapis ──
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoadingBills(true);

      const MONTH_ORDER: Record<string, number> = {
        Januari: 1, Februari: 2, Maret: 3, April: 4, Mei: 5, Juni: 6,
        Juli: 7, Agustus: 8, September: 9, Oktober: 10, November: 11, Desember: 12,
      };
      const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni",
                      "Juli","Agustus","September","Oktober","November","Desember"];

      try {
        // ── LAPIS 1: Cari student di Supabase by user_id atau email atau nisn ──
        
        // Cari student by user_id
        let { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        // Fallback: cari by NISN
        if (!studentData && user.nisn) {
          const res = await supabase
            .from('students')
            .select('*')
            .eq('nisn', user.nisn)
            .maybeSingle();
          studentData = res.data;
        }

        // Fallback: cari by name
        if (!studentData && user.name) {
          const res = await supabase
            .from('students')
            .select('*')
            .ilike('name', user.name)
            .maybeSingle();
          studentData = res.data;
        }

        if (studentData) {
          // Simpan studentId & sppAmount untuk pembayaran
          setStudentId(studentData.id);
          const amount = studentData.spp_amount || 750000;
          setSppAmount(amount);

          // Ambil payments dari Supabase
          const { data: paymentsData } = await supabase
            .from('payments')
            .select('*')
            .eq('student_id', studentData.id)
            .order('created_at', { ascending: false });

          const payments = paymentsData || [];

          if (payments.length > 0) {
            // Ada data payments di Supabase
            const paidMonths = new Set(
              payments
                .filter((p: any) => p.status === 'completed' || p.status === 'success')
                .map((p: any) => `${p.month_paid}-${p.year_paid}`)
            );

            // Buat daftar tagihan 6 bulan terakhir
            const now = new Date();
            const uiBills: any[] = [];
            for (let i = 5; i >= 0; i--) {
              const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const monthName = MONTHS[d.getMonth()];
              const year = d.getFullYear();
              const isPaid = paidMonths.has(`${monthName}-${year}`);
              const dueDate = new Date(year, d.getMonth() + 1, 10).toISOString();
              uiBills.push({
                id: `bill-${year}-${d.getMonth()}`,
                studentId: studentData.id,
                month: monthName,
                year,
                dueDate,
                total: amount,
                status: isPaid ? "Lunas" : "Tertunggak",
                items: [{ name: "SPP Bulanan", amount }],
              });
            }
            setBills(uiBills);
            const firstUnpaid = uiBills.find(b => b.status === "Tertunggak");
            if (firstUnpaid) setSelected([firstUnpaid.id]);
            setLoadingBills(false);
            return;
          }
        }

        // ── LAPIS 2: Fallback ke localStorage ──
        const localStudents = Database.getStudents();
        const localStudent = localStudents.find(
          s => s.userId === user.id || s.nisn === user.nisn || s.name === user.name
        );

        if (localStudent) {
          setStudentId(localStudent.id);
          const amount = localStudent.sppAmount || 750000;
          setSppAmount(amount);
          const localBills = Database.getSPPBills().filter(b => b.studentId === localStudent.id);
          if (localBills.length > 0) {
            setBills(localBills);
            const firstUnpaid = localBills.find(b => b.status === "Tertunggak");
            if (firstUnpaid) setSelected([firstUnpaid.id]);
            setLoadingBills(false);
            return;
          }
        }

        // ── LAPIS 3: Generate tagihan default (untuk akun demo / data baru) ──
        const defaultAmount = sppAmount || 750000;
        const now = new Date();
        const generatedBills: any[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = MONTHS[d.getMonth()];
          const year = d.getFullYear();
          // Bulan lalu dan sebelumnya dianggap tertunggak, bulan sebelumnya lagi lunas
          const isPaid = i > 2;
          const dueDate = new Date(year, d.getMonth() + 1, 10).toISOString();
          generatedBills.push({
            id: `demo-bill-${year}-${d.getMonth()}`,
            studentId: localStudent?.id || `student-${user.id}`,
            month: monthName,
            year,
            dueDate,
            total: defaultAmount,
            status: isPaid ? "Lunas" : "Tertunggak",
            items: [{ name: "SPP Bulanan", amount: defaultAmount }],
          });
        }
        setBills(generatedBills);
        const firstUnpaid = generatedBills.find(b => b.status === "Tertunggak");
        if (firstUnpaid) setSelected([firstUnpaid.id]);

      } catch (err) {
        console.error('[PaySPP] Error loading data:', err);
        // Tetap generate bills agar halaman tidak kosong
        const defaultAmount = 750000;
        const now = new Date();
        const MONTHS_LOCAL = ["Januari","Februari","Maret","April","Mei","Juni",
                              "Juli","Agustus","September","Oktober","November","Desember"];
        const fallbackBills: any[] = [];
        for (let i = 2; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          fallbackBills.push({
            id: `fallback-${i}`,
            studentId: user.id,
            month: MONTHS_LOCAL[d.getMonth()],
            year: d.getFullYear(),
            dueDate: new Date(d.getFullYear(), d.getMonth() + 1, 10).toISOString(),
            total: defaultAmount,
            status: i === 0 ? "Tertunggak" : "Lunas",
            items: [{ name: "SPP Bulanan", amount: defaultAmount }],
          });
        }
        setBills(fallbackBills);
        const firstUnpaid = fallbackBills.find(b => b.status === "Tertunggak");
        if (firstUnpaid) setSelected([firstUnpaid.id]);
      } finally {
        setLoadingBills(false);
      }
    }
    loadData();
  }, [user]);

  // ─── Xendit Payment Handler ────────────────────────────────────────────────
  // Xendit menggunakan redirect: user diarahkan ke halaman Xendit untuk bayar,
  // lalu setelah selesai di-redirect kembali ke URL success/failed kita.
  const handleXenditPayment = async () => {
    setPaymentLoading(true);
    setPaymentError("");
    try {
      const billDescription = selectedBills
        .map((b) => `SPP ${b.month} ${b.year}`)
        .join(", ");

      const { invoiceUrl, externalId } = await createXenditInvoice(
        selectedBills.map((b) => b.id),
        firstPayment,
        user?.name || "Siswa",
        user?.email || "siswa@edufin.app",
        billDescription
      );

      // Simpan referensi sementara di sessionStorage
      // agar bisa ditampilkan di halaman sukses setelah redirect kembali
      sessionStorage.setItem('xendit_pending_order', JSON.stringify({
        externalId,
        amount: firstPayment,
        bills: selectedBills.map(b => ({ id: b.id, month: b.month, year: b.year })),
        studentId: studentId || user?.id,
        paymentMethod: selectedMethod?.label || 'Xendit',
        timestamp: Date.now(),
      }));

      // Redirect user ke halaman pembayaran Xendit
      // Di sana user bisa pilih QRIS, Virtual Account, GoPay, OVO, dll.
      window.location.href = invoiceUrl;
    } catch (err: any) {
      setPaymentLoading(false);
      setPaymentError(err.message || "Gagal memulai pembayaran. Coba lagi.");
    }
  };

  const unpaid = bills.filter((b) => b.status === "Tertunggak");
  const selectedBills = bills.filter((b) => selected.includes(b.id));
  const subtotal = selectedBills.reduce((acc, b) => acc + b.items.reduce((s, i) => s + i.amount, 0), 0);

  const firstPayment = subtotal;

  const now = new Date();
  const receiptNo = "EDU" + now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + "0053";

  const toggleSelect = (id: string) => {
    if (bills.find((b) => b.id === id)?.status === "Lunas") return;
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === payMethod);

  // ─── SUCCESS ───────────────────────────────────────────────────
  // Data diambil dari pendingOrder (sessionStorage) jika balik dari redirect Xendit,
  // atau dari state lokal jika flow normal (tanpa redirect).
  if (step === "success") {
    const orderBills = pendingOrder?.bills ?? selectedBills.map(b => ({ id: b.id, month: b.month, year: b.year }));
    const orderAmount = pendingOrder?.amount ?? firstPayment;
    const orderMethod = pendingOrder?.paymentMethod ?? selectedMethod?.label ?? "Xendit";
    const orderExternalId = pendingOrder?.externalId ?? receiptNo;
    const orderTime = pendingOrder ? new Date(pendingOrder.timestamp) : now;

    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{ background: "#F6FFED" }}>
            <CheckCircle size={52} color="#52C41A" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#242424", marginBottom: "8px", textAlign: "center" }}>
            Pembayaran Berhasil! 🎉
          </h2>
          <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "24px", fontSize: "0.9rem" }}>
            SPP kamu telah berhasil dibayarkan
          </p>

          {/* E-Receipt */}
          <div className="w-full rounded-3xl overflow-hidden shadow-md" style={{ border: "1px solid #F0F0F0" }}>
            <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>No. Transaksi</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem" }}>{orderExternalId}</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Nama Siswa</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>NISN</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{user?.nisn ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Bulan Dibayar</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>
                  {orderBills.map(b => b.month).join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Metode</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{orderMethod}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Waktu</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>
                  {orderTime.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="h-px" style={{ background: "#F0F0F0" }} />
              <div className="flex justify-between">
                <span style={{ fontWeight: 700, color: "#242424" }}>Total Dibayar</span>
                <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.05rem" }}>{formatRupiah(orderAmount)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full mt-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{ background: "#F5F7FA", color: "#1677FF", fontWeight: 600 }}
          >
            <Download size={18} />
            Unduh E-Receipt (PDF)
          </button>
          <button
            onClick={() => navigate("/student")}
            className="w-full mt-3 py-4 rounded-2xl text-white active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, boxShadow: "0 6px 20px rgba(22,119,255,0.3)" }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // ─── FAILED ──────────────────────────────────────────────────
  if (step === "failed") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{ background: "#FFF2EE" }}>
            <span style={{ fontSize: "3rem" }}>❌</span>
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#242424", marginBottom: "8px", textAlign: "center" }}>
            Pembayaran Gagal
          </h2>
          <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "8px", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Pembayaran dibatalkan atau gagal diproses oleh Xendit.
            Tagihan kamu belum berubah, tidak ada biaya yang dipotong.
          </p>

          {/* Info box */}
          <div className="w-full mt-4 px-4 py-4 rounded-2xl" style={{ background: "#FFF2EE", border: "1px solid #FFBDAD" }}>
            <p style={{ fontSize: "0.8rem", color: "#EA4E0D", lineHeight: 1.6 }}>
              💡 Jika saldo sudah terpotong tapi status belum berubah, tunggu beberapa menit atau hubungi{" "}
              <strong>support@edufin.id</strong> dengan menyertakan ID transaksi.
            </p>
            {pendingOrder && (
              <p style={{ fontSize: "0.75rem", color: "#EA4E0D", marginTop: "8px", fontWeight: 600 }}>
                ID Transaksi: {pendingOrder.externalId}
              </p>
            )}
          </div>

          <button
            onClick={() => setStep("list")}
            className="w-full mt-5 py-4 rounded-2xl text-white active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, boxShadow: "0 6px 20px rgba(22,119,255,0.3)" }}
          >
            Coba Bayar Lagi
          </button>
          <button
            onClick={() => navigate("/student")}
            className="w-full mt-3 py-3.5 rounded-2xl active:scale-95 transition-all"
            style={{ background: "#F5F7FA", color: "#595959", fontWeight: 600 }}
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

          {/* Ringkasan cicilan & metode */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "#F5F7FA" }}>
            <div className="flex justify-between">
              <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Jenis Pembayaran</span>
              <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>
                {cicilanOption === "penuh" ? "Bayar Penuh" : cicilanOption === "2x" ? "Cicilan 2x" : "Cicilan 3x"}
              </span>
            </div>
            {cicilanOption !== "penuh" && (
              <div className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Bayar Sekarang</span>
                <span style={{ fontWeight: 600, color: "#1677FF", fontSize: "0.85rem" }}>
                  {formatRupiah(cicilanOption === "2x" ? Math.ceil(subtotal / 2) : Math.ceil(subtotal / 3))}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Metode</span>
              <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{selectedMethod?.label}</span>
            </div>
          </div>
        </div>

        {/* ── Sticky Bottom ── */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "white",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
            padding: "16px 24px",
            zIndex: 40,
          }}
        >
          <div className="flex justify-between mb-1">
            <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Total Pembayaran</span>
            <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.1rem" }}>
              {formatRupiah(cicilanOption === "2x" ? Math.ceil(subtotal / 2) : cicilanOption === "3x" ? Math.ceil(subtotal / 3) : firstPayment)}
            </span>
          </div>
          {paymentError && (
            <div className="mb-3 px-4 py-3 rounded-2xl"
              style={{ background: "#FFF2EE", border: "1px solid #FFBDAD" }}>
              <p style={{ color: "#EA4E0D", fontSize: "0.82rem" }}>⚠️ {paymentError}</p>
            </div>
          )}
          <button
            onClick={handleXenditPayment}
            disabled={paymentLoading}
            className="w-full py-4 rounded-2xl text-white disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
          >
            {paymentLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Menyiapkan Pembayaran...</>
            ) : (
              "Bayar via Xendit"
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

        <div className="flex-1 px-6 py-5 overflow-y-auto space-y-5" style={{ paddingBottom: "180px" }}>

          {/* ── Opsi Cicilan ── */}
          <div>
            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Pilih Jenis Pembayaran</p>
            <div className="space-y-2">
              {CICILAN_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setCicilanOption(opt.key)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white shadow-sm transition-all active:scale-[0.98] text-left"
                  style={{
                    border: "2px solid",
                    borderColor: cicilanOption === opt.key ? "#1677FF" : "transparent",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: cicilanOption === opt.key ? "#1677FF" : "#D9D9D9" }}
                  >
                    {cicilanOption === opt.key && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1677FF" }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem" }}>{opt.label}</p>
                      {opt.badge && (
                        <span className="px-2 py-0.5 rounded-full" style={{ background: "#F6FFED", color: "#52C41A", fontSize: "0.65rem", fontWeight: 700 }}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ color: "#8C8C8C", fontSize: "0.78rem", marginTop: 2 }}>{opt.sub}</p>
                  </div>
                  {cicilanOption === opt.key && (
                    <CheckCircle size={18} color="#1677FF" className="flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Metode Pembayaran ── */}
          <div>
            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Metode Pembayaran</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => {
                const MethodIcon = m.Icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white shadow-sm transition-all active:scale-[0.98] text-left"
                    style={{
                      border: "1.5px solid",
                      borderColor: payMethod === m.id ? "#1677FF" : "transparent",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: payMethod === m.id ? "#EEF4FF" : "#F5F7FA" }}
                    >
                      <MethodIcon size={20} color={payMethod === m.id ? "#1677FF" : "#595959"} />
                    </div>
                    <div className="flex-1">
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

        {/* ── Sticky Bottom ── */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "white",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
            padding: "16px 24px",
            zIndex: 40,
          }}
        >
          <div className="flex justify-between mb-3">
            <span style={{ color: "#8C8C8C", fontSize: "0.9rem" }}>Total Bayar</span>
            <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.05rem" }}>
              {formatRupiah(cicilanOption === "2x" ? Math.ceil(subtotal / 2) : cicilanOption === "3x" ? Math.ceil(subtotal / 3) : subtotal)}
              {cicilanOption !== "penuh" && <span style={{ fontWeight: 400, fontSize: "0.75rem", color: "#8C8C8C" }}> /cicilan</span>}
            </span>
          </div>
          <button
            onClick={() => setStep("confirm")}
            disabled={!payMethod}
            className="w-full py-4 rounded-2xl text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
          >
            Lanjutkan →
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
          {loadingBills && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div className="w-8 h-8 rounded-full mx-auto mb-3"
                style={{ border: "3px solid #EEF4FF", borderTopColor: "#1677FF", animation: "spin 0.8s linear infinite" }} />
              <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat tagihan...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          {!loadingBills && bills.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ fontSize: "2rem", marginBottom: "8px" }}>📋</p>
              <p style={{ color: "#242424", fontWeight: 700, marginBottom: "4px" }}>Tidak ada tagihan</p>
              <p style={{ color: "#8C8C8C", fontSize: "0.82rem" }}>Semua tagihan SPP Anda sudah lunas 🎉</p>
            </div>
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

      {/* ── Sticky Bottom ── */}
      {selected.length > 0 && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "white",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
            padding: "16px 24px",
            zIndex: 40,
          }}
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
