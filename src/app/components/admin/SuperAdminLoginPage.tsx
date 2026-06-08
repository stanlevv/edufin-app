import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ChevronRight, ShieldCheck, Terminal, Activity } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function SuperAdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async () => {
    if (!email.trim()) { setError("Email wajib diisi."); return; }
    if (!password) { setError("Kata sandi wajib diisi."); return; }

    // Rate limiting sederhana di frontend
    if (attempts >= 5) {
      setError("Terlalu banyak percobaan gagal. Silakan tunggu beberapa menit.");
      return;
    }

    setLoading(true);
    setError("");

    // Hanya izinkan role superadmin
    const result = await login(email.trim(), password, "superadmin");
    setLoading(false);

    if (result.success) {
      navigate("/superadmin/dashboard");
    } else {
      setAttempts((prev) => prev + 1);
      // Pesan error sengaja dibuat generic agar tidak bocorkan info
      setError("Kredensial tidak valid atau akun tidak memiliki otorisasi super admin.");
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen relative overflow-hidden"
      style={{ background: "#060A14" }}
    >
      {/* Animated background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep gradient */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(22,50,120,0.4) 0%, transparent 60%)" }} />
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-64" style={{ background: "linear-gradient(to top, rgba(22,119,255,0.05), transparent)" }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(100,160,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Diagonal stripe accent */}
        <div className="absolute -top-20 -right-40 w-80 h-[500px] opacity-5 rotate-12"
          style={{ background: "linear-gradient(135deg, #1677FF, transparent)" }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">

        {/* Top status bar */}
        <div className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full"
          style={{ background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.15)" }}>
          <Activity size={12} color="#60A5FA" className="animate-pulse" />
          <span style={{ color: "#60A5FA", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1.5px" }}>
            EDUFIN PLATFORM · SUPER ADMIN CONSOLE
          </span>
        </div>

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-5">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, #0D2A6B 0%, #1239A0 50%, #1677FF 100%)",
                boxShadow: "0 0 0 1px rgba(22,119,255,0.3), 0 0 60px rgba(22,119,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
              }}>
              <Terminal size={38} color="white" strokeWidth={1.5} />
            </div>
            {/* Status dot */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#060A14", border: "2px solid #060A14" }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: "#22C55E" }} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <ShieldCheck size={11} color="#FCA5A5" />
            <span style={{ color: "#FCA5A5", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px" }}>
              TOP SECRET — AUTHORIZED ACCESS ONLY
            </span>
          </div>

          <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 900, letterSpacing: "-1px", marginBottom: "6px" }}>
            Super Admin
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem" }}>
            Platform Management Console · EduFin
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm">
          <div className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 32px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}>

            {/* Top highlight */}
            <div className="absolute top-0 left-8 right-8 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

            {/* Attempt counter warning */}
            {attempts > 2 && (
              <div className="mb-4 px-3 py-2 rounded-xl flex items-center gap-2"
                style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
                <AlertCircle size={13} color="#FDBA74" />
                <p style={{ color: "#FDBA74", fontSize: "0.72rem" }}>
                  {5 - attempts} percobaan tersisa sebelum diblokir sementara
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-2xl flex items-start gap-2.5"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <AlertCircle size={14} color="#FCA5A5" className="mt-0.5 flex-shrink-0" />
                <p style={{ color: "#FCA5A5", fontSize: "0.78rem", lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label style={{ fontSize: "0.7rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "8px", letterSpacing: "0.8px" }}>
                ADMIN EMAIL
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1.5px solid ${email ? "rgba(22,119,255,0.6)" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: email ? "0 0 20px rgba(22,119,255,0.08)" : "none",
                }}>
                <Mail size={16} color={email ? "#60A5FA" : "rgba(255,255,255,0.2)"} />
                <input
                  type="email"
                  placeholder="superadmin@edufin.id"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.88rem", color: "white" }}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-8">
              <label style={{ fontSize: "0.7rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "8px", letterSpacing: "0.8px" }}>
                PASSWORD
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1.5px solid ${password ? "rgba(22,119,255,0.6)" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: password ? "0 0 20px rgba(22,119,255,0.08)" : "none",
                }}>
                <Lock size={16} color={password ? "#60A5FA" : "rgba(255,255,255,0.2)"} />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.88rem", color: "white", letterSpacing: showPass ? "normal" : "2px" }}
                  autoComplete="off"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button onClick={() => setShowPass(!showPass)} className="opacity-40 hover:opacity-80 transition-opacity">
                  {showPass ? <EyeOff size={16} color="white" /> : <Eye size={16} color="white" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={loading || attempts >= 5}
              className="w-full py-4 rounded-2xl text-white relative overflow-hidden transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "rgba(22,119,255,0.5)"
                  : "linear-gradient(135deg, #1239A0 0%, #1677FF 50%, #108EE9 100%)",
                fontWeight: 800,
                fontSize: "0.92rem",
                letterSpacing: "0.3px",
                boxShadow: "0 8px 40px rgba(22,119,255,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <div className="absolute inset-0 opacity-15"
                style={{ background: "linear-gradient(105deg, transparent 35%, white 50%, transparent 65%)" }} />
              {loading ? (
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Mengautentikasi...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck size={17} />
                  <span>Akses Console</span>
                  <ChevronRight size={16} />
                </div>
              )}
            </button>
          </div>

          {/* Footer disclaimer */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck size={12} color="rgba(255,255,255,0.2)" />
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem", letterSpacing: "0.3px" }}>
                Semua aktivitas dicatat dan dipantau
              </p>
            </div>
            <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.62rem", textAlign: "center" }}>
              Akses tidak sah adalah pelanggaran hukum · UU ITE Pasal 30
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
