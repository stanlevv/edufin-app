import React, { useState } from "react";
import { X, Upload, Info } from "lucide-react";

interface CampaignSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: "parent" | "student";
  studentId?: string; // Optional: jika parent ingin campaign untuk anaknya
}

export const CampaignSubmissionForm: React.FC<CampaignSubmissionFormProps> = ({
  isOpen,
  onClose,
  userRole,
  studentId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reason: "",
    targetAmount: "",
    startDate: "",
    endDate: "",
    campaignFor: studentId ? "student" : "general", // "student" atau "general"
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi submit ke Supabase
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form setelah 2 detik
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setFormData({
          title: "",
          description: "",
          reason: "",
          targetAmount: "",
          startDate: "",
          endDate: "",
          campaignFor: studentId ? "student" : "general",
        });
        setCoverImage(null);
        setImagePreview("");
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#262626" }}>
            Kampanye Berhasil Diajukan!
          </h3>
          <p className="text-sm" style={{ color: "#8C8C8C" }}>
            Kampanye Anda sedang dalam proses review oleh admin. Kami akan mengirimkan notifikasi jika kampanye disetujui.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-[430px] max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold" style={{ color: "#262626" }}>
            Ajukan Kampanye Donasi
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "#F5F5F5" }}
          >
            <X className="w-5 h-5" style={{ color: "#595959" }} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mx-6 mt-4 p-3 rounded-xl flex gap-3" style={{ background: "#FFF7E6", border: "1px solid #FFE7BA" }}>
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#FA8C16" }} />
          <div>
            <p className="text-xs font-medium" style={{ color: "#D46B08" }}>
              Kampanye akan direview oleh admin
            </p>
            <p className="text-xs mt-1" style={{ color: "#AD6800" }}>
              Pastikan semua informasi yang Anda isi akurat dan lengkap. Proses review memakan waktu 1-3 hari kerja.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#262626" }}>
              Foto Kampanye *
            </label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <label className="block w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-[#1677FF]" style={{ borderColor: "#D9D9D9", background: "#FAFAFA" }}>
                  <Upload className="w-8 h-8 mb-2" style={{ color: "#8C8C8C" }} />
                  <span className="text-sm font-medium" style={{ color: "#595959" }}>
                    Upload Foto
                  </span>
                  <span className="text-xs mt-1" style={{ color: "#8C8C8C" }}>
                    JPG, PNG (max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Judul Kampanye */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#262626" }}>
              Judul Kampanye *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Bantu Adik Budi Operasi Jantung"
              required
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] transition-colors"
              style={{ background: "#FAFAFA" }}
            />
            <p className="text-xs mt-1" style={{ color: "#8C8C8C" }}>
              {formData.title.length}/100 karakter
            </p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#262626" }}>
              Deskripsi Kampanye *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan secara detail tentang kampanye ini, tujuan, dan manfaatnya..."
              required
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] transition-colors resize-none"
              style={{ background: "#FAFAFA" }}
            />
            <p className="text-xs mt-1" style={{ color: "#8C8C8C" }}>
              {formData.description.length}/500 karakter
            </p>
          </div>

          {/* Alasan/Latar Belakang */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#262626" }}>
              Alasan/Latar Belakang *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Jelaskan mengapa kampanye ini penting dan mendesak..."
              required
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] transition-colors resize-none"
              style={{ background: "#FAFAFA" }}
            />
            <p className="text-xs mt-1" style={{ color: "#8C8C8C" }}>
              {formData.reason.length}/300 karakter
            </p>
          </div>

          {/* Target Donasi */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#262626" }}>
              Target Donasi *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#8C8C8C" }}>
                Rp
              </span>
              <input
                type="text"
                value={formData.targetAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, targetAmount: value });
                }}
                placeholder="0"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] transition-colors"
                style={{ background: "#FAFAFA" }}
              />
            </div>
            {formData.targetAmount && (
              <p className="text-xs mt-1" style={{ color: "#1677FF" }}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(parseInt(formData.targetAmount))}
              </p>
            )}
          </div>

          {/* Periode Kampanye */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#262626" }}>
                Tanggal Mulai *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] transition-colors"
                style={{ background: "#FAFAFA" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#262626" }}>
                Tanggal Selesai *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                min={formData.startDate || new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] transition-colors"
                style={{ background: "#FAFAFA" }}
              />
            </div>
          </div>

          {/* Campaign For (hanya untuk parent) */}
          {userRole === "parent" && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#262626" }}>
                Kampanye Untuk *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors" style={{ background: formData.campaignFor === "student" ? "#EEF4FF" : "#FAFAFA", border: formData.campaignFor === "student" ? "2px solid #1677FF" : "2px solid transparent" }}>
                  <input
                    type="radio"
                    name="campaignFor"
                    value="student"
                    checked={formData.campaignFor === "student"}
                    onChange={(e) => setFormData({ ...formData, campaignFor: e.target.value })}
                    className="w-4 h-4 accent-[#1677FF]"
                  />
                  <span className="text-sm font-medium" style={{ color: "#262626" }}>
                    Untuk Anak Saya
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors" style={{ background: formData.campaignFor === "general" ? "#EEF4FF" : "#FAFAFA", border: formData.campaignFor === "general" ? "2px solid #1677FF" : "2px solid transparent" }}>
                  <input
                    type="radio"
                    name="campaignFor"
                    value="general"
                    checked={formData.campaignFor === "general"}
                    onChange={(e) => setFormData({ ...formData, campaignFor: e.target.value })}
                    className="w-4 h-4 accent-[#1677FF]"
                  />
                  <span className="text-sm font-medium" style={{ color: "#262626" }}>
                    Kampanye Umum (Sekolah/Fasilitas)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold transition-colors"
              style={{ background: "#F5F5F5", color: "#595959" }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.description || !formData.reason || !formData.targetAmount || !formData.startDate || !formData.endDate}
              className="flex-1 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "#1677FF" }}
            >
              {isSubmitting ? "Mengirim..." : "Ajukan Kampanye"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
