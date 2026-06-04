import React, { useState } from "react";
import { useNavigate } from "react-router";
import { User, School, Receipt, ChevronRight, LogOut, HeadphonesIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ITSupportForm } from "../shared/ITSupportForm";
import { PersonalDataForm } from "./modals/PersonalDataForm";
import { SchoolInfoForm } from "./modals/SchoolInfoForm";

export function StudentProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showITSupport, setShowITSupport] = useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const [showSchoolInfo, setShowSchoolInfo] = useState(false);
  
  const [totalDonasi, setTotalDonasi] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [studentData, setStudentData] = useState<any>(null);

  React.useEffect(() => {
    async function loadData() {
      if (!user) return;
      const { Database } = await import("../../data/database");
      const students = await Database.fetchStudentsSupabase();
      const student = students.find((s: any) => s.userId === user.id || s.name === user.name);
      if (student) setStudentData(student);

      const payments = await Database.fetchPaymentsSupabase();
      if (student) {
        const studentPayments = payments.filter((p: any) => 
          p.studentId === student.id && (p.status === "pending" || p.status === "unpaid")
        );
        setUnpaidCount(studentPayments.length);
      }

      const txns = await Database.fetchTransactionsSupabase();
      const myDonations = txns.filter((t: any) => t.user_id === user.id && t.category === "Donasi");
      const total = myDonations.reduce((acc: number, t: any) => acc + t.amount, 0);
      setTotalDonasi(total);
    }
    loadData();
  }, [user]);

  const MENU = [
    {
      group: "Akun",
      items: [
        { icon: <User size={18} />, label: "Data Pribadi", color: "#EEF4FF", iconColor: "#1677FF", action: () => setShowPersonalData(true) },
        { icon: <School size={18} />, label: "Info Sekolah", color: "#FFF7E6", iconColor: "#FD9A16", action: () => setShowSchoolInfo(true) },
        { icon: <Receipt size={18} />, label: "Riwayat Transaksi", color: "#F6FFED", iconColor: "#52C41A", action: () => navigate("/student/history") },
      ],
    },
    {
      group: "Bantuan",
      items: [
        { icon: <HeadphonesIcon size={18} />, label: "Hubungi Tim IT", color: "#F0F7FF", iconColor: "#1677FF", action: () => setShowITSupport(true) },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
        className="px-6 pt-12 pb-8"
        style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}
      >
        <h1 style={{ color: "white", fontSize: "1.2rem", fontWeight: 800, marginBottom: "20px" }}>
          Profil Saya
        </h1>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.25)", fontSize: "1.6rem", fontWeight: 700, color: "white" }}
          >
            {user?.name?.[0] ?? "B"}
          </div>
          <div>
            <p style={{ color: "white", fontSize: "1.05rem", fontWeight: 700 }}>{user?.name}</p>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem" }}>{user?.school}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)", fontSize: "0.72rem", fontWeight: 600 }}
              >
                NISN: {studentData?.nisn || user?.nisn || "0012345678"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="px-6 -mt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 mb-3 pb-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
            {[
              { label: "Kelas", value: studentData?.class || user?.class || "-" },
              { label: "Status", value: "Aktif" },
              { label: "Tagihan", value: `${unpaidCount} Tertunggak` },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="flex flex-col items-center px-2"
                style={{ borderRight: idx < 2 ? "1px solid #F0F0F0" : "none" }}
              >
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>{item.value}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{item.label}</p>
              </div>
            ))}
          </div>
          {/* Total Donasi */}
          <div className="text-center">
            <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Total Donasi</p>
            <p style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.1rem" }}>Rp {totalDonasi.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>

      {/* Menu Groups */}
      <div className="flex-1 px-6 pb-32 space-y-4 overflow-y-auto">
        {MENU.map((group) => (
          <div key={group.group}>
            <p style={{ fontWeight: 700, color: "#8C8C8C", fontSize: "0.75rem", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {group.group}
            </p>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {group.items.map((item, idx) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3.5 transition-all active:bg-gray-50"
                  style={{ borderBottom: idx < group.items.length - 1 ? "1px solid #F5F7FA" : "none" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.color, color: item.iconColor }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ flex: 1, textAlign: "left", fontWeight: 500, color: "#242424", fontSize: "0.9rem" }}>
                    {item.label}
                  </span>
                  <ChevronRight size={16} color="#BFBFBF" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl"
          style={{ background: "#FFF2F0", color: "#F95654", fontWeight: 700, fontSize: "0.9rem" }}
        >
          <LogOut size={18} />
          Keluar dari Akun
        </button>
      </div>

      {/* Modals */}
      <PersonalDataForm isOpen={showPersonalData} onClose={() => setShowPersonalData(false)} user={user} studentData={studentData} />
      <SchoolInfoForm isOpen={showSchoolInfo} onClose={() => setShowSchoolInfo(false)} user={user} studentData={studentData} />
      <ITSupportForm isOpen={showITSupport} onClose={() => setShowITSupport(false)} />
    </div>
  );
}