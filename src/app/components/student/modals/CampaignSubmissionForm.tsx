import React, { useState } from "react";
import { X, Heart, Image as ImageIcon, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";

interface CampaignSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CampaignSubmissionForm({ isOpen, onClose, onSuccess }: CampaignSubmissionFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Beasiswa",
    targetAmount: "",
    story: "",
    imageFile: null as File | null,
    imagePreview: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, imageFile: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    try {
      // 1. Get student_id and school_id for this user
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("id, school_id")
        .eq("user_id", user.id)
        .single();

      if (studentError || !studentData) {
        throw new Error("Data siswa tidak ditemukan. Harap lengkapi profil terlebih dahulu.");
      }

      let imageUrl = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"; // Default
      
      // 2. Upload image to Supabase Storage if provided
      if (formData.imageFile) {
        const fileExt = formData.imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `campaigns/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("edufin-assets")
          .upload(filePath, formData.imageFile);

        if (!uploadError) {
          const { data: publicUrl } = supabase.storage
            .from("edufin-assets")
            .getPublicUrl(filePath);
          imageUrl = publicUrl.publicUrl;
        }
      }

      // 3. Insert Campaign (status pending)
      const { error: insertError } = await supabase.from("campaigns").insert({
        title: formData.title,
        category: formData.category,
        target_amount: parseInt(formData.targetAmount.replace(/\D/g, "") || "0", 10),
        story: formData.story,
        description: formData.story.substring(0, 100) + "...",
        image_url: imageUrl,
        status: "pending",
        student_id: studentData.id,
        school_id: studentData.school_id,
        created_by: user.id,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);

    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat mengajukan kampanye.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="bg-white w-full rounded-t-3xl relative z-10 flex flex-col transition-transform duration-300"
        style={{ maxHeight: "90vh" }}>
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
          <div>
            <h3 style={{ fontWeight: 800, color: "#242424", fontSize: "1.1rem" }}>Ajukan Galang Dana</h3>
            <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>Ceritakan kebutuhan pendidikanmu</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={18} color="#595959" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1 pb-32">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle size={32} color="#52C41A" />
              </div>
              <h4 style={{ fontWeight: 800, color: "#242424", fontSize: "1.1rem", marginBottom: "8px" }}>
                Pengajuan Berhasil!
              </h4>
              <p style={{ color: "#8C8C8C", fontSize: "0.85rem", lineHeight: "1.5" }}>
                Kampanye kamu telah dikirim ke Admin Sekolah untuk proses verifikasi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Photo Upload */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#595959", display: "block", marginBottom: "8px" }}>
                  Foto/Brosur Pendukung
                </label>
                <div className="relative w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden"
                  style={{ borderColor: "#E8E8E8", background: "#FAFAFA" }}>
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={24} color="#BFBFBF" className="mb-2" />
                      <span style={{ fontSize: "0.75rem", color: "#8C8C8C" }}>Tap untuk unggah foto</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#595959", display: "block", marginBottom: "8px" }}>
                  Judul Kampanye
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bantuan Beli Laptop Bekas untuk UNBK"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ background: "#F5F7FA", border: "1.5px solid transparent", fontSize: "0.9rem" }}
                  onFocus={(e) => e.target.style.borderColor = "#1677FF"}
                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#595959", display: "block", marginBottom: "8px" }}>
                  Kategori Kebutuhan
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: "#F5F7FA", fontSize: "0.9rem" }}
                >
                  <option value="Beasiswa">Beasiswa (SPP / Buku)</option>
                  <option value="Fasilitas">Fasilitas (Laptop / Seragam)</option>
                  <option value="Perlengkapan">Perlengkapan Alat Tulis</option>
                  <option value="Ujian">Biaya Ujian & Sertifikasi</option>
                </select>
              </div>

              {/* Target Amount */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#595959", display: "block", marginBottom: "8px" }}>
                  Target Dana (Rp)
                </label>
                <input
                  type="text"
                  required
                  placeholder="500.000"
                  value={formData.targetAmount}
                  onChange={(e) => {
                    const num = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, targetAmount: num ? parseInt(num).toLocaleString("id-ID") : "" });
                  }}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: "#F5F7FA", fontSize: "0.9rem" }}
                />
              </div>

              {/* Story */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#595959", display: "block", marginBottom: "8px" }}>
                  Ceritakan Mengapa Kamu Butuh Bantuan Ini
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan latar belakangmu dengan jujur..."
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{ background: "#F5F7FA", fontSize: "0.9rem" }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-white mt-4 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "0.95rem" }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} />}
                Kirim Pengajuan
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
