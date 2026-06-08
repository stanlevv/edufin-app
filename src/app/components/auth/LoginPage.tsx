import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, AlertCircle, ChevronRight, HeadphonesIcon, X, MessageCircle, Phone, Send, Clock, ChevronDown, GraduationCap, Lightbulb, Receipt } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ROLE_DEST = {
  siswa: "/student",
  sekolah: "/school",
  donatur: "/donor",
};

const DEMOS = [
  { label: "Siswa/Ortu", email: "siswa@edufin.id", password: "demo123", color: "#1677FF", bg: "#EEF4FF" },
  { label: "Sekolah", email: "sekolah@edufin.id", password: "demo123", color: "#52C41A", bg: "#F6FFED" },
  { label: "Donatur", email: "donatur@edufin.id", password: "demo123", color: "#B07D00", bg: "#FFF7E0" },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHelpdesk, setShowHelpdesk] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) { setError("Masukkan alamat email kamu."); return; }
    if (!password) { setError("Masukkan kata sandi kamu."); return; }
    setLoading(true);
    setError("");
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success && result.role) {
      navigate(ROLE_DEST[result.role]);
    } else {
      setError(result.message);
    }
  };

  const fillDemo = (d: typeof DEMOS[0]) => {
    setEmail(d.email);
    setPassword(d.password);
    setError("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Header ─────────────────────────────────────────── */}
      <div
        className="px-5 pt-12 pb-8 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}
      >
        {/* Decoration */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: "white" }} />
        <div className="absolute bottom-0 right-12 w-24 h-24 rounded-full opacity-8"
          style={{ background: "white" }} />

        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-6 relative z-10 active:scale-90 transition-all"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
        >
          <ArrowLeft size={20} color="white" />
        </button>

        {/* Logo + name */}
        <div className="flex items-center gap-2.5 mb-3 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
            <Receipt size={20} color="white" />
          </div>
          <span style={{ fontWeight: 900, color: "white", fontSize: "1rem", letterSpacing: "1px" }}>EDUFIN</span>
        </div>

        <h1 className="relative z-10" style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", marginBottom: "4px" }}>
          Selamat Datang 👋
        </h1>
        <p className="relative z-10" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.88rem" }}>
          Masuk menggunakan email yang terdaftar
        </p>
      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10">

        {/* ── Demo Pills ──────────────────────────────────── */}
        <div className="mb-5">
          <p style={{ fontSize: "0.75rem", color: "#BFBFBF", fontWeight: 600, marginBottom: "8px", letterSpacing: "0.3px" }}>
            AKUN DEMO — ketuk untuk isi otomatis
          </p>
          <div className="flex gap-2">
            {DEMOS.map((d) => (
              <button
                key={d.email}
                onClick={() => fillDemo(d)}
                className="flex-1 py-2.5 px-2 rounded-2xl text-center transition-all active:scale-90"
                style={{ background: d.bg, border: `1.5px solid ${d.color}22` }}
              >
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: d.color }}>{d.label}</p>
                <p style={{ fontSize: "0.6rem", color: "#8C8C8C", marginTop: "1px" }}>demo123</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Error Banner ─────────────────────────────────── */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-2xl flex items-start gap-2.5"
            style={{ background: "#FFF2EE", border: "1px solid #FFBDAD" }}>
            <AlertCircle size={16} color="#EA4E0D" className="mt-0.5 flex-shrink-0" />
            <p style={{ color: "#EA4E0D", fontSize: "0.82rem", lineHeight: 1.45 }}>{error}</p>
          </div>
        )}

        {/* ── Email ────────────────────────────────────────── */}
        <div className="mb-3.5">
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#242424", display: "block", marginBottom: "7px" }}>
            Email
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
            style={{
              background: "#F5F7FA",
              border: `1.5px solid ${error && !email ? "#EA4E0D" : email ? "#1677FF" : "transparent"}`,
            }}
          >
            <Mail size={18} color={email ? "#1677FF" : "#8C8C8C"} />
            <input
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: "0.92rem", color: "#242424" }}
              autoComplete="email"
            />
            {email && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#1677FF" }}>
                <span style={{ color: "white", fontSize: "0.6rem", fontWeight: 800 }}>✓</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Password ─────────────────────────────────────── */}
        <div className="mb-2">
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#242424", display: "block", marginBottom: "7px" }}>
            Kata Sandi
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
            style={{
              background: "#F5F7FA",
              border: `1.5px solid ${password ? "#1677FF" : "transparent"}`,
            }}
          >
            <Lock size={18} color={password ? "#1677FF" : "#8C8C8C"} />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: "0.92rem", color: "#242424" }}
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button onClick={() => setShowPass(!showPass)} className="flex-shrink-0">
              {showPass
                ? <EyeOff size={18} color="#8C8C8C" />
                : <Eye size={18} color="#8C8C8C" />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="text-right mb-6">
          <button
            onClick={() => navigate("/forgot-password")}
            style={{ color: "#1677FF", fontSize: "0.82rem", fontWeight: 600 }}
          >
            Lupa Kata Sandi?
          </button>
        </div>

        {/* ── Login Button ─────────────────────────────────── */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white transition-all active:scale-95 disabled:opacity-70 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#1677FF 0%,#108EE9 100%)",
            fontWeight: 800, fontSize: "0.95rem",
            boxShadow: "0 6px 24px rgba(22,119,255,0.35)",
          }}
        >
          {/* Sheen */}
          <div className="absolute inset-0 opacity-15"
            style={{ background: "linear-gradient(105deg,transparent 35%,white 50%,transparent 65%)" }} />
          {loading ? (
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Memverifikasi...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Masuk ke EDUFIN
              <ChevronRight size={18} />
            </div>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: "#F0F0F0" }} />
          <span style={{ color: "#BFBFBF", fontSize: "0.75rem" }}>atau</span>
          <div className="flex-1 h-px" style={{ background: "#F0F0F0" }} />
        </div>

        {/* Google (Donatur) */}
        <button
          onClick={async () => {
            setError("");
            const res = await loginWithGoogle();
            if (!res.success) {
              setError(res.message);
            }
          }}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
          style={{
            background: "white",
            border: "2px solid #E8E8E8",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
            <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
            <path fill="#FBBC05" d="M11.68 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.34-5.7z" />
            <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.34 5.7c1.74-5.2 6.59-9.07 12.32-9.07z" />
          </svg>
          <span style={{ fontWeight: 600, color: "#595959", fontSize: "0.9rem" }}>
            Masuk dengan Google (Khusus Donatur)
          </span>
        </button>

        {/* Register link */}
        <p className="text-center mt-6" style={{ fontSize: "0.85rem", color: "#8C8C8C" }}>
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/register")}
            style={{ color: "#1677FF", fontWeight: 700 }}
          >
            Daftar Sekarang
          </button>
        </p>

        {/* Info siswa */}
        <div className="mt-5 rounded-2xl px-4 py-3.5 flex gap-3"
          style={{ background: "#F5F7FA" }}>
          <Lightbulb size={18} color="#595959" className="flex-shrink-0" />
          <p style={{ color: "#8C8C8C", fontSize: "0.72rem", lineHeight: 1.55 }}>
            <strong style={{ color: "#595959" }}>Siswa & Orang Tua</strong> — gunakan email yang didaftarkan saat mendaftar dengan NISN.{" "}
            Belum punya akun?{" "}
            <button onClick={() => navigate("/register")} style={{ color: "#1677FF", fontWeight: 700 }}>
              Daftar di sini →
            </button>
          </p>
        </div>
      </div>

      {/* ── Floating Helpdesk Button ─────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[380px] z-40 pointer-events-none flex justify-end px-6">
        <button
          onClick={() => setShowHelpdesk(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all active:scale-90 pointer-events-auto"
          style={{
            background: "linear-gradient(135deg,#1677FF,#108EE9)",
            boxShadow: "0 6px 24px rgba(22,119,255,0.4)",
          }}
        >
          <HeadphonesIcon size={18} color="white" />
          <span style={{ color: "white", fontSize: "0.8rem", fontWeight: 700 }}>Butuh Bantuan?</span>
        </button>
      </div>

      {/* ── Helpdesk Bottom Sheet ────────────────────────── */}
      {showHelpdesk && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
            onClick={() => setShowHelpdesk(false)}
          />

          {/* Sheet */}
          <div
            className="fixed bottom-0 left-1/2 z-50 w-full"
            style={{
              maxWidth: 380,
              transform: "translateX(-50%)",
              background: "white",
              borderRadius: "28px 28px 0 0",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
              animation: "slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "#E0E0E0" }} />
            </div>

            {/* Header */}
            <div className="px-5 pt-3 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#1677FF,#108EE9)" }}>
                  <HeadphonesIcon size={20} color="white" />
                </div>
                <div>
                  <p style={{ fontWeight: 900, color: "#1A1A2E", fontSize: "1rem" }}>Pusat Bantuan</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#52C41A" }} />
                    <p style={{ color: "#52C41A", fontSize: "0.72rem", fontWeight: 600 }}>Tim aktif · Senin–Jumat, 08.00–17.00</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHelpdesk(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all"
                style={{ background: "#F5F5F5" }}
              >
                <X size={16} color="#595959" />
              </button>
            </div>

            {/* FAQ cepat */}
            <div className="px-5 mb-4">
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#BFBFBF", letterSpacing: "0.4px", marginBottom: "10px" }}>
                PERTANYAAN UMUM
              </p>
              <div className="space-y-2">
                {[
                  { q: "Lupa email yang didaftarkan?", a: "Gunakan email yang sama saat daftar dengan NISN. Cek kotak masuk email untuk tautan verifikasi." },
                  { q: "NISN saya tidak ditemukan saat daftar?", a: "Pastikan NISN 10 digit sesuai kartu pelajar. Hubungi sekolah jika NISN belum terdaftar di sistem." },
                  { q: "Akun sekolah/admin bagaimana cara daftarnya?", a: "Akun sekolah hanya dibuat oleh tim EDUFIN. Hubungi kami melalui WhatsApp atau email di bawah." },
                  { q: "Transaksi pembayaran SPP gagal?", a: "Pastikan koneksi internet stabil. Jika sudah terpotong tapi belum tercatat, hubungi tim kami segera." },
                ].map((item, i) => (
                  <FAQItem key={i} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 mb-4" style={{ height: 1, background: "#F0F0F0" }} />

            {/* Kontak options */}
            <div className="px-5 pb-2">
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#BFBFBF", letterSpacing: "0.4px", marginBottom: "10px" }}>
                HUBUNGI TIM KAMI
              </p>
              <div className="space-y-2.5">

                {/* WhatsApp */}
                <a
                  href="https://wa.me/6281234567890?text=Halo%20tim%20EDUFIN%2C%20saya%20butuh%20bantuan%20login."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all active:scale-98"
                  style={{ background: "#F6FFED", border: "1.5px solid #B7EB8F", textDecoration: "none" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#52C41A", fontSize: "1.1rem" }}>
                    💬
                  </div>
                  <div className="flex-1">
                    <p style={{ fontWeight: 700, color: "#237804", fontSize: "0.88rem" }}>WhatsApp</p>
                    <p style={{ color: "#52C41A", fontSize: "0.73rem" }}>+62 812-3456-7890 · Respon cepat</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full" style={{ background: "#52C41A" }}>
                    <span style={{ color: "white", fontSize: "0.65rem", fontWeight: 700 }}>CHAT</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:support@edufin.id?subject=Bantuan%20Login%20EDUFIN"
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all active:scale-98"
                  style={{ background: "#EEF4FF", border: "1.5px solid #C5D8FF", textDecoration: "none" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#1677FF", fontSize: "1.1rem" }}>
                    📧
                  </div>
                  <div className="flex-1">
                    <p style={{ fontWeight: 700, color: "#1677FF", fontSize: "0.88rem" }}>Email Support</p>
                    <p style={{ color: "#4A6FA5", fontSize: "0.73rem" }}>support@edufin.id · Balasan 1×24 jam</p>
                  </div>
                  <ChevronRight size={16} color="#1677FF" />
                </a>

                {/* Telepon */}
                <a
                  href="tel:+62211234567"
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all active:scale-98"
                  style={{ background: "#F5F7FA", border: "1.5px solid #E8E8E8", textDecoration: "none" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#595959", fontSize: "1.1rem" }}>
                    📞
                  </div>
                  <div className="flex-1">
                    <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>Telepon</p>
                    <p style={{ color: "#8C8C8C", fontSize: "0.73rem" }}>(021) 123-4567 · Jam kerja saja</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} color="#BFBFBF" />
                    <span style={{ color: "#BFBFBF", fontSize: "0.65rem" }}>08–17</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Bottom safe area */}
            <div className="h-8" />
          </div>
        </>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ background: open ? "#F8FAFF" : "#F5F7FA", border: `1.5px solid ${open ? "#C5D8FF" : "transparent"}` }}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.82rem", flex: 1, textAlign: "left", lineHeight: 1.4 }}>
          {question}
        </span>
        <ChevronDown
          size={16}
          color="#1677FF"
          style={{ flexShrink: 0, marginLeft: 8, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-4 pb-3">
          <p style={{ color: "#595959", fontSize: "0.77rem", lineHeight: 1.6 }}>{answer}</p>
        </div>
      )}
    </div>
  );
}