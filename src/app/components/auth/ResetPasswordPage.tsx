import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Receipt, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";

function getPasswordStrength(pwd: string): { level: "lemah" | "sedang" | "kuat"; color: string; pct: number } {
  if (pwd.length < 6) return { level: "lemah", color: "#EA4E0D", pct: 25 };
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
  const score = [pwd.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score <= 2) return { level: "sedang", color: "#D4A017", pct: 55 };
  return { level: "kuat", color: "#52C41A", pct: 100 };
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [hasSession, setHasSession] = useState(false);

  const strength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsNoMatch = confirmPassword && password !== confirmPassword;

  // Periksa apakah ada session dari link reset Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setHasSession(true);
    });
  }, []);

  const handleReset = async () => {
    if (!password) { setError("Masukkan kata sandi baru."); return; }
    if (password.length < 8) { setError("Kata sandi minimal 8 karakter."); return; }
    if (password !== confirmPassword) { setError("Konfirmasi kata sandi tidak cocok."); return; }

    setLoading(true);
    setError("");

    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      // Auto redirect setelah 3 detik
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal reset kata sandi. Coba minta link baru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Header ────────────────────────────────────── */}
      <div
        className="px-5 pt-12 pb-8 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />

        <button
          onClick={() => navigate("/login")}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-6 relative z-10 active:scale-90 transition-all"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
        >
          <ArrowLeft size={20} color="white" />
        </button>

        <div className="flex items-center gap-2.5 mb-3 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
            <Receipt size={20} color="white" />
          </div>
          <span style={{ fontWeight: 900, color: "white", fontSize: "1rem", letterSpacing: "1px" }}>EDUFIN</span>
        </div>

        <h1 className="relative z-10" style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", marginBottom: "4px" }}>
          Buat Kata Sandi Baru
        </h1>
        <p className="relative z-10" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.88rem" }}>
          Minimal 8 karakter dengan huruf kapital dan angka
        </p>
      </div>

      {/* ── Body ──────────────────────────────────────── */}
      <div className="flex-1 px-5 pt-8 pb-10">

        {done ? (
          /* ── SUCCESS STATE ── */
          <div className="flex flex-col items-center text-center pt-8 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: "#F6FFED" }}>
              <ShieldCheck size={42} color="#52C41A" />
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "1.3rem", color: "#242424", marginBottom: "8px" }}>
              Kata Sandi Berhasil Diubah! 🎉
            </h2>
            <p style={{ color: "#8C8C8C", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Kamu akan diarahkan ke halaman login dalam 3 detik...
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full py-4 rounded-2xl text-white transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg,#1677FF 0%,#108EE9 100%)",
                fontWeight: 800,
                boxShadow: "0 6px 24px rgba(22,119,255,0.3)",
              }}
            >
              Masuk Sekarang →
            </button>
          </div>
        ) : !hasSession ? (
          /* ── NO SESSION / LINK EXPIRED ── */
          <div className="flex flex-col items-center text-center pt-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: "#FFF2EE" }}>
              <span style={{ fontSize: "2.5rem" }}>⏰</span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "1.2rem", color: "#242424", marginBottom: "8px" }}>
              Link Sudah Kedaluwarsa
            </h2>
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem", lineHeight: 1.6, maxWidth: "280px" }}>
              Link reset kata sandi ini sudah tidak valid atau sudah digunakan. Minta link baru dari halaman Lupa Kata Sandi.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="mt-6 w-full py-4 rounded-2xl text-white transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg,#1677FF 0%,#108EE9 100%)",
                fontWeight: 800,
                boxShadow: "0 6px 24px rgba(22,119,255,0.3)",
              }}
            >
              Minta Link Baru
            </button>
          </div>
        ) : (
          /* ── FORM STATE ── */
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ background: "#EEF4FF" }}>
                <Lock size={36} color="#1677FF" />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-2xl flex items-start gap-2.5"
                style={{ background: "#FFF2EE", border: "1px solid #FFBDAD" }}>
                <AlertCircle size={16} color="#EA4E0D" className="mt-0.5 flex-shrink-0" />
                <p style={{ color: "#EA4E0D", fontSize: "0.82rem" }}>{error}</p>
              </div>
            )}

            {/* Password baru */}
            <div className="mb-4">
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#242424", display: "block", marginBottom: "7px" }}>
                Kata Sandi Baru
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
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.92rem", color: "#242424" }}
                  autoComplete="new-password"
                />
                <button onClick={() => setShowPass(!showPass)} className="flex-shrink-0">
                  {showPass ? <EyeOff size={18} color="#8C8C8C" /> : <Eye size={18} color="#8C8C8C" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="w-full h-1.5 rounded-full" style={{ background: "#F0F0F0" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${strength.pct}%`, background: strength.color }}
                    />
                  </div>
                  <p className="mt-1" style={{ fontSize: "0.7rem", fontWeight: 600, color: strength.color }}>
                    Kekuatan: {strength.level}
                    {strength.level === "lemah" && " — tambah huruf kapital & angka"}
                    {strength.level === "sedang" && " — tambah karakter spesial untuk lebih kuat"}
                  </p>
                </div>
              )}
            </div>

            {/* Konfirmasi password */}
            <div className="mb-6">
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#242424", display: "block", marginBottom: "7px" }}>
                Konfirmasi Kata Sandi
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
                style={{
                  background: "#F5F7FA",
                  border: `1.5px solid ${passwordsNoMatch ? "#EA4E0D" : passwordsMatch ? "#52C41A" : "transparent"}`,
                }}
              >
                <Lock size={18} color={passwordsNoMatch ? "#EA4E0D" : passwordsMatch ? "#52C41A" : "#8C8C8C"} />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.92rem", color: "#242424" }}
                  autoComplete="new-password"
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                />
                {passwordsMatch && <CheckCircle size={18} color="#52C41A" className="flex-shrink-0" />}
                {!passwordsMatch && (
                  <button onClick={() => setShowConfirm(!showConfirm)} className="flex-shrink-0">
                    {showConfirm ? <EyeOff size={18} color="#8C8C8C" /> : <Eye size={18} color="#8C8C8C" />}
                  </button>
                )}
              </div>
              {passwordsNoMatch && (
                <p className="mt-1" style={{ fontSize: "0.72rem", color: "#EA4E0D", fontWeight: 600 }}>
                  Kata sandi tidak cocok
                </p>
              )}
            </div>

            {/* Tombol reset */}
            <button
              onClick={handleReset}
              disabled={loading || !password || !confirmPassword || password !== confirmPassword}
              className="w-full py-4 rounded-2xl text-white transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2.5"
              style={{
                background: "linear-gradient(135deg,#1677FF 0%,#108EE9 100%)",
                fontWeight: 800, fontSize: "0.95rem",
                boxShadow: "0 6px 24px rgba(22,119,255,0.35)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                "Simpan Kata Sandi Baru"
              )}
            </button>

            {/* Syarat password */}
            <div className="mt-4 px-4 py-3.5 rounded-2xl" style={{ background: "#F5F7FA" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8C8C8C", marginBottom: "8px" }}>SYARAT KATA SANDI:</p>
              {[
                { text: "Minimal 8 karakter", ok: password.length >= 8 },
                { text: "Minimal 1 huruf kapital (A-Z)", ok: /[A-Z]/.test(password) },
                { text: "Minimal 1 angka (0-9)", ok: /[0-9]/.test(password) },
              ].map((req) => (
                <div key={req.text} className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: req.ok ? "#F6FFED" : "#F5F7FA", border: `1.5px solid ${req.ok ? "#52C41A" : "#D9D9D9"}` }}>
                    {req.ok && <span style={{ color: "#52C41A", fontSize: "0.6rem", fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "0.73rem", color: req.ok ? "#52C41A" : "#8C8C8C", fontWeight: req.ok ? 600 : 400 }}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
