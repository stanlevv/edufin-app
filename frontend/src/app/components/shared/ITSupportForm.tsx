import React, { useState } from "react";
import { Send, Upload } from "lucide-react";
import { ModalWrapper } from "./ModalWrapper";

interface ITSupportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ITSupportForm({ isOpen, onClose }: ITSupportFormProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Supabase
    alert("Pesan berhasil dikirim ke Tim IT!");
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Hubungi Tim IT"
      subtitle="Kami siap membantu masalah teknis Anda"
      maxWidth="480px"
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Dropdown */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#595959", marginBottom: "6px", display: "block" }}>
              Kategori Masalah
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
              style={{
                borderColor: subject ? "#1677FF" : "#F0F0F0",
                background: "#FAFAFA",
                fontSize: "0.88rem",
                fontWeight: 500,
              }}
            >
              <option value="">Pilih kategori...</option>
              <option value="lupa-password">Lupa Password</option>
              <option value="bug">Bug / Error Aplikasi</option>
              <option value="pembayaran">Masalah Pembayaran</option>
              <option value="data">Kesalahan Data</option>
              <option value="fitur">Pertanyaan Fitur</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#595959", marginBottom: "6px", display: "block" }}>
              Deskripsi Masalah
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              placeholder="Jelaskan masalah yang Anda alami..."
              className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none"
              style={{
                borderColor: description ? "#1677FF" : "#F0F0F0",
                background: "#FAFAFA",
                fontSize: "0.88rem",
                fontWeight: 500,
              }}
            />
          </div>

          {/* File Upload (Optional) */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#595959", marginBottom: "6px", display: "block" }}>
              Lampiran (Opsional)
            </label>
            <label
              className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all"
              style={{
                borderColor: file ? "#1677FF" : "#E0E0E0",
                background: file ? "#F0F7FF" : "#FAFAFA",
              }}
            >
              <Upload size={18} color={file ? "#1677FF" : "#8C8C8C"} />
              <span style={{ fontSize: "0.82rem", color: file ? "#1677FF" : "#8C8C8C", fontWeight: 500 }}>
                {file ? file.name : "Upload screenshot atau file (max 5MB)"}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(145deg, #1677FF 0%, #108EE9 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            <Send size={18} />
            Kirim Pesan
          </button>
        </form>
    </ModalWrapper>
  );
}
