import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle,
  Search, AlertCircle, ChevronRight, Loader, User,
  Sparkles, GraduationCap, School, MapPin, Hash, BookOpen, Users
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ─── Mock NISN Database ───────────────────────────────────────────────────────
const NISN_DB: Record<string, {
  name: string; school: string; class: string;
  nisn: string; parentName: string; address: string;
}> = {
  "0012345678": {
    name: "Budi Santoso",
    school: "SDN 3 Malang",
    class: "X IPA 1",
    nisn: "0012345678",
    parentName: "Hendra Santoso",
    address: "Jl. Veteran No.12, Malang",
  },
  "0087654321": {
    name: "Citra Dewi Rahayu",
    school: "SMPN 5 Batu",
    class: "VIII B",
    nisn: "0087654321",
    parentName: "Dewi Rahayu",
    address: "Jl. Diponegoro No.45, Batu",
  },
  "0099887766": {
    name: "Ahmad Rizki Pratama",
    school: "SMA Negeri 2 Kepanjen",
    class: "XII IPA 2",
    nisn: "0099887766",
    parentName: "Rizki Purnama",
    address: "Jl. Pahlawan No.7, Kepanjen",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "siswa" | "donatur";
type Step = "role" | "nisn" | "verify" | "password" | "donor-auth" | "success";

// ─── Sub-components ───────────────────────────────────────────────────────────
function InputField({
  icon, type = "text", placeholder, value, onChange, suffix, label, error
}: {
  icon: React.ReactNode; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  suffix?: React.ReactNode; label?: string; error?: string;
}) {
  return (
    <div>
      {label && (
        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#242424", marginBottom: "7px" }}>{label}</p>
      )}
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
        style={{
          background: "#F5F7FA",
          border: `1.5px solid ${error ? "#EA4E0D" : value ? "#1677FF" : "transparent"}`,
        }}>
        <span style={{ color: "#8C8C8C", flexShrink: 0 }}>{icon}</span>
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none"
          style={{ fontSize: "0.92rem", color: "#242424" }}
        />
        {suffix}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <AlertCircle size={13} color="#EA4E0D" />
          <p style={{ color: "#EA4E0D", fontSize: "0.75rem" }}>{error}</p>
        </div>
      )}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Min. 8 karakter", ok: password.length >= 8 },
    { label: "Huruf kapital", ok: /[A-Z]/.test(password) },
    { label: "Angka", ok: /[0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.ok).length;
  const colors = ["#EA4E0D", "#FDD504", "#52C41A"];
  const labels = ["Lemah", "Sedang", "Kuat"];

  if (!password) return null;
  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5 mb-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
            style={{ background: i < strength ? colors[strength - 1] : "#E0E0E0" }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(c => (
            <div key={c.label} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full"
                style={{ background: c.ok ? "#52C41A" : "#D9D9D9" }} />
              <span style={{ fontSize: "0.65rem", color: c.ok ? "#52C41A" : "#BFBFBF" }}>{c.label}</span>
            </div>
          ))}
        </div>
        {strength > 0 && (
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: colors[strength - 1] }}>
            {labels[strength - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // State
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [nisn, setNisn] = useState("");
  const [nisnError, setNisnError] = useState("");
  const [nisnLoading, setNisnLoading] = useState(false);
  const [studentData, setStudentData] = useState<typeof NISN_DB[string] | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [name, setName] = useState("");

  // Step progress map
  const STEPS_SISWA: Step[] = ["role", "nisn", "verify", "password", "success"];
  const STEPS_DONOR: Step[] = ["role", "donor-auth", "success"];
  const allSteps = role === "siswa" ? STEPS_SISWA : STEPS_DONOR;
  const stepIdx = allSteps.indexOf(step);
  const progress = step === "success" ? 100 : Math.round((stepIdx / (allSteps.length - 1)) * 100);

  const goBack = () => {
    if (step === "role") { navigate(-1); return; }
    if (step === "nisn" || step === "donor-auth") { setStep("role"); setRole(null); return; }
    if (step === "verify") { setStep("nisn"); setStudentData(null); return; }
    if (step === "password") { setStep("verify"); return; }
  };

  // ── NISN Lookup ──
  const handleNisnLookup = () => {
    const clean = nisn.replace(/\s/g, "");
    if (clean.length < 10) { setNisnError("NISN harus 10 digit."); return; }
    setNisnLoading(true);
    setNisnError("");
    setTimeout(() => {
      const data = NISN_DB[clean];
      if (data) {
        setStudentData(data);
        setStep("verify");
      } else {
        setNisnError("NISN tidak ditemukan. Pastikan NISN sesuai dengan kartu pelajar.");
      }
      setNisnLoading(false);
    }, 1600);
  };

  // ── Password Submit ──
  const handlePasswordSubmit = async () => {
    let ok = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Masukkan alamat email yang valid."); ok = false;
    } else setEmailError("");
    if (password.length < 8) {
      setPasswordError("Password minimal 8 karakter."); ok = false;
    } else if (password !== confirmPassword) {
      setPasswordError("Password tidak cocok."); ok = false;
    } else setPasswordError("");
    if (!ok) return;

    setSubmitLoading(true);
    const result = await register({
      email,
      password,
      role: "siswa",
      name: studentData!.name,
      nisn: studentData!.nisn,
      school: studentData!.school,
      class: studentData!.class,
      parentName: studentData!.parentName,
    });
    setSubmitLoading(false);

    if (!result.success) {
      setEmailError(result.message);
      return;
    }
    setStep("success");
  };

  // ── Donor Submit ──
  const handleDonorSubmit = async () => {
    let ok = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Masukkan alamat email yang valid."); ok = false;
    } else setEmailError("");
    if (password.length < 6) {
      setPasswordError("Password minimal 6 karakter."); ok = false;
    } else setPasswordError("");
    if (!ok) return;

    setSubmitLoading(true);
    const result = await register({
      email,
      password,
      role: "donatur",
      name: name.trim() || email.split("@")[0],
    });
    setSubmitLoading(false);

    if (!result.success) {
      setEmailError(result.message);
      return;
    }
    setStep("success");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SUCCESS
  if (step === "success") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8"
        style={{ background: "linear-gradient(160deg,#0D5FD6 0%,#108EE9 60%,#1AAEFC 100%)" }}>
        {/* Animated check */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}>
            <CheckCircle size={52} color="white" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#52C41A" }}>
            <Sparkles size={16} color="white" />
          </div>
        </div>

        <h2 className="text-white text-center mb-2" style={{ fontSize: "1.6rem", fontWeight: 900 }}>
          {role === "siswa" ? "Akun Terdaftar!" : "Pendaftaran Berhasil!"}
        </h2>

        {role === "siswa" ? (
          <>
            <p className="text-center mb-2" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
              Data siswa <strong style={{ color: "white" }}>{studentData?.name}</strong> berhasil dikaitkan
            </p>
            <div className="w-full rounded-2xl p-4 mb-4 mt-2"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.25)" }}>
                  <GraduationCap size={22} color="white" />
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 800, fontSize: "0.92rem" }}>{studentData?.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>
                    {studentData?.school} · {studentData?.class}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center mb-4 mt-2" style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>
            Akun donatur kamu telah dibuat.
          </p>
        )}

        {/* Email verification notice for ALL roles */}
        <div className="w-full rounded-2xl p-4 mb-8"
          style={{ background: "rgba(255,255,255,0.15)", border: "1.5px dashed rgba(255,255,255,0.5)" }}>
          <p className="text-center" style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>
            ✉️ Cek Konfirmasi Email
          </p>
          <p className="text-center" style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", lineHeight: 1.5 }}>
            Kami telah mengirimkan tautan konfirmasi ke <br/>
            <strong style={{ color: "white", letterSpacing: "0.5px" }}>{email}</strong><br/>
            Silakan verifikasi email Anda sebelum masuk.
          </p>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="w-full py-4 rounded-2xl text-center active:scale-95 transition-all"
          style={{ background: "white", color: "#1677FF", fontWeight: 800, fontSize: "0.95rem" }}
        >
          Masuk ke Akun
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="px-5 pt-12 pb-4">
        {step !== "role" && (
          <button onClick={goBack}
            className="w-10 h-10 rounded-full flex items-center justify-center mb-5 active:scale-90 transition-all"
            style={{ background: "#F5F7FA" }}>
            <ArrowLeft size={20} color="#242424" />
          </button>
        )}
        {step === "role" && <div className="h-2 mb-5" />}

        {/* Progress bar */}
        {step !== "role" && (
          <div className="mb-5">
            <div className="w-full h-1.5 rounded-full" style={{ background: "#F0F0F0" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,#1677FF,#108EE9)" }} />
            </div>
          </div>
        )}

        {/* Step titles */}
        {step === "role" && (
          <>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "#EEF4FF" }}>
                <GraduationCap size={18} color="#1677FF" />
              </div>
              <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "0.82rem" }}>EDUFIN</span>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1A1A2E", marginBottom: "6px" }}>
              Daftar sebagai apa?
            </h1>
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>
              Pilih peran yang sesuai untuk melanjutkan
            </p>
          </>
        )}
        {step === "nisn" && (
          <>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1A1A2E", marginBottom: "6px" }}>
              Masukkan NISN
            </h1>
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>
              Nomor Induk Siswa Nasional tertera di kartu pelajar atau rapor
            </p>
          </>
        )}
        {step === "verify" && (
          <>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1A1A2E", marginBottom: "6px" }}>
              Konfirmasi Data
            </h1>
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>
              Pastikan data di bawah adalah milikmu / anak kamu
            </p>
          </>
        )}
        {step === "password" && (
          <>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1A1A2E", marginBottom: "6px" }}>
              Buat Akun
            </h1>
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>
              Email dan password untuk masuk ke EDUFIN
            </p>
          </>
        )}
        {step === "donor-auth" && (
          <>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1A1A2E", marginBottom: "6px" }}>
              Daftar Donatur
            </h1>
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>
              Daftar cepat, mulai donasi dalam hitungan detik
            </p>
          </>
        )}
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">

        {/* ══ STEP: ROLE ══════════════════════════════════════ */}
        {step === "role" && (
          <div className="space-y-3 mt-2">

            {/* Siswa / Orang Tua */}
            <button
              onClick={() => { setRole("siswa"); setStep("nisn"); }}
              className="w-full rounded-3xl p-5 text-left transition-all active:scale-98"
              style={{
                background: "linear-gradient(135deg,#EEF4FF 0%,#E0EDFF 100%)",
                border: "2px solid #C5D8FF",
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "white", boxShadow: "0 4px 16px rgba(22,119,255,0.15)" }}>
                  <GraduationCap size={32} color="#1677FF" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ fontWeight: 800, color: "#1677FF", fontSize: "1rem" }}>Siswa / Orang Tua</p>
                    <span className="px-2 py-0.5 rounded-full"
                      style={{ background: "#1677FF", color: "white", fontSize: "0.6rem", fontWeight: 700 }}>
                      NISN Required
                    </span>
                  </div>
                  <p style={{ color: "#4A6FA5", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    Bayar SPP, cicilan gratis, ajukan bantuan, dan pantau tagihan anak kamu
                  </p>
                  <div className="flex gap-2 mt-2.5 flex-wrap">
                    {["Bayar SPP", "Cicilan", "Bantuan"].map(t => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full"
                        style={{ background: "rgba(22,119,255,0.12)", color: "#1677FF", fontSize: "0.68rem", fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={18} color="#1677FF" className="mt-1 flex-shrink-0" />
              </div>
            </button>

            {/* Tamu / Donatur */}
            <button
              onClick={() => { setRole("donatur"); setStep("donor-auth"); }}
              className="w-full rounded-3xl p-5 text-left transition-all active:scale-98"
              style={{
                background: "linear-gradient(135deg,#FFF7E0 0%,#FFF0C0 100%)",
                border: "2px solid #FFE17A",
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "white", fontSize: "1.6rem", boxShadow: "0 4px 16px rgba(253,213,4,0.2)" }}>
                  ❤️
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ fontWeight: 800, color: "#B07D00", fontSize: "1rem" }}>Tamu / Donatur</p>
                    <span className="px-2 py-0.5 rounded-full"
                      style={{ background: "#FDD504", color: "#5A4000", fontSize: "0.6rem", fontWeight: 700 }}>
                      Gratis
                    </span>
                  </div>
                  <p style={{ color: "#8B6A00", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    Alumni, perusahaan CSR, atau masyarakat umum yang ingin berdonasi
                  </p>
                  <div className="flex gap-2 mt-2.5 flex-wrap">
                    {["🌐 Publik", "🏆 Sertifikat", "📣 CSR"].map(t => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full"
                        style={{ background: "rgba(253,213,4,0.25)", color: "#8B6A00", fontSize: "0.68rem", fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={18} color="#B07D00" className="mt-1 flex-shrink-0" />
              </div>
            </button>

            {/* Admin notice */}
            <div className="rounded-2xl px-4 py-3.5 flex items-start gap-3"
              style={{ background: "#F5F7FA", border: "1.5px solid #E8E8E8" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#F0F0F0" }}>
                <School size={18} color="#595959" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#595959", fontSize: "0.82rem" }}>
                  Sekolah / Admin
                </p>
                <p style={{ color: "#BFBFBF", fontSize: "0.72rem", lineHeight: 1.4 }}>
                  Akun sekolah hanya dibuat oleh tim EDUFIN.{" "}
                  <span style={{ color: "#1677FF", fontWeight: 600 }}>Hubungi kami</span> untuk aktivasi.
                </p>
              </div>
            </div>

            <p className="text-center pt-2" style={{ fontSize: "0.85rem", color: "#8C8C8C" }}>
              Sudah punya akun?{" "}
              <button onClick={() => navigate("/login")} style={{ color: "#1677FF", fontWeight: 700 }}>
                Masuk
              </button>
            </p>
          </div>
        )}

        {/* ══ STEP: NISN ══════════════════════════════════════ */}
        {step === "nisn" && (
          <div className="mt-2 space-y-4">

            {/* Info box */}
            <div className="rounded-2xl p-4 flex gap-3"
              style={{ background: "#EEF4FF", border: "1px solid #C5D8FF" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#1677FF", fontSize: "0.9rem" }}>ℹ️</div>
              <div>
                <p style={{ fontWeight: 700, color: "#1677FF", fontSize: "0.8rem" }}>Coba NISN Demo</p>
                <p style={{ color: "#4A6FA5", fontSize: "0.73rem", lineHeight: 1.5 }}>
                  Gunakan NISN: <strong>0012345678</strong>, <strong>0087654321</strong>, atau <strong>0099887766</strong> untuk mencoba.
                </p>
              </div>
            </div>

            {/* NISN Input */}
            <div>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#242424", marginBottom: "7px" }}>
                Nomor Induk Siswa Nasional (NISN)
              </p>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
                style={{
                  background: "#F5F7FA",
                  border: `1.5px solid ${nisnError ? "#EA4E0D" : nisn ? "#1677FF" : "transparent"}`,
                }}>
                <Search size={18} color="#8C8C8C" />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Masukkan 10 digit NISN"
                  value={nisn}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setNisn(val);
                    setNisnError("");
                  }}
                  className="flex-1 bg-transparent outline-none tracking-widest"
                  style={{ fontSize: "1rem", color: "#242424", fontWeight: 600 }}
                />
                <span style={{ color: "#BFBFBF", fontSize: "0.75rem" }}>{nisn.length}/10</span>
              </div>
              {nisnError && (
                <div className="flex items-start gap-1.5 mt-2">
                  <AlertCircle size={13} color="#EA4E0D" className="mt-0.5 flex-shrink-0" />
                  <p style={{ color: "#EA4E0D", fontSize: "0.75rem", lineHeight: 1.4 }}>{nisnError}</p>
                </div>
              )}
            </div>

            {/* Digit display */}
            <div className="flex gap-1.5 justify-center">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-7 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: nisn[i] ? "#1677FF" : "#F0F0F0",
                    transition: "all 0.15s ease",
                  }}>
                  <span style={{
                    fontSize: "0.85rem", fontWeight: 800,
                    color: nisn[i] ? "white" : "#D9D9D9"
                  }}>
                    {nisn[i] || "·"}
                  </span>
                </div>
              ))}
            </div>

            <p style={{ color: "#8C8C8C", fontSize: "0.75rem", textAlign: "center", lineHeight: 1.5 }}>
              NISN tertera di kartu pelajar, rapor, atau bisa dicek di{" "}
              <span style={{ color: "#1677FF", fontWeight: 600 }}>nisn.data.kemdikbud.go.id</span>
            </p>

            <button
              onClick={handleNisnLookup}
              disabled={nisn.length !== 10 || nisnLoading}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: nisn.length === 10 ? "linear-gradient(135deg,#1677FF,#108EE9)" : "#F0F0F0",
                color: nisn.length === 10 ? "white" : "#BFBFBF",
                fontWeight: 700, fontSize: "0.95rem",
                boxShadow: nisn.length === 10 ? "0 6px 20px rgba(22,119,255,0.3)" : "none",
              }}
            >
              {nisnLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Memverifikasi data...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Cari & Verifikasi
                </>
              )}
            </button>
          </div>
        )}

        {/* ══ STEP: VERIFY ════════════════════════════════════ */}
        {step === "verify" && studentData && (
          <div className="mt-2 space-y-4">

            {/* Student card */}
            <div className="rounded-3xl overflow-hidden"
              style={{ border: "2px solid #C5D8FF", boxShadow: "0 4px 20px rgba(22,119,255,0.1)" }}>

              {/* Card header */}
              <div className="px-5 py-4"
                style={{ background: "linear-gradient(135deg,#1677FF 0%,#108EE9 100%)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
                    <GraduationCap size={32} color="white" />
                  </div>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem" }}>Data Ditemukan</p>
                    <p style={{ color: "white", fontWeight: 900, fontSize: "1.05rem" }}>{studentData.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                      {studentData.school} · Kelas {studentData.class}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 py-4 space-y-3" style={{ background: "white" }}>
                {[
                  { label: "NISN", value: studentData.nisn, Icon: Hash },
                  { label: "Sekolah", value: studentData.school, Icon: School },
                  { label: "Kelas", value: studentData.class, Icon: BookOpen },
                  { label: "Nama Orang Tua", value: studentData.parentName, Icon: Users },
                  { label: "Alamat", value: studentData.address, Icon: MapPin },
                ].map((row) => {
                  const RowIcon = row.Icon;
                  return (
                    <div key={row.label} className="flex items-start gap-3">
                      <div style={{ width: "20px", flexShrink: 0 }}>
                        <RowIcon size={16} color="#8C8C8C" />
                      </div>
                      <div className="flex-1">
                        <p style={{ color: "#8C8C8C", fontSize: "0.68rem" }}>{row.label}</p>
                        <p style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{row.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Verified badge */}
              <div className="px-5 py-3 flex items-center gap-2"
                style={{ background: "#F6FFED", borderTop: "1px solid #D9F7BE" }}>
                <CheckCircle size={16} color="#52C41A" />
                <p style={{ color: "#52C41A", fontSize: "0.78rem", fontWeight: 700 }}>
                  Data valid dari server Kemdikbud
                </p>
              </div>
            </div>

            {/* Confirm note */}
            <div className="rounded-2xl p-3.5 flex gap-2.5"
              style={{ background: "#FFFBE6", border: "1px solid #FFE17A" }}>
              <AlertCircle size={18} color="#8B6A00" className="flex-shrink-0" />
              <p style={{ color: "#8B6A00", fontSize: "0.75rem", lineHeight: 1.5 }}>
                Pastikan data ini benar. Akun akan dikaitkan permanen dengan NISN{" "}
                <strong>{studentData.nisn}</strong>. Data tidak bisa diubah setelah konfirmasi.
              </p>
            </div>

            {/* Buttons */}
            <button
              onClick={() => setStep("password")}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg,#1677FF,#108EE9)",
                color: "white", fontWeight: 800, fontSize: "0.95rem",
                boxShadow: "0 6px 20px rgba(22,119,255,0.3)",
              }}
            >
              <CheckCircle size={18} /> Ya, Ini Data Saya
            </button>
            <button
              onClick={() => { setStep("nisn"); setStudentData(null); setNisn(""); }}
              className="w-full py-3 rounded-2xl transition-all active:scale-95"
              style={{ background: "#F5F7FA", color: "#595959", fontWeight: 600, fontSize: "0.88rem" }}
            >
              Bukan Saya, Cari Ulang
            </button>
          </div>
        )}

        {/* ══ STEP: PASSWORD (Siswa) ══════════════════════════ */}
        {step === "password" && (
          <div className="mt-2 space-y-4">

            {/* Mini student summary */}
            <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ background: "#EEF4FF", border: "1px solid #C5D8FF" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#1677FF" }}>
                <GraduationCap size={18} color="white" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#1677FF", fontSize: "0.82rem" }}>{studentData?.name}</p>
                <p style={{ color: "#4A6FA5", fontSize: "0.7rem" }}>{studentData?.school} · NISN {studentData?.nisn}</p>
              </div>
              <CheckCircle size={16} color="#52C41A" className="ml-auto flex-shrink-0" />
            </div>

            <InputField
              label="Alamat Email"
              icon={<Mail size={18} />}
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={setEmail}
              error={emailError}
            />

            <div>
              <InputField
                label="Buat Password"
                icon={<Lock size={18} />}
                type={showPass ? "text" : "password"}
                placeholder="Min. 8 karakter"
                value={password}
                onChange={setPassword}
                error={passwordError}
                suffix={
                  <button onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={17} color="#8C8C8C" /> : <Eye size={17} color="#8C8C8C" />}
                  </button>
                }
              />
              <PasswordStrength password={password} />
            </div>

            <InputField
              label="Konfirmasi Password"
              icon={<Lock size={18} />}
              type={showConfirm ? "text" : "password"}
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              suffix={
                <button onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={17} color="#8C8C8C" /> : <Eye size={17} color="#8C8C8C" />}
                </button>
              }
            />

            <button
              onClick={handlePasswordSubmit}
              disabled={!email || !password || !confirmPassword}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg,#1677FF,#108EE9)",
                color: "white", fontWeight: 800, fontSize: "0.95rem",
                boxShadow: "0 6px 20px rgba(22,119,255,0.3)",
              }}
            >
              {submitLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <div className="flex items-center gap-2">
                  Buat Akun Sekarang
                  <Sparkles size={18} />
                </div>
              )}
            </button>

            <p className="text-center" style={{ fontSize: "0.72rem", color: "#BFBFBF", lineHeight: 1.5 }}>
              Dengan mendaftar, kamu menyetujui{" "}
              <span style={{ color: "#1677FF" }}>Syarat & Ketentuan</span> dan{" "}
              <span style={{ color: "#1677FF" }}>Kebijakan Privasi</span> EDUFIN
            </p>
          </div>
        )}

        {/* ══ STEP: DONOR AUTH ════════════════════════════════ */}
        {step === "donor-auth" && (
          <div className="mt-2 space-y-4">

            {/* Google Sign-in */}
            <button
              onClick={() => setStep("success")}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              style={{
                background: "white",
                border: "2px solid #E8E8E8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {/* Google icon SVG */}
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
                <path fill="#FBBC05" d="M11.68 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.34-5.7z" />
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.34 5.7c1.74-5.2 6.59-9.07 12.32-9.07z" />
              </svg>
              <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.95rem" }}>
                Lanjutkan dengan Google
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "#F0F0F0" }} />
              <span style={{ color: "#BFBFBF", fontSize: "0.78rem", fontWeight: 500 }}>atau daftar manual</span>
              <div className="flex-1 h-px" style={{ background: "#F0F0F0" }} />
            </div>

            <InputField
              label="Alamat Email"
              icon={<Mail size={18} />}
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={setEmail}
              error={emailError}
            />

            <div>
              <InputField
                label="Buat Password"
                icon={<Lock size={18} />}
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 karakter"
                value={password}
                onChange={setPassword}
                error={passwordError}
                suffix={
                  <button onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={17} color="#8C8C8C" /> : <Eye size={17} color="#8C8C8C" />}
                  </button>
                }
              />
              <PasswordStrength password={password} />
            </div>

            {/* Name */}
            <InputField
              label="Nama Lengkap (opsional)"
              icon={<User size={18} />}
              placeholder="Nama kamu"
              value={name}
              onChange={setName}
            />

            <button
              onClick={handleDonorSubmit}
              disabled={!email || !password}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg,#FDD504 0%,#FFA500 100%)",
                color: "#5A4000", fontWeight: 800, fontSize: "0.95rem",
                boxShadow: "0 6px 20px rgba(253,213,4,0.35)",
              }}
            >
              {submitLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Daftar sebagai Donatur ❤️
                </>
              )}
            </button>

            <p className="text-center" style={{ fontSize: "0.72rem", color: "#BFBFBF", lineHeight: 1.5 }}>
              Kamu bisa berdonasi tanpa akun melalui link kampanye publik
            </p>

            <p className="text-center" style={{ fontSize: "0.85rem", color: "#8C8C8C" }}>
              Sudah punya akun?{" "}
              <button onClick={() => navigate("/login")} style={{ color: "#1677FF", fontWeight: 700 }}>
                Masuk
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}