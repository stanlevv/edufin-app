import React, { useState } from "react";
import { X, Award, TrendingUp } from "lucide-react";

interface AcademicHistoryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEMESTERS = [
  { id: 1, semester: "Semester 1 - 2025/2026", gpa: 88.5, rank: 5, totalStudents: 32, achievements: ["Juara 2 Olimpiade Matematika Kota"] },
  { id: 2, semester: "Semester 2 - 2024/2025", gpa: 87.2, rank: 7, totalStudents: 32, achievements: [] },
  { id: 3, semester: "Semester 1 - 2024/2025", gpa: 86.8, rank: 8, totalStudents: 32, achievements: ["Finalis Kompetisi Sains Nasional"] },
  { id: 4, semester: "Semester 2 - 2023/2024", gpa: 85.5, rank: 10, totalStudents: 30, achievements: [] },
];

export function AcademicHistoryForm({ isOpen, onClose }: AcademicHistoryFormProps) {
  const [selectedSemester, setSelectedSemester] = useState(SEMESTERS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Riwayat Akademik</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5F7FA" }}>
            <X size={18} color="#8C8C8C" />
          </button>
        </div>

        {/* Current Stats */}
        <div className="mb-4 p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", marginBottom: "8px" }}>Rata-rata Keseluruhan</p>
          <div className="flex items-end gap-3">
            <p style={{ color: "white", fontWeight: 800, fontSize: "2.2rem" }}>87.0</p>
            <div className="flex items-center gap-1 mb-2">
              <TrendingUp size={14} color="#B7EB8F" />
              <span style={{ color: "#B7EB8F", fontSize: "0.8rem", fontWeight: 700 }}>+1.5</span>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Peringkat 5 dari 32 siswa</p>
        </div>

        {/* Semester List */}
        <div className="mb-4">
          <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>
            Pilih Semester
          </p>
          <div className="grid grid-cols-1 gap-2">
            {SEMESTERS.map((sem) => (
              <button
                key={sem.id}
                onClick={() => setSelectedSemester(sem)}
                className="p-3 rounded-xl text-left transition-all"
                style={{
                  background: selectedSemester.id === sem.id ? "#EEF4FF" : "#F5F7FA",
                  border: selectedSemester.id === sem.id ? "2px solid #1677FF" : "2px solid transparent",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#242424" }}>{sem.semester}</p>
                    <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>
                      Rata-rata: {sem.gpa} • Peringkat: {sem.rank}/{sem.totalStudents}
                    </p>
                  </div>
                  {selectedSemester.id === sem.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "#1677FF" }}>
                      <span style={{ color: "white", fontSize: "0.7rem" }}>✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Semester Details */}
        <div className="p-4 rounded-2xl" style={{ background: "#F5F7FA" }}>
          <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>
            Detail {selectedSemester.semester}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-xl text-center" style={{ background: "white" }}>
              <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1677FF" }}>{selectedSemester.gpa}</p>
              <p style={{ color: "#8C8C8C", fontSize: "0.68rem" }}>Rata-rata</p>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: "white" }}>
              <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#52C41A" }}>{selectedSemester.rank}</p>
              <p style={{ color: "#8C8C8C", fontSize: "0.68rem" }}>Peringkat</p>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: "white" }}>
              <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#FD9A16" }}>{selectedSemester.totalStudents}</p>
              <p style={{ color: "#8C8C8C", fontSize: "0.68rem" }}>Total Siswa</p>
            </div>
          </div>

          {/* Achievements */}
          {selectedSemester.achievements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} color="#FD9A16" />
                <p style={{ fontWeight: 700, fontSize: "0.8rem", color: "#242424" }}>Prestasi</p>
              </div>
              <div className="space-y-2">
                {selectedSemester.achievements.map((ach, idx) => (
                  <div key={idx} className="p-2 rounded-lg flex items-center gap-2"
                    style={{ background: "white" }}>
                    <span style={{ fontSize: "0.9rem" }}>🏆</span>
                    <p style={{ color: "#242424", fontSize: "0.8rem" }}>{ach}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedSemester.achievements.length === 0 && (
            <div className="p-3 rounded-lg text-center" style={{ background: "white" }}>
              <p style={{ color: "#8C8C8C", fontSize: "0.8rem" }}>Tidak ada prestasi tercatat</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3.5 rounded-xl font-bold"
          style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", color: "white" }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
