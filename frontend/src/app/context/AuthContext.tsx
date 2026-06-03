import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const SESSION_KEY = "edufin_session";

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

import { supabase } from "../lib/supabase";

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
    setIsLoading(true);
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

      if (!data.user) {
         throw new Error("Pendaftaran berhasil, tetapi data user tidak turun.");
      }
      return { success: true, message: "Akun berhasil dibuat! Silakan cek email jika diperlukan." };
    } catch (err: any) {
      console.error("[REGISTER] Network error:", err);
      return { success: false, message: err.message || "Gagal membuat akun." };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Login ───────────────────────────────────────────────
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    setIsLoading(true);
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
    } catch (err: any) {
      console.error("[LOGIN] Error:", err);
      return { success: false, message: err.message || "Email atau kata sandi salah." };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ──────────────────────────────────────────────
  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
  };

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
