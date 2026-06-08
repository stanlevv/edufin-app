import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Shield, ShieldAlert, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;
const STORAGE_KEY = "school_login_lock";

function sanitizeInput(val: string): string {
  // Hapus karakter berbahaya SQL/XSS
  return val.replace(/['";\-\-\/\*\\<>]/g, "").trim();
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Restore lockout dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { until, count } = JSON.parse(stored);
      if (Date.now() < until) {
        setLockoutUntil(until);
        setAttempts(count);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setAttempts(0);
        setCountdown(0);
        localStorage.removeItem(STORAGE_KEY);
        clearInterval(interval);
      } else {
        setCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLocked = lockoutUntil !== null && Date.now() < lockoutUntil;

  const handleLogin = async () => {
    if (isLocked) return;
    
    const cleanEmail = sanitizeInput(email);
    const cleanPassword = password; // password tidak di-sanitize agar karakter spesial tetap valid
    
    if (!cleanEmail) { setError("Masukkan alamat email admin."); return; }
    if (!cleanPassword) { setError("Masukkan kata sandi."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    setError("");
    const result = await login(cleanEmail, cleanPassword, ["sekolah"]);
    setLoading(false);

    if (result.success) {
      localStorage.removeItem(STORAGE_KEY);
      navigate("/school");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockoutUntil(until);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ until, count: newAttempts }));
        setError(`Akun dikunci sementara. Coba lagi dalam ${LOCKOUT_SECONDS} detik.`);
      } else {
        setError(`Email atau kata sandi salah. (${MAX_ATTEMPTS - newAttempts} percobaan tersisa)`);
      }
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "linear-gradient(135deg, #EEF4FF 0%, #E6F7FF 50%, #F0F5FF 100%)" }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0D2A6B 0%, #1239A0 40%, #1677FF 100%)" }}>
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #60A5FA, transparent)" }} />
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              <Shield size={18} color="white" />
            </div>
            <span style={{ color: "white", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.3px" }}>EduFin</span>
          </div>
          <h2 style={{ color: "white", fontSize: "2rem", fontWeight: 900, lineHeight: 1.2, marginBottom: "16px" }}>
            Portal Admin<br />Sekolah
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Kelola tagihan SPP, data siswa, laporan keuangan, dan kampanye beasiswa sekolah Anda dalam satu platform.
          </p>
        </div>
        <div className="space-y-3">
          {["Manajemen Tagihan SPP", "Laporan Keuangan Real-time", "Verifikasi Kampanye Beasiswa"].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#60A5FA" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
              <Shield size={18} color="white" />
            </div>
            <span style={{ color: "#1677FF", fontWeight: 800, fontSize: "1.1rem" }}>EduFin</span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.2)" }}>
              <ShieldAlert size={12} color="#1677FF" />
              <span style={{ color: "#1677FF", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.5px" }}>RESTRICTED ACCESS</span>
            </div>
            <h1 style={{ color: "#0D1F3C", fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "6px" }}>
              Masuk Admin Sekolah
            </h1>
            <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
              Gunakan akun administrator yang telah didaftarkan oleh Super Admin.
            </p>
          </div>

          {/* Lockout Banner */}
          {isLocked && (
            <div className="mb-5 p-4 rounded-2xl flex items-center gap-3"
              style={{ background: "rgba(234,78,13,0.06)", border: "1.5px solid rgba(234,78,13,0.2)" }}>
              <AlertCircle size={18} color="#EA4E0D" className="flex-shrink-0" />
              <div>
                <p style={{ color: "#EA4E0D", fontWeight: 700, fontSize: "0.85rem" }}>Akun Dikunci Sementara</p>
                <p style={{ color: "#EA4E0D", fontSize: "0.78rem", opacity: 0.8 }}>Buka kunci dalam {countdown} detik</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !isLocked && (
            <div className="mb-5 px-4 py-3 rounded-2xl flex items-start gap-2.5"
              style={{ background: "rgba(234,78,13,0.06)", border: "1px solid rgba(234,78,13,0.2)" }}>
              <AlertCircle size={15} color="#EA4E0D" className="mt-0.5 flex-shrink-0" />
              <p style={{ color: "#EA4E0D", fontSize: "0.8rem", lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-7 space-y-5"
            style={{ boxShadow: "0 4px 40px rgba(22,119,255,0.08), 0 1px 3px rgba(0,0,0,0.05)", border: "1px solid rgba(22,119,255,0.08)" }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "8px" }}>
                EMAIL ADMIN
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                style={{ background: "#F8FAFF", border: `1.5px solid ${email ? "#1677FF" : "#E5E7EB"}` }}>
                <Mail size={17} color={email ? "#1677FF" : "#9CA3AF"} />
                <input
                  type="email"
                  placeholder="admin@sekolah.sch.id"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.9rem", color: "#0D1F3C" }}
                  autoComplete="email"
                  disabled={isLocked}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "8px" }}>
                KATA SANDI
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                style={{ background: "#F8FAFF", border: `1.5px solid ${password ? "#1677FF" : "#E5E7EB"}` }}>
                <Lock size={17} color={password ? "#1677FF" : "#9CA3AF"} />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.9rem", color: "#0D1F3C" }}
                  autoComplete="current-password"
                  disabled={isLocked}
                />
                <button onClick={() => setShowPass(!showPass)} className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                  {showPass ? <EyeOff size={17} color="#374151" /> : <Eye size={17} color="#374151" />}
                </button>
              </div>
            </div>

            {/* Progress bar attempts */}
            {attempts > 0 && !isLocked && (
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>Percobaan login</span>
                  <span style={{ fontSize: "0.7rem", color: attempts >= 3 ? "#EA4E0D" : "#6B7280", fontWeight: 700 }}>{attempts}/{MAX_ATTEMPTS}</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "#F3F4F6" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(attempts / MAX_ATTEMPTS) * 100}%`, background: attempts >= 3 ? "#EA4E0D" : "#1677FF" }} />
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || isLocked}
              className="w-full py-4 rounded-xl text-white flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #1677FF 0%, #108EE9 100%)", fontWeight: 800, fontSize: "0.95rem", boxShadow: "0 4px 20px rgba(22,119,255,0.35)" }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : isLocked ? (
                <span>🔒 Dikunci ({countdown}d)</span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Masuk ke Panel Admin</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center mt-6" style={{ color: "#9CA3AF", fontSize: "0.72rem" }}>
            🔒 Aktivitas login dipantau · Hanya untuk staff berwenang · UU ITE Pasal 30
          </p>
        </div>
      </div>
    </div>
  );
}
