import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

// ─── Illustrations ────────────────────────────────────────────────────────────

function IllustrationSPP() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background circles */}
      <circle cx="150" cy="130" r="100" fill="rgba(255,255,255,0.08)" />
      <circle cx="150" cy="130" r="75" fill="rgba(255,255,255,0.07)" />

      {/* Floating coins */}
      <ellipse cx="58" cy="72" rx="18" ry="7" fill="#FDD504" />
      <rect x="40" y="62" width="36" height="10" rx="5" fill="#FD9A16" />
      <ellipse cx="58" cy="62" rx="18" ry="7" fill="#FDD504" />
      <rect x="40" y="52" width="36" height="10" rx="5" fill="#FD9A16" />
      <ellipse cx="58" cy="52" rx="18" ry="7" fill="#FFEC3D" />

      {/* Card */}
      <rect x="70" y="88" width="160" height="100" rx="18" fill="white" fillOpacity="0.97"
        style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.18))" }} />
      <rect x="70" y="88" width="160" height="38" rx="18" fill="#1677FF" />
      <rect x="70" y="108" width="160" height="18" fill="#0D5FD6" />
      {/* Chip */}
      <rect x="88" y="98" width="22" height="16" rx="4" fill="#FDD504" />
      <line x1="94" y1="98" x2="94" y2="114" stroke="#FD9A16" strokeWidth="1.5" />
      <line x1="100" y1="98" x2="100" y2="114" stroke="#FD9A16" strokeWidth="1.5" />
      <line x1="88" y1="106" x2="110" y2="106" stroke="#FD9A16" strokeWidth="1" />
      {/* Contactless */}
      <path d="M120 103 Q128 106 120 109" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M122 100 Q133 106 122 112" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      {/* Card text */}
      <rect x="88" y="133" width="48" height="6" rx="3" fill="#E0E7FF" />
      <rect x="88" y="144" width="36" height="5" rx="2.5" fill="#C7D7F8" />
      <rect x="148" y="133" width="32" height="6" rx="3" fill="#1677FF" fillOpacity="0.3" />
      <rect x="148" y="144" width="40" height="5" rx="2.5" fill="#1677FF" fillOpacity="0.2" />
      {/* Amount */}
      <rect x="88" y="158" width="80" height="20" rx="5" fill="#F0F7FF" />
      <rect x="92" y="163" width="50" height="10" rx="3" fill="#1677FF" fillOpacity="0.2" />

      {/* Phone */}
      <rect x="185" y="118" width="52" height="88" rx="12" fill="white"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))" }} />
      <rect x="185" y="118" width="52" height="88" rx="12" fill="white" />
      <rect x="188" y="124" width="46" height="66" rx="6" fill="#F0F7FF" />
      {/* Screen content */}
      <rect x="192" y="130" width="38" height="5" rx="2.5" fill="#1677FF" fillOpacity="0.3" />
      <rect x="192" y="138" width="30" height="14" rx="4" fill="#EEF4FF" />
      <rect x="196" y="142" width="22" height="6" rx="2" fill="#1677FF" fillOpacity="0.5" />
      <rect x="192" y="155" width="38" height="4" rx="2" fill="#E0E7FF" />
      <rect x="192" y="162" width="28" height="4" rx="2" fill="#E0E7FF" />
      {/* QR */}
      <rect x="192" y="170" width="24" height="14" rx="3" fill="white" />
      <rect x="194" y="172" width="6" height="4" rx="1" fill="#1677FF" opacity="0.7" />
      <rect x="202" y="172" width="6" height="4" rx="1" fill="#1677FF" opacity="0.7" />
      <rect x="194" y="178" width="6" height="4" rx="1" fill="#1677FF" opacity="0.7" />
      <rect x="202" y="178" width="4" height="2" rx="0.5" fill="#1677FF" opacity="0.5" />
      <rect x="202" y="181" width="6" height="2" rx="0.5" fill="#1677FF" opacity="0.5" />
      {/* Success checkmark badge */}
      <circle cx="232" cy="126" r="10" fill="#52C41A" />
      <path d="M227 126l3.5 3.5L237 122" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Person */}
      <circle cx="150" cy="58" r="16" fill="#FFD8A8" />
      <ellipse cx="150" cy="90" rx="22" ry="14" fill="#1677FF" />
      {/* Hair */}
      <path d="M134 56c0-10 8-18 16-18s16 8 16 18" fill="#3D2B1F" />
      {/* Face */}
      <circle cx="145" cy="60" r="2" fill="#3D2B1F" />
      <circle cx="155" cy="60" r="2" fill="#3D2B1F" />
      <path d="M146 65 Q150 68 154 65" stroke="#C27C4B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Arm */}
      <path d="M128 98 Q115 105 118 118" stroke="#FFD8A8" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M172 98 Q185 105 182 118" stroke="#FFD8A8" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Stars / sparkles */}
      <path d="M240 75 L242 70 L244 75 L249 77 L244 79 L242 84 L240 79 L235 77 Z" fill="#FDD504" opacity="0.9" />
      <path d="M62 155 L63 151 L64 155 L68 156 L64 157 L63 161 L62 157 L58 156 Z" fill="#FDD504" opacity="0.7" />
      <circle cx="255" cy="105" r="4" fill="#FDD504" opacity="0.6" />
      <circle cx="55" cy="130" r="3" fill="white" opacity="0.4" />
      <circle cx="250" cy="145" r="2.5" fill="white" opacity="0.4" />

      {/* Floating tag "SPP" */}
      <rect x="30" y="148" width="50" height="24" rx="12" fill="white"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }} />
      <text x="55" y="163" textAnchor="middle" fill="#1677FF" fontSize="9" fontWeight="800">SPP ✓</text>

      {/* Floating tag "Lunas" */}
      <rect x="222" y="165" width="52" height="24" rx="12" fill="#52C41A"
        style={{ filter: "drop-shadow(0 4px 12px rgba(82,196,26,0.25))" }} />
      <text x="248" y="180" textAnchor="middle" fill="white" fontSize="9" fontWeight="800">Lunas!</text>
    </svg>
  );
}

