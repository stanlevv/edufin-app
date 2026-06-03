import React, { useState } from "react";

interface Screen {
  id: string;
  title: string;
  role: string;
  component: React.ReactNode;
}

const screens: Screen[] = [
  {
    id: "login",
    title: "1. Login",
    role: "Semua Role",
    component: <LoginScreen />,
  },
  {
    id: "student-dashboard",
    title: "2. Dashboard Siswa",
    role: "Student",
    component: <StudentDashboardScreen />,
  },
  {
    id: "spp-payment",
    title: "3. Pembayaran SPP",
    role: "Student",
    component: <SPPPaymentScreen />,
  },
  {
    id: "campaign-submission",
    title: "4. Ajukan Kampanye",
    role: "Student/Parent",
    component: <CampaignSubmissionScreen />,
  },
  {
    id: "campaign-list",
    title: "5. Daftar Kampanye",
    role: "All Roles",
    component: <CampaignListScreen />,
  },
  {
    id: "campaign-detail",
    title: "6. Detail & Donasi",
    role: "Donor",
    component: <CampaignDetailScreen />,
  },
  {
    id: "school-dashboard",
    title: "7. Dashboard Sekolah",
    role: "School/Admin",
    component: <SchoolDashboardScreen />,
  },
  {
    id: "manage-bills",
    title: "8. Kelola Tagihan",
    role: "School/Admin",
    component: <ManageBillsScreen />,
  },
  {
    id: "manage-campaigns",
    title: "9. Kelola Kampanye",
    role: "School/Admin",
    component: <ManageCampaignsScreen />,
  },
  {
    id: "donor-profile",
    title: "10. Profil Donatur",
    role: "Donor",
    component: <DonorProfileScreen />,
  },
  {
    id: "aid-review",
    title: "11. Review Bantuan",
    role: "School/Admin",
    component: <AidReviewScreen />,
  },
  {
    id: "history",
    title: "12. Riwayat Transaksi",
    role: "All Roles",
    component: <HistoryScreen />,
  },
];

