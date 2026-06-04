import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, CheckCircle, XCircle, Megaphone } from "lucide-react";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";
import { Database, Campaign } from "../../data/database";
import { useAuth } from "../../context/AuthContext";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const CATEGORIES = ["Beasiswa", "Fasilitas", "Perlengkapan", "Ujian"] as const;
type Category = typeof CATEGORIES[number];
type CampaignStatus = "active" | "completed" | "cancelled";

const STATUS_CFG: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Aktif", color: "#52C41A", bg: "#F6FFED" },
  completed: { label: "Selesai", color: "#1677FF", bg: "#EEF4FF" },
  cancelled: { label: "Dibatalkan", color: "#8C8C8C", bg: "#F5F5F5" },
};

const CAT_CFG: Record<string, { color: string; bg: string }> = {
  Beasiswa: { color: "#722ED1", bg: "#F9F0FF" },
  Fasilitas: { color: "#1677FF", bg: "#EEF4FF" },
  Perlengkapan: { color: "#D4A017", bg: "#FFFBE6" },
  Ujian: { color: "#EA4E0D", bg: "#FFF2EE" },
};

type FilterType = "Semua" | CampaignStatus;

const EMPTY_FORM = (): Partial<Campaign> => ({
  status: "active",
  verified: false,
  category: "Beasiswa",
  collected: 0,
  donors: 0,
  updates: [],
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
});

export function SchoolCampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("Semua");
  const [filterCat, setFilterCat] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<Partial<Campaign>>(EMPTY_FORM());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await Database.fetchCampaignsSupabase();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = campaigns.filter((c) => {
    const ms = c.title.toLowerCase().includes(search.toLowerCase()) || c.school.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "Semua" || c.status === filter;
    const mc = filterCat === "Semua" || c.category === filterCat;
    return ms && mf && mc;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    verified: campaigns.filter((c) => c.verified).length,
    pending: campaigns.filter((c) => !c.verified && c.status === "active").length,
    totalCollected: campaigns.reduce((s, c) => s + c.collected, 0),
  };

  const openCreate = () => {
    setEditingCampaign(null);
    setFormData(EMPTY_FORM());
    setShowModal(true);
  };

  const openEdit = (c: Campaign) => {
    setEditingCampaign(c);
    setFormData({ ...c });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    await Database.deleteCampaignSupabase(id);
    await loadData();
    setDeleteConfirm(null);
  };

  const handleToggleVerify = async (c: Campaign) => {
    // Verified flag is just status 'active' in DB for simplicity right now
    await Database.updateCampaignSupabase({ ...c, verified: !c.verified });
    await loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampaign) {
      await Database.updateCampaignSupabase({
        ...editingCampaign,
        ...formData
      } as Campaign);
    } else {
      await Database.insertCampaignSupabase(formData, user?.id || "");
    }
    await loadData();
    setShowModal(false);
  };

  const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white";

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Manajemen Kampanye</h2>
            <p className="text-sm text-gray-500">Approve, edit, dan kelola semua kampanye donasi</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm">
            <Plus size={18} /> <span className="text-sm">Tambah Kampanye</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total", value: stats.total, color: "#595959", bg: "#F5F7FA" },
            { label: "Aktif", value: stats.active, color: "#52C41A", bg: "#F6FFED" },
            { label: "Terverifikasi", value: stats.verified, color: "#1677FF", bg: "#EEF4FF" },
            { label: "Pending Approve", value: stats.pending, color: "#F97316", bg: "#FFF7E6" },
            { label: "Total Terkumpul", value: formatRupiah(stats.totalCollected), color: "#722ED1", bg: "#F9F0FF", wide: true },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: s.bg }}>
                <Megaphone size={16} style={{ color: s.color }} />
              </div>
              <p className="font-bold text-gray-800" style={{ fontSize: typeof s.value === "string" ? "13px" : "22px" }}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <Search size={17} color="#8C8C8C" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul kampanye atau sekolah..." className="flex-1 bg-transparent outline-none text-sm" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["Semua","active","completed","cancelled"] as FilterType[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: filter === f ? "#1677FF" : "#F5F7FA", color: filter === f ? "white" : "#595959" }}>
                {f === "Semua" ? "Semua Status" : STATUS_CFG[f as CampaignStatus].label}
              </button>
            ))}
            <div className="w-px bg-gray-200 mx-1" />
            {["Semua", ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setFilterCat(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: filterCat === c ? "#722ED1" : "#F5F7FA", color: filterCat === c ? "white" : "#595959" }}>
                {c === "Semua" ? "Semua Kategori" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kampanye</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Donatur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Verifikasi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const sc = STATUS_CFG[c.status];
                const cc = CAT_CFG[c.category] || { color: "#595959", bg: "#F5F5F5" };
                const pct = Math.min(Math.round((c.collected / (c.target || 1)) * 100), 100);
                return (
                  <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <Megaphone size={16} color="#722ED1" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 max-w-xs">{c.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{c.school}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: cc.bg, color: cc.color }}>{c.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{pct}%</span>
                          <span className="text-gray-400">{formatRupiah(c.collected)}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Target: {formatRupiah(c.target)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.donors}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleVerify(c)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: c.verified ? "#F6FFED" : "#FFF7E6",
                          color: c.verified ? "#52C41A" : "#F97316",
                        }}
                      >
                        {c.verified ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        {c.verified ? "Terverifikasi" : "Belum"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"><Edit size={15} /></button>
                        <button onClick={() => setDeleteConfirm(c.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Megaphone size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">Tidak ada kampanye ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-800">{editingCampaign ? "Edit Kampanye" : "Tambah Kampanye Baru"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Judul Kampanye *</label>
                <input required value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputCls} placeholder="Judul kampanye" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sekolah *</label>
                  <input required value={formData.school || ""} onChange={(e) => setFormData({ ...formData, school: e.target.value })} className={inputCls} placeholder="Nama sekolah" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Lokasi</label>
                  <input value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputCls} placeholder="Kota, Provinsi" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi *</label>
                <textarea required value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputCls} rows={2} placeholder="Deskripsi singkat" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cerita Lengkap</label>
                <textarea value={formData.story || ""} onChange={(e) => setFormData({ ...formData, story: e.target.value })} className={inputCls} rows={3} placeholder="Cerita lengkap kampanye..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kategori</label>
                  <select value={formData.category || "Beasiswa"} onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Target Dana (Rp) *</label>
                  <input type="number" required value={formData.target || ""} onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 0 })} className={inputCls} placeholder="5000000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dana Terkumpul</label>
                  <input type="number" value={formData.collected || ""} onChange={(e) => setFormData({ ...formData, collected: parseInt(e.target.value) || 0 })} className={inputCls} placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mulai</label>
                  <input type="date" value={formData.startDate || ""} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Berakhir</label>
                  <input type="date" value={formData.endDate || ""} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                  <select value={formData.status || "active"} onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })} className={inputCls}>
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL Gambar</label>
                <input value={formData.image || ""} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className={inputCls} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
                <input type="checkbox" id="verified" checked={formData.verified || false} onChange={(e) => setFormData({ ...formData, verified: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                <label htmlFor="verified" className="text-sm font-semibold text-blue-700 cursor-pointer">Tandai sebagai Terverifikasi</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
                  {editingCampaign ? "Simpan Perubahan" : "Tambah Kampanye"}
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Kampanye?</h3>
            <p className="text-sm text-gray-500 mb-6">Kampanye ini akan dihapus permanen beserta semua data terkait.</p>
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
