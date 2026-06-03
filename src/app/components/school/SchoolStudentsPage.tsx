import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, Users, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Database, Student } from "../../data/database";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const EMPTY_FORM: Partial<Student> = {
  status: "active",
  sppAmount: 725000,
  verified: false,
  school: "SDN 3 Malang",
  userId: "",
};

export function SchoolStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setStudents(Database.getStudents());
  }, []);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nisn.includes(search) ||
      s.class.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    Database.deleteStudent(id);
    setStudents(Database.getStudents());
    setDeleteConfirm(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingStudent?.id ?? `student-${Date.now()}`;
    const student: Student = {
      id,
      userId: formData.userId || id,
      nisn: formData.nisn || "",
      name: formData.name || "",
      email: formData.email || "",
      school: formData.school || "SDN 3 Malang",
      class: formData.class || "",
      parentName: formData.parentName || "",
      phone: formData.phone || "",
      parentPhone: formData.parentPhone || "",
      address: formData.address || "",
      sppAmount: formData.sppAmount || 725000,
      status: formData.status || "active",
      verified: formData.verified ?? false,
    };
    Database.saveStudent(student);
    setStudents(Database.getStudents());
    setShowModal(false);
    setFormData(EMPTY_FORM);
  };

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    inactive: students.filter((s) => s.status === "inactive").length,
    classes: new Set(students.map((s) => s.class)).size,
  };

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white";

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Manajemen Siswa</h2>
            <p className="text-sm text-gray-500">Kelola data seluruh siswa — tambah, edit, dan hapus</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="text-sm">Tambah Siswa</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Siswa", value: stats.total, color: "#1677FF", bg: "#EEF4FF", icon: <Users size={22} color="#1677FF" /> },
            { label: "Siswa Aktif", value: stats.active, color: "#52C41A", bg: "#F6FFED", icon: <CheckCircle size={22} color="#52C41A" /> },
            { label: "Non-Aktif", value: stats.inactive, color: "#8C8C8C", bg: "#F5F5F5", icon: <XCircle size={22} color="#8C8C8C" /> },
            { label: "Total Kelas", value: stats.classes, color: "#722ED1", bg: "#F9F0FF", icon: <BookOpen size={22} color="#722ED1" /> },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex gap-3 items-center">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <Search size={17} color="#8C8C8C" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NISN, atau kelas..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ background: filterStatus === f ? "#1677FF" : "#F5F7FA", color: filterStatus === f ? "white" : "#595959" }}
              >
                {f === "all" ? "Semua" : f === "active" ? "Aktif" : "Non-Aktif"}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">NISN</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Orang Tua</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">SPP/Bulan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {student.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{student.nisn}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.class}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{student.parentName}</p>
                    {student.parentPhone && <p className="text-xs text-gray-400">{student.parentPhone}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">{formatRupiah(student.sppAmount)}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: student.status === "active" ? "#F6FFED" : "#F5F5F5",
                        color: student.status === "active" ? "#52C41A" : "#8C8C8C",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: student.status === "active" ? "#52C41A" : "#8C8C8C" }} />
                      {student.status === "active" ? "Aktif" : "Non-Aktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(student)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all" title="Edit">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => setDeleteConfirm(student.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all" title="Hapus">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">Tidak ada data siswa</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Isi semua kolom yang bertanda *</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Lengkap *</label>
                  <input required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="Nama siswa" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">NISN *</label>
                  <input required value={formData.nisn || ""} onChange={(e) => setFormData({ ...formData, nisn: e.target.value })} className={inputCls} placeholder="10 digit NISN" maxLength={10} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kelas *</label>
                  <input required value={formData.class || ""} onChange={(e) => setFormData({ ...formData, class: e.target.value })} className={inputCls} placeholder="Contoh: X IPA 1" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                  <input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls} placeholder="email@siswa.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">No. HP Siswa</label>
                  <input value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputCls} placeholder="081234567890" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Sekolah</label>
                  <input value={formData.school || ""} onChange={(e) => setFormData({ ...formData, school: e.target.value })} className={inputCls} placeholder="SDN 3 Malang" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Orang Tua *</label>
                  <input required value={formData.parentName || ""} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} className={inputCls} placeholder="Nama orang tua/wali" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">No. HP Orang Tua</label>
                  <input value={formData.parentPhone || ""} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} className={inputCls} placeholder="081234567890" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Alamat</label>
                <textarea value={formData.address || ""} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputCls} placeholder="Alamat lengkap" rows={2} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">SPP / Bulan (Rp)</label>
                  <input type="number" value={formData.sppAmount || ""} onChange={(e) => setFormData({ ...formData, sppAmount: parseInt(e.target.value) })} className={inputCls} placeholder="725000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                  <select value={formData.status || "active"} onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })} className={inputCls}>
                    <option value="active">Aktif</option>
                    <option value="inactive">Non-Aktif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Verifikasi</label>
                  <select value={formData.verified ? "true" : "false"} onChange={(e) => setFormData({ ...formData, verified: e.target.value === "true" })} className={inputCls}>
                    <option value="true">Terverifikasi</option>
                    <option value="false">Belum</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all">
                  {editingStudent ? "Simpan Perubahan" : "Tambah Siswa"}
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
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} color="#EF4444" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Siswa?</h3>
            <p className="text-sm text-gray-500 mb-6">Data siswa ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </SchoolDesktopLayout>
  );
}
