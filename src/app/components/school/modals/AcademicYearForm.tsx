import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface SchoolYear {
  id: string;
  year: string;
  semester: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface AcademicYearFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_YEARS: SchoolYear[] = [
  { id: "1", year: "2025/2026", semester: "Genap", startDate: "2026-01-01", endDate: "2026-06-30", isActive: true },
  { id: "2", year: "2024/2025", semester: "Ganjil", startDate: "2025-07-01", endDate: "2025-12-31", isActive: false },
];

export function AcademicYearForm({ isOpen, onClose }: AcademicYearFormProps) {
  const [years, setYears] = useState<SchoolYear[]>(INITIAL_YEARS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newYear, setNewYear] = useState({
    year: "",
    semester: "Ganjil",
    startDate: "",
    endDate: "",
  });

  const handleAdd = () => {
    if (!newYear.year || !newYear.startDate || !newYear.endDate) {
      alert("Mohon lengkapi semua data");
      return;
    }
    const added: SchoolYear = {
      id: Date.now().toString(),
      ...newYear,
      isActive: false,
    };
    setYears([added, ...years]);
    setNewYear({ year: "", semester: "Ganjil", startDate: "", endDate: "" });
    setShowAddForm(false);
  };

  const handleSetActive = (id: string) => {
    setYears(years.map((y) => ({ ...y, isActive: y.id === id })));
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus tahun ajaran ini?")) {
      setYears(years.filter((y) => y.id !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Tahun Ajaran</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5F7FA" }}>
            <X size={18} color="#8C8C8C" />
          </button>
        </div>

        {/* Add Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-4 py-3 rounded-xl flex items-center justify-center gap-2"
            style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 700 }}
          >
            <Plus size={18} /> Tambah Tahun Ajaran
          </button>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-4 p-4 rounded-xl" style={{ background: "#F5F7FA" }}>
            <div className="space-y-3">
              <div>
                <label style={{ color: "#595959", fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  placeholder="2026/2027"
                  value={newYear.year}
                  onChange={(e) => setNewYear({ ...newYear, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: "#E8E8E8", fontSize: "0.85rem" }}
                />
              </div>
              <div>
                <label style={{ color: "#595959", fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Semester
                </label>
                <select
                  value={newYear.semester}
                  onChange={(e) => setNewYear({ ...newYear, semester: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: "#E8E8E8", fontSize: "0.85rem" }}
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: "#595959", fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Mulai
                  </label>
                  <input
                    type="date"
                    value={newYear.startDate}
                    onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: "#E8E8E8", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ color: "#595959", fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Selesai
                  </label>
                  <input
                    type="date"
                    value={newYear.endDate}
                    onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: "#E8E8E8", fontSize: "0.85rem" }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 rounded-lg"
                  style={{ background: "white", color: "#8C8C8C", fontWeight: 600 }}
                >
                  Batal
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2 rounded-lg text-white"
                  style={{ background: "#1677FF", fontWeight: 600 }}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {years.map((year) => (
            <div key={year.id} className="p-4 rounded-xl border" style={{ borderColor: year.isActive ? "#1677FF" : "#E8E8E8", background: year.isActive ? "#EEF4FF" : "white" }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#242424" }}>{year.year}</p>
                    {year.isActive && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#52C41A", color: "white" }}>
                        Aktif
                      </span>
                    )}
                  </div>
                  <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>
                    Semester {year.semester} • {new Date(year.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} - {new Date(year.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button onClick={() => handleDelete(year.id)} className="ml-2 p-2 rounded-lg" style={{ background: "#FFF2F0" }}>
                  <Trash2 size={14} color="#F95654" />
                </button>
              </div>
              {!year.isActive && (
                <button
                  onClick={() => handleSetActive(year.id)}
                  className="w-full py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "#F5F7FA", color: "#1677FF" }}
                >
                  Aktifkan Periode Ini
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