export default function WireframeViewer() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E8F4FF 0%, #F0F7FF 50%, #E8F4FF 100%)",
      padding: "60px 30px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: "absolute",
        top: "5%",
        right: "8%",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        border: "2px solid rgba(255, 185, 0, 0.3)",
        opacity: 0.6
      }} />
      <div style={{
        position: "absolute",
        top: "15%",
        right: "5%",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        border: "2px solid rgba(255, 185, 0, 0.2)",
        opacity: 0.4
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "5%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 8px)",
        gap: "8px",
        opacity: 0.4
      }}>
        {[...Array(9)].map((_, i) => (
          <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1677FF" }} />
        ))}
      </div>
      <div style={{
        position: "absolute",
        top: "40%",
        left: "3%",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#52C41A",
        opacity: 0.3
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "10%",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background: "#FDD504",
        opacity: 0.4
      }} />

      <div style={{ maxWidth: "1600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{
            fontSize: "42px",
            fontWeight: "900",
            color: "#1677FF",
            marginBottom: "12px",
            textShadow: "0 2px 4px rgba(22, 119, 255, 0.1)"
          }}>
            EDUFIN - Low Fidelity Wireframes
          </h1>
          <p style={{ fontSize: "18px", color: "#595959", fontWeight: "500" }}>
            Wireframe halaman-halaman penting sistem pendidikan dan donasi
          </p>
          <div style={{
            display: "inline-block",
            marginTop: "16px",
            padding: "8px 24px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "24px",
            fontSize: "14px",
            color: "#8C8C8C",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            📱 12 Wireframes • Mobile-First Design • Max Width 430px
          </div>
        </div>

        {/* All Wireframes Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "50px",
          marginBottom: "60px"
        }}>
          {screens.map((screen, index) => (
            <WireframeCard
              key={screen.id}
              number={index + 1}
              title={screen.title.replace(/^\d+\.\s*/, "")}
              role={screen.role}
              component={screen.component}
            />
          ))}
        </div>

        {/* Legend */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
        }}>
          <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "24px", color: "#262626" }}>
            📋 Penjelasan Elemen Wireframe
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            <LegendItem color="#1677FF" label="Warna utama EDUFIN - CTA buttons dan header" />
            <LegendItem color="#f5f5f5" border="3px dashed #d9d9d9" label="Placeholder untuk konten dinamis (image, chart)" />
            <LegendItem color="white" border="3px solid #d9d9d9" label="Card dan List Item containers" />
            <LegendItem color="#fafafa" border="3px solid #d9d9d9" label="Form input fields untuk user input" />
          </div>

          <div style={{
            marginTop: "32px",
            padding: "24px",
            background: "#F0F7FF",
            borderRadius: "16px",
            borderLeft: "4px solid #1677FF"
          }}>
            <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#262626", marginBottom: "12px" }}>
              💡 Tips Export untuk Dokumentasi TA/Skripsi:
            </h4>
            <ul style={{ margin: 0, paddingLeft: "24px", color: "#595959", lineHeight: "1.8" }}>
              <li><strong>Screenshot:</strong> Win+Shift+S (Windows) atau Cmd+Shift+4 (Mac)</li>
              <li><strong>Print to PDF:</strong> Ctrl+P atau Cmd+P → Save as PDF</li>
              <li><strong>Resolution:</strong> Zoom browser ke 100-125% untuk hasil terbaik</li>
              <li><strong>Caption:</strong> Gunakan format "Gambar 4.X Wireframe [Nama Halaman]"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function WireframeCard({ number, title, role, component }: {
  number: number;
  title: string;
  role: string;
  component: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "30px",
      background: "white",
      borderRadius: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      transition: "transform 0.2s",
    }}>
      <div style={{
        marginBottom: "20px",
        textAlign: "center",
        width: "100%"
      }}>
        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          background: "#EEF4FF",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "700",
          color: "#1677FF",
          marginBottom: "12px"
        }}>
          {number}. {role}
        </div>
        <h3 style={{
          fontSize: "18px",
          fontWeight: "800",
          color: "#262626",
          margin: 0
        }}>
          {title}
        </h3>
      </div>
      <div>
        {component}
      </div>
      <div style={{
        marginTop: "20px",
        padding: "12px 24px",
        background: "#F0F7FF",
        borderRadius: "12px",
        border: "2px solid #D6E8FF",
        cursor: "move",
        userSelect: "none"
      }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#1677FF" }}>
          {title}
        </span>
      </div>
    </div>
  );
}

function LegendItem({ color, border, label }: { color: string; border?: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: "48px",
        height: "32px",
        background: color,
        border: border || "none",
        borderRadius: "4px",
        flexShrink: 0
      }} />
      <span style={{ fontSize: "14px", color: "#595959" }}>{label}</span>
    </div>
  );
}

// ============================================================================
// WIREFRAME COMPONENTS (Sketchy Style)
// ============================================================================

const wireframeStyles = {
  phone: {
    width: "340px",
    border: "6px solid #4A90E2",
    borderRadius: "36px",
    padding: "14px",
    background: "white",
    boxShadow: "0 12px 40px rgba(74, 144, 226, 0.25)",
    position: "relative" as const,
  },
  header: {
    background: "#5B9BD5",
    color: "white",
    padding: "14px",
    borderRadius: "24px 24px 0 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "600",
  },
  box: {
    background: "#E8E8E8",
    border: "none",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center" as const,
    fontSize: "11px",
    color: "#999",
    fontWeight: "600",
  },
  card: {
    background: "#F8F8F8",
    border: "2px solid #E0E0E0",
    borderRadius: "14px",
    padding: "12px",
  },
  btn: {
    background: "#5B9BD5",
    color: "white",
    padding: "11px",
    borderRadius: "10px",
    textAlign: "center" as const,
    fontSize: "12px",
    fontWeight: "700",
    border: "none",
  },
  btnOutline: {
    background: "white",
    color: "#5B9BD5",
    border: "2px solid #5B9BD5",
    padding: "11px",
    borderRadius: "10px",
    textAlign: "center" as const,
    fontSize: "12px",
    fontWeight: "700",
  },
  input: {
    background: "#F5F5F5",
    border: "2px solid #E0E0E0",
    borderRadius: "10px",
    padding: "11px",
    fontSize: "11px",
    color: "#999",
  },
  listItem: {
    border: "2px solid #E0E0E0",
    borderRadius: "12px",
    padding: "11px",
    fontSize: "11px",
    color: "#666",
    background: "#FAFAFA",
  },
  bottomNav: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "4px",
    padding: "12px",
    background: "white",
    borderTop: "3px solid #d9d9d9",
    borderRadius: "0 0 8px 8px",
  },
  navItem: {
    textAlign: "center" as const,
    fontSize: "11px",
    color: "#8C8C8C",
    padding: "8px",
  },
};

