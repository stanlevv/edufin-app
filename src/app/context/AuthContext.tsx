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
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

import { supabase } from "../lib/supabase";
import { Database } from "../data/database";

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

  // Sesi listener untuk menangani perubahan status login (OAuth Google / Email)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AUTH STATE CHANGE] Event: ${event}`, session?.user?.email);
      
      if (session?.user) {
        const uData = session.user.user_metadata;
        let role = uData.role as UserRole || "donatur";
        let name = uData.name || "User";

        // Query tabel public.users untuk mengambil data role terbaru (terutama untuk login Google)
        try {
          const { data: publicUser, error } = await supabase
            .from("users")
            .select("role, name")
            .eq("id", session.user.id)
            .single();

          if (!error && publicUser) {
            if (publicUser.role) role = publicUser.role as UserRole;
            if (publicUser.name) name = publicUser.name;
          }
        } catch (dbErr) {
          console.error("[AUTH ONSTATECHANGE] Gagal query public.users:", dbErr);
        }

        const supaUser: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: name,
          role: role,
          verified: true,
          nisn: uData.nisn,
          school: uData.school,
          class: uData.class,
          parentName: uData.parentName
        };

        setUser(supaUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Persist session
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));

      if (user.role === "siswa" && user.nisn) {
        const students = Database.getStudents();
        const existingStudent = students.find(s => s.nisn === user.nisn);
        if (existingStudent && existingStudent.userId !== user.id) {
          existingStudent.userId = user.id;
          Database.saveStudent(existingStudent);
        } else if (!existingStudent) {
          Database.saveStudent({
            id: `student-${Date.now()}`,
            userId: user.id,
            nisn: user.nisn,
            name: user.name,
            email: user.email,
            school: user.school || "",
            class: user.class || "",
            parentName: user.parentName || "",
            address: "",
            sppAmount: 750000,
            status: "active",
            verified: true,
          });
        }
      }
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

      // Hubungkan user_id di tabel students jika mendaftar sebagai siswa
      if (payload.role === "siswa" && payload.nisn) {
        const { error: updateError } = await supabase
          .from("students")
          .update({ user_id: data.user.id })
          .eq("nisn", payload.nisn);
          
        if (updateError) {
          console.error("[REGISTER] Gagal menghubungkan user_id ke tabel students:", updateError.message);
        }
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
        
        let role = uData.role as UserRole || "donatur";
        let name = uData.name || "User";

        // Query tabel public.users untuk memvalidasi role
        try {
          const { data: publicUser } = await supabase
            .from("users")
            .select("role, name")
            .eq("id", data.user.id)
            .single();

          if (publicUser) {
            if (publicUser.role) role = publicUser.role as UserRole;
            if (publicUser.name) name = publicUser.name;
          }
        } catch (dbErr) {
          console.error("[LOGIN] Gagal query public.users:", dbErr);
        }

        // Jika siswa, cek registration_status di tabel students
        if (role === 'siswa') {
          const { data: studentData } = await supabase
            .from('students')
            .select('registration_status, name, nisn, class, parent_name')
            .eq('user_id', data.user.id)
            .single();

          if (!studentData) {
            await supabase.auth.signOut();
            return { success: false, message: 'Data siswa tidak ditemukan. Hubungi admin sekolah Anda.' };
          }

          if (studentData.registration_status === 'pending') {
            // Siswa pending boleh login, tapi akan ditampilkan halaman tunggu konfirmasi di dashboard
            // Jangan sign out, biarkan masuk
            name = studentData.name || name;
          }

          if (studentData.registration_status === 'data_only') {
            await supabase.auth.signOut();
            return { success: false, message: 'Silakan daftar terlebih dahulu menggunakan NISN Anda.' };
          }

          // Override name dari data siswa jika ada
          if (studentData.name) name = studentData.name;
        }

        const supaUser: User = {
           id: data.user.id,
           email: data.user.email || email,
           name: name,
           role: role,
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

  // ── Login With Google (OAuth) ────────────────────────────
  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      return { success: true, message: "Mengalihkan ke Google Login..." };
    } catch (err: any) {
      console.error("[GOOGLE AUTH] Error:", err);
      return { success: false, message: err.message || "Gagal login dengan Google." };
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
    <AuthContext.Provider value={{ user, login, logout, register, loginWithGoogle, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