function IllustrationDonasi() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="150" cy="130" r="100" fill="rgba(255,255,255,0.08)" />

      {/* Big heart */}
      <path d="M150 200 C80 160 60 120 80 95 C95 75 120 78 135 95 C140 100 145 107 150 115 C155 107 160 100 165 95 C180 78 205 75 220 95 C240 120 220 160 150 200Z"
        fill="white" fillOpacity="0.15" />

      {/* School building */}
      <rect x="80" y="145" width="80" height="65" rx="4" fill="white" fillOpacity="0.95"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))" }} />
      <polygon points="80,145 120,118 160,145" fill="#FDD504" />
      <rect x="105" y="168" width="30" height="42" rx="3" fill="#EEF4FF" />
      <rect x="85" y="158" width="18" height="18" rx="2" fill="#EEF4FF" />
      <rect x="117" y="158" width="18" height="18" rx="2" fill="#EEF4FF" />
      <rect x="149" y="158" width="18" height="18" rx="2" fill="#EEF4FF" />
      <circle cx="120" cy="135" r="5" fill="#1677FF" fillOpacity="0.4" />

      {/* Person 1 - giving */}
      <circle cx="65" cy="128" r="14" fill="#FFD8A8" />
      <ellipse cx="65" cy="158" rx="18" ry="12" fill="#EA4E0D" />
      <path d="M51 165 Q45 172 48 180" stroke="#FFD8A8" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M79 165 Q88 162 95 148" stroke="#FFD8A8" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Hair */}
      <path d="M51 126c0-8 6-15 14-15s14 7 14 15" fill="#2D2D2D" />
      <circle cx="61" cy="130" r="1.5" fill="#3D2B1F" />
      <circle cx="69" cy="130" r="1.5" fill="#3D2B1F" />
      <path d="M62 135 Q65 137.5 68 135" stroke="#C27C4B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Heart float from hand */}
      <path d="M96 142 C91 138 87 132 91 127 C93.5 124 97 124.5 99 127 C99.5 128 100 129 100 130 C100 129 100.5 128 101 127 C103 124.5 106.5 124 109 127 C113 132 109 138 104 142 L100 146 Z"
        fill="#EA4E0D" />

      {/* Person 2 - receiving */}
      <circle cx="225" cy="128" r="14" fill="#FFDDB0" />
      <ellipse cx="225" cy="158" rx="18" ry="12" fill="#1677FF" />
      <path d="M211 165 Q205 172 208 180" stroke="#FFDDB0" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M239 165 Q245 172 242 180" stroke="#FFDDB0" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Hair - curly */}
      <circle cx="225" cy="118" r="9" fill="#8B5E3C" />
      <circle cx="218" cy="120" r="5" fill="#8B5E3C" />
      <circle cx="232" cy="120" r="5" fill="#8B5E3C" />
      <circle cx="221" cy="130" r="1.5" fill="#3D2B1F" />
      <circle cx="229" cy="130" r="1.5" fill="#3D2B1F" />
      <path d="M222 135 Q225 137.5 228 135" stroke="#C27C4B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Progress bar */}
      <rect x="100" y="92" width="100" height="20" rx="10" fill="white"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }} />
      <rect x="103" y="95" width="94" height="14" rx="7" fill="#F0F0F0" />
      <rect x="103" y="95" width="72" height="14" rx="7" fill="linear-gradient(90deg,#1677FF,#108EE9)" />
      <rect x="103" y="95" width="72" height="14" rx="7" fill="#1677FF" />
      <text x="200" y="105" textAnchor="middle" fill="#1677FF" fontSize="8" fontWeight="700">76%</text>

      {/* Floating badges */}
      <rect x="28" y="92" width="56" height="26" rx="13" fill="white"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }} />
      <text x="56" y="102" textAnchor="middle" fill="#8C8C8C" fontSize="7">Terkumpul</text>
      <text x="56" y="112" textAnchor="middle" fill="#1677FF" fontSize="8" fontWeight="800">11.2jt</text>

      <rect x="218" y="92" width="56" height="26" rx="13" fill="#FDD504"
        style={{ filter: "drop-shadow(0 4px 12px rgba(253,213,4,0.3))" }} />
      <text x="246" y="102" textAnchor="middle" fill="#5A4000" fontSize="7" fontWeight="700">Target</text>
      <text x="246" y="112" textAnchor="middle" fill="#5A4000" fontSize="8" fontWeight="800">15jt</text>

      {/* Sparkles */}
      <path d="M247 68 L249 62 L251 68 L257 70 L251 72 L249 78 L247 72 L241 70 Z" fill="#FDD504" opacity="0.9" />
      <path d="M48 72 L50 67 L52 72 L57 74 L52 76 L50 81 L48 76 L43 74 Z" fill="white" opacity="0.6" />
      <circle cx="258" cy="135" r="4" fill="white" opacity="0.3" />
      <circle cx="42" cy="155" r="3" fill="white" opacity="0.3" />
    </svg>
  );
}