function LoginScreen() {
  return (
    <div style={wireframeStyles.phone}>
      {/* Status Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", fontSize: "10px", color: "#999" }}>
        <span>9:41</span>
        <div style={{ display: "flex", gap: "4px" }}>
          <span>📶</span>
          <span>📡</span>
          <span>🔋</span>
        </div>
      </div>

      <div style={{ padding: "24px 20px" }}>
        <div style={{ ...wireframeStyles.box, height: "80px", marginBottom: "20px", marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#AAA" }}>
          LOGO
        </div>

        {/* Text Lines */}
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
          <div style={{ height: "3px", background: "#D0D0D0", borderRadius: "2px", width: "70%", margin: "0 auto 6px" }} />
          <div style={{ height: "3px", background: "#D0D0D0", borderRadius: "2px", width: "85%", margin: "0 auto" }} />
        </div>

        <div style={{ ...wireframeStyles.input, marginBottom: "12px", position: "relative", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "16px", height: "16px", background: "#D0D0D0", borderRadius: "4px" }} />
          <div style={{ height: "2px", background: "#D0D0D0", flex: 1, borderRadius: "1px" }} />
        </div>

        <div style={{ ...wireframeStyles.input, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "16px", height: "16px", background: "#D0D0D0", borderRadius: "4px" }} />
          <div style={{ height: "2px", background: "#D0D0D0", flex: 1, borderRadius: "1px" }} />
        </div>

        <div style={{ ...wireframeStyles.btn, marginBottom: "12px" }}>
          Login
        </div>

        <div style={{ ...wireframeStyles.btnOutline }}>
          Sign Up
        </div>

        {/* Footer Text Line */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <div style={{ height: "2px", background: "#E0E0E0", borderRadius: "1px", width: "60%", margin: "0 auto" }} />
        </div>
      </div>
    </div>
  );
}

function StudentDashboardScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.3)", borderRadius: "10px" }} />
          <span>Nama Siswa</span>
        </div>
        <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.3)", borderRadius: "10px" }} />
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ ...wireframeStyles.card, marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", marginBottom: "6px" }}>Tagihan SPP Bulan Ini</div>
          <div style={{ fontSize: "20px", fontWeight: "800", marginBottom: "12px" }}>Rp 850.000</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ ...wireframeStyles.btn, padding: "10px" }}>Bayar</div>
            <div style={{ ...wireframeStyles.btnOutline, padding: "10px" }}>Cicilan</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "12px" }}>
          <div style={{ ...wireframeStyles.box, padding: "10px", fontSize: "10px" }}>Dibayar<br />Tahun</div>
          <div style={{ ...wireframeStyles.box, padding: "10px", fontSize: "10px" }}>Tagihan<br />Bulan</div>
          <div style={{ ...wireframeStyles.box, padding: "10px", fontSize: "10px" }}>Rata<br />-rata</div>
        </div>
        <div style={{ ...wireframeStyles.box, height: "100px", marginBottom: "12px" }}>
          📊 Grafik Riwayat Pembayaran
        </div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>
          Kampanye Donasi 1
        </div>
        <div style={wireframeStyles.listItem}>
          Kampanye Donasi 2
        </div>
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem}>🏠<br />Home</div>
        <div style={wireframeStyles.navItem}>💰<br />SPP</div>
        <div style={wireframeStyles.navItem}>❤️<br />Donasi</div>
        <div style={wireframeStyles.navItem}>👤<br />Profil</div>
      </div>
    </div>
  );
}

function SPPPaymentScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <span>← Kembali</span>
        <span>Bayar SPP</span>
        <span></span>
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ ...wireframeStyles.card, marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px" }}>Detail Tagihan</div>
          <div style={{ ...wireframeStyles.listItem, marginBottom: "6px" }}>SPP - Rp 500.000</div>
          <div style={{ ...wireframeStyles.listItem, marginBottom: "6px" }}>Lab - Rp 125.000</div>
          <div style={{ ...wireframeStyles.listItem, marginBottom: "6px" }}>Perpus - Rp 75.000</div>
          <div style={{ ...wireframeStyles.listItem, marginBottom: "10px" }}>Kegiatan - Rp 150.000</div>
          <div style={{ borderTop: "3px solid #d9d9d9", paddingTop: "10px", fontWeight: "800", fontSize: "14px" }}>
            Total: Rp 850.000
          </div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px" }}>
          Pilih Metode Pembayaran
        </div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>📱 QRIS - Scan & bayar</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>🏦 Virtual Account</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "16px" }}>💳 Bank Transfer</div>
        <div style={wireframeStyles.btn}>
          Bayar Sekarang
        </div>
      </div>
    </div>
  );
}

function CampaignSubmissionScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <span>← Kembali</span>
        <span>Ajukan Kampanye</span>
        <span></span>
      </div>
      <div style={{ padding: "14px", maxHeight: "480px", overflowY: "auto" }}>
        <div style={{ ...wireframeStyles.box, height: "100px", marginBottom: "12px" }}>
          📷 Upload Foto Kampanye
        </div>
        <div style={{ ...wireframeStyles.input, marginBottom: "10px" }}>Judul Kampanye</div>
        <div style={{ ...wireframeStyles.input, height: "70px", marginBottom: "10px" }}>Deskripsi Kampanye</div>
        <div style={{ ...wireframeStyles.input, height: "60px", marginBottom: "10px" }}>Alasan/Latar Belakang</div>
        <div style={{ ...wireframeStyles.input, marginBottom: "10px" }}>Target Donasi (Rp)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
          <div style={wireframeStyles.input}>Tgl Mulai</div>
          <div style={wireframeStyles.input}>Tgl Selesai</div>
        </div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "6px" }}>⭕ Untuk Anak Saya</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "16px" }}>⭕ Kampanye Umum</div>
        <div style={wireframeStyles.btn}>
          Ajukan Kampanye
        </div>
      </div>
    </div>
  );
}

function CampaignListScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <span>Kampanye Donasi</span>
        <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.3)", borderRadius: "8px" }} />
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ ...wireframeStyles.input, marginBottom: "12px" }}>🔍 Cari kampanye...</div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", overflowX: "auto" }}>
          <div style={{ ...wireframeStyles.btn, padding: "8px 16px", whiteSpace: "nowrap", fontSize: "12px" }}>Semua</div>
          <div style={{ ...wireframeStyles.btnOutline, padding: "8px 16px", whiteSpace: "nowrap", fontSize: "12px" }}>Pendidikan</div>
          <div style={{ ...wireframeStyles.btnOutline, padding: "8px 16px", whiteSpace: "nowrap", fontSize: "12px" }}>Kesehatan</div>
        </div>
        <div style={{ ...wireframeStyles.card, marginBottom: "12px" }}>
          <div style={{ ...wireframeStyles.box, height: "110px", marginBottom: "10px" }}>Foto Kampanye</div>
          <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>Judul Kampanye Donasi</div>
          <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "6px", overflow: "hidden" }}>
            <div style={{ width: "75%", height: "100%", background: "#1677FF" }} />
          </div>
          <div style={{ fontSize: "11px", color: "#8C8C8C" }}>75% • Rp 7.5jt dari Rp 10jt</div>
        </div>
        <div style={wireframeStyles.card}>
          <div style={{ ...wireframeStyles.box, height: "110px", marginBottom: "10px" }}>Foto Kampanye</div>
          <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>Renovasi Lab Komputer</div>
          <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "6px", overflow: "hidden" }}>
            <div style={{ width: "50%", height: "100%", background: "#1677FF" }} />
          </div>
          <div style={{ fontSize: "11px", color: "#8C8C8C" }}>50% • Rp 12.5jt dari Rp 25jt</div>
        </div>
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem}>🏠<br />Home</div>
        <div style={wireframeStyles.navItem}>💰<br />SPP</div>
        <div style={wireframeStyles.navItem}>❤️<br />Donasi</div>
        <div style={wireframeStyles.navItem}>👤<br />Profil</div>
      </div>
    </div>
  );
}

function CampaignDetailScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={{ maxHeight: "580px", overflowY: "auto" }}>
        <div style={{ ...wireframeStyles.box, height: "160px", borderRadius: "0", marginBottom: "0" }}>
          Cover Image Kampanye
        </div>
        <div style={{ padding: "14px" }}>
          <div style={{ fontSize: "14px", fontWeight: "800", marginBottom: "10px" }}>Judul Kampanye Donasi</div>
          <div style={{ height: "10px", background: "#f0f0f0", borderRadius: "5px", marginBottom: "6px", overflow: "hidden" }}>
            <div style={{ width: "75%", height: "100%", background: "#1677FF" }} />
          </div>
          <div style={{ fontSize: "12px", color: "#8C8C8C", marginBottom: "16px" }}>
            Rp 11.2jt dari Rp 15jt • 12 hari lagi
          </div>

          <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>Deskripsi</div>
          <div style={{ ...wireframeStyles.box, height: "70px", textAlign: "left", padding: "10px", marginBottom: "16px" }}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit...
          </div>

          <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>Jumlah Donasi</div>
          <div style={{ ...wireframeStyles.input, marginBottom: "16px" }}>Rp 0</div>

          <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>Metode Pembayaran</div>
          <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>📱 QRIS</div>
          <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>🏦 Virtual Account</div>
          <div style={{ ...wireframeStyles.listItem, marginBottom: "16px" }}>💳 Bank Transfer</div>

          <div style={wireframeStyles.btn}>
            Donasi Sekarang
          </div>
        </div>
      </div>
    </div>
  );
}

function SchoolDashboardScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.3)", borderRadius: "10px" }} />
          <span>SDN 3 Malang</span>
        </div>
        <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.3)", borderRadius: "10px" }} />
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "12px" }}>
          <div style={{ ...wireframeStyles.box, padding: "10px", fontSize: "10px" }}>Total<br />Siswa</div>
          <div style={{ ...wireframeStyles.box, padding: "10px", fontSize: "10px" }}>Lunas<br />Bulan Ini</div>
          <div style={{ ...wireframeStyles.box, padding: "10px", fontSize: "10px" }}>Tunggakan</div>
        </div>
        <div style={{ ...wireframeStyles.card, marginBottom: "14px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px" }}>Pembayaran Bulan Ini</div>
          <div style={{ ...wireframeStyles.box, height: "120px" }}>
            📊 Bar Chart - Pembayaran
          </div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px" }}>Menu Cepat</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>📋 Kelola Tagihan SPP</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>❤️ Kelola Kampanye</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>🎓 Review Bantuan</div>
        <div style={wireframeStyles.listItem}>📊 Laporan Keuangan</div>
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem}>🏠<br />Home</div>
        <div style={wireframeStyles.navItem}>💰<br />Tagihan</div>
        <div style={wireframeStyles.navItem}>❤️<br />Kampanye</div>
        <div style={wireframeStyles.navItem}>👤<br />Profil</div>
      </div>
    </div>
  );
}

function ManageBillsScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <span>← Kembali</span>
        <span>Kelola Tagihan</span>
        <span style={{ fontSize: "18px" }}>➕</span>
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ ...wireframeStyles.input, marginBottom: "12px" }}>🔍 Cari siswa (NISN/Nama)...</div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          <div style={{ ...wireframeStyles.btn, flex: 1, padding: "8px", fontSize: "12px" }}>Semua</div>
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, padding: "8px", fontSize: "12px" }}>Lunas</div>
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, padding: "8px", fontSize: "12px" }}>Belum</div>
        </div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "10px" }}>
          <div style={{ fontWeight: "700", marginBottom: "4px" }}>Budi Santoso</div>
          <div style={{ fontSize: "11px", color: "#8C8C8C", marginBottom: "6px" }}>
            NISN: 0012345678 • Kelas X IPA 1
          </div>
          <div style={{ fontSize: "12px" }}>
            SPP Mei: <span style={{ color: "#EA4E0D", fontWeight: "700" }}>Belum Lunas</span>
          </div>
        </div>
        <div style={wireframeStyles.listItem}>
          <div style={{ fontWeight: "700", marginBottom: "4px" }}>Ani Wijaya</div>
          <div style={{ fontSize: "11px", color: "#8C8C8C", marginBottom: "6px" }}>
            NISN: 0012345679 • Kelas X IPA 1
          </div>
          <div style={{ fontSize: "12px" }}>
            SPP Mei: <span style={{ color: "#52C41A", fontWeight: "700" }}>✓ Lunas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageCampaignsScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <span>← Kembali</span>
        <span>Kelola Kampanye</span>
        <span style={{ fontSize: "18px" }}>➕</span>
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          <div style={{ ...wireframeStyles.btn, flex: 1, padding: "8px", fontSize: "12px" }}>Aktif</div>
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, padding: "8px", fontSize: "12px" }}>Pending</div>
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, padding: "8px", fontSize: "12px" }}>Selesai</div>
        </div>
        <div style={{ ...wireframeStyles.card, marginBottom: "12px" }}>
          <div style={{ ...wireframeStyles.box, height: "90px", marginBottom: "10px" }}>Foto Kampanye</div>
          <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>Judul Kampanye</div>
          <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "6px", overflow: "hidden" }}>
            <div style={{ width: "75%", height: "100%", background: "#1677FF" }} />
          </div>
          <div style={{ fontSize: "11px", color: "#8C8C8C", marginBottom: "10px" }}>75% • Rp 7.5jt dari Rp 10jt</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ ...wireframeStyles.btnOutline, padding: "8px", fontSize: "12px" }}>Edit</div>
            <div style={{ ...wireframeStyles.btn, padding: "8px", fontSize: "12px", background: "#EA4E0D" }}>Tutup</div>
          </div>
        </div>
        <div style={wireframeStyles.card}>
          <div style={{ ...wireframeStyles.box, height: "90px", marginBottom: "10px" }}>Foto Kampanye</div>
          <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>Kampanye Pending Review</div>
          <div style={{ fontSize: "11px", color: "#8C8C8C", marginBottom: "10px" }}>Target: Rp 15jt • 30 hari</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ ...wireframeStyles.btnOutline, padding: "8px", fontSize: "12px", color: "#EA4E0D", borderColor: "#EA4E0D" }}>Tolak</div>
            <div style={{ ...wireframeStyles.btn, padding: "8px", fontSize: "12px", background: "#52C41A" }}>Setujui</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonorProfileScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <span>Profil</span>
        <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.3)", borderRadius: "8px" }} />
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{
            width: "70px",
            height: "70px",
            background: "rgba(22,119,255,0.2)",
            border: "3px solid #1677FF",
            borderRadius: "50%",
            margin: "0 auto 10px"
          }} />
          <div style={{ fontWeight: "800", marginBottom: "4px" }}>Nama Donatur</div>
          <div style={{ fontSize: "12px", color: "#8C8C8C" }}>donatur@email.com</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          <div style={{ ...wireframeStyles.box, padding: "12px" }}>
            Total<br />Donasi<br /><strong style={{ fontSize: "14px", color: "#1677FF" }}>Rp 2.5jt</strong>
          </div>
          <div style={{ ...wireframeStyles.box, padding: "12px" }}>
            Kampanye<br />Didonasi<br /><strong style={{ fontSize: "14px", color: "#1677FF" }}>8</strong>
          </div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px" }}>Menu</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>👤 Data Pribadi</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>📊 Statistik Donasi</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>🔔 Notifikasi</div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "8px" }}>🆘 Bantuan IT</div>
        <div style={{ ...wireframeStyles.listItem, color: "#EA4E0D", borderColor: "#EA4E0D" }}>
          🚪 Keluar
        </div>
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem}>🏠<br />Home</div>
        <div style={wireframeStyles.navItem}>❤️<br />Donasi</div>
        <div style={wireframeStyles.navItem}>📜<br />Riwayat</div>
        <div style={wireframeStyles.navItem}>👤<br />Profil</div>
      </div>
    </div>
  );
}

function AidReviewScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <span>← Kembali</span>
        <span>Review Bantuan</span>
        <span></span>
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          <div style={{ ...wireframeStyles.btn, flex: 1, padding: "8px", fontSize: "12px" }}>Pending</div>
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, padding: "8px", fontSize: "12px" }}>Disetujui</div>
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, padding: "8px", fontSize: "12px" }}>Ditolak</div>
        </div>
        <div style={{ ...wireframeStyles.card, marginBottom: "12px" }}>
          <div style={{ fontWeight: "700", marginBottom: "4px", fontSize: "12px" }}>Budi Santoso</div>
          <div style={{ fontSize: "11px", color: "#8C8C8C", marginBottom: "8px" }}>
            NISN: 0012345678 • Kelas X IPA 1
          </div>
          <div style={{ fontSize: "12px", marginBottom: "10px" }}>
            Jumlah: <strong>Rp 850.000</strong>
          </div>
          <div style={{ ...wireframeStyles.box, height: "50px", textAlign: "left", padding: "8px", marginBottom: "10px", fontSize: "11px" }}>
            Alasan: Kondisi ekonomi keluarga yang sulit...
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ ...wireframeStyles.btnOutline, padding: "8px", fontSize: "12px", color: "#EA4E0D", borderColor: "#EA4E0D" }}>Tolak</div>
            <div style={{ ...wireframeStyles.btn, padding: "8px", fontSize: "12px", background: "#52C41A" }}>Setujui</div>
          </div>
        </div>
        <div style={wireframeStyles.card}>
          <div style={{ fontWeight: "700", marginBottom: "4px", fontSize: "12px" }}>Ani Wijaya</div>
          <div style={{ fontSize: "11px", color: "#8C8C8C", marginBottom: "8px" }}>
            NISN: 0012345679 • Kelas X IPA 1
          </div>
          <div style={{ fontSize: "12px", marginBottom: "10px" }}>
            Jumlah: <strong>Rp 425.000</strong>
          </div>
          <div style={{ ...wireframeStyles.box, height: "50px", textAlign: "left", padding: "8px", marginBottom: "10px", fontSize: "11px" }}>
            Alasan: Orang tua terkena PHK...
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ ...wireframeStyles.btnOutline, padding: "8px", fontSize: "12px", color: "#EA4E0D", borderColor: "#EA4E0D" }}>Tolak</div>
            <div style={{ ...wireframeStyles.btn, padding: "8px", fontSize: "12px", background: "#52C41A" }}>Setujui</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <span>Riwayat Transaksi</span>
        <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.3)", borderRadius: "8px" }} />
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          <div style={{ ...wireframeStyles.btn, flex: 1, padding: "8px", fontSize: "12px" }}>Semua</div>
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, padding: "8px", fontSize: "12px" }}>SPP</div>
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, padding: "8px", fontSize: "12px" }}>Donasi</div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "#8C8C8C", marginBottom: "10px" }}>
          Mei 2025
        </div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontWeight: "700" }}>Pembayaran SPP</span>
            <span style={{ color: "#52C41A", fontWeight: "700" }}>✓</span>
          </div>
          <div style={{ fontSize: "11px", color: "#8C8C8C" }}>15 Mei 2025 • Rp 850.000</div>
        </div>
        <div style={{ ...wireframeStyles.listItem, marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontWeight: "700" }}>Donasi: Beasiswa Siswa</span>
            <span style={{ color: "#52C41A", fontWeight: "700" }}>✓</span>
          </div>
          <div style={{ fontSize: "11px", color: "#8C8C8C" }}>12 Mei 2025 • Rp 100.000</div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "#8C8C8C", margin: "20px 0 10px" }}>
          April 2025
        </div>
        <div style={wireframeStyles.listItem}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontWeight: "700" }}>Pembayaran SPP</span>
            <span style={{ color: "#52C41A", fontWeight: "700" }}>✓</span>
          </div>
          <div style={{ fontSize: "11px", color: "#8C8C8C" }}>10 Apr 2025 • Rp 850.000</div>
        </div>
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem}>🏠<br />Home</div>
        <div style={wireframeStyles.navItem}>💰<br />SPP</div>
        <div style={wireframeStyles.navItem}>❤️<br />Donasi</div>
        <div style={wireframeStyles.navItem}>👤<br />Profil</div>
      </div>
    </div>
  );
}
