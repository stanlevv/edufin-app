import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Bell, ChevronRight, TrendingUp, CreditCard,
  CheckCircle, Clock, Zap, BookOpen, Heart, History,
  GraduationCap, Flame, School, User, Receipt, Wallet, HandHeart
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { CampaignSubmissionForm } from "../shared/CampaignSubmissionForm";
import { NotificationDropdown } from "../shared/NotificationDropdown";
import { Database } from "../../data/database";
import heroImg from "figma:asset/c8cddcb48410b814bd5d05fb077ab775500e3bac.png";

// ─── Helper Functions ────────────────────────────────────────────────────────

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatK(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}jt`;
  if (n >= 1000) return `${Math.round(n / 1000)}rb`;
  return `${n}`;
}

// ─── Custom SVG Bar Chart ────────────────────────────────────────────────────
function SvgBarChart({ data }: { data: typeof monthlyData }) {
  const W = 300;
  const H = 100;
  const paddingLeft = 36;
  const paddingBottom = 20;
  const chartW = W - paddingLeft;
  const chartH = H - paddingBottom;
  const max = 850000;
  const barW = 22;
  const gap = (chartW - barW * data.length) / (data.length + 1);
  const yTicks = [0, 425000, 850000];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* Y gridlines */}
      {yTicks.map((tick) => {
        const y = chartH - (tick / max) * chartH;
        return (
          <g key={`ytick-${tick}`}>
            <line
              x1={paddingLeft} y1={y} x2={W} y2={y}
              stroke="#F0F0F0" strokeWidth={1}
            />
            <text
              x={paddingLeft - 4} y={y + 3.5}
              textAnchor="end" fontSize={8} fill="#BFBFBF"
            >
              {tick === 0 ? "0" : `${tick / 1000}rb`}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = paddingLeft + gap + i * (barW + gap);
        const barH = d.status === "lunas" ? (d.paid / max) * chartH : 8;
        const y = chartH - barH;
        const fill = d.status === "lunas" ? "#1677FF" : "#E8EDF5";
        return (
          <g key={`bar-${d.month}`}>
            <rect x={x} y={y} width={barW} height={barH} fill={fill} rx={5} ry={5} />
            <text
              x={x + barW / 2} y={chartH + 13}
              textAnchor="middle" fontSize={9} fill="#BFBFBF" fontWeight={600}
            >
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Custom SVG Donut Chart ──────────────────────────────────────────────────
function SvgDonutChart({
  data,
  total,
}: {
  data: typeof billBreakdown;
  total: number;
}) {
  const cx = 55;
  const cy = 55;
  const r = 38;
  const inner = 24;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const slices = data.map((d) => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const startOffset = offset * circumference;
    offset += pct;
    return { ...d, dash, gap, startOffset };
  });

  // rotate so first slice starts at top (-90deg = -circumference/4 offset)
  const startRotate = -circumference / 4;

  return (
    <svg width={110} height={110} viewBox="0 0 110 110">
      {slices.map((s) => (
        <circle
          key={`donut-${s.name}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={r - inner}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={startRotate - s.startOffset * circumference / circumference * circumference + circumference / 4}
          style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      {/* Inner white circle */}
      <circle cx={cx} cy={cy} r={inner} fill="white" />
    </svg>
  );
}