function IllustrationLaporan() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="150" cy="130" r="100" fill="rgba(255,255,255,0.08)" />

      {/* Main dashboard card */}
      <rect x="55" y="75" width="190" height="140" rx="20" fill="white" fillOpacity="0.97"
        style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.18))" }} />

      {/* Header bar */}
      <rect x="55" y="75" width="190" height="40" rx="20" fill="#1677FF" />
      <rect x="55" y="95" width="190" height="20" fill="#0D5FD6" />
      <rect x="68" y="87" width="80" height="8" rx="4" fill="white" fillOpacity="0.5" />
      <rect x="68" y="99" width="55" height="6" rx="3" fill="white" fillOpacity="0.3" />
      {/* Avatar */}
      <circle cx="220" cy="95" r="12" fill="rgba(255,255,255,0.25)" />
      <circle cx="220" cy="91" r="5" fill="white" fillOpacity="0.7" />
      <ellipse cx="220" cy="101" rx="7" ry="4" fill="white" fillOpacity="0.7" />

      {/* Stats row */}
      <rect x="68" y="122" width="50" height="40" rx="10" fill="#EEF4FF" />
      <rect x="124" y="122" width="50" height="40" rx="10" fill="#F6FFED" />
      <rect x="180" y="122" width="50" height="40" rx="10" fill="#FFF2EE" />
      {/* Stat values */}
      <text x="93" y="139" textAnchor="middle" fill="#1677FF" fontSize="11" fontWeight="900">35</text>
      <text x="93" y="153" textAnchor="middle" fill="#8C8C8C" fontSize="7">Lunas</text>
      <text x="149" y="139" textAnchor="middle" fill="#52C41A" fontSize="11" fontWeight="900">70%</text>
      <text x="149" y="153" textAnchor="middle" fill="#8C8C8C" fontSize="7">Bayar</text>
      <text x="205" y="139" textAnchor="middle" fill="#EA4E0D" fontSize="11" fontWeight="900">10</text>
      <text x="205" y="153" textAnchor="middle" fill="#8C8C8C" fontSize="7">Menunggak</text>

      {/* Bar chart */}
      {[
        { x: 68, h: 18, fill: "#1677FF" },
        { x: 86, h: 28, fill: "#1677FF" },
        { x: 104, h: 22, fill: "#1677FF" },
        { x: 122, h: 32, fill: "#1677FF" },
        { x: 140, h: 20, fill: "#FDD504" },
        { x: 158, h: 8, fill: "#E0E7FF" },
      ].map((bar, i) => (
        <g key={i}>
          <rect x={bar.x} y={180 - bar.h} width="14" height={bar.h} rx="4" fill={bar.fill} fillOpacity={i === 5 ? 0.6 : 1} />
        </g>
      ))}

      {/* Trend line */}
      <polyline
        points="75,168 93,158 111,163 129,153 147,161 165,175"
        stroke="#EA4E0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray="0"
      />
      {/* Line dots */}
      {[[75, 168], [93, 158], [111, 163], [129, 153], [147, 161], [165, 175]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#EA4E0D" />
      ))}

      {/* Pie chart mini */}
      <circle cx="212" cy="172" r="22" fill="#F5F7FA" />
      <path d="M212 150 A22 22 0 0 1 234 172" stroke="#1677FF" strokeWidth="10" fill="none" strokeLinecap="butt" />
      <path d="M234 172 A22 22 0 0 1 212 194" stroke="#52C41A" strokeWidth="10" fill="none" strokeLinecap="butt" />
      <path d="M212 194 A22 22 0 0 1 190 172" stroke="#EA4E0D" strokeWidth="10" fill="none" strokeLinecap="butt" />
      <path d="M190 172 A22 22 0 0 1 212 150" stroke="#FDD504" strokeWidth="10" fill="none" strokeLinecap="butt" />
      <circle cx="212" cy="172" r="12" fill="white" />
      <text x="212" y="176" textAnchor="middle" fill="#1677FF" fontSize="8" fontWeight="800">50</text>

      {/* X-axis labels */}
      {["Des", "Jan", "Feb", "Mar", "Apr", "Mei"].map((m, i) => (
        <text key={i} x={75 + i * 18} y={196} textAnchor="middle" fill="#BFBFBF" fontSize="7">{m}</text>
      ))}

      {/* Floating badge - download */}
      <rect x="175" y="57" width="70" height="28" rx="14" fill="#FDD504"
        style={{ filter: "drop-shadow(0 4px 12px rgba(253,213,4,0.35))" }} />
      <text x="210" y="68" textAnchor="middle" fill="#5A4000" fontSize="7" fontWeight="700">↓ Ekspor</text>
      <text x="210" y="79" textAnchor="middle" fill="#5A4000" fontSize="8" fontWeight="800">Laporan</text>

      {/* Floating badge - alert */}
      <rect x="55" y="57" width="60" height="28" rx="14" fill="white"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }} />
      <text x="85" y="68" textAnchor="middle" fill="#8C8C8C" fontSize="7">Real-time</text>
      <text x="85" y="79" textAnchor="middle" fill="#52C41A" fontSize="8" fontWeight="800">● Live</text>

      {/* Sparkles */}
      <path d="M42 100 L44 94 L46 100 L52 102 L46 104 L44 110 L42 104 L36 102 Z" fill="white" opacity="0.5" />
      <path d="M255 80 L257 75 L259 80 L264 82 L259 84 L257 89 L255 84 L250 82 Z" fill="#FDD504" opacity="0.8" />
      <circle cx="252" cy="150" r="4" fill="white" opacity="0.3" />
      <circle cx="45" cy="165" r="3" fill="#FDD504" opacity="0.5" />
    </svg>
  );
}

