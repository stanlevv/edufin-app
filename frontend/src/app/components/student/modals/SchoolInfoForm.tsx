import React from "react";
import { X, MapPin, Phone, Mail, Globe, School } from "lucide-react";

interface SchoolInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchoolInfoForm({ isOpen, onClose }: SchoolInfoFormProps) {
  const schoolInfo = {
    name: "SDN 3 Malang",
    npsn: "20534812",
    address: "Jl. Veteran No. 12, Malang, Jawa Timur 65145",
    phone: "(0341) 123-4567",
    email: "admin@sdn3malang.sch.id",
    website: "www.sdn3malang.sch.id",
    class: "XII IPA 2",
    academicYear: "2025/2026",
    semester: "Genap",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Info Sekolah</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5F7FA" }}>
            <X size={18} color="#8C8C8C" />
          </button>
        </div>

        <div className="space-y-4">
          {/* School Logo & Name */}
          <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "#F5F7FA" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
              <School size={28} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#242424" }}>{schoolInfo.name}</p>
              <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>NPSN: {schoolInfo.npsn}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424" }}>Kontak Sekolah</p>

            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#F5F7FA" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#FFF2F0" }}>
                <MapPin size={16} color="#EA4E0D" />
              </div>
              <div>
                <p style={{ color: "#8C8C8C", fontSize: "0.7rem", marginBottom: "2px" }}>Alamat</p>
                <p style={{ color: "#242424", fontSize: "0.82rem", fontWeight: 500 }}>{schoolInfo.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F5F7FA" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#F6FFED" }}>
                <Phone size={16} color="#52C41A" />
              </div>
              <div>
                <p style={{ color: "#8C8C8C", fontSize: "0.7rem", marginBottom: "2px" }}>Telepon</p>
                <p style={{ color: "#242424", fontSize: "0.82rem", fontWeight: 500 }}>{schoolInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F5F7FA" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#FFF7E6" }}>
                <Mail size={16} color="#FD9A16" />
              </div>
              <div>
                <p style={{ color: "#8C8C8C", fontSize: "0.7rem", marginBottom: "2px" }}>Email</p>
                <p style={{ color: "#242424", fontSize: "0.82rem", fontWeight: 500 }}>{schoolInfo.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F5F7FA" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#EEF4FF" }}>
                <Globe size={16} color="#1677FF" />
              </div>
              <div>
                <p style={{ color: "#8C8C8C", fontSize: "0.7rem", marginBottom: "2px" }}>Website</p>
                <p style={{ color: "#242424", fontSize: "0.82rem", fontWeight: 500 }}>{schoolInfo.website}</p>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="pt-4" style={{ borderTop: "1px solid #F0F0F0" }}>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>
              Info Akademik
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl text-center" style={{ background: "#EEF4FF" }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1677FF" }}>{schoolInfo.class}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.7rem" }}>Kelas</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: "#F6FFED" }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#52C41A" }}>{schoolInfo.academicYear}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.7rem" }}>Tahun Ajaran</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: "#FFF7E6" }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#FD9A16" }}>{schoolInfo.semester}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.7rem" }}>Semester</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-bold"
            style={{ background: "#F5F7FA", color: "#595959" }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
