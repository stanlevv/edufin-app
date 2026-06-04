import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, CheckCircle, Clock, AlertCircle, FileText, Loader2 } from "lucide-react";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Database, Student } from "../../data/database";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const STATUS_CFG = {
  completed: { label: "Lunas", color: "#52C41A", bg: "#F6FFED", icon: <CheckCircle size={12} /> },
  failed: { label: "Gagal", color: "#EA4E0D", bg: "#FFF2EE", icon: <AlertCircle size={12} /> },
  pending: { label: "Menunggu", color: "#D4A017", bg: "#FFFBE6", icon: <Clock size={12} /> },
};

type PaymentStatus = "completed" | "pending" | "failed";
type FilterType = "Semua" | PaymentStatus;

interface PaymentRow {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentNisn: string;
  month: string;
  year: number;
  amount: number;
  method: string;
  status: PaymentStatus;
  paidAt: string;
}

export function SchoolBillsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // form state
  const [fStudentId, setFStudentId] = useState("");
  const [fMonth, setFMonth] = useState("Januari");
  const [fYear, setFYear] = useState(new Date().getFullYear());
  const [fAmount, setFAmount] = useState(500000);
  const [fMethod, setFMethod] = useState("Manual Cash");
  const [fStatus, setFStatus] = useState<PaymentStatus>("completed");

  const loadData = async () => {
    setIsLoading(true);
    // Fetch students for the dropdown
    const allStudents = await Database.fetchStudentsSupabase();
    setStudents(allStudents);
    
    if (allStudents.length > 0 && !fStudentId) {
      setFStudentId(allStudents[0].id);
    }
    
    // Fetch payments
    const rows = await Database.fetchPaymentsSupabase();
    setPayments(rows);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = payments.filter((p) => {
    const ms = (p.studentName + p.studentNisn).toLowerCase().includes(search.toLowerCase());
    const mf = filter === "Semua" || p.status === filter;
    return ms && mf;
  });

  const stats = {
    completed: payments.filter((p) => p.status === "completed").length,
    pending: payments.filter((p) => p.status === "pending").length,
    failed: payments.filter((p) => p.status === "failed").length,
    total: payments.reduce((s, p) => s + p.amount, 0),
  };

  const openCreate = () => {
    setEditingPayment(null);
    if (students.length > 0) setFStudentId(students[0].id);
    const d = new Date();
    setFMonth(MONTHS[d.getMonth()]);
    setFYear(d.getFullYear());
    setFAmount(500000);
    setFMethod("Manual Cash");
    setFStatus("completed");
    setShowModal(true);
  };

  const openEdit = (p: PaymentRow) => {
    setEditingPayment(p);
    setFStudentId(p.studentId);
    setFMonth(p.month);
    setFYear(p.year);
    setFAmount(p.amount);
    setFMethod(p.method);
    setFStatus(p.status);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    await Database.deletePaymentSupabase(id);
    await loadData();
    setDeleteConfirm(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const paymentData = {
      id: editingPayment?.id,
      studentId: fStudentId,
      month: fMonth,
      year: fYear,
      amount: fAmount,
      method: fMethod,
      status: fStatus
    };
    
    if (editingPayment) {
      await Database.updatePaymentSupabase(paymentData);
    } else {
      await Database.insertPaymentSupabase(paymentData);
    }
    
    await loadData();
    setShowModal(false);
    setIsSaving(false);
  };

  const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white";

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Manajemen Tagihan</h2>
            <p className="text-sm text-gray-500">Buat, edit, dan kelola tagihan SPP seluruh siswa</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm">
            <Plus size={18} /> <span className="text-sm">Buat Tagihan</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Total Pemasukan</p>
            <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
            <p className="text-xs text-blue-500 mt-1">{formatRupiah(stats.total)}</p>
          </div>
          {(["completed","pending","failed"] as PaymentStatus[]).map((s) => (
            <div key={s} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{STATUS_CFG[s].label}</p>
              <p className="text-2xl font-bold" style={{ color: STATUS_CFG[s].color }}>{stats[s]}</p>
              <div className="mt-2 h-1 rounded-full bg-gray-100">
                <div className="h-1 rounded-full transition-all" style={{ background: STATUS_CFG[s].color, width: payments.length ? `${(stats[s] / payments.length) * 100}%` : "0%" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex gap-3 items-center">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <Search size={17} color="#8C8C8C" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau NISN siswa..." className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <div className="flex gap-2">
            {(["Semua","completed","pending","failed"] as FilterType[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ background: filter === f ? "#1677FF" : "#F5F7FA", color: filter === f ? "white" : "#595959" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Siswa</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Periode</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Metode</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const sc = STATUS_CFG[p.status];
                return (
                  <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {p.studentName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{p.studentName}</p>
                          <p className="text-xs text-gray-400 font-mono">{p.studentNisn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.studentClass}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.month} {p.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.method || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600 text-sm">{formatRupiah(p.amount)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: sc.bg, color: sc.color }}>
                        {sc.icon} {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all" title="Edit"><Edit size={15} /></button>
                        <button onClick={() => setDeleteConfirm(p.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all" title="Hapus"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <FileText size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">Tidak ada tagihan ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-800">{editingBill ? "Edit Tagihan" : "Buat Tagihan Baru"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Siswa *</label>
                <select required value={fStudentId} onChange={(e) => setFStudentId(e.target.value)} className={inputCls} disabled={!!editingPayment}>
                  <option value="">— Pilih Siswa —</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {s.class}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bulan *</label>
                  <select required value={fMonth} onChange={(e) => setFMonth(e.target.value)} className={inputCls}>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tahun *</label>
                  <input type="number" required value={fYear} onChange={(e) => setFYear(parseInt(e.target.value))} className={inputCls} placeholder="2025" min={2020} max={2030} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jumlah Pembayaran (Rp) *</label>
                  <input type="number" required value={fAmount} onChange={(e) => setFAmount(parseInt(e.target.value) || 0)} className={inputCls} placeholder="500000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Metode Pembayaran</label>
                  <select value={fMethod} onChange={(e) => setFMethod(e.target.value)} className={inputCls}>
                    <option value="Manual Cash">Manual Cash</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="Virtual Account">Virtual Account</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status Pembayaran</label>
                <select value={fStatus} onChange={(e) => setFStatus(e.target.value as PaymentStatus)} className={inputCls}>
                  <option value="completed">Lunas (Completed)</option>
                  <option value="pending">Menunggu (Pending)</option>
                  <option value="failed">Gagal (Failed)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50" disabled={isSaving}>Batal</button>
                <button type="submit" disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-70">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                  {editingPayment ? "Simpan Perubahan" : "Buat Pembayaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} color="#EF4444" /></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Tagihan?</h3>
            <p className="text-sm text-gray-500 mb-6">Tagihan ini akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </SchoolDesktopLayout>
  );
}
