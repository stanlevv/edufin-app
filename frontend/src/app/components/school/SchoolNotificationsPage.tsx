import React, { useState } from "react";
import { Plus, X, Bell, Trash2, Edit, Send, Users, CheckCircle } from "lucide-react";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Database } from "../../data/database";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  target: "all" | "class" | "student";
  targetValue?: string;
  createdAt: string;
  sentBy: string;
  read: number;
  total: number;
}

const INITIAL_NOTIFICATIONS: Notification[] = [];

const TYPE_CONFIG = {
  info: { label: "Info", color: "#1677FF", bg: "#EEF4FF", icon: Bell },
  warning: { label: "Peringatan", color: "#FD9A16", bg: "#FFF7E6", icon: Bell },
  success: { label: "Sukses", color: "#52C41A", bg: "#F6FFED", icon: CheckCircle },
  urgent: { label: "Penting", color: "#F95654", bg: "#FFF2F0", icon: Bell },
};

const STORAGE_KEY = "edufin_school_broadcast_notifs";

function loadNotifs(): Notification[] {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) return JSON.parse(d);
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  return INITIAL_NOTIFICATIONS;
}

function saveNotifs(notifs: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
}

export function SchoolNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifs);
  const [showModal, setShowModal] = useState(false);
  const [editingNotif, setEditingNotif] = useState<Notification | null>(null);
  const [formData, setFormData] = useState<Partial<Notification>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const updateState = (notifs: Notification[]) => {
    saveNotifs(notifs);
    setNotifications(notifs);
  };

  const handleAdd = () => {
    setEditingNotif(null);
    setFormData({ type: "info", target: "all" });
    setShowModal(true);
  };

  const handleEdit = (notif: Notification) => {
    setEditingNotif(notif);
    setFormData(notif);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    updateState(notifications.filter((n) => n.id !== id));
    setDeleteConfirm(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");

    if (editingNotif) {
      updateState(notifications.map((n) => (n.id === editingNotif.id ? { ...n, ...formData } : n)));
    } else {
      const newNotif: Notification = {
        id: Math.max(...notifications.map((n) => n.id), 0) + 1,
        ...formData as Notification,
        createdAt: now,
        sentBy: "Admin SDN 3 Malang",
        read: 0,
        total: formData.target === "all" ? 50 : formData.target === "class" ? 15 : 1,
      };
      updateState([newNotif, ...notifications]);

      // ─── Relay ke Database siswa ───────────────────────────────────
      // Ambil semua siswa, filter berdasarkan target
      const allStudents = Database.getStudents();
      const targetStudents = allStudents.filter((s) => {
        if (formData.target === "all") return true;
        if (formData.target === "class") return s.class?.includes(formData.targetValue ?? "");
        if (formData.target === "student") return s.nisn === formData.targetValue;
        return false;
      });

      // Map tipe notifikasi sekolah ke tipe Database
      const dbType = formData.type === "urgent" || formData.type === "warning" ? "reminder" :
                     formData.type === "success" ? "payment" : "system";

      targetStudents.forEach((student) => {
        Database.saveNotification({
          id: `school-notif-${Date.now()}-${student.id}`,
          userId: student.userId,
          title: formData.title ?? "Notifikasi Sekolah",
          message: formData.message ?? "",
          type: dbType,
          read: false,
          createdAt: new Date().toISOString(),
        });
      });
      // ──────────────────────────────────────────────────────────────
    }
    setShowModal(false);
    setFormData({});
  };

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Notifikasi</h2>
          <p className="text-sm text-gray-500">SDN 3 Malang - Kirim notifikasi ke siswa dan orang tua</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-blue-600 mb-1">{notifications.length}</p>
            <p className="text-sm text-gray-500">Total Notifikasi</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-green-600 mb-1">
              {notifications.reduce((sum, n) => sum + n.read, 0)}
            </p>
            <p className="text-sm text-gray-500">Total Dibaca</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-orange-600 mb-1">
              {notifications.filter((n) => n.type === "warning" || n.type === "urgent").length}
            </p>
            <p className="text-sm text-gray-500">Peringatan</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {notifications.filter((n) => {
                const daysSince = Math.floor(
                  (Date.now() - new Date(n.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                );
                return daysSince <= 7;
              }).length}
            </p>
            <p className="text-sm text-gray-500">7 Hari Terakhir</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
          >
            <Plus size={18} />
            <span className="text-sm">Buat Notifikasi Baru</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notif) => {
            const config = TYPE_CONFIG[notif.type];
            const Icon = config.icon;
            const readPercentage = Math.round((notif.read / notif.total) * 100);

            return (
              <div key={notif.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: config.bg }}
                  >
                    <Icon size={24} color={config.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-800">{notif.title}</h3>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: config.bg, color: config.color }}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{notif.message}</p>

                        <div className="flex items-center gap-6 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            <span>
                              Target:{" "}
                              {notif.target === "all"
                                ? "Semua Siswa"
                                : notif.target === "class"
                                ? `Kelas ${notif.targetValue}`
                                : `Siswa ${notif.targetValue}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Bell size={14} />
                            <span>
                              Dibaca: {notif.read}/{notif.total} ({readPercentage}%)
                            </span>
                          </div>
                          <div>
                            <span>{notif.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(notif)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(notif.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300 rounded-full"
                          style={{ width: `${readPercentage}%`, background: config.color }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-400">Belum ada notifikasi</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-800">
                {editingNotif ? "Edit Notifikasi" : "Buat Notifikasi Baru"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Notifikasi *</label>
                <input
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                  placeholder="Contoh: Pengumuman Libur Hari Raya"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan *</label>
                <textarea
                  required
                  value={formData.message || ""}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                  placeholder="Tulis pesan notifikasi..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Notifikasi *</label>
                  <select
                    value={formData.type || "info"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as Notification["type"] })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Peringatan</option>
                    <option value="success">Sukses</option>
                    <option value="urgent">Penting/Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Penerima *</label>
                  <select
                    value={formData.target || "all"}
                    onChange={(e) =>
                      setFormData({ ...formData, target: e.target.value as Notification["target"] })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="all">Semua Siswa</option>
                    <option value="class">Kelas Tertentu</option>
                    <option value="student">Siswa Tertentu</option>
                  </select>
                </div>
              </div>

              {(formData.target === "class" || formData.target === "student") && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.target === "class" ? "Nama Kelas" : "NISN Siswa"} *
                  </label>
                  <input
                    required
                    value={formData.targetValue || ""}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                    placeholder={formData.target === "class" ? "Contoh: X IPA 1" : "Contoh: 0012345678"}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  <span>{editingNotif ? "Simpan Perubahan" : "Kirim Notifikasi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} color="#EF4444" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Notifikasi?</h3>
            <p className="text-sm text-gray-500 mb-6">Notifikasi ini akan dihapus permanen.</p>
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
