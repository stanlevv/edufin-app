import React, { useState, useEffect } from "react";
import {
  GraduationCap, Plus, Edit, Trash2, X, Users, CheckCircle,
  XCircle, Search, ChevronRight, Award, Calendar, DollarSign, BookOpen
} from "lucide-react";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Database, Scholarship, ScholarshipRecipient, Student } from "../../data/database";
import { useAuth } from "../../context/AuthContext";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return iso; }
}

type ScholarshipStatus = "active" | "completed" | "cancelled";
type RecipientStatus = "active" | "graduated" | "terminated";

const STATUS_SCH: Record<ScholarshipStatus, { label: string; color: string; bg: string }> = {
  active:    { label: "Aktif",     color: "#52C41A", bg: "#F6FFED" },
  completed: { label: "Selesai",   color: "#1677FF", bg: "#EEF4FF" },
  cancelled: { label: "Dibatalkan",color: "#8C8C8C", bg: "#F5F5F5" },
};
const STATUS_RCP: Record<RecipientStatus, { label: string; color: string; bg: string }> = {
  active:     { label: "Aktif",       color: "#52C41A", bg: "#F6FFED" },
  graduated:  { label: "Lulus",       color: "#1677FF", bg: "#EEF4FF" },
  terminated: { label: "Dihentikan",  color: "#EA4E0D", bg: "#FFF2EE" },
};

const SOURCES = ["Dana BOS", "Dana Donatur", "Yayasan", "Anggaran Sekolah", "Pemerintah Daerah", "Lainnya"];

// ─── Scholarship Form ──────────────────────────────────────────────────────────
function ScholarshipModal({
  initial, onClose, onSave,
}: {
  initial: Partial<Scholarship> | null;
  onClose: () => void;
  onSave: (s: Scholarship) => void;
}) {
  const [form, setForm] = useState<Partial<Scholarship>>(
    initial ?? { status: "active", totalMonths: 12, maxRecipients: 5, source: "Dana BOS" }
  );
  const inp = "w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initial?.id ?? `sch-${Date.now()}`,
      name: form.name || "",
      description: form.description || "",
      amountPerMonth: form.amountPerMonth || 0,
      totalMonths: form.totalMonths || 12,
      startDate: form.startDate || "",
      endDate: form.endDate || "",
      source: form.source || "Dana BOS",
      campaignId: form.campaignId,
      status: (form.status || "active") as ScholarshipStatus,
      maxRecipients: form.maxRecipients || 5,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Program *</label>
        <input required value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} placeholder="Contoh: Beasiswa Prestasi Akademik 2025" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi</label>
        <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} rows={2} placeholder="Syarat dan ketentuan penerima beasiswa" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subsidi / Bulan (Rp) *</label>
          <input type="number" required value={form.amountPerMonth || ""} onChange={(e) => setForm({ ...form, amountPerMonth: parseInt(e.target.value) || 0 })} className={inp} placeholder="725000" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Durasi (Bulan)</label>
          <input type="number" value={form.totalMonths || ""} onChange={(e) => setForm({ ...form, totalMonths: parseInt(e.target.value) || 12 })} className={inp} placeholder="12" min={1} max={48} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Mulai</label>
          <input type="date" value={form.startDate || ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inp} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Berakhir</label>
          <input type="date" value={form.endDate || ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inp} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sumber Dana</label>
          <select value={form.source || "Dana BOS"} onChange={(e) => setForm({ ...form, source: e.target.value })} className={inp}>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Maks. Penerima</label>
          <input type="number" value={form.maxRecipients || ""} onChange={(e) => setForm({ ...form, maxRecipients: parseInt(e.target.value) || 1 })} className={inp} placeholder="5" min={1} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
        <select value={form.status || "active"} onChange={(e) => setForm({ ...form, status: e.target.value as ScholarshipStatus })} className={inp}>
          <option value="active">Aktif</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2 pb-6">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">Batal</button>
        <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
          {initial?.id ? "Simpan Perubahan" : "Tambah Program"}
        </button>
      </div>
    </form>
  );
}

