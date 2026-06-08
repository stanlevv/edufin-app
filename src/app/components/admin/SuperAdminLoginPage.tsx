import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 120;
const STORAGE_KEY = "superadmin_login_lock";

function sanitizeInput(val: string): string {
  return val.replace(/['";\-\-\/\*\\<>]/g, "").trim();
}

const BOOT_LINES = [
  "EDUFIN OS v2.6.0 · kernel 5.15.0-edufin",
  "Loading secure modules.............. OK",
  "Initializing RLS policies........... OK",
  "Mounting encrypted partition......... OK",
  "Starting auth daemon................. OK",
  "SuperAdmin console ready.",
];

export function SuperAdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [activeField, setActiveField] = useState<"email" | "password" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Boot sequence animation
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBootDone(true);
          setActiveField("email");
          setTimeout(() => emailRef.current?.focus(), 100);
        }, 400);
      }
    }, 220);
    return () => clearInterval(interval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const iv = setInterval(() => setCursorBlink((b) => !b), 500);
    return () => clearInterval(iv);
  }, []);

  // Restore lockout
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { until, count } = JSON.parse(stored);
      if (Date.now() < until) { setLockoutUntil(until); setAttempts(count); }
      else localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Countdown
  useEffect(() => {
    if (!lockoutUntil) return;
    const iv = setInterval(() => {
      const rem = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (rem <= 0) {
        setLockoutUntil(null); setAttempts(0); setCountdown(0);
        localStorage.removeItem(STORAGE_KEY);
        clearInterval(iv);
      } else setCountdown(rem);
    }, 1000);
    return () => clearInterval(iv);
  }, [lockoutUntil]);

  const isLocked = lockoutUntil !== null && Date.now() < lockoutUntil;

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [bootLines, bootDone, submitted, error]);

  const handleLogin = async () => {
    if (isLocked || loading) return;
    const cleanEmail = sanitizeInput(email);
    if (!cleanEmail || !password) {
      setError("auth: missing credentials");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("auth: invalid email format");
      return;
    }

    setSubmitted(true);
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
      setSubmitted(false);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockoutUntil(until);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ until, count: newAttempts }));
        setError(`auth: too many failed attempts — locked for ${LOCKOUT_SECONDS}s`);
      } else {
        setError(`auth: invalid credentials (${MAX_ATTEMPTS - newAttempts} attempts remaining)`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0A0A0A" }}>

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        }} />

      {/* Subtle blue ambient glow top-left */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #1677FF, transparent)" }} />
      {/* Bottom right amber glow */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }} />

      <div className="relative z-20 w-full max-w-2xl px-4 py-8">

        {/* Terminal window chrome */}
        <div className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(22,119,255,0.06), 0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(22,119,255,0.04)",
          }}>

          {/* Title bar */}
          <div className="flex items-center gap-3 px-5 py-3.5"
            style={{ background: "#161616", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
            </div>
            <div className="flex-1 text-center">
              <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>
                edufin-console — superadmin@auth:~
              </span>
            </div>
            <div className="w-14" />
          </div>

          {/* Terminal body */}
          <div
            ref={terminalRef}
            className="p-6 overflow-y-auto"
            style={{
              background: "#0D0D0D",
              minHeight: "420px",
              maxHeight: "80vh",
              fontFamily: "'Courier New', 'Lucida Console', monospace",
            }}
          >
            {/* Boot sequence */}
            <div className="mb-4">
              {bootLines.map((line, i) => {
                if (!line) return null;
                const isOk = line.endsWith("OK");
                const isReady = line.includes("ready");
                return (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    {isOk ? (
                      <>
                        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>
                          {line.replace("OK", "").trimEnd()}
                        </span>
                        <span style={{ color: "#22C55E", fontSize: "0.8rem", fontWeight: 700 }}>OK</span>
                      </>
                    ) : isReady ? (
                      <span style={{ color: "#60A5FA", fontSize: "0.8rem", fontWeight: 700 }}>{line}</span>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>{line}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Login form — CLI style */}
            {bootDone && (
              <div>
                <div className="mb-5 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "#22C55E", fontSize: "0.82rem" }}>edufin-auth</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}> $ </span>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>login --role superadmin</span>
                </div>

                {/* Email input */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span style={{ color: "#60A5FA", fontSize: "0.78rem" }}>email</span>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.78rem" }}>{">"}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                    style={{
                      background: activeField === "email" ? "rgba(22,119,255,0.06)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${activeField === "email" ? "rgba(22,119,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                      transition: "all 0.2s",
                    }}>
                    <span style={{ color: "#22C55E", fontSize: "0.8rem", userSelect: "none" }}>$</span>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      onFocus={() => setActiveField("email")}
                      onBlur={() => setActiveField(null)}
                      onKeyDown={(e) => { if (e.key === "Enter") { setActiveField("password"); (document.getElementById("sa-pass") as HTMLInputElement)?.focus(); } }}
                      placeholder="admin@edufin.app"
                      disabled={isLocked || loading}
                      className="flex-1 bg-transparent outline-none"
                      style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#E5E7EB", caretColor: "#22C55E" }}
                      autoComplete="off"
                    />
                    {activeField === "email" && (
                      <span style={{ color: "#22C55E", opacity: cursorBlink ? 1 : 0, fontSize: "0.9rem", transition: "opacity 0.1s" }}>▌</span>
                    )}
                  </div>
                </div>

                {/* Password input — CLI style */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span style={{ color: "#60A5FA", fontSize: "0.78rem" }}>password</span>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.78rem" }}>{">"}</span>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem", fontStyle: "italic" }}>(hidden)</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                    style={{
                      background: activeField === "password" ? "rgba(22,119,255,0.06)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${activeField === "password" ? "rgba(22,119,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                      transition: "all 0.2s",
                    }}>
                    <span style={{ color: "#22C55E", fontSize: "0.8rem", userSelect: "none" }}>$</span>
                    <input
                      id="sa-pass"
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      onFocus={() => setActiveField("password")}
                      onBlur={() => setActiveField(null)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                      placeholder="••••••••••••"
                      disabled={isLocked || loading}
                      className="flex-1 bg-transparent outline-none"
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        color: "#E5E7EB",
                        caretColor: "#22C55E",
                        letterSpacing: password ? "4px" : "normal",
                      }}
                      autoComplete="off"
                    />
                    {activeField === "password" && (
                      <span style={{ color: "#22C55E", opacity: cursorBlink ? 1 : 0, fontSize: "0.9rem", transition: "opacity 0.1s" }}>▌</span>
                    )}
                  </div>
                </div>

                {/* Loading / submitted state */}
                {submitted && loading && (
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ background: "#22C55E", animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    <span style={{ color: "#22C55E", fontFamily: "monospace", fontSize: "0.8rem" }}>
                      authenticating...
                    </span>
                  </div>
                )}

                {/* Error output */}
                {error && (
                  <div className="mb-4 flex items-start gap-2">
                    <AlertCircle size={13} color="#EF4444" className="mt-0.5 flex-shrink-0" />
                    <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#EF4444" }}>
                      {error}
                    </span>
                  </div>
                )}

                {/* Lockout */}
                {isLocked && (
                  <div className="mb-4 px-3 py-2.5 rounded-lg"
                    style={{ background: "rgba(234,78,13,0.06)", border: "1px solid rgba(234,78,13,0.2)" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#F97316" }}>
                      [LOCKOUT] session blocked — retry in {countdown}s
                    </span>
                  </div>
                )}

                {/* Attempts bar */}
                {attempts > 0 && !isLocked && (
                  <div className="mb-4">
                    <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)" }}>
                      failed attempts: {Array(attempts).fill("█").join("")}{Array(MAX_ATTEMPTS - attempts).fill("░").join("")} {attempts}/{MAX_ATTEMPTS}
                    </span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleLogin}
                  disabled={isLocked || loading || !email || !password}
                  className="w-full py-3 rounded-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: isLocked ? "rgba(255,255,255,0.04)" : "rgba(22,119,255,0.12)",
                    border: `1px solid ${isLocked ? "rgba(255,255,255,0.06)" : "rgba(22,119,255,0.35)"}`,
                    fontFamily: "monospace",
                    color: isLocked ? "rgba(255,255,255,0.2)" : "#60A5FA",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}
                >
                  {loading ? (
                    <span>authenticating<span className="animate-pulse">...</span></span>
                  ) : isLocked ? (
                    <span>🔒 LOCKED ({countdown}s)</span>
                  ) : (
                    <>
                      <span style={{ color: "#22C55E" }}>$</span>
                      <span>exec login --verify</span>
                      <span style={{ color: "rgba(255,255,255,0.2)", marginLeft: "auto", fontSize: "0.72rem" }}>↵ Enter</span>
                    </>
                  )}
                </button>

                {/* Footer */}
                <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <p style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.12)", textAlign: "center", lineHeight: 1.8 }}>
                    All connections encrypted · Activity logged · Unauthorized access violates UU ITE Pasal 30
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-2"
            style={{ background: "#1677FF", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.85)", letterSpacing: "0.3px" }}>
              ● SECURE CONNECTION
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)" }}>
              edufin-console v2.6 · ap-southeast-1
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.85)" }}>
              {isLocked ? "🔒 LOCKED" : attempts > 0 ? `⚠ ${attempts} ERR` : "● READY"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
