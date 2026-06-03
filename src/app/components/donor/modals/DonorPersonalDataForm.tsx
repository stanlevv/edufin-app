import React, { useState } from "react";
import { X, Camera } from "lucide-react";

interface DonorPersonalDataFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonorPersonalDataForm({ isOpen, onClose }: DonorPersonalDataFormProps) {
  const [formData, setFormData] = useState({
    name: "Rina Permata",
    email: "rina.permata@email.com",
    phone: "081298765432",
    organization: "PT. Maju Bersama",
    donorType: "individu",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    alert("Data pribadi berhasil diperbarui!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Data Pribadi</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5F7FA" }}>
            <X size={18} color="#8C8C8C" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontSize: "2rem", fontWeight: 800 }}>
              R
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "#1677FF", border: "2px solid white" }}>
              <Camera size={14} color="white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
              required
            />
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
              required
            />
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              No. Handphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
              required
            />
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Tipe Donatur
            </label>
            <select
              value={formData.donorType}
              onChange={(e) => setFormData({ ...formData, donorType: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
            >
              <option value="individu">Individu / Perorangan</option>
              <option value="alumni">Alumni Sekolah</option>
              <option value="csr">Corporate / CSR</option>
              <option value="yayasan">Yayasan / Lembaga</option>
            </select>
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Nama Organisasi / Perusahaan (Opsional)
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
              placeholder="Kosongkan jika donatur individu"
            />
            <p style={{ fontSize: "0.7rem", color: "#8C8C8C", marginTop: "4px" }}>
              Untuk Alumni, CSR, atau Yayasan
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-white font-bold"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
