import React, { useState, useEffect } from "react";
import { X, Users, Mail, Plus, ShieldCheck, Search, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";

interface ManageSchoolAdminsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  schoolName: string;
}

export function ManageSchoolAdminsModal({
  isOpen,
  onClose,
  schoolId,
  schoolName
}: ManageSchoolAdminsModalProps) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (isOpen && schoolId) {
      fetchAdmins();
    }
  }, [isOpen, schoolId]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      // Fetch admins for this school
      const { data, error } = await supabase
        .from("school_admins")
        .select("id, role, users!inner(id, name, email)")
        .eq("school_id", schoolId);

      if (error) throw error;
      setAdmins(data || []);
    } catch (err: any) {
      toast.error("Gagal memuat daftar admin: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setAdding(true);
    try {
      // 1. Cari user berdasarkan email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, role")
        .eq("email", emailInput.trim())
        .single();

      if (userError && userError.code !== "PGRST116") {
        throw userError;
      }

      let userId = userData?.id;

      if (!userData) {
        // Skenario: Belum pernah login
        toast.error("Pengguna dengan email ini belum pernah mendaftar/login ke sistem. Minta mereka untuk login via Google terlebih dahulu.");
        setAdding(false);
        return;
      }

      // 2. Jika ketemu, update role menjadi 'sekolah' di public.users
      if (userData.role !== "sekolah") {
        const { error: updateError } = await supabase
          .from("users")
          .update({ role: "sekolah" })
          .eq("id", userId);
        if (updateError) throw updateError;
      }

      // 3. Tambahkan ke school_admins
      const { error: insertError } = await supabase
        .from("school_admins")
        .insert({
          user_id: userId,
          school_id: schoolId,
          name: emailInput.split('@')[0], // Default name if we don't have it explicitly in school_admins
          role: "admin"
        });

      if (insertError) {
        if (insertError.code === "23505") { // unique violation
          toast.info("Pengguna ini sudah menjadi admin di sekolah ini.");
        } else {
          throw insertError;
        }
      } else {
        toast.success(`Berhasil menambahkan ${emailInput} sebagai Admin!`);
        setEmailInput("");
        fetchAdmins();
      }

    } catch (err: any) {
      console.error(err);
      toast.error("Gagal menambahkan admin: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users size={22} className="text-blue-600" />
              Kelola Admin Sekolah
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {schoolName}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} color="#595959" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Add Admin Form */}
          <form onSubmit={handleAddAdmin} className="mb-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <label className="block text-xs font-semibold text-blue-800 mb-2">
              TAMBAHKAN ADMIN BARU
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Alamat Email (cth: kepsek@gmail.com)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={adding}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Undang
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Masukkan email admin. Jika menggunakan akun Google, minta mereka login ke Edufin sekali terlebih dahulu agar terdaftar di sistem.
            </p>
          </form>

          {/* Admin List */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              Daftar Admin Aktif ({admins.length})
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-blue-500" />
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                <ShieldCheck size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Belum ada admin yang ditugaskan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {admins.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                      {a.users.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{a.users.name}</p>
                      <p className="text-xs text-gray-500 truncate">{a.users.email}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-100 rounded-lg text-xs font-semibold capitalize">
                      {a.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
