import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Terminal, ShieldCheck, LogIn, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 120;
const STORAGE_KEY = "superadmin_login_lock";

function sanitizeInput(val: string): string {
  return val.replace(/['";\-\-\/\*\\<>]/g, "").trim();
}

export function SuperAdminLoginPage() {
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
    if (!cleanEmail) { setError("Email wajib diisi."); return; }
    if (!password) { setError("Kata sandi wajib diisi."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    setError("");
    const result = await login(cleanEmail, password, ["superadmin"]);
    setLoading(false);

    if (result.success) {
      localStorage.removeItem(STORAGE_KEY);
      navigate("/superadmin/dashboard");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockoutUntil(until);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ until, count: newAttempts }));
        setError(`Terlalu banyak percobaan. Akun dikunci selama ${LOCKOUT_SECONDS / 60} menit.`);
      } else {
        setError(`Kredensial tidak valid. (${MAX_ATTEMPTS - newAttempts} percobaan tersisa)`);
      }
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020818 0%, #040D24 50%, #071235 100%)" }}
    >
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "linear-gradient(rgba(100,160,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,255,0.8) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #1677FF 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #108EE9 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-sm px-5 py-8">
        {/* Header badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(22,119,255,0.1)", border: "1px solid rgba(22,119,255,0.25)" }}>
            <Zap size={11} color="#60A5FA" className="animate-pulse" />
            <span style={{ color: "#60A5FA", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px" }}>
              EDUFIN · SUPER ADMIN CONSOLE
            </span>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-7">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: "linear-gradient(135deg, #1239A0 0%, #1677FF 100%)", boxShadow: "0 0 0 1px rgba(22,119,255,0.4), 0 0 50px rgba(22,119,255,0.25)" }}>
              <Terminal size={34} color="white" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#020818", border: "2px solid #020818" }}>
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#22C55E" }} />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
            style={{ background: "rgba(234,78,13,0.1)", border: "1px solid rgba(234,78,13,0.25)" }}>
            <ShieldCheck size={10} color="#FCA5A5" />
            <span style={{ color: "#FCA5A5", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px" }}>
              AUTHORIZED ACCESS ONLY
            </span>
          </div>

          <h1 style={{ color: "white", fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.8px", marginBottom: "4px" }}>
            Super Admin
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
            Platform Management Console · EduFin
          </p>
        </div>

        {/* Lockout Banner */}
        {isLocked && (
          <div className="mb-4 p-3.5 rounded-2xl flex items-center gap-3"
            style={{ background: "rgba(234,78,13,0.08)", border: "1px solid rgba(234,78,13,0.3)" }}>
            <AlertCircle size={16} color="#FCA5A5" className="flex-shrink-0" />
            <div>
              <p style={{ color: "#FCA5A5", fontWeight: 700, fontSize: "0.82rem" }}>Akses Dikunci</p>
              <p style={{ color: "rgba(252,165,165,0.7)", fontSize: "0.72rem" }}>Coba lagi dalam {countdown} detik</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isLocked && (
          <div className="mb-4 px-4 py-3 rounded-2xl flex items-start gap-2.5"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <AlertCircle size={14} color="#FCA5A5" className="mt-0.5 flex-shrink-0" />
            <p style={{ color: "#FCA5A5", fontSize: "0.78rem", lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>

          {/* Attempt warning */}
          {attempts > 0 && attempts < MAX_ATTEMPTS && !isLocked && (
            <div className="px-3 py-2 rounded-xl flex items-center gap-2"
              style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
              <AlertCircle size={12} color="#FDBA74" />
              <p style={{ color: "#FDBA74", fontSize: "0.7rem" }}>
                {MAX_ATTEMPTS - attempts} percobaan tersisa sebelum dikunci {LOCKOUT_SECONDS / 60} menit
              </p>
            </div>
          )}

          {/* Email */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "8px", letterSpacing: "0.8px" }}>
              ADMIN EMAIL
            </label>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: `1.5px solid ${email ? "rgba(22,119,255,0.7)" : "rgba(255,255,255,0.08)"}` }}>
              <Mail size={16} color={email ? "#60A5FA" : "rgba(255,255,255,0.25)"} />
              <input
                type="email"
                placeholder="superadmin@edufin.id"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: "0.88rem", color: "white" }}
                autoComplete="off"
                disabled={isLocked}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "8px", letterSpacing: "0.8px" }}>
              PASSWORD
            </label>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: `1.5px solid ${password ? "rgba(22,119,255,0.7)" : "rgba(255,255,255,0.08)"}` }}>
              <Lock size={16} color={password ? "#60A5FA" : "rgba(255,255,255,0.25)"} />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: "0.88rem", color: "white" }}
                autoComplete="off"
                disabled={isLocked}
              />
              <button onClick={() => setShowPass(!showPass)} className="opacity-40 hover:opacity-80 transition-opacity">
                {showPass ? <EyeOff size={15} color="white" /> : <Eye size={15} color="white" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading || isLocked}
            className="w-full py-4 rounded-xl text-white flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #1239A0 0%, #1677FF 60%, #108EE9 100%)", fontWeight: 800, fontSize: "0.9rem", boxShadow: "0 6px 30px rgba(22,119,255,0.3)", letterSpacing: "0.2px" }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Mengautentikasi...</span>
              </>
            ) : isLocked ? (
              <span>🔒 Dikunci ({countdown}d)</span>
            ) : (
              <>
                <LogIn size={17} />
                <span>Akses Console</span>
              </>
            )}
          </button>
        </div>

        <p className="text-center mt-5" style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.65rem", lineHeight: 1.6 }}>
          Semua aktivitas dicatat dan dipantau · Akses tidak sah adalah pelanggaran UU ITE Pasal 30
        </p>
      </div>
    </div>
  );
}