// ─── Slide Data ───────────────────────────────────────────────────────────────

const SLIDES = [
  {
    gradient: ["#1677FF", "#0D5FD6", "#0A4FBF"],
    accent: "#FDD504",
    illustration: <IllustrationSPP />,
    badge: "Pembayaran Digital",
    title: "Bayar SPP\nLebih Mudah",
    desc: "Bayar tagihan sekolah kapan saja dan di mana saja. Cicil 2-3x gratis, tanpa bunga, langsung via QRIS & Transfer Bank.",
  },
  {
    gradient: ["#0A3F99", "#1677FF", "#2196F3"],
    accent: "#EA4E0D",
    illustration: <IllustrationDonasi />,
    badge: "Kampanye Donasi",
    title: "Bantu Sesama\nPelajar Indonesia",
    desc: "Browse kampanye dari sekolah-sekolah di seluruh Indonesia. Donasi mulai Rp 10.000 dan dapatkan sertifikat digital.",
  },
  {
    gradient: ["#052E80", "#0D5FD6", "#1677FF"],
    accent: "#52C41A",
    illustration: <IllustrationLaporan />,
    badge: "Laporan Transparan",
    title: "Keuangan Sekolah\nTransparan & Akurat",
    desc: "Pantau semua transaksi SPP dan donasi secara real-time. Laporan otomatis, ekspor PDF, dan audit siap kapan saja.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function OnboardingPage() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goTo = (index: number) => {
    if (animating || index === activeSlide) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveSlide(index);
      setAnimating(false);
    }, 220);
  };

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((s) => (s + 1) % SLIDES.length);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveSlide((s) => (s + 1) % SLIDES.length);
    }, 4000);
  };

  const handleDotClick = (i: number) => {
    goTo(i);
    resetInterval();
  };

  // Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 50 && dy < 50) {
      const next = dx < 0
        ? (activeSlide + 1) % SLIDES.length
        : (activeSlide - 1 + SLIDES.length) % SLIDES.length;
      goTo(next);
      resetInterval();
    }
  };

  const slide = SLIDES[activeSlide];

  return (
    <div
      className="flex flex-col min-h-screen overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── TOP: Illustration Area ──────────────────────────── */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{
          minHeight: "58vh",
          paddingTop: "env(safe-area-inset-top)",
          background: `linear-gradient(160deg, ${slide.gradient[0]} 0%, ${slide.gradient[1]} 50%, ${slide.gradient[2]} 100%)`,
          transition: "background 0.5s ease",
        }}
      >
        {/* Decorative rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-2 border-white opacity-8" />
          <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full border border-white opacity-10" />
          <div className="absolute bottom-0 -left-20 w-56 h-56 rounded-full border-2 border-white opacity-6" />
          <div className="absolute top-1/3 -left-10 w-28 h-28 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="absolute bottom-12 right-0 w-40 h-40 rounded-full"
            style={{ background: "rgba(0,0,0,0.08)" }} />
        </div>

        {/* Skip button */}
        <button
          onClick={() => navigate("/login")}
          className="absolute right-6 z-20 px-4 py-1.5 rounded-full transition-all active:scale-95"
          style={{
            top: "calc(env(safe-area-inset-top) + 1.5rem)",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            color: "white",
            fontSize: "0.82rem",
            fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          Lewati
        </button>

        {/* Slide number */}
        <div className="absolute left-6 z-20 flex items-center gap-2" style={{ top: "calc(env(safe-area-inset-top) + 1.5rem)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
            <span style={{ color: "white", fontSize: "0.7rem", fontWeight: 800 }}>
              {activeSlide + 1}/{SLIDES.length}
            </span>
          </div>
        </div>

        {/* Badge */}
        <div className="absolute left-1/2 z-20 -translate-x-1/2" style={{ top: "calc(env(safe-area-inset-top) + 2rem)" }}>
          <div
            className="px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)",
              fontSize: "0.75rem",
              color: "white",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {slide.badge}
          </div>
        </div>

        {/* Illustration */}
        <div
          className="absolute inset-0 flex items-end justify-center pb-0 pt-20"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "scale(0.95)" : "scale(1)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          <div className="w-full px-4" style={{ maxWidth: "340px", height: "220px" }}>
            {slide.illustration}
          </div>
        </div>

        {/* Bottom wave */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: 50 }}
          viewBox="0 0 430 50"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 50 L0 22 Q55 0 110 18 Q165 36 215 18 Q265 0 320 20 Q375 40 430 18 L430 50 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* ── BOTTOM: Content Area ────────────────────────────── */}
      <div
        className="flex-1 bg-white flex flex-col px-7 pt-4 pb-6"
        style={{ minHeight: "42vh", paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
      >
        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className="transition-all duration-300"
              style={{
                width: i === activeSlide ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === activeSlide ? "#1677FF" : "#E0E0E0",
              }}
            />
          ))}
        </div>

        {/* Text content */}
        <div
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
            flex: 1,
          }}
        >
          <h1
            style={{
              fontWeight: 900,
              color: "#1A1A2E",
              fontSize: "1.75rem",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              marginBottom: "10px",
              whiteSpace: "pre-line",
            }}
          >
            {slide.title}
          </h1>

          {/* Accent underline */}
          <div
            className="rounded-full mb-4"
            style={{ width: 44, height: 4, background: slide.accent }}
          />

          <p
            style={{
              color: "#6B7280",
              fontSize: "0.88rem",
              lineHeight: 1.65,
              marginBottom: "20px",
            }}
          >
            {slide.desc}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mt-auto">
          <button
            onClick={() => navigate("/register")}
            className="w-full py-4 rounded-2xl text-center transition-all active:scale-95 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1677FF 0%, #108EE9 100%)",
              color: "white",
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "0.2px",
              boxShadow: "0 6px 24px rgba(22,119,255,0.35)",
            }}
          >
            {/* Sheen effect */}
            <div className="absolute inset-0 opacity-20"
              style={{ background: "linear-gradient(105deg, transparent 35%, white 50%, transparent 65%)" }} />
            Buat Akun Gratis
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 rounded-2xl text-center transition-all active:scale-95"
            style={{
              background: "#F0F7FF",
              color: "#1677FF",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            Sudah punya akun?{" "}
            <span style={{ fontWeight: 900 }}>Masuk</span>
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center mt-4" style={{ color: "#BFBFBF", fontSize: "0.7rem" }}>
          Dengan mendaftar, kamu menyetujui{" "}
          <span style={{ color: "#1677FF" }}>Syarat & Ketentuan</span> EDUFIN
        </p>
      </div>
    </div>
  );
}
