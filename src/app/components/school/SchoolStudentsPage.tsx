import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, Users, CheckCircle, XCircle, BookOpen, Loader2, Clock, UserCheck, UserX } from "lucide-react";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Student } from "../../data/database";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const EMPTY_FORM: Partial<Student> = {
  status: "active",
  sppAmount: 725000,
  verified: false,
  school: "SMA Negeri 1 Jakarta",
  userId: "",
};

type TabType = "all" | "pending";

export function SchoolStudentsPage() {
  const { user, register } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>(EMPTY_FORM);
  const [password, setPassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    if (!user?.id) return;

    // Ambil school_id
    const { data: adminData } = await supabase.from("school_admins").select("school_id").eq("user_id", user.id).single();
    if (!adminData?.school_id) {
      setIsLoading(false);
      return;
    }
    const schoolId = adminData.school_id;

    // Fetch students
    const { data: allData } = await supabase.from("students").select("*").eq("school_id", schoolId).order("name", { ascending: true });
    
    if (allData) {
      const active = allData.filter((d: any) => d.registration_status !== "pending").map((d: any) => ({
        id: d.id,
        userId: d.user_id || "",
        nisn: d.nisn,
        name: d.name,
        email: d.edufin_email || d.email || "",
        school: "",
        class: d.class,
        parentName: d.parent_name,
        sppAmount: d.spp_amount,
        status: d.status,
        registrationStatus: d.registration_status || "data_only",
        verified: d.registration_status === "active",
      }));
      setStudents(active as Student[]);

      const pending = allData.filter((d: any) => d.registration_status === "pending").map((d: any) => ({
        id: d.id,
        userId: d.user_id || "",
        nisn: d.nisn,
        name: d.name,
        email: d.edufin_email || d.email || "",
        personalEmail: d.personal_email || "",
        edufinEmail: d.edufin_email || "",
        class: d.class,
        parentName: d.parent_name,
        sppAmount: d.spp_amount,
        status: d.status,
        registrationStatus: d.registration_status,
        registeredAt: d.registered_at,
      }));
      setPendingStudents(pending);
    }
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

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
    setPassword("");
    setShowModal(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    await supabase.from("students").delete().eq("id", id);
    await loadData();
    setDeleteConfirm(null);
  };

  const handleConfirm = async (studentId: string) => {
    await supabase.from("students").update({ registration_status: "active", status: "active" }).eq("id", studentId);
    await loadData();
  };

  const handleReject = async (studentId: string) => {
    await supabase.from("students").update({ 
      registration_status: "data_only", 
      user_id: null, email: null, personal_email: null, edufin_email: null, registered_at: null 
    }).eq("id", studentId);
    await loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (editingStudent) {
      await supabase.from("students").update({
        nisn: formData.nisn,
        name: formData.name,
        class: formData.class,
        parent_name: formData.parentName,
        spp_amount: formData.sppAmount,
        status: formData.status
      }).eq("id", editingStudent.id);
    } else {
      let createdUserId = null;
      // 1. Buat akun Supabase Auth (simulasi pendaftaran)
      if (formData.email && password) {
        const regRes = await register({
          email: formData.email,
          password: password,
          name: formData.name || "",
          role: "siswa",
          nisn: formData.nisn,
          school: "SMA Negeri 1 Jakarta",
          class: formData.class,
          parentName: formData.parentName
        });
        if (!regRes.success) {
          alert("Gagal membuat akun login: " + regRes.message);
          setIsSaving(false);
          return;
        }
      }
      // 2. Insert data siswa
      const { data: adminData } = await supabase.from("school_admins").select("school_id").eq("user_id", user?.id).single();
      if (adminData?.school_id) {
        await supabase.from("students").insert([{
          school_id: adminData.school_id,
          nisn: formData.nisn,
          name: formData.name,
          class: formData.class,
          parent_name: formData.parentName,
          spp_amount: formData.sppAmount || 725000,
          status: formData.status || "active",
          registration_status: formData.email ? "active" : "data_only",
          created_by: user?.id
        }]);
      }
    }

    await loadData();
    setShowModal(false);
    setFormData(EMPTY_FORM);
    setPassword("");
    setIsSaving(false);
  };

  const stats = {
    total: students.length,
    active: students.filter((s) => s.registrationStatus === "active" && s.status === "active").length,
    inactive: students.filter((s) => s.status === "inactive").length,
    classes: new Set(students.map((s) => s.class).filter(Boolean)).size,
  };

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white";

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Manajemen Siswa</h2>
            <p className="text-sm text-gray-500">Kelola data seluruh siswa — tambah, konfirmasi, dan hapus</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="text-sm">Tambah Siswa</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: activeTab === "all" ? "#1677FF" : "#F5F7FA", color: activeTab === "all" ? "white" : "#595959" }}
          >
            Semua Siswa
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: activeTab === "pending" ? "#FA8C16" : "#FFF7E6", color: activeTab === "pending" ? "white" : "#FA8C16" }}
          >
            <Clock size={15} />
            Menunggu Konfirmasi
            {pendingStudents.length > 0 && (
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                style={{ background: activeTab === "pending" ? "white" : "#FA8C16", color: activeTab === "pending" ? "#FA8C16" : "white" }}
              >
                {pendingStudents.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "pending" ? (
          /* ── PENDING TAB ── */
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-4 bg-orange-50 border-b border-orange-100 flex items-center gap-3">
              <Clock size={18} color="#FA8C16" />
              <p className="font-semibold text-orange-700 text-sm">Daftar Pendaftaran Menunggu Konfirmasi</p>
              <span className="ml-auto text-xs text-orange-500 bg-orange-100 px-2.5 py-1 rounded-full font-semibold">
                {pendingStudents.length} pendaftaran
              </span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Siswa</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">NISN</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Akun EDUFIN</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Notif</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Tgl Daftar</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map((s) => (
                  <tr key={s.id} className="border-t border-gray-100 hover:bg-orange-50/30 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                          {s.name[0]}
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{s.nisn}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.class}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-blue-600 font-mono">{s.edufinEmail || s.email || '-'}</p>
                      <p className="text-xs text-gray-400">Akun login EDUFIN</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.personalEmail || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {s.registeredAt
                        ? new Date(s.registeredAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirm(s.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all text-xs font-semibold"
                        >
                          <UserCheck size={14} /> Konfirmasi
                        </button>
                        <button
                          onClick={() => handleReject(s.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all text-xs font-semibold"
                        >
                          <UserX size={14} /> Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingStudents.length === 0 && (
              <div className="text-center py-16">
                <CheckCircle size={40} className="mx-auto mb-3 text-green-200" />
                <p className="text-gray-400 text-sm">Tidak ada pendaftaran yang menunggu konfirmasi</p>
              </div>
            )}
          </div>
        ) : (
          <>
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status Akun</th>
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
                        {(() => {
                          const rs = student.registrationStatus || 'data_only';
                          if (rs === 'active') return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Aktif
                            </span>
                          );
                          if (rs === 'pending') return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Menunggu
                            </span>
                          );
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Belum Daftar
                            </span>
                          );
                        })()}
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
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingStudent ? "Edit data siswa" : "Admin tambah siswa — akun langsung aktif"}
                </p>
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

              {!editingStudent && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Login *</label>
                    <input type="email" required value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls} placeholder="email@siswa.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password Login *</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="Minimal 6 karakter" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kelas *</label>
                  <input required value={formData.class || ""} onChange={(e) => setFormData({ ...formData, class: e.target.value })} className={inputCls} placeholder="Contoh: X IPA 1" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Orang Tua *</label>
                  <input required value={formData.parentName || ""} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} className={inputCls} placeholder="Nama orang tua/wali" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">Batal</button>
                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  {isSaving ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : (editingStudent ? "Simpan Perubahan" : "Tambah Siswa")}
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