// ─── Proper donut using arc paths ─────────────────────────────────────────────
function DonutChart({ data, total }: { data: typeof billBreakdown; total: number }) {
  const cx = 55, cy = 55, outerR = 50, innerR = 33;
  const gap = 0.03; // radians gap between slices

  function polarToCartesian(angle: number, r: number) {
    return {
      x: cx + r * Math.cos(angle - Math.PI / 2),
      y: cy + r * Math.sin(angle - Math.PI / 2),
    };
  }

  let startAngle = 0;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const s = startAngle + gap / 2;
    const e = startAngle + angle - gap / 2;
    startAngle += angle;
    return { ...d, startAngle: s, endAngle: e };
  });

  return (
    <svg width={110} height={110} viewBox="0 0 110 110">
      {slices.map((s) => {
        const p1 = polarToCartesian(s.startAngle, outerR);
        const p2 = polarToCartesian(s.endAngle, outerR);
        const p3 = polarToCartesian(s.endAngle, innerR);
        const p4 = polarToCartesian(s.startAngle, innerR);
        const large = s.endAngle - s.startAngle > Math.PI ? 1 : 0;
        const d = [
          `M ${p1.x} ${p1.y}`,
          `A ${outerR} ${outerR} 0 ${large} 1 ${p2.x} ${p2.y}`,
          `L ${p3.x} ${p3.y}`,
          `A ${innerR} ${innerR} 0 ${large} 0 ${p4.x} ${p4.y}`,
          "Z",
        ].join(" ");
        return <path key={`donut-${s.name}`} d={d} fill={s.color} />;
      })}
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCampaignForm, setShowCampaignForm] = useState(false);

  // State untuk data dari database
  const [activeBill, setActiveBill] = useState<any>(null);
  const [billBreakdown, setBillBreakdown] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [paymentStreak, setPaymentStreak] = useState(0);
  const [activeScholarship, setActiveScholarship] = useState<{ name: string; amount: number; endDate: string } | null>(null);

  // Load data dari database
  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        const { supabase } = await import('../../lib/supabase');
        const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni",
                        "Juli","Agustus","September","Oktober","November","Desember"];

        // ── Cari student dengan multi-fallback ──
        let studentData: any = null;

        // 1. by user_id
        const r1 = await supabase.from('students').select('*').eq('user_id', user.id).maybeSingle();
        studentData = r1.data;

        // 2. by NISN
        if (!studentData && user.nisn) {
          const r2 = await supabase.from('students').select('*').eq('nisn', user.nisn).maybeSingle();
          studentData = r2.data;
        }

        // 3. by name
        if (!studentData && user.name) {
          const r3 = await supabase.from('students').select('*').ilike('name', user.name).maybeSingle();
          studentData = r3.data;
        }

        // 4. by email
        if (!studentData && user.email) {
          const r4 = await supabase.from('students').select('*').eq('email', user.email).maybeSingle();
          studentData = r4.data;
        }

        const sppAmt = studentData?.spp_amount || 750000;

        // Ambil payments
        let studentPayments: any[] = [];
        if (studentData) {
          const { data: pData } = await supabase
            .from('payments')
            .select('*')
            .eq('student_id', studentData.id)
            .order('created_at', { ascending: false });
          studentPayments = pData || [];
        }

        // Buat tagihan 6 bulan (dari payments atau generate)
        const now = new Date();
        let unpaidBill: any = null;
        let monthlyArr: any[] = [];

        if (studentPayments.length > 0) {
          const paidSet = new Set(
            studentPayments
              .filter((p: any) => p.status === 'completed' || p.status === 'success')
              .map((p: any) => `${p.month_paid}-${p.year_paid}`)
          );
          for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mn = MONTHS[d.getMonth()];
            const yr = d.getFullYear();
            const paid = paidSet.has(`${mn}-${yr}`);
            monthlyArr.push({ month: mn.slice(0,3), paid: paid ? sppAmt : 0, status: paid ? "lunas" : "belum" });
            if (!paid && !unpaidBill) {
              unpaidBill = {
                month: `${mn} ${yr}`,
                dueDate: new Date(yr, d.getMonth() + 1, 10).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
                total: sppAmt,
                status: "Tertunggak",
              };
            }
          }
        } else {
          // Generate data dummy
          for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mn = MONTHS[d.getMonth()];
            const yr = d.getFullYear();
            const paid = i > 2;
            monthlyArr.push({ month: mn.slice(0,3), paid: paid ? sppAmt : 0, status: paid ? "lunas" : "belum" });
            if (!paid && !unpaidBill) {
              unpaidBill = {
                month: `${mn} ${yr}`,
                dueDate: new Date(yr, d.getMonth() + 1, 10).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
                total: sppAmt,
                status: "Tertunggak",
              };
            }
          }
        }

        setActiveBill(unpaidBill ?? { month: "-", dueDate: "-", total: 0, status: "Lunas" });
        setBillBreakdown([{ name: "SPP Bulanan", value: sppAmt, color: "#1677FF" }]);
        setMonthlyData(monthlyArr);
        setPaymentStreak(studentPayments.filter((p: any) => p.status === 'completed' || p.status === 'success').length);

        // Scholarship
        if (studentData) {
          const schRecipients = await Database.fetchScholarshipRecipientsSupabase(undefined);
          const myRecipient = schRecipients.find((r: any) => r.studentId === studentData.id && r.status === "active");
          if (myRecipient) {
            const scholarships = await Database.fetchScholarshipsSupabase();
            const sch = scholarships.find((s: any) => s.id === myRecipient.scholarshipId);
            if (sch) setActiveScholarship({ name: sch.name, amount: myRecipient.amountPerMonth, endDate: myRecipient.endDate });
          }
        }

        const allCampaigns = await Database.fetchCampaignsSupabase();
        setCampaigns(allCampaigns.slice(0, 2).map((c: any) => {
          const daysLeft = Math.ceil((new Date(c.endDate).getTime() - Date.now()) / 86400000);
          return { ...c, daysLeft: Math.max(0, daysLeft) };
        }));

        const allNotifs = await Database.fetchNotificationsSupabase();
        setNotifications(allNotifs.slice(0, 2).map((n: any) => ({ id: n.id, text: n.title, time: "Baru saja", unread: false })));

      } catch (err) {
        console.error('[Dashboard] Error:', err);
        // Fallback minimal agar dashboard tidak kosong
        const sppAmt = 750000;
        const now = new Date();
        const MONTHS_L = ["Januari","Februari","Maret","April","Mei","Juni",
                          "Juli","Agustus","September","Oktober","November","Desember"];
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        setActiveBill({
          month: `${MONTHS_L[d.getMonth()]} ${d.getFullYear()}`,
          dueDate: new Date(d.getFullYear(), d.getMonth() + 1, 10).toLocaleDateString("id-ID"),
          total: sppAmt, status: "Tertunggak",
        });
        setBillBreakdown([{ name: "SPP Bulanan", value: sppAmt, color: "#1677FF" }]);
      }
    }
    loadData();
  }, [user]);

  const bill = activeBill ?? { month: "-", dueDate: "-", total: 0, status: "Lunas" };
  const isLunas = bill.status === "Lunas";
  const totalBayarTahun = monthlyData.filter(m => m.status === "lunas").reduce((s, m) => s + m.paid, 0);
  const totalBill = billBreakdown.reduce((a, b) => a + b.value, 0);

  // Calculate paid bills count for the chart label
  const paidCount = monthlyData.filter(m => m.status === "lunas").length;
  const totalMonths = monthlyData.length;

  // Show loading if user exists but activeBill hasn't been set yet
  if (!!user && activeBill === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl animate-spin"
            style={{ border: "3px solid #E6F0FF", borderTopColor: "#1677FF" }} />
          <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat data...</p>
        </div>
      </div>
    );
  }

  const SHORTCUTS = [
    { icon: <Receipt size={20} />, label: "Bayar SPP", route: "/student/spp", bg: "#EEF4FF", fg: "#1677FF" },
    { icon: <HandHeart size={20} />, label: "Donasi", route: "/student/fundraising", bg: "#EEF4FF", fg: "#1677FF" },
    { icon: <History size={20} />, label: "Riwayat", route: "/student/history", bg: "#EEF4FF", fg: "#1677FF" },
  ];

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: "100dvh" }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div
        className="relative px-6 pt-12 pb-6 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0D5FD6 0%, #108EE9 60%, #1AAEFC 100%)" }}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: "white" }} />
        <div className="absolute top-16 -right-4 w-24 h-24 rounded-full opacity-8"
          style={{ background: "white" }} />

        <img
          src={heroImg}
          alt="edufin hero"
          className="absolute -right-3 top-2 w-40 opacity-90 pointer-events-none select-none"
          style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" }}
        />

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "rgba(255,255,255,0.25)", fontSize: "1.1rem", fontWeight: 800 }}
            >
              {user?.name?.[0] ?? "B"}
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.75rem" }}>Selamat datang 👋</p>
              <p style={{ color: "white", fontWeight: 800, fontSize: "0.98rem" }}>{user?.name}</p>
            </div>
          </div>

          {/* Bell */}
          <NotificationDropdown
            notifications={notifications}
            unreadCount={notifications.filter((n) => n.unread).length}
            onNotificationClick={(id) => {
              // Mark notification as read
              console.log("Notification clicked:", id);
            }}
          />
        </div>

        {/* NISN badge */}
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <span className="px-3 py-1 rounded-full flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.18)", fontSize: "0.72rem", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
            <GraduationCap size={12} />
            NISN: {user?.nisn ?? "0012345678"}
          </span>
        </div>

        {/* Tagihan Card */}
        <div
          className="rounded-3xl p-4 relative z-10"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <CreditCard size={13} color="rgba(255,255,255,0.8)" />
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                Tagihan SPP {bill.month}
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full"
              style={{
                background: isLunas ? "rgba(82,196,26,0.35)" : "rgba(234,78,13,0.4)",
                color: "white", fontSize: "0.68rem", fontWeight: 700
              }}>
              {isLunas ? "✓ Lunas" : "⚠ Tertunggak"}
            </span>
          </div>
          <p style={{ color: "white", fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-1px" }}>
            {formatRupiah(bill.total)}
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: "12px" }}>
            Jatuh tempo: {bill.dueDate}
          </p>
          {!isLunas && (
            <div className="flex gap-2.5">
              <button
                onClick={() => navigate("/student/spp")}
                className="flex-1 py-2.5 rounded-xl transition-all active:scale-95"
                style={{ background: "white", color: "#1677FF", fontWeight: 800, fontSize: "0.85rem" }}
              >
                Bayar Penuh
              </button>
              <button
                onClick={() => navigate("/student/spp?mode=cicilan")}
                className="flex-1 py-2.5 rounded-xl transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white", fontWeight: 700, fontSize: "0.85rem",
                  border: "1px solid rgba(255,255,255,0.35)"
                }}
              >
                Cicilan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────── */}
      <div className="pb-24" style={{ background: "#F3F6FB" }}>

        {/* ── STAT CARDS ───────────────────────────────────── */}
        <div className="px-5 pt-4 pb-2">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                label: "Dibayar\nTahun Ini",
                value: formatK(totalBayarTahun),
                sub: "5 bulan",
                icon: <CheckCircle size={16} color="#52C41A" />,
                bg: "#F6FFED",
                accent: "#52C41A",
              },
              {
                label: "Tagihan\nBulan Ini",
                value: formatK(bill.total),
                sub: bill.status,
                icon: <Clock size={16} color="#EA4E0D" />,
                bg: "#FFF2EE",
                accent: "#EA4E0D",
              },
              {
                label: "Streak\nTepat Waktu",
                value: `${paymentStreak}x`,
                sub: "berturut-turut",
                icon: <TrendingUp size={16} color="#1677FF" />,
                bg: "#EEF4FF",
                accent: "#1677FF",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-3 flex flex-col gap-1"
                style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                    style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                </div>
                <p style={{ fontWeight: 800, color: "#242424", fontSize: "1.05rem", lineHeight: 1.1 }}>
                  {s.value}
                </p>
                <p style={{ color: s.accent, fontSize: "0.65rem", fontWeight: 600 }}>{s.sub}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.62rem", whiteSpace: "pre-line", lineHeight: 1.3 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEASISWA BANNER ──────────────────────────────── */}
        {activeScholarship && (
          <div className="px-5 pt-2 pb-1">
            <div
              className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, #722ED1 0%, #9254DE 100%)", boxShadow: "0 4px 16px rgba(114,46,209,0.25)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={22} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.65rem", fontWeight: 600 }}>PENERIMA BEASISWA</p>
                <p style={{ color: "white", fontWeight: 800, fontSize: "0.88rem" }} className="truncate">{activeScholarship.name}</p>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.7rem" }}>
                  Subsidi SPP: <span style={{ fontWeight: 700 }}>Rp {activeScholarship.amount.toLocaleString("id-ID")}/bulan</span>
                  {activeScholarship.endDate && ` · s/d ${new Date(activeScholarship.endDate).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}`}
                </p>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <CheckCircle size={18} color="white" />
              </div>
            </div>
          </div>
        )}

        {/* ── SHORTCUTS ─────────────────────────────────────── */}
        <div className="px-5 py-3">
          <div className="grid grid-cols-4 gap-2">
            {SHORTCUTS.map((s) => (
              <button
                key={s.route}
                onClick={() => navigate(s.route)}
                className="flex flex-col items-center gap-1.5 transition-all active:scale-90"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ background: s.bg, color: s.fg }}
                >
                  {s.icon}
                </div>
                <span style={{ fontSize: "0.68rem", color: "#595959", fontWeight: 600, textAlign: "center" }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── TREN PEMBAYARAN BULANAN ───────────────────────── */}
        <div className="px-5 mb-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.92rem" }}>Tren Pembayaran</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>6 bulan terakhir</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
                style={{ background: "#EEF4FF" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#1677FF" }} />
                <span style={{ color: "#1677FF", fontSize: "0.68rem", fontWeight: 700 }}>
                  {paidCount}/{totalMonths} Lunas
                </span>
              </div>
            </div>

            {/* Custom SVG Bar Chart — no recharts key collision */}
            <div className="mt-3" style={{ height: 110 }}>
              <SvgBarChart data={monthlyData} />
            </div>

            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#1677FF" }} />
                <span style={{ fontSize: "0.68rem", color: "#8C8C8C" }}>Sudah Bayar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#E8EDF5", border: "1px solid #D9D9D9" }} />
                <span style={{ fontSize: "0.68rem", color: "#8C8C8C" }}>Belum Bayar</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RINCIAN BIAYA SPP ─────────────────────────────── */}
        <div className="px-5 mb-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.92rem" }}>Rincian Biaya SPP</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Komponen tagihan {bill.month}</p>
              </div>
              <BookOpen size={18} color="#BFBFBF" />
            </div>

            <div className="flex items-center gap-3">
              {/* Custom SVG Donut — no recharts key collision */}
              <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
                <DonutChart data={billBreakdown} total={totalBill} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p style={{ fontSize: "0.58rem", color: "#8C8C8C", fontWeight: 600 }}>Total</p>
                  <p style={{ fontSize: "0.72rem", color: "#1677FF", fontWeight: 800 }}>
                    {formatK(totalBill)}
                  </p>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 space-y-2.5">
                {billBreakdown.map((d) => {
                  const pct = Math.round((d.value / totalBill) * 100);
                  return (
                    <div key={d.name}>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                          <span style={{ fontSize: "0.75rem", color: "#595959", fontWeight: 600 }}>{d.name}</span>
                        </div>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#242424" }}>
                          {formatRupiah(d.value)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: "#F0F0F0" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: d.color }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between pt-1.5" style={{ borderTop: "1.5px solid #F0F0F0" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#242424" }}>Total</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1677FF" }}>
                    {formatRupiah(totalBill)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATUS PEMBAYARAN BADGE ───────────────────────── */}
        <div className="px-5 mb-3">
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #0D5FD6 0%, #108EE9 100%)",
              boxShadow: "0 4px 20px rgba(22,119,255,0.25)",
            }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <TrendingUp size={20} color="white" />
            </div>
            <div className="flex-1">
              <p style={{ color: "white", fontWeight: 800, fontSize: "0.88rem" }}>
                Streak {paymentStreak} Bulan Berturut! <Flame size={16} color="white" className="inline" />
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>
                Pertahankan pembayaran tepat waktu kamu
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span style={{ color: "#FDD504", fontWeight: 900, fontSize: "1.4rem", lineHeight: 1 }}>
                {paymentStreak}
              </span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.6rem" }}>bulan</span>
            </div>
          </div>
        </div>

        {/* ── KAMPANYE DONASI ───────────────────────────────── */}
        <div className="mb-4">
          <div className="px-5 flex items-center justify-between mb-2.5">
            <div>
              <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.92rem" }}>Kampanye Donasi</p>
              <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Bantu sesama pelajar</p>
            </div>
            <button
              onClick={() => navigate("/student/fundraising")}
              className="flex items-center gap-1 px-3 py-1 rounded-xl"
              style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 700, fontSize: "0.75rem" }}
            >
              Lihat Semua <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex gap-3 px-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {campaigns.map((c) => {
              const pct = Math.round((c.collected / c.target) * 100);
              return (
                <div
                  key={c.id}
                  className="flex-shrink-0 w-52 rounded-2xl overflow-hidden bg-white shadow-sm cursor-pointer active:scale-95 transition-all"
                  onClick={() => navigate(`/student/fundraising`)}
                  style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
                >
                  <div className="relative h-28 overflow-hidden">
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }} />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(0,0,0,0.45)" }}>
                      <span style={{ fontSize: "0.6rem", color: "white" }}>{c.daysLeft}h lagi</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2"
                      style={{ fontSize: "0.78rem", fontWeight: 700, color: "#242424", lineHeight: "1.3", marginBottom: "2px" }}>
                      {c.title}
                    </p>
                    <div className="flex items-center gap-1 mb-2" style={{ fontSize: "0.68rem", color: "#8C8C8C" }}>
                      <School size={11} />
                      <span>{c.school}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full mb-1" style={{ background: "#F0F0F0" }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg,#1677FF,#108EE9)" }} />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontSize: "0.68rem", color: "#1677FF", fontWeight: 700 }}>{pct}%</span>
                      <span style={{ fontSize: "0.68rem", color: "#8C8C8C" }}>dari {formatK(c.target)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── AKSI CEPAT LAINNYA ─────────────────────────────── */}
        <div className="px-5 mb-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {[
              { Icon: HandHeart, label: "Ajukan Kampanye Donasi", sub: "Buat kampanye penggalangan dana", action: () => setShowCampaignForm(true), color: "#EEF4FF", iconColor: "#1677FF" },
              { Icon: Wallet, label: "Ajukan Bantuan SPP", sub: "Gratis, tanpa bunga", route: "/student/loan", color: "#EEF4FF", iconColor: "#1677FF" },
              { Icon: User, label: "Profil & Pengaturan", sub: "Data pribadi & keamanan", route: "/student/profile", color: "#EEF4FF", iconColor: "#1677FF" },
            ].map((item, idx) => {
              const ItemIcon = item.Icon;
              return (
                <button
                  key={item.route || item.label}
                  onClick={() => item.action ? item.action() : navigate(item.route)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 transition-all active:bg-gray-50"
                  style={{ borderBottom: idx < 2 ? "1px solid #F5F7FA" : "none" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.color }}>
                    <ItemIcon size={20} color={item.iconColor} />
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>{item.label}</p>
                  <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{item.sub}</p>
                </div>
                <ChevronRight size={16} color="#BFBFBF" />
              </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Campaign Submission Form Modal */}
      <CampaignSubmissionForm
        isOpen={showCampaignForm}
        onClose={() => setShowCampaignForm(false)}
        userRole="student"
      />
    </div>
  );
}