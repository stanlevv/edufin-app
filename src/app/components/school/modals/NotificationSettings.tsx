import React, { useState } from "react";
import { X } from "lucide-react";

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotifSettings {
  sppPayment: boolean;
  campaignDonation: boolean;
  aidRequest: boolean;
  overduePayment: boolean;
  systemUpdate: boolean;
  email: boolean;
  whatsapp: boolean;
}

export function NotificationSettings({ isOpen, onClose }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotifSettings>({
    sppPayment: true,
    campaignDonation: true,
    aidRequest: true,
    overduePayment: true,
    systemUpdate: false,
    email: true,
    whatsapp: true,
  });

  const handleToggle = (key: keyof NotifSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    // TODO: Submit to API
    alert("Pengaturan notifikasi berhasil disimpan!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Pengaturan Notifikasi</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5F7FA" }}>
            <X size={18} color="#8C8C8C" />
          </button>
        </div>

        {/* Event Notifications */}
        <div className="mb-6">
          <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>Notifikasi Kejadian</p>
          <div className="space-y-3">
            {[
              { key: "sppPayment" as const, label: "Pembayaran SPP Masuk", desc: "Notifikasi setiap ada pembayaran SPP baru" },
              { key: "campaignDonation" as const, label: "Donasi Kampanye", desc: "Notifikasi setiap ada donasi ke kampanye" },
              { key: "aidRequest" as const, label: "Pengajuan Bantuan SPP", desc: "Notifikasi saat ada siswa mengajukan bantuan" },
              { key: "overduePayment" as const, label: "Tagihan Jatuh Tempo", desc: "Notifikasi otomatis untuk tagihan yang lewat deadline" },
              { key: "systemUpdate" as const, label: "Update Sistem", desc: "Notifikasi fitur baru dan pemeliharaan sistem" },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between p-3 rounded-xl" style={{ background: "#F5F7FA" }}>
                <div className="flex-1 pr-3">
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#242424" }}>{item.label}</p>
                  <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className="flex-shrink-0 w-12 h-6 rounded-full transition-all relative"
                  style={{ background: settings[item.key] ? "#52C41A" : "#D9D9D9" }}
                >
                  <span
                    className="absolute w-5 h-5 rounded-full bg-white transition-all"
                    style={{ top: "2px", left: settings[item.key] ? "26px" : "2px" }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Channels */}
        <div className="mb-6">
          <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>Saluran Notifikasi</p>
          <div className="space-y-3">
            {[
              { key: "email" as const, label: "Email", desc: "Kirim notifikasi ke admin@sdn3malang.sch.id" },
              { key: "whatsapp" as const, label: "WhatsApp", desc: "Kirim notifikasi via WhatsApp Business API" },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between p-3 rounded-xl" style={{ background: "#F5F7FA" }}>
                <div className="flex-1 pr-3">
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#242424" }}>{item.label}</p>
                  <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className="flex-shrink-0 w-12 h-6 rounded-full transition-all relative"
                  style={{ background: settings[item.key] ? "#52C41A" : "#D9D9D9" }}
                >
                  <span
                    className="absolute w-5 h-5 rounded-full bg-white transition-all"
                    style={{ top: "2px", left: settings[item.key] ? "26px" : "2px" }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl text-white font-bold"
          style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}
