import React, { useState } from "react";
import { X } from "lucide-react";

interface SchoolDataFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchoolDataForm({ isOpen, onClose }: SchoolDataFormProps) {
  const [formData, setFormData] = useState({
    name: "SDN 3 Malang",
    npsn: "20534812",
    address: "Jl. Veteran No.12, Malang",
    phone: "(0341) 123-4567",
    email: "admin@sdn3malang.sch.id",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    alert("Data sekolah berhasil diperbarui!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Data Sekolah</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5F7FA" }}>
            <X size={18} color="#8C8C8C" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Nama Sekolah
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
              NPSN
            </label>
            <input
              type="text"
              value={formData.npsn}
              onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
              required
            />
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Alamat Lengkap
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem", minHeight: "80px" }}
              required
            />
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Nomor Telepon
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
              Email Resmi
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
