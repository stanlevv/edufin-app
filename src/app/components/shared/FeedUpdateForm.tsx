import React, { useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface FeedUpdateFormProps {
  campaignId: string;
  onClose: () => void;
  onSuccess: (update: { date: string; text: string; image?: string }) => void;
}

export function FeedUpdateForm({ campaignId, onClose, onSuccess }: FeedUpdateFormProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 2 * 1024 * 1024) {
      setErrorMsg("Ukuran file maksimal 2MB");
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar (JPG/PNG/WEBP)");
      return;
    }

    setErrorMsg("");
    setFile(selected);
    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    setIsUploading(true);
    setErrorMsg("");

    try {
      let imageUrl = "";

      // Upload to Supabase Storage if file exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${campaignId}-${Date.now()}.${fileExt}`;
        const filePath = `updates/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("feed_updates")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("feed_updates")
          .getPublicUrl(filePath);
        
        imageUrl = publicUrlData.publicUrl;
      }

      const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });

      // Panggil callback success untuk mengupdate UI/Database lokal di parent
      onSuccess({
        date: today,
        text,
        image: imageUrl || undefined
      });
      
      onClose();
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "Gagal mengupload gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Buat Update Baru</h2>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pesan Update</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ceritakan perkembangan terbaru atau bukti nota pengeluaran..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none h-28"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Foto / Nota (Opsional)</label>
            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition-all group">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ImageIcon size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="text-sm text-slate-500 font-medium">Tap untuk pilih foto (Max 2MB)</span>
                <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading || (!text.trim() && !file)}
            className="mt-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload size={18} />
                Bagikan Update
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
