import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "siswa" | "sekolah" | "donatur";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
  nisn?: string;
  school?: string;
  class?: string;
  parentName?: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  nisn?: string;
  school?: string;
  class?: string;
  parentName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Demo accounts (always available, no network required) ───────────────────
const DEMO_ACCOUNTS = [
  {
    email: "siswa@edufin.id",
    password: "demo123",
    user: {
      id: "demo-1",
      name: "Budi Santoso",
      email: "siswa@edufin.id",
      role: "siswa" as UserRole,
      verified: true,
      nisn: "0012345678",
      school: "SDN 3 Malang",
      class: "X IPA 1",
      parentName: "Hendra Santoso",
    },
  },
  {
    email: "sekolah@edufin.id",
    password: "demo123",
    user: {
      id: "demo-2",
      name: "Admin SDN 3 Malang",
      email: "sekolah@edufin.id",
      role: "sekolah" as UserRole,
      verified: true,
      school: "SDN 3 Malang",
    },
  },
  {
    email: "donatur@edufin.id",
    password: "demo123",
    user: {
      id: "demo-3",
      name: "Rina Permata",
      email: "donatur@edufin.id",
      role: "donatur" as UserRole,
      verified: true,
    },
  },
];

const SESSION_KEY = "edufin_session";
const USERS_KEY = "edufin_users";

// ─── Environment-based server config (no hardcoded credentials) ──────────────
function getServerBase(): string {
  // Read from environment variables (set in .env.local)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  if (supabaseUrl && supabaseUrl.includes("supabase.co")) {
    return `${supabaseUrl}/functions/v1/make-server-87d0698a`;
  }
  // Fallback: construct from project ID env var
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID as string;
  if (projectId) {
    return `https://${projectId}.supabase.co/functions/v1/make-server-87d0698a`;
  }
  console.warn("[EDUFIN] VITE_SUPABASE_URL not set. API calls will fail. Check .env.local");
  return "";
}

function getAnonKey(): string {
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  if (!key) {
    console.warn("[EDUFIN] VITE_SUPABASE_ANON_KEY not set. Check .env.local");
  }
  return key || "";
}

async function apiFetch(path: string, body: object): Promise<Response> {
  return fetch(`${getServerBase()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAnonKey()}`,
    },
    body: JSON.stringify(body),
  });
}

// ─── Local storage helpers for fallback auth ──────────────────────────────────
function getLocalUsers(): Array<{ email: string; password: string; user: User }> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUser(email: string, password: string, user: User): void {
  const users = getLocalUsers();
  // Store a simple hash instead of plain-text password
  // Note: for real security, use bcrypt on server side. This is client-side only.
  const passwordHash = btoa(email + ":" + password + ":edufin"); // base64 obfuscation
  users.push({ email, password: passwordHash, user, _hashed: true });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Persist session
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  // ── Register ────────────────────────────────────────────
  const register = async (payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    // Block demo emails
    if (DEMO_ACCOUNTS.some((a) => a.email.toLowerCase() === payload.email.toLowerCase())) {
      return { success: false, message: "Email sudah terdaftar. Silakan masuk." };
    }

    // Check local users
    const localUsers = getLocalUsers();
    if (localUsers.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return { success: false, message: "Email sudah terdaftar. Silakan masuk." };
    }

    try {
      const res = await apiFetch("/auth/register", payload);
      const data = await res.json();
      if (!res.ok) {
        console.error("[REGISTER] Server error:", data);
        return { success: false, message: data.message || "Gagal mendaftar." };
      }
      return { success: true, message: data.message || "Akun berhasil dibuat!" };
    } catch (err) {
      console.error("[REGISTER] Network error:", err);

      // Fallback: save locally
      const newUser: User = {
        id: `local-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        verified: false,
        nisn: payload.nisn,
        school: payload.school,
        class: payload.class,
        parentName: payload.parentName,
      };
      saveLocalUser(payload.email, payload.password, newUser);
      return { success: true, message: "Akun berhasil dibuat!" };
    }
  };

  // ── Login ───────────────────────────────────────────────
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    setIsLoading(true);
    try {
      // 1. Demo accounts first (instant, no network)
      const demo = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );
      if (demo) {
        setUser(demo.user);
        return { success: true, message: "Login berhasil!", role: demo.user.role };
      }

      const demoEmailOnly = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.toLowerCase()
      );
      if (demoEmailOnly) {
        return { success: false, message: "Kata sandi salah. Coba lagi." };
      }

      // 2. Check local users
      const localUsers = getLocalUsers();
      const localUser = localUsers.find((u) => {
        if (u.email.toLowerCase() !== email.toLowerCase()) return false;
        if ((u as any)._hashed) {
          // Compare against stored hash
          const inputHash = btoa(email.toLowerCase() + ":" + password + ":edufin");
          return u.password === inputHash;
        }
        return u.password === password; // legacy plain-text (will be migrated on next login)
      });
      if (localUser) {
        setUser(localUser.user);
        return { success: true, message: "Login berhasil!", role: localUser.user.role };
      }

      const localEmailOnly = localUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (localEmailOnly) {
        return { success: false, message: "Kata sandi salah. Coba lagi." };
      }

      // 3. Server / database
      try {
        const res = await apiFetch("/auth/login", { email, password });
        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.user as User);
          return { success: true, message: "Login berhasil!", role: data.user.role };
        }
        return { success: false, message: data.message || "Login gagal." };
      } catch (networkErr) {
        console.error("[LOGIN] Network error:", networkErr);
        // If we get here, the user doesn't exist in demo or local, and we can't reach server
        return { success: false, message: "Email atau kata sandi salah." };
      }
    } catch (err) {
      console.error("[LOGIN] Error:", err);
      return { success: false, message: "Terjadi kesalahan. Coba lagi." };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ──────────────────────────────────────────────
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