// ─── Recipient Form ────────────────────────────────────────────────────────────
function RecipientModal({
  scholarshipId, defaultAmount, existingIds, students, error, onClose, onSave,
}: {
  scholarshipId: string;
  defaultAmount: number;
  existingIds: string[];
  students: Student[];
  error: string;
  onClose: () => void;
  onSave: (r: any) => void;
}) {
  const availableStudents = students.filter((s) => !existingIds.includes(s.id) && s.status === "active");
  const [studentId, setStudentId] = useState(availableStudents[0]?.id || "");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState(defaultAmount);
  const [notes, setNotes] = useState("");
  const inp = "w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `recip-${Date.now()}`,
      scholarshipId,
      studentId,
      startDate,
      endDate,
      amountPerMonth: amount,
      status: "active",
      notes,
      assignedAt: new Date().toISOString(),
    });
  };

  if (availableStudents.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4"><Users size={24} color="#F97316" /></div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Semua Siswa Aktif Sudah Terdaftar</h3>
          <p className="text-sm text-gray-500 mb-4">Tidak ada siswa aktif yang belum menerima beasiswa ini.</p>
          <button onClick={onClose} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold">Tutup</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Tambah Penerima Beasiswa</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        {error && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pilih Siswa *</label>
            <select required value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inp}>
              {availableStudents.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.class}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subsidi / Bulan (Rp)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 0)} className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mulai *</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Berakhir</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inp} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Catatan / Alasan</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inp} rows={2} placeholder="Contoh: Peringkat 1 kelas, orang tua tidak mampu..." />
          </div>
          <div className="flex gap-3 pt-2 pb-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">Batal</button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">Tambah Penerima</button>
          </div>
        </form>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function SchoolScholarshipPage() {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [recipients, setRecipients] = useState<ScholarshipRecipient[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Scholarship | null>(null);
  const [search, setSearch] = useState("");
  const [saveError, setSaveError] = useState("");

  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [deleteScholarshipId, setDeleteScholarshipId] = useState<string | null>(null);

  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [deleteRecipientId, setDeleteRecipientId] = useState<string | null>(null);
  const [editingRecipient, setEditingRecipient] = useState<ScholarshipRecipient | null>(null);

  const load = async () => {
    const allS = await Database.fetchScholarshipsSupabase();
    setScholarships(allS);
    setStudents(await Database.fetchStudentsSupabase());
    if (allS.length > 0 && !selected) setSelected(allS[0]);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (selected) {
      Database.fetchScholarshipRecipientsSupabase(selected.id).then(setRecipients);
    }
  }, [selected]);

  const studentMap = new Map(students.map((s) => [s.id, s]));

  const selectedRecipients = recipients;

  const filteredRecipients = selectedRecipients.filter((r) => {
    const s = studentMap.get(r.studentId);
    return !search || (s?.name ?? "").toLowerCase().includes(search.toLowerCase()) || (s?.class ?? "").toLowerCase().includes(search.toLowerCase());
  });

  // Stats
  const activeRecipients = recipients.filter((r) => r.status === "active");
  const totalCoverage = activeRecipients.reduce((sum, r) => sum + r.amountPerMonth, 0);

  const handleSaveScholarship = async (s: any) => {
    setSaveError("");
    try {
      const ok = await Database.insertScholarshipSupabase(s, user?.id || "");
      if (!ok) {
        setSaveError("Gagal menyimpan beasiswa. Pastikan RLS policy sudah diatur di Supabase.");
        return;
      }
      await load();
      setShowScholarshipModal(false);
    } catch (err: any) {
      console.error("[SCHOLARSHIP SAVE ERROR]", err);
      setSaveError(err.message || "Terjadi kesalahan.");
    }
  };

  const handleDeleteScholarship = async (id: string) => {
    // Database.deleteScholarship(id); (Need API if we want full CRUD)
    alert("Delete not implemented for Supabase yet");
    setDeleteScholarshipId(null);
  };

  const handleSaveRecipient = async (r: any) => {
    setSaveError("");
    try {
      const result = await Database.insertScholarshipRecipientSupabase(r);
      if (!result.success) {
        setSaveError(result.error || "Gagal menambah penerima. Pastikan RLS policy sudah diatur.");
        return;
      }
      Database.fetchScholarshipRecipientsSupabase(selected?.id).then(setRecipients);
      setShowRecipientModal(false);
    } catch (err: any) {
      setSaveError(err.message || "Terjadi kesalahan saat menambah penerima.");
    }
  };

  const handleDeleteRecipient = async (id: string) => {
    await Database.deleteScholarshipRecipientSupabase(id);
    Database.fetchScholarshipRecipientsSupabase(selected?.id).then(setRecipients);
    setDeleteRecipientId(null);
  };

  const handleTerminate = (r: any) => {
    alert("Update status not implemented in this migration yet");
  };

  const handleReactivate = (r: any) => {
    alert("Update status not implemented in this migration yet");
  };

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Manajemen Beasiswa</h2>
            <p className="text-sm text-gray-500">Admin menentukan siapa yang berhak menerima beasiswa dan subsidi SPP</p>
          </div>
          <button
            onClick={() => { setEditingScholarship(null); setShowScholarshipModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus size={18} /> <span className="text-sm">Program Baru</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Program Beasiswa", value: scholarships.length, icon: <Award size={22} color="#722ED1" />, bg: "#F9F0FF", color: "#722ED1" },
            { label: "Program Aktif", value: scholarships.filter((s) => s.status === "active").length, icon: <CheckCircle size={22} color="#52C41A" />, bg: "#F6FFED", color: "#52C41A" },
            { label: "Penerima Aktif", value: activeRecipients.length, icon: <Users size={22} color="#1677FF" />, bg: "#EEF4FF", color: "#1677FF" },
            { label: "Total Subsidi/Bulan", value: formatRupiah(totalCoverage), icon: <DollarSign size={22} color="#EA4E0D" />, bg: "#FFF2EE", color: "#EA4E0D" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <p className="font-bold text-gray-800" style={{ fontSize: typeof s.value === "string" ? "13px" : "22px" }}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Program list */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Program Beasiswa</h3>
            {scholarships.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
                <Award size={36} className="mx-auto mb-3 text-gray-200" />
                <p className="text-sm text-gray-400">Belum ada program beasiswa</p>
                <button onClick={() => { setEditingScholarship(null); setShowScholarshipModal(true); }}
                  className="mt-3 text-sm text-blue-600 font-semibold">+ Tambah Program</button>
              </div>
            )}
            {scholarships.map((sch) => {
              const schRecipients = recipients.filter((r) => r.scholarshipId === sch.id);
              const activeCount = schRecipients.filter((r) => r.status === "active").length;
              const sc = STATUS_SCH[sch.status];
              const isSelected = selected?.id === sch.id;
              return (
                <div key={sch.id} onClick={() => setSelected(sch)}
                  className="w-full text-left bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md cursor-pointer"
                  style={{ borderColor: isSelected ? "#1677FF" : "#F0F0F0", borderWidth: isSelected ? 2 : 1 }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={18} color="#722ED1" />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>
                  <p className="font-bold text-gray-800 text-sm leading-snug mb-1">{sch.name}</p>
                  <p className="text-xs text-blue-600 font-semibold mb-2">{formatRupiah(sch.amountPerMonth)} / bulan</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{activeCount}/{sch.maxRecipients} penerima aktif</span>
                    <span className="text-gray-300">{sch.source}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${sch.maxRecipients ? Math.min((activeCount / sch.maxRecipients) * 100, 100) : 0}%` }} />
                  </div>
                  <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => { setEditingScholarship(sch); setShowScholarshipModal(true); }}
                      className="flex-1 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 flex items-center justify-center gap-1">
                      <Edit size={12} /> Edit
                    </button>
                    <button onClick={() => setDeleteScholarshipId(sch.id)}
                      className="flex-1 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 flex items-center justify-center gap-1">
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Recipients of selected */}
          <div className="col-span-2">
            {!selected ? (
              <div className="bg-white rounded-xl p-16 text-center border border-gray-100 shadow-sm">
                <GraduationCap size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="text-gray-400">Pilih program beasiswa untuk kelola penerima</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <GraduationCap size={18} color="#722ED1" />
                        {selected.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{selected.description}</p>
                    </div>
                    <button
                      onClick={() => setShowRecipientModal(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all text-sm"
                    >
                      <Plus size={16} /> Tambah Penerima
                    </button>
                  </div>

                  {/* Program meta */}
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { icon: <DollarSign size={13} />, text: `${formatRupiah(selected.amountPerMonth)}/bulan` },
                      { icon: <Calendar size={13} />, text: `${selected.totalMonths} bulan` },
                      { icon: <BookOpen size={13} />, text: selected.source },
                      { icon: <Users size={13} />, text: `Maks. ${selected.maxRecipients} penerima` },
                    ].map(({ icon, text }) => (
                      <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        {icon} {text}
                      </div>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                    <Search size={15} color="#8C8C8C" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari nama atau kelas penerima..."
                      className="flex-1 bg-transparent outline-none text-sm" />
                  </div>
                </div>

                {/* Recipients table */}
                {filteredRecipients.length === 0 ? (
                  <div className="text-center py-16">
                    <Users size={40} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 text-sm">Belum ada penerima terdaftar</p>
                    <button onClick={() => setShowRecipientModal(true)}
                      className="mt-3 text-sm text-blue-600 font-semibold">+ Tambah Penerima</button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Siswa</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Subsidi</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Periode</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecipients.map((r) => {
                        const student = studentMap.get(r.studentId);
                        const rc = STATUS_RCP[r.status];
                        return (
                          <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50 transition-all">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                  {student?.name?.[0] ?? "?"}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 text-sm">{student?.name ?? "Siswa dihapus"}</p>
                                  <p className="text-xs text-gray-400">{student?.class ?? "—"} · {student?.nisn ?? "—"}</p>
                                  {r.notes && <p className="text-xs text-purple-600 mt-0.5 italic">"{r.notes}"</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-bold text-green-600 text-sm">{formatRupiah(r.amountPerMonth)}</td>
                            <td className="px-5 py-4 text-xs text-gray-500">
                              <p>{formatDate(r.startDate)}</p>
                              {r.endDate && <p className="text-gray-400">s/d {formatDate(r.endDate)}</p>}
                            </td>
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: rc.bg, color: rc.color }}>{rc.label}</span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex gap-1.5">
                                {r.status === "active" ? (
                                  <button onClick={() => handleTerminate(r)}
                                    className="p-1.5 rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 transition-all" title="Hentikan">
                                    <XCircle size={14} />
                                  </button>
                                ) : (
                                  <button onClick={() => handleReactivate(r)}
                                    className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all" title="Aktifkan kembali">
                                    <CheckCircle size={14} />
                                  </button>
                                )}
                                <button onClick={() => setDeleteRecipientId(r.id)}
                                  className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all" title="Hapus">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {selectedRecipients.length > 0 && (
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {selectedRecipients.filter((r) => r.status === "active").length} aktif · {selectedRecipients.length} total penerima
                    </p>
                    <p className="text-xs font-semibold text-green-600">
                      Total subsidi: {formatRupiah(selectedRecipients.filter((r) => r.status === "active").reduce((s, r) => s + r.amountPerMonth, 0))}/bulan
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scholarship Modal */}
      {showScholarshipModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-[200] p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-800">{editingScholarship?.id ? "Edit Program Beasiswa" : "Tambah Program Beasiswa"}</h3>
              <button onClick={() => { setShowScholarshipModal(false); setEditingScholarship(null); setSaveError(""); }} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            {saveError && (
              <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                ⚠️ {saveError}
              </div>
            )}
            <ScholarshipModal
              initial={editingScholarship}
              onClose={() => { setShowScholarshipModal(false); setEditingScholarship(null); setSaveError(""); }}
              onSave={handleSaveScholarship}
            />
          </div>
        </div>
      )}

      {showRecipientModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-[200] p-0 sm:p-4">
          <RecipientModal
            scholarshipId={selected.id}
            defaultAmount={selected.amountPerMonth}
            existingIds={recipients.filter((r) => r.scholarshipId === selected.id && r.status === "active").map((r) => r.studentId)}
            students={students}
            error={saveError}
            onClose={() => { setShowRecipientModal(false); setSaveError(""); }}
            onSave={handleSaveRecipient}
          />
        </div>
      )}

      {deleteScholarshipId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} color="#EF4444" /></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Program Beasiswa?</h3>
            <p className="text-sm text-gray-500 mb-6">Program dan semua data penerima akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteScholarshipId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">Batal</button>
              <button onClick={() => handleDeleteScholarship(deleteScholarshipId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {deleteRecipientId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} color="#EF4444" /></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Penerima?</h3>
            <p className="text-sm text-gray-500 mb-6">Siswa ini akan dihapus dari daftar penerima beasiswa.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteRecipientId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">Batal</button>
              <button onClick={() => handleDeleteRecipient(deleteRecipientId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </SchoolDesktopLayout>
  );
}
