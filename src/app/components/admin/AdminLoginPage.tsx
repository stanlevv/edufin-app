import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ChevronRight, Shield, ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim()) { setError("Masukkan alamat email admin."); return; }
    if (!password) { setError("Masukkan kata sandi."); return; }
    setLoading(true);
    setError("");
    // Validasi hanya role 'sekolah' yang diizinkan masuk
    const result = await login(email.trim(), password, ["sekolah"]);
    setLoading(false);
    if (result.success) {
      navigate("/school");
    } else {
      setError(result.message || "Email atau kata sandi salah, atau akun tidak memiliki akses admin sekolah.");
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "linear-gradient(160deg, #0a1628 0%, #0D2144 50%, #0D5FD6 100%)" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #60A5FA, transparent)" }} />
        <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #2563EB, transparent)" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Logo & Branding */}
        <div className="text-center mb-10">
          {/* Logo Icon */}
          <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center relative"
            style={{ background: "linear-gradient(135deg, #1677FF 0%, #108EE9 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 20px 60px rgba(22,119,255,0.4)" }}>
            <Shield size={36} color="white" />
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-3xl animate-ping opacity-20"
              style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }} />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(22,119,255,0.15)", border: "1px solid rgba(22,119,255,0.3)" }}>
            <ShieldAlert size={12} color="#60A5FA" />
            <span style={{ color: "#60A5FA", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px" }}>
              RESTRICTED ACCESS
            </span>
          </div>

          <h1 style={{ color: "white", fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "6px" }}>
            Panel Admin Sekolah
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
            Masuk dengan akun administrator sekolah Anda
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-sm">
          <div className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
            }}>

            {/* Subtle inner glow */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

            {/* Error Banner */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-2xl flex items-start gap-2.5"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <AlertCircle size={15} color="#FCA5A5" className="mt-0.5 flex-shrink-0" />
                <p style={{ color: "#FCA5A5", fontSize: "0.8rem", lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="mb-4">
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "8px", letterSpacing: "0.3px" }}>
                EMAIL ADMIN
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1.5px solid ${email ? "rgba(22,119,255,0.7)" : "rgba(255,255,255,0.1)"}`,
                }}>
                <Mail size={17} color={email ? "#60A5FA" : "rgba(255,255,255,0.3)"} />
                <input
                  type="email"
                  placeholder="admin@sekolah.sch.id"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.9rem", color: "white" }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-7">
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "8px", letterSpacing: "0.3px" }}>
                KATA SANDI
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1.5px solid ${password ? "rgba(22,119,255,0.7)" : "rgba(255,255,255,0.1)"}`,
                }}>
                <Lock size={17} color={password ? "#60A5FA" : "rgba(255,255,255,0.3)"} />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.9rem", color: "white" }}
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button onClick={() => setShowPass(!showPass)} className="flex-shrink-0 transition-opacity hover:opacity-100 opacity-60">
                  {showPass ? <EyeOff size={17} color="white" /> : <Eye size={17} color="white" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white relative overflow-hidden transition-all active:scale-95 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #1677FF 0%, #108EE9 100%)",
                fontWeight: 800,
                fontSize: "0.95rem",
                boxShadow: "0 8px 30px rgba(22,119,255,0.45)",
              }}
            >
              {/* Sheen effect */}
              <div className="absolute inset-0 opacity-20"
                style={{ background: "linear-gradient(105deg, transparent 40%, white 55%, transparent 70%)" }} />
              {loading ? (
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Masuk ke Panel Admin</span>
                  <ChevronRight size={18} />
                </div>
              )}
            </button>
          </div>

          {/* Security disclaimer */}
          <div className="mt-6 text-center flex items-center justify-center gap-2">
            <ShieldAlert size={13} color="rgba(255,255,255,0.3)" />
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem" }}>
              Aktivitas login tercatat · Hanya untuk staff berwenang
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}
