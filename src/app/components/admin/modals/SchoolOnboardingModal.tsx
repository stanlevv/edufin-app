import React, { useState } from "react";
import { X, Building, Mail, MapPin, Hash, CheckCircle, ShieldCheck } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";

interface SchoolOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SchoolOnboardingModal({ isOpen, onClose, onSuccess }: SchoolOnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    npsn: "",
    name: "",
    level: "SD",
    city: "",
    address: "",
    adminName: "",
    adminEmail: "",
    adminPassword: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_tenant_and_admin', {
        p_npsn: formData.npsn,
        p_name: formData.name,
        p_level: formData.level,
        p_city: formData.city,
        p_address: formData.address,
        p_admin_name: formData.adminName,
        p_admin_email: formData.adminEmail,
        p_admin_password: formData.adminPassword
      });

      if (error) throw error;
      if (data && !data.success) throw new Error(data.error || "Gagal mendaftarkan tenant");

      toast.success("Sekolah baru berhasil didaftarkan!");
      setStep(3);
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal mendaftarkan tenant: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="bg-[#0F172A] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Building size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Onboarding Sekolah</h2>
              <p className="text-white/50 text-xs">Daftarkan tenant baru ke platform EDUFIN</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-white/70" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 3 ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-500/30">
                <CheckCircle size={40} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sekolah Berhasil Didaftarkan!</h3>
              <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">
                Tenant {formData.name} telah diaktifkan. Akun Super Admin sementara telah dikirim ke email {formData.adminEmail}.
              </p>
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                Selesai
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Progress */}
              <div className="flex gap-2 mb-6">
                <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-white/10"}`} />
                <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-white/10"}`} />
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">NPSN</label>
                      <div className="relative">
                        <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          required
                          value={formData.npsn}
                          onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                          placeholder="8 Digit NPSN"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Jenjang</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                      >
                        <option value="SD">Sekolah Dasar (SD)</option>
                        <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                        <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                        <option value="SMK">Sekolah Menengah Kejuruan (SMK)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Nama Sekolah</label>
                    <div className="relative">
                      <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Contoh: SDN 3 Malang"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Alamat Lengkap</label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-3 text-white/40" />
                        <textarea
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                          placeholder="Jalan, RT/RW, Kelurahan..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Kota</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Kota/Kab"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-2">
                    <div className="flex gap-3">
                      <ShieldCheck size={20} className="text-blue-400 flex-shrink-0" />
                      <p className="text-blue-300 text-xs leading-relaxed">
                        Anda akan membuat akun Admin Sekolah pertama untuk tenant ini. Akun ini akan memiliki full access untuk setup data sekolah.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Nama Admin</label>
                    <input
                      type="text"
                      required
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Nama Lengkap Admin"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Email Admin</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="email"
                        required
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="email@sekolah.sch.id"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Password Sementara</label>
                    <input
                      type="text"
                      required
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-8 flex gap-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors"
                  >
                    Kembali
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : step === 1 ? (
                    "Lanjut Setup Admin"
                  ) : (
                    "Daftarkan Tenant"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
