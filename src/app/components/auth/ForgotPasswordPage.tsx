import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Receipt, Send } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email.trim()) { setError("Masukkan alamat email kamu."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError("Format email tidak valid."); return; }

    setLoading(true);
    setError("");

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });
      if (err) throw err;
      setSent(true);
    } catch (err: any) {
      setError("Gagal mengirim link reset. Pastikan email terdaftar di sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Header ─────────────────────────────────── */}
      <div
        className="px-5 pt-12 pb-8 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute bottom-0 right-12 w-24 h-24 rounded-full opacity-8" style={{ background: "white" }} />

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
          Lupa Kata Sandi?
        </h1>
        <p className="relative z-10" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.88rem" }}>
          Masukkan email kamu dan kami kirimkan link reset
        </p>
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="flex-1 px-5 pt-8 pb-10">

        {sent ? (
          /* ── SUCCESS STATE ── */
          <div className="flex flex-col items-center text-center pt-8 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: "#F6FFED" }}>
              <CheckCircle size={40} color="#52C41A" />
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "1.3rem", color: "#242424", marginBottom: "8px" }}>
              Email Terkirim! ✅
            </h2>
            <p style={{ color: "#8C8C8C", fontSize: "0.88rem", lineHeight: 1.6, maxWidth: "280px" }}>
              Link reset kata sandi telah dikirim ke{" "}
              <strong style={{ color: "#1677FF" }}>{email}</strong>.{" "}
              Cek kotak masuk (dan folder Spam) kamu.
            </p>

            <div className="mt-6 w-full px-4 py-4 rounded-2xl" style={{ background: "#F5F7FA" }}>
              <p style={{ color: "#595959", fontSize: "0.8rem", lineHeight: 1.6 }}>
                📌 Link reset berlaku selama <strong>1 jam</strong>. Jika tidak menerima email, periksa folder Spam atau coba lagi.
              </p>
            </div>

            <button
              onClick={() => setSent(false)}
              className="mt-4 w-full py-3 rounded-2xl transition-all active:scale-95"
              style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 700 }}
            >
              Kirim Ulang
            </button>

            <button
              onClick={() => navigate("/login")}
              className="mt-3 w-full py-4 rounded-2xl text-white transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg,#1677FF 0%,#108EE9 100%)",
                fontWeight: 800,
                boxShadow: "0 6px 24px rgba(22,119,255,0.3)",
              }}
            >
              Kembali ke Halaman Login
            </button>
          </div>
        ) : (
          /* ── FORM STATE ── */
          <>
            {/* Ilustrasi kunci */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ background: "#EEF4FF" }}>
                <span style={{ fontSize: "2.2rem" }}>🔐</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-2xl flex items-start gap-2.5"
                style={{ background: "#FFF2EE", border: "1px solid #FFBDAD" }}>
                <AlertCircle size={16} color="#EA4E0D" className="mt-0.5 flex-shrink-0" />
                <p style={{ color: "#EA4E0D", fontSize: "0.82rem", lineHeight: 1.45 }}>{error}</p>
              </div>
            )}

            {/* Input email */}
            <div className="mb-5">
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#242424", display: "block", marginBottom: "7px" }}>
                Alamat Email
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
                style={{
                  background: "#F5F7FA",
                  border: `1.5px solid ${error ? "#EA4E0D" : email ? "#1677FF" : "transparent"}`,
                }}
              >
                <Mail size={18} color={email ? "#1677FF" : "#8C8C8C"} />
                <input
                  type="email"
                  placeholder="Masukkan email yang terdaftar"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.92rem", color: "#242424" }}
                  autoComplete="email"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
              </div>
            </div>

            {/* Info box */}
            <div className="mb-6 px-4 py-3.5 rounded-2xl flex gap-3"
              style={{ background: "#F5F7FA" }}>
              <span style={{ fontSize: "1.1rem" }}>💡</span>
              <p style={{ color: "#8C8C8C", fontSize: "0.78rem", lineHeight: 1.6 }}>
                Pastikan gunakan email yang sama saat mendaftar akun EDUFIN.{" "}
                <strong style={{ color: "#595959" }}>Siswa/Ortu</strong> gunakan email orang tua yang didaftarkan sekolah.
              </p>
            </div>

            {/* Tombol kirim */}
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2.5"
              style={{
                background: "linear-gradient(135deg,#1677FF 0%,#108EE9 100%)",
                fontWeight: 800, fontSize: "0.95rem",
                boxShadow: "0 6px 24px rgba(22,119,255,0.35)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Kirim Link Reset</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 rounded-2xl mt-3 transition-all active:scale-95"
              style={{ background: "#F5F7FA", color: "#595959", fontWeight: 600 }}
            >
              Batal, Kembali ke Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
