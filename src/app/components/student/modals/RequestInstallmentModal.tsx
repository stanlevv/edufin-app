import React, { useState } from "react";
import { X, CalendarClock, MessageSquare, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";

interface RequestInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  billId: string;
  amount: number;
  month: string;
  installmentType: "2x" | "3x";
}

export function RequestInstallmentModal({ 
  isOpen, onClose, onSuccess, billId, amount, month, installmentType 
}: RequestInstallmentModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('bills')
        .update({
          installment_status: 'pending',
          installment_type: installmentType,
          installment_reason: reason
        })
        .eq('id', billId);

      if (error) throw error;
      
      toast.success("Pengajuan cicilan berhasil dikirim!");
      onSuccess();
    } catch (err: any) {
      console.error("Gagal mengajukan cicilan:", err);
      toast.error("Terjadi kesalahan saat mengajukan cicilan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const periodCount = installmentType === "2x" ? 2 : 3;
  const amountPerPeriod = Math.ceil(amount / periodCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <CalendarClock size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-gray-900 font-bold">Pengajuan Cicilan</h2>
              <p className="text-gray-500 text-xs">SPP {month}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-5 p-3.5 rounded-xl bg-orange-50 border border-orange-100 flex gap-3">
            <AlertCircle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-orange-800 mb-1">Persetujuan Sekolah Diperlukan</h3>
              <p className="text-xs text-orange-700 leading-relaxed">
                Pengajuan cicilan Anda akan ditinjau oleh pihak sekolah. Anda baru bisa membayar setelah pengajuan disetujui.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-sm text-gray-500">Skema Cicilan</span>
              <span className="font-bold text-gray-900">{installmentType} Pembayaran</span>
            </div>
            
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-sm text-gray-500">Tagihan per periode</span>
              <span className="font-bold text-gray-900">
                Rp {amountPerPeriod.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">/ bln</span>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Alasan Pengajuan (Wajib)</label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ceritakan secara singkat alasan Anda membutuhkan keringanan cicilan..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Kirim Pengajuan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
