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

import { supabase } from "../lib/supabase";

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

    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            name: payload.name,
            role: payload.role,
            nisn: payload.nisn,
            school: payload.school,
            class: payload.class,
            parentName: payload.parentName,
          },
        },
      });

      if (error) {
        console.error("[REGISTER] Supabase error:", error.message);
        return { success: false, message: error.message };
      }

      // Check local users for fallback (offline dev mode)
      if (!data.user) {
         throw new Error("Pendaftaran berhasil, tetapi data user tidak turun.");
      }
      return { success: true, message: "Akun berhasil dibuat! Silakan cek email jika diperlukan." };
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
      return { success: true, message: "Akun (Lokal) berhasil dibuat!" };
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
        return { success: true, message: "Login Demo berhasil!", role: demo.user.role };
      }

      // 2. Supabase Auth
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          const uData = data.user.user_metadata;
          const supaUser: User = {
             id: data.user.id,
             email: data.user.email || email,
             name: uData.name || "User",
             role: uData.role as UserRole,
             verified: true,
             nisn: uData.nisn,
             school: uData.school,
             class: uData.class,
             parentName: uData.parentName
          };
          setUser(supaUser);
          return { success: true, message: "Login berhasil!", role: supaUser.role };
        }
        return { success: false, message: "Data pengguna tidak ditemukan." };
      } catch (authErr: any) {
         console.warn("[LOGIN] Supabase failed, trying local fallback:", authErr.message);
         // 3. Fallback Check local users
         const localUsers = getLocalUsers();
         const localUser = localUsers.find((u) => {
           if (u.email.toLowerCase() !== email.toLowerCase()) return false;
           if ((u as any)._hashed) {
             const inputHash = btoa(email.toLowerCase() + ":" + password + ":edufin");
             return u.password === inputHash;
           }
           return u.password === password;
         });

         if (localUser) {
           setUser(localUser.user);
           return { success: true, message: "Login (Lokal) berhasil!", role: localUser.user.role };
         }
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
