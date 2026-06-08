import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface InstallmentRequest {
  id: string;
  studentName: string;
  className: string;
  month: string;
  amount: number;
  type: string;
  reason: string;
  status: string;
}

export function InstallmentApprovalList() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<InstallmentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      if (!user?.id) return;
      // Get school_id
      const { data: adminData } = await supabase
        .from('school_admins')
        .select('school_id')
        .eq('user_id', user.id)
        .single();
      
      if (!adminData?.school_id) return;

      const { data, error } = await supabase
        .from('bills')
        .select('id, month, amount, installment_status, installment_type, installment_reason, students(name, class)')
        .eq('school_id', adminData.school_id)
        .eq('installment_status', 'pending');

      if (error) throw error;

      if (data) {
        setRequests(data.map((b: any) => ({
          id: b.id,
          studentName: b.students?.name || "Unknown",
          className: b.students?.class || "-",
          month: b.month,
          amount: b.amount,
          type: b.installment_type || "2x",
          reason: b.installment_reason || "-",
          status: b.installment_status
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleApprove = async (id: string, amount: number, type: string) => {
    try {
      // Logic pemecahan cicilan
      const periodCount = type === "3x" ? 3 : 2;
      const amountPerPeriod = Math.ceil(amount / periodCount);
      
      const { error } = await supabase
        .from('bills')
        .update({
          installment_status: 'approved',
          amount: amountPerPeriod, 
          status: 'cicilan'
        })
        .eq('id', id);

      if (error) throw error;
      toast.success("Pengajuan disetujui! Tagihan siswa otomatis terbagi menjadi cicilan.");
      fetchRequests();
    } catch (err) {
      toast.error("Gagal menyetujui cicilan");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bills')
        .update({
          installment_status: 'rejected'
        })
        .eq('id', id);

      if (error) throw error;
      toast.success("Pengajuan ditolak. Siswa harus membayar tagihan secara penuh.");
      fetchRequests();
    } catch (err) {
      toast.error("Gagal menolak cicilan");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-gray-400" size={32} />
        </div>
        <h3 className="text-gray-900 font-bold mb-2">Tidak Ada Pengajuan</h3>
        <p className="text-gray-500 text-sm">Semua pengajuan cicilan sudah ditinjau.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-5 flex flex-col md:flex-row gap-5 items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1">
                  <Clock size={12} /> Pending Approval
                </span>
                <span className="text-gray-400 text-sm">SPP {req.month}</span>
              </div>
              <h3 className="text-gray-900 font-bold text-lg">{req.studentName} <span className="text-gray-500 text-sm font-normal">({req.className})</span></h3>
              <div className="mt-2 text-sm text-gray-700">
                <p><strong>Total Tagihan:</strong> Rp {req.amount.toLocaleString('id-ID')}</p>
                <p><strong>Pengajuan:</strong> Cicilan {req.type} Pembayaran</p>
                <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Alasan Pengajuan:</p>
                  <p className="text-sm text-gray-800 italic">"{req.reason}"</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
              <button 
                onClick={() => handleApprove(req.id, req.amount, req.type)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-bold transition-colors border border-green-200"
              >
                <CheckCircle size={16} /> Setujui
              </button>
              <button 
                onClick={() => handleReject(req.id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold transition-colors border border-red-200"
              >
                <XCircle size={16} /> Tolak
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
