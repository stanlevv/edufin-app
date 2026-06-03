import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, CheckCircle, Clock, AlertCircle, FileText, Minus } from "lucide-react";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Database, Bill, Student } from "../../data/database";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const STATUS_CFG = {
  Lunas: { label: "Lunas", color: "#52C41A", bg: "#F6FFED", icon: <CheckCircle size={12} /> },
  Tertunggak: { label: "Tertunggak", color: "#EA4E0D", bg: "#FFF2EE", icon: <AlertCircle size={12} /> },
  Cicilan: { label: "Cicilan", color: "#D4A017", bg: "#FFFBE6", icon: <Clock size={12} /> },
};

type BillStatus = "Lunas" | "Tertunggak" | "Cicilan";
type FilterType = "Semua" | BillStatus;

interface BillRow extends Bill {
  studentName: string;
  studentClass: string;
  studentNisn: string;
}

interface BillItem { name: string; amount: number }

export function SchoolBillsPage() {
  const [bills, setBills] = useState<BillRow[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState<BillRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // form state
  const [fStudentId, setFStudentId] = useState("");
  const [fMonth, setFMonth] = useState("Januari");
  const [fYear, setFYear] = useState(2025);
  const [fDueDate, setFDueDate] = useState("");
  const [fStatus, setFStatus] = useState<BillStatus>("Tertunggak");
  const [fItems, setFItems] = useState<BillItem[]>([{ name: "SPP", amount: 500000 }]);

  const loadData = () => {
    const allStudents = Database.getStudents();
    setStudents(allStudents);
    const studentMap = new Map(allStudents.map((s) => [s.id, s]));
    const rows: BillRow[] = Database.getBills().map((b) => {
      const s = studentMap.get(b.studentId);
      return { ...b, studentName: s?.name ?? "—", studentClass: s?.class ?? "—", studentNisn: s?.nisn ?? "—" };
    });
    setBills(rows);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = bills.filter((b) => {
    const ms = (b.studentName + b.studentNisn).toLowerCase().includes(search.toLowerCase());
    const mf = filter === "Semua" || b.status === filter;
    return ms && mf;
  });

  const stats = {
    Lunas: bills.filter((b) => b.status === "Lunas").length,
    Tertunggak: bills.filter((b) => b.status === "Tertunggak").length,
    Cicilan: bills.filter((b) => b.status === "Cicilan").length,
    total: bills.reduce((s, b) => s + b.total, 0),
  };

  const openCreate = () => {
    setEditingBill(null);
    setFStudentId(students[0]?.id ?? "");
    setFMonth("Januari");
    setFYear(2025);
    setFDueDate("");
    setFStatus("Tertunggak");
    setFItems([{ name: "SPP", amount: 500000 }]);
    setShowModal(true);
  };

  const openEdit = (bill: BillRow) => {
    setEditingBill(bill);
    setFStudentId(bill.studentId);
    setFMonth(bill.month);
    setFYear(bill.year);
    setFDueDate(bill.dueDate);
    setFStatus(bill.status);
    setFItems(bill.items.map((i) => ({ ...i })));
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    Database.deleteBill(id);
    loadData();
    setDeleteConfirm(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = fItems.reduce((s, i) => s + (i.amount || 0), 0);
    const bill: Bill = {
      id: editingBill?.id ?? `bill-${Date.now()}`,
      studentId: fStudentId,
      month: fMonth,
      year: fYear,
      dueDate: fDueDate,
      items: fItems,
      total,
      status: fStatus,
      ...(fStatus === "Lunas" ? { paidAt: new Date().toISOString().slice(0, 10) } : {}),
    };
    Database.saveBill(bill);
    loadData();
    setShowModal(false);
  };

  const addItem = () => setFItems([...fItems, { name: "", amount: 0 }]);
  const removeItem = (i: number) => setFItems(fItems.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof BillItem, value: string | number) =>
    setFItems(fItems.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));

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
            <p className="text-xs text-gray-500 mb-1">Total Tagihan</p>
            <p className="text-2xl font-bold text-gray-800">{bills.length}</p>
            <p className="text-xs text-blue-500 mt-1">{formatRupiah(stats.total)}</p>
          </div>
          {(["Lunas","Tertunggak","Cicilan"] as BillStatus[]).map((s) => (
            <div key={s} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{s}</p>
              <p className="text-2xl font-bold" style={{ color: STATUS_CFG[s].color }}>{stats[s]}</p>
              <div className="mt-2 h-1 rounded-full bg-gray-100">
                <div className="h-1 rounded-full transition-all" style={{ background: STATUS_CFG[s].color, width: bills.length ? `${(stats[s] / bills.length) * 100}%` : "0%" }} />
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
            {(["Semua","Lunas","Tertunggak","Cicilan"] as FilterType[]).map((f) => (
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Jatuh Tempo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bill) => {
                const sc = STATUS_CFG[bill.status];
                return (
                  <tr key={bill.id} className="border-t border-gray-100 hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {bill.studentName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{bill.studentName}</p>
                          <p className="text-xs text-gray-400 font-mono">{bill.studentNisn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{bill.studentClass}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{bill.month} {bill.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{bill.dueDate || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600 text-sm">{formatRupiah(bill.total)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: sc.bg, color: sc.color }}>
                        {sc.icon} {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(bill)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all" title="Edit"><Edit size={15} /></button>
                        <button onClick={() => setDeleteConfirm(bill.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all" title="Hapus"><Trash2 size={15} /></button>
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
                <select required value={fStudentId} onChange={(e) => setFStudentId(e.target.value)} className={inputCls}>
                  <option value="">— Pilih Siswa —</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {s.class}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
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
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                  <select value={fStatus} onChange={(e) => setFStatus(e.target.value as BillStatus)} className={inputCls}>
                    <option value="Tertunggak">Tertunggak</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Cicilan">Cicilan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jatuh Tempo</label>
                <input type="date" value={fDueDate} onChange={(e) => setFDueDate(e.target.value)} className={inputCls} />
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">Item Tagihan *</label>
                  <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-700">
                    <Plus size={13} /> Tambah Item
                  </button>
                </div>
                <div className="space-y-2">
                  {fItems.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} className={inputCls + " flex-1"} placeholder="Nama item (SPP, Lab, dll)" required />
                      <input type="number" value={item.amount || ""} onChange={(e) => updateItem(i, "amount", parseInt(e.target.value) || 0)} className={inputCls + " w-36"} placeholder="Jumlah" required />
                      {fItems.length > 1 && (
                        <button type="button" onClick={() => removeItem(i)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex-shrink-0"><Minus size={14} /></button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between items-center px-3 py-2.5 rounded-lg bg-blue-50">
                  <span className="text-sm font-semibold text-blue-700">Total</span>
                  <span className="text-sm font-bold text-blue-700">{formatRupiah(fItems.reduce((s, i) => s + (i.amount || 0), 0))}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
                  {editingBill ? "Simpan Perubahan" : "Buat Tagihan"}
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
