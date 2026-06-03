import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Database, Table, GitBranch, FileText,
  ChevronDown, ChevronRight, Download, Copy, Check,
  Search, Layers, Link2, Shield, Key, ArrowRight
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// ANALISIS LENGKAP SISTEM EDUFIN — ERD, NORMALISASI, RELASI
// ═══════════════════════════════════════════════════════════════════════════════

type Tab = "analysis" | "erd" | "normalization" | "relations";

// ─── Warna ────────────────────────────────────────────────────────────────────
const BLUE = "#1677FF";
const DARK = "#1A1A2E";
const GRAY = "#8C8C8C";
const BG = "#F3F6FB";

// ─── Data Analisis User Input ────────────────────────────────────────────────
const USER_INPUTS = [
  {
    page: "Onboarding (/)",
    inputs: [],
    clicks: [
      { btn: "Lewati", action: "navigate('/login')" },
      { btn: "Buat Akun Gratis", action: "navigate('/register')" },
      { btn: "Sudah punya akun? Masuk", action: "navigate('/login')" },
      { btn: "Dot indicator (1/2/3)", action: "Pindah slide carousel" },
      { btn: "Swipe kiri/kanan", action: "Pindah slide carousel" },
    ],
    validations: [],
  },
  {
    page: "Register (/register)",
    inputs: [
      { field: "NISN", type: "tel/numeric", maxLength: 10, desc: "Nomor Induk Siswa Nasional 10 digit" },
      { field: "Email", type: "email", desc: "Alamat email untuk login" },
      { field: "Password", type: "password", desc: "Min 8 karakter, huruf kapital, angka" },
      { field: "Konfirmasi Password", type: "password", desc: "Harus cocok dengan password" },
    ],
    clicks: [
      { btn: "Siswa / Orang Tua", action: "Set role='siswa', step='nisn'" },
      { btn: "Tamu / Donatur", action: "Set role='donatur', step='donor-auth'" },
      { btn: "Cari & Verifikasi (NISN)", action: "handleNisnLookup() → cek NISN_DB" },
      { btn: "Ya, Data Ini Benar", action: "step='password' (konfirmasi data siswa)" },
      { btn: "Bukan, Cari Ulang", action: "step='nisn' (kembali input NISN)" },
      { btn: "Daftar Sekarang (Siswa)", action: "handlePasswordSubmit() → register()" },
      { btn: "Daftar sebagai Donatur", action: "handleDonorSubmit() → register()" },
      { btn: "Masuk ke Akun (Success)", action: "navigate('/login')" },
      { btn: "← Back", action: "goBack() navigasi step mundur" },
      { btn: "Sudah punya akun? Masuk", action: "navigate('/login')" },
    ],
    validations: [
      { rule: "NISN harus 10 digit", field: "NISN", type: "length" },
      { rule: "NISN dicek ke database (mock NISN_DB)", field: "NISN", type: "lookup" },
      { rule: "NISN hanya angka (replace /\\D/g)", field: "NISN", type: "format" },
      { rule: "Email format valid (regex)", field: "Email", type: "format" },
      { rule: "Password min 8 karakter", field: "Password", type: "length" },
      { rule: "Password harus ada huruf kapital", field: "Password", type: "strength" },
      { rule: "Password harus ada angka", field: "Password", type: "strength" },
      { rule: "Konfirmasi password harus cocok", field: "Confirm", type: "match" },
      { rule: "Email belum terdaftar (server check)", field: "Email", type: "unique" },
      { rule: "Donatur: password min 6 karakter", field: "Password", type: "length" },
    ],
  },
  {
    page: "Login (/login)",
    inputs: [
      { field: "Email", type: "email", desc: "Email terdaftar" },
      { field: "Kata Sandi", type: "password", desc: "Password akun" },
    ],
    clicks: [
      { btn: "← Back", action: "navigate('/')" },
      { btn: "Demo Siswa/Ortu", action: "fillDemo(siswa@edufin.id, demo123)" },
      { btn: "Demo Sekolah", action: "fillDemo(sekolah@edufin.id, demo123)" },
      { btn: "Demo Donatur", action: "fillDemo(donatur@edufin.id, demo123)" },
      { btn: "Masuk ke EDUFIN", action: "handleLogin() → redirect by role" },
      { btn: "Lupa Kata Sandi?", action: "(belum diimplementasi)" },
      { btn: "Masuk dengan Google", action: "navigate('/register')" },
      { btn: "Daftar Sekarang", action: "navigate('/register')" },
      { btn: "Butuh Bantuan? (FAB)", action: "setShowHelpdesk(true)" },
      { btn: "WhatsApp (Helpdesk)", action: "Buka wa.me link" },
      { btn: "Email Support (Helpdesk)", action: "Buka mailto link" },
      { btn: "Telepon (Helpdesk)", action: "Buka tel link" },
      { btn: "FAQ Accordion toggle", action: "setOpen(!open)" },
      { btn: "Enter di password field", action: "handleLogin()" },
    ],
    validations: [
      { rule: "Email tidak boleh kosong", field: "Email", type: "required" },
      { rule: "Password tidak boleh kosong", field: "Password", type: "required" },
      { rule: "Cek demo account dulu → lalu server", field: "Email+Password", type: "auth" },
      { rule: "Role-based redirect (siswa/sekolah/donatur)", field: "Role", type: "routing" },
    ],
  },
  {
    page: "Dashboard Siswa (/student)",
    inputs: [],
    clicks: [
      { btn: "Bell (Notifikasi)", action: "setShowNotif(!showNotif)" },
      { btn: "Bayar Penuh", action: "navigate('/student/spp')" },
      { btn: "Cicilan", action: "navigate('/student/spp?mode=cicilan')" },
      { btn: "Shortcut: Bayar SPP", action: "navigate('/student/spp')" },
      { btn: "Shortcut: Pinjaman", action: "navigate('/student/loan')" },
      { btn: "Shortcut: Donasi", action: "navigate('/student/fundraising')" },
      { btn: "Shortcut: Riwayat", action: "navigate('/student/history')" },
      { btn: "Lihat Semua Kampanye", action: "navigate('/student/fundraising')" },
      { btn: "Campaign Card", action: "navigate('/donor/campaign/:id')" },
      { btn: "Ajukan Kampanye Donasi", action: "setShowCampaignForm(true)" },
      { btn: "Ajukan Bantuan SPP", action: "navigate('/student/loan')" },
      { btn: "Profil & Pengaturan", action: "navigate('/student/profile')" },
    ],
    validations: [],
  },
  {
    page: "Bayar SPP (/student/spp)",
    inputs: [],
    clicks: [
      { btn: "← Back", action: "navigate('/student') atau step mundur" },
      { btn: "Toggle pilih tagihan (checkbox)", action: "toggleSelect(bill.id)" },
      { btn: "Pilih Cara Bayar →", action: "setStep('checkout')" },
      { btn: "Radio: Bayar Penuh / Cicilan 2x / 3x", action: "setCicilanOption(key)" },
      { btn: "Radio: Metode Pembayaran (BCA/BNI/QRIS/Indomaret)", action: "setPayMethod(id)" },
      { btn: "Lanjutkan (ke konfirmasi)", action: "setStep('confirm')" },
      { btn: "Konfirmasi & Bayar", action: "setStep('success')" },
      { btn: "Unduh E-Receipt (PDF)", action: "(UI only)" },
      { btn: "Kembali ke Beranda", action: "navigate('/student')" },
    ],
    validations: [
      { rule: "Hanya tagihan 'Tertunggak' bisa dipilih", field: "Bill selection", type: "status" },
      { rule: "Metode pembayaran wajib dipilih sebelum lanjut", field: "payMethod", type: "required" },
      { rule: "Minimal 1 tagihan dipilih", field: "selected[]", type: "required" },
      { rule: "Kalkulasi cicilan: subtotal/2 atau /3", field: "firstPayment", type: "calculation" },
    ],
  },
  {
    page: "Pinjaman Mikro (/student/loan)",
    inputs: [
      { field: "Jumlah Pinjaman", type: "number", desc: "Max Rp 3.000.000" },
      { field: "Tujuan Penggunaan", type: "select/button grid", desc: "6 opsi tujuan" },
      { field: "Periode Cicilan", type: "select/button", desc: "3/6/9/12 bulan" },
      { field: "Dokumen Pendukung", type: "file upload", desc: "Kartu pelajar/tagihan" },
    ],
    clicks: [
      { btn: "← Back", action: "navigate('/student')" },
      { btn: "Tab: Pinjaman Aktif", action: "setTab('active')" },
      { btn: "Tab: Ajukan Pinjaman", action: "setTab('apply')" },
      { btn: "Quick amount (500rb/1jt/1.5jt/2jt)", action: "setAmount(value)" },
      { btn: "Tujuan grid button", action: "setPurpose(selected)" },
      { btn: "Periode button (3/6/9/12)", action: "setPeriod(selected)" },
      { btn: "Pilih File (upload)", action: "File picker" },
      { btn: "Ajukan Pinjaman", action: "handleSubmit()" },
      { btn: "Kembali ke Beranda (success)", action: "navigate('/student')" },
    ],
    validations: [
      { rule: "Jumlah pinjaman wajib diisi", field: "amount", type: "required" },
      { rule: "Tujuan penggunaan wajib dipilih", field: "purpose", type: "required" },
      { rule: "Max Rp 3.000.000", field: "amount", type: "max" },
    ],
  },
  {
    page: "Galang Dana Siswa (/student/fundraising)",
    inputs: [
      { field: "Search", type: "text", desc: "Cari kampanye atau sekolah" },
    ],
    clicks: [
      { btn: "← Back", action: "navigate('/student')" },
      { btn: "Kategori filter (Semua/Beasiswa/dll)", action: "setActiveCategory(cat)" },
      { btn: "Campaign card", action: "navigate('/donor/campaign/:id')" },
      { btn: "Donasi Sekarang", action: "navigate('/donor/campaign/:id')" },
    ],
    validations: [],
  },
  {
    page: "Riwayat Transaksi (/student/history)",
    inputs: [],
    clicks: [
      { btn: "← Back", action: "navigate('/student')" },
      { btn: "Kategori filter (Semua/SPP/Cicilan/Donasi)", action: "setActiveCat(cat)" },
    ],
    validations: [],
  },
  {
    page: "Profil Siswa (/student/profile)",
    inputs: [],
    clicks: [
      { btn: "Data Pribadi", action: "setShowPersonalData(true) → modal form" },
      { btn: "Info Sekolah", action: "setShowSchoolInfo(true) → modal form" },
      { btn: "Riwayat Akademik", action: "setShowAcademicHistory(true) → modal form" },
      { btn: "Notifikasi", action: "setShowNotification(true) → modal form" },
      { btn: "Hubungi Tim IT", action: "setShowITSupport(true) → modal form" },
      { btn: "Keluar", action: "logout() → navigate('/login')" },
    ],
    validations: [],
  },
  {
    page: "Dashboard Sekolah (/school)",
    inputs: [],
    clicks: [
      { btn: "Bell (Notifikasi)", action: "Toggle notifikasi dropdown" },
      { btn: "Lihat Semua Siswa", action: "navigate('/school/bills')" },
      { btn: "Setujui/Tolak Kampanye", action: "Review kampanye pending" },
      { btn: "Shortcut: Tagihan", action: "navigate('/school/bills')" },
      { btn: "Shortcut: Laporan", action: "navigate('/school/report')" },
      { btn: "Shortcut: Riwayat", action: "navigate('/school/history')" },
      { btn: "Shortcut: Profil", action: "navigate('/school/profile')" },
    ],
    validations: [],
  },
  {
    page: "Manajemen Tagihan (/school/bills)",
    inputs: [
      { field: "Search", type: "text", desc: "Cari nama/NISN siswa" },
    ],
    clicks: [
      { btn: "Filter tab (Semua/Lunas/Tertunggak/Cicilan)", action: "setFilter(type)" },
      { btn: "Student row", action: "Lihat detail tagihan siswa" },
    ],
    validations: [],
  },
  {
    page: "Profil Sekolah (/school/profile)",
    inputs: [],
    clicks: [
      { btn: "Data Sekolah", action: "Modal form data sekolah" },
      { btn: "Tahun Ajaran", action: "Modal form tahun ajaran" },
      { btn: "Rekening Bank", action: "Modal form rekening" },
      { btn: "Notifikasi", action: "Modal pengaturan notifikasi" },
      { btn: "Keluar", action: "logout()" },
    ],
    validations: [],
  },
  {
    page: "Dashboard Donatur (/donor)",
    inputs: [
      { field: "Search", type: "text", desc: "Cari kampanye pendidikan" },
    ],
    clicks: [
      { btn: "Bell (Notifikasi)", action: "Toggle notifikasi" },
      { btn: "Kategori filter", action: "Filter kampanye" },
      { btn: "Campaign card", action: "navigate('/donor/campaign/:id')" },
      { btn: "Donasi Sekarang", action: "navigate('/donor/campaign/:id')" },
      { btn: "Lihat Semua Kampanye", action: "navigate('/donor/campaigns')" },
    ],
    validations: [],
  },
  {
    page: "Detail Kampanye (/donor/campaign/:id)",
    inputs: [
      { field: "Nominal Donasi", type: "number", desc: "Input bebas atau pilih preset" },
    ],
    clicks: [
      { btn: "← Back", action: "navigate(-1)" },
      { btn: "❤️ Like kampanye", action: "setLiked(!liked)" },
      { btn: "Share", action: "(UI only)" },
      { btn: "Donasi Sekarang", action: "setStep('donate')" },
      { btn: "Preset nominal (10rb-500rb)", action: "setDonationAmount(value)" },
      { btn: "Metode: QRIS/VA/Bank Transfer", action: "setPaymentMethod(id)" },
      { btn: "Konfirmasi Donasi", action: "setStep('success')" },
      { btn: "Kembali ke Beranda", action: "navigate('/donor')" },
      { btn: "Donasi Lagi", action: "Reset form, step='detail'" },
    ],
    validations: [
      { rule: "Nominal minimal Rp 10.000", field: "donationAmount", type: "min" },
      { rule: "Metode pembayaran wajib dipilih", field: "paymentMethod", type: "required" },
      { rule: "Nominal harus angka valid", field: "donationAmount", type: "format" },
    ],
  },
  {
    page: "Profil Donatur (/donor/profile)",
    inputs: [],
    clicks: [
      { btn: "Data Pribadi", action: "Modal form data donatur" },
      { btn: "Statistik Donasi", action: "Modal statistik" },
      { btn: "Notifikasi", action: "Modal pengaturan notifikasi" },
      { btn: "Hubungi Tim IT", action: "Modal IT support form" },
      { btn: "Keluar", action: "logout()" },
    ],
    validations: [],
  },
  {
    page: "Form Kampanye (Shared Modal)",
    inputs: [
      { field: "Judul Kampanye", type: "text", desc: "Nama kampanye donasi" },
      { field: "Deskripsi", type: "textarea", desc: "Cerita kampanye" },
      { field: "Alasan", type: "textarea", desc: "Mengapa butuh bantuan" },
      { field: "Target Dana", type: "number", desc: "Target penggalangan" },
      { field: "Tanggal Mulai", type: "date", desc: "Awal kampanye" },
      { field: "Tanggal Berakhir", type: "date", desc: "Akhir kampanye" },
      { field: "Cover Image", type: "file", desc: "Gambar sampul" },
    ],
    clicks: [
      { btn: "✕ Close", action: "onClose()" },
      { btn: "Submit Kampanye", action: "handleSubmit() → simulasi" },
    ],
    validations: [
      { rule: "Semua field wajib diisi", field: "all", type: "required" },
    ],
  },
  {
    page: "Form IT Support (Shared Modal)",
    inputs: [
      { field: "Kategori Masalah", type: "select", desc: "Dropdown kategori" },
      { field: "Deskripsi Masalah", type: "textarea", desc: "Detail masalah" },
      { field: "File Lampiran", type: "file", desc: "Screenshot/dokumen" },
    ],
    clicks: [
      { btn: "✕ Close", action: "onClose()" },
      { btn: "Kirim Laporan", action: "handleSubmit()" },
    ],
    validations: [
      { rule: "Kategori masalah wajib dipilih", field: "subject", type: "required" },
    ],
  },
];

// ─── Data Tabel Database (8 tabel) ───────────────────────────────────────────
const DB_TABLES = [
  {
    name: "users",
    color: "#1677FF",
    desc: "Semua pengguna sistem (siswa/ortu, admin sekolah, donatur)",
    columns: [
      { name: "user_id", type: "UUID", pk: true, desc: "Primary Key" },
      { name: "email", type: "VARCHAR(100)", unique: true, desc: "Email login, unik" },
      { name: "password_hash", type: "VARCHAR(255)", desc: "Hash password (bcrypt)" },
      { name: "name", type: "VARCHAR(100)", desc: "Nama lengkap" },
      { name: "role", type: "ENUM('siswa','sekolah','donatur')", desc: "Peran pengguna" },
      { name: "phone", type: "VARCHAR(20)", desc: "Nomor telepon" },
      { name: "avatar_url", type: "TEXT", desc: "URL foto profil" },
      { name: "is_verified", type: "BOOLEAN", desc: "Status verifikasi email" },
      { name: "created_at", type: "TIMESTAMP", desc: "Waktu registrasi" },
      { name: "updated_at", type: "TIMESTAMP", desc: "Waktu update terakhir" },
    ],
  },
  {
    name: "students",
    color: "#52C41A",
    desc: "Data siswa terhubung via NISN, terkait user & sekolah",
    columns: [
      { name: "student_id", type: "UUID", pk: true, desc: "Primary Key" },
      { name: "user_id", type: "UUID", fk: "users.user_id", desc: "FK → users" },
      { name: "nisn", type: "CHAR(10)", unique: true, desc: "NISN 10 digit, unik" },
      { name: "school_name", type: "VARCHAR(150)", desc: "Nama sekolah" },
      { name: "class", type: "VARCHAR(20)", desc: "Kelas (X IPA 1, dll)" },
      { name: "parent_name", type: "VARCHAR(100)", desc: "Nama orang tua/wali" },
      { name: "address", type: "TEXT", desc: "Alamat lengkap" },
      { name: "academic_year", type: "VARCHAR(9)", desc: "Tahun ajaran (2024/2025)" },
      { name: "enrollment_status", type: "ENUM('aktif','lulus','pindah')", desc: "Status" },
      { name: "created_at", type: "TIMESTAMP", desc: "Waktu data dibuat" },
    ],
  },
  {
    name: "bills",
    color: "#EA4E0D",
    desc: "Tagihan bulanan SPP per siswa",
    columns: [
      { name: "bill_id", type: "UUID", pk: true, desc: "Primary Key" },
      { name: "student_id", type: "UUID", fk: "students.student_id", desc: "FK → students" },
      { name: "month", type: "VARCHAR(20)", desc: "Bulan tagihan (Mei 2025)" },
      { name: "total_amount", type: "DECIMAL(12,2)", desc: "Total tagihan" },
      { name: "status", type: "ENUM('lunas','tertunggak','cicilan')", desc: "Status bayar" },
      { name: "due_date", type: "DATE", desc: "Tanggal jatuh tempo" },
      { name: "created_at", type: "TIMESTAMP", desc: "Waktu tagihan dibuat" },
      { name: "paid_at", type: "TIMESTAMP", desc: "Waktu pelunasan (nullable)" },
    ],
  },
  {
    name: "bill_items",
    color: "#FDD504",
    desc: "Komponen rincian tagihan (SPP, Kegiatan, Lab, Perpustakaan)",
    columns: [
      { name: "item_id", type: "UUID", pk: true, desc: "Primary Key" },
      { name: "bill_id", type: "UUID", fk: "bills.bill_id", desc: "FK → bills" },
      { name: "item_name", type: "VARCHAR(50)", desc: "Nama komponen (SPP, Lab, dll)" },
      { name: "amount", type: "DECIMAL(12,2)", desc: "Nominal komponen" },
    ],
  },
  {
    name: "payments",
    color: "#722ED1",
    desc: "Semua transaksi pembayaran (SPP, cicilan, donasi)",
    columns: [
      { name: "payment_id", type: "UUID", pk: true, desc: "Primary Key" },
      { name: "user_id", type: "UUID", fk: "users.user_id", desc: "FK → users (pembayar)" },
      { name: "bill_id", type: "UUID", fk: "bills.bill_id", desc: "FK → bills (nullable, utk SPP)" },
      { name: "donation_id", type: "UUID", fk: "donations.donation_id", desc: "FK → donations (nullable)" },
      { name: "payment_type", type: "ENUM('spp_penuh','cicilan','donasi')", desc: "Jenis bayar" },
      { name: "amount", type: "DECIMAL(12,2)", desc: "Nominal dibayar" },
      { name: "method", type: "ENUM('bca','bni','qris','indomaret')", desc: "Metode bayar" },
      { name: "installment_plan", type: "ENUM('1x','2x','3x')", desc: "Skema cicilan" },
      { name: "installment_number", type: "INT", desc: "Cicilan ke-berapa (1,2,3)" },
      { name: "receipt_number", type: "VARCHAR(20)", desc: "No kwitansi (EDU202505xxx)" },
      { name: "status", type: "ENUM('berhasil','pending','gagal')", desc: "Status transaksi" },
      { name: "paid_at", type: "TIMESTAMP", desc: "Waktu pembayaran" },
    ],
  },
  {
    name: "campaigns",
    color: "#EB2F96",
    desc: "Kampanye donasi pendidikan",
    columns: [
      { name: "campaign_id", type: "UUID", pk: true, desc: "Primary Key" },
      { name: "created_by", type: "UUID", fk: "users.user_id", desc: "FK → users (pengaju)" },
      { name: "title", type: "VARCHAR(200)", desc: "Judul kampanye" },
      { name: "description", type: "TEXT", desc: "Cerita/deskripsi kampanye" },
      { name: "reason", type: "TEXT", desc: "Alasan pengajuan" },
      { name: "category", type: "ENUM('beasiswa','fasilitas','perlengkapan','ujian')", desc: "Kategori" },
      { name: "target_amount", type: "DECIMAL(12,2)", desc: "Target dana" },
      { name: "collected_amount", type: "DECIMAL(12,2)", desc: "Dana terkumpul" },
      { name: "cover_image_url", type: "TEXT", desc: "URL gambar sampul" },
      { name: "school_name", type: "VARCHAR(150)", desc: "Sekolah terkait" },
      { name: "location", type: "VARCHAR(100)", desc: "Lokasi" },
      { name: "is_verified", type: "BOOLEAN", desc: "Sudah diverifikasi sekolah?" },
      { name: "status", type: "ENUM('pending','aktif','selesai','ditolak')", desc: "Status" },
      { name: "start_date", type: "DATE", desc: "Tanggal mulai" },
      { name: "end_date", type: "DATE", desc: "Tanggal berakhir" },
      { name: "created_at", type: "TIMESTAMP", desc: "Waktu dibuat" },
    ],
  },
  {
    name: "donations",
    color: "#FA541C",
    desc: "Donasi individual ke kampanye",
    columns: [
      { name: "donation_id", type: "UUID", pk: true, desc: "Primary Key" },
      { name: "campaign_id", type: "UUID", fk: "campaigns.campaign_id", desc: "FK → campaigns" },
      { name: "donor_id", type: "UUID", fk: "users.user_id", desc: "FK → users (donatur)" },
      { name: "amount", type: "DECIMAL(12,2)", desc: "Nominal donasi" },
      { name: "payment_method", type: "ENUM('qris','va','bank_transfer')", desc: "Metode bayar" },
      { name: "message", type: "TEXT", desc: "Pesan donatur (opsional)" },
      { name: "is_anonymous", type: "BOOLEAN", desc: "Donasi anonim?" },
      { name: "status", type: "ENUM('berhasil','pending','gagal')", desc: "Status" },
      { name: "donated_at", type: "TIMESTAMP", desc: "Waktu donasi" },
    ],
  },
  {
    name: "aid_requests",
    color: "#13C2C2",
    desc: "Pengajuan bantuan/pinjaman mikro pendidikan",
    columns: [
      { name: "request_id", type: "UUID", pk: true, desc: "Primary Key" },
      { name: "student_id", type: "UUID", fk: "students.student_id", desc: "FK → students" },
      { name: "request_type", type: "ENUM('pinjaman','bantuan_spp')", desc: "Jenis pengajuan" },
      { name: "amount", type: "DECIMAL(12,2)", desc: "Jumlah diajukan" },
      { name: "purpose", type: "VARCHAR(100)", desc: "Tujuan penggunaan" },
      { name: "installment_period", type: "INT", desc: "Periode cicilan (bulan)" },
      { name: "document_url", type: "TEXT", desc: "URL dokumen pendukung" },
      { name: "status", type: "ENUM('pending','disetujui','ditolak','lunas')", desc: "Status" },
      { name: "reviewed_by", type: "UUID", fk: "users.user_id", desc: "FK → users (admin reviewer)" },
      { name: "reviewed_at", type: "TIMESTAMP", desc: "Waktu review" },
      { name: "created_at", type: "TIMESTAMP", desc: "Waktu pengajuan" },
    ],
  },
];

// ─── Normalisasi Data ────────────────────────────────────────────────────────
const NORMALIZATION = {
  unf: {
    title: "UNF (Unnormalized Form)",
    desc: "Data mentah seperti yang ada di form/UI — belum dinormalisasi, banyak redundansi dan repeating groups",
    tables: [
      {
        name: "data_edufin_mentah",
        note: "Semua data dalam 1 tabel besar",
        columns: [
          "user_id", "email", "password", "name", "role", "phone", "avatar_url", "is_verified",
          "nisn", "school_name", "class", "parent_name", "address", "academic_year",
          "bill_month_1", "bill_amount_1", "bill_item_names_1", "bill_item_amounts_1", "bill_status_1",
          "bill_month_2", "bill_amount_2", "bill_item_names_2", "bill_item_amounts_2", "bill_status_2",
          "payment_type", "payment_amount", "payment_method", "payment_date", "receipt_no",
          "campaign_title", "campaign_target", "campaign_collected", "campaign_category",
          "donation_amount", "donation_method", "donation_date",
          "loan_amount", "loan_purpose", "loan_period", "loan_status",
        ],
        issues: [
          "Repeating groups: bill_month_1, bill_month_2, ... (tagihan berulang)",
          "bill_item_names_1 = 'SPP, Kegiatan, Lab' → multi-valued attribute",
          "Redundansi: school_name diulang di setiap baris siswa",
          "Redundansi: campaign data diulang per donasi",
          "Mixing entitas berbeda (user + student + bill + payment + campaign + donation + loan)",
        ],
      },
    ],
  },
  nf1: {
    title: "1NF (First Normal Form)",
    desc: "Menghilangkan repeating groups dan multi-valued attributes. Setiap kolom berisi atomic value.",
    rules: [
      "Setiap sel berisi nilai tunggal (atomic)",
      "Tidak ada repeating groups (bill_month_1, bill_month_2, ...)",
      "Setiap baris unik dengan primary key",
    ],
    tables: [
      {
        name: "users_1nf",
        pk: "user_id",
        columns: ["user_id", "email", "password_hash", "name", "role", "phone", "avatar_url", "is_verified", "created_at"],
      },
      {
        name: "student_data_1nf",
        pk: "student_id",
        columns: ["student_id", "user_id", "nisn", "school_name", "class", "parent_name", "address", "academic_year", "enrollment_status"],
      },
      {
        name: "bills_1nf",
        pk: "bill_id",
        columns: ["bill_id", "student_id", "month", "total_amount", "status", "due_date", "item_name", "item_amount"],
        issue: "⚠ item_name + item_amount masih menyebabkan partial dependency terhadap bill_id",
      },
      {
        name: "payments_1nf",
        pk: "payment_id",
        columns: ["payment_id", "user_id", "bill_id", "donation_id", "payment_type", "amount", "method", "installment_plan", "installment_number", "receipt_number", "status", "paid_at"],
      },
      {
        name: "campaigns_1nf",
        pk: "campaign_id",
        columns: ["campaign_id", "created_by", "title", "description", "reason", "category", "target_amount", "collected_amount", "cover_image_url", "school_name", "location", "is_verified", "status", "start_date", "end_date"],
      },
      {
        name: "donations_1nf",
        pk: "donation_id",
        columns: ["donation_id", "campaign_id", "donor_id", "amount", "payment_method", "message", "is_anonymous", "status", "donated_at"],
      },
      {
        name: "aid_requests_1nf",
        pk: "request_id",
        columns: ["request_id", "student_id", "request_type", "amount", "purpose", "installment_period", "document_url", "status", "reviewed_by", "reviewed_at"],
      },
    ],
    changes: [
      "Repeating groups (bill_month_1, 2, 3...) dipecah jadi baris terpisah di bills_1nf",
      "Multi-valued 'bill_item_names' dipecah jadi baris per item (tapi belum full 2NF)",
      "Data user, student, bill, payment, campaign, donation, loan dipisah ke tabel sendiri",
    ],
  },
  nf2: {
    title: "2NF (Second Normal Form)",
    desc: "Menghilangkan partial dependency — setiap non-key column bergantung penuh pada seluruh primary key",
    rules: [
      "Sudah memenuhi 1NF",
      "Tidak ada partial dependency (non-key bergantung pada subset dari composite key)",
      "Pisahkan atribut yang bergantung hanya pada sebagian key",
    ],
    tables: [
      { name: "users", pk: "user_id", columns: ["user_id", "email", "password_hash", "name", "role", "phone", "avatar_url", "is_verified", "created_at", "updated_at"] },
      { name: "students", pk: "student_id", columns: ["student_id", "user_id(FK)", "nisn", "school_name", "class", "parent_name", "address", "academic_year", "enrollment_status", "created_at"] },
      { name: "bills", pk: "bill_id", columns: ["bill_id", "student_id(FK)", "month", "total_amount", "status", "due_date", "created_at", "paid_at"] },
      {
        name: "bill_items ← BARU (dipecah dari bills_1nf)",
        pk: "item_id",
        columns: ["item_id", "bill_id(FK)", "item_name", "amount"],
        highlight: true,
      },
      { name: "payments", pk: "payment_id", columns: ["payment_id", "user_id(FK)", "bill_id(FK)", "donation_id(FK)", "payment_type", "amount", "method", "installment_plan", "installment_number", "receipt_number", "status", "paid_at"] },
      { name: "campaigns", pk: "campaign_id", columns: ["campaign_id", "created_by(FK)", "title", "description", "reason", "category", "target_amount", "collected_amount", "cover_image_url", "school_name", "location", "is_verified", "status", "start_date", "end_date", "created_at"] },
      { name: "donations", pk: "donation_id", columns: ["donation_id", "campaign_id(FK)", "donor_id(FK)", "amount", "payment_method", "message", "is_anonymous", "status", "donated_at"] },
      { name: "aid_requests", pk: "request_id", columns: ["request_id", "student_id(FK)", "request_type", "amount", "purpose", "installment_period", "document_url", "status", "reviewed_by(FK)", "reviewed_at", "created_at"] },
    ],
    changes: [
      "bill_items dipisah dari bills — item_name & amount hanya bergantung pada item_id, bukan bill_id",
      "Ini menghapus partial dependency: (bill_id, item_name) → amount menjadi item_id → (bill_id, item_name, amount)",
    ],
  },
  nf3: {
    title: "3NF (Third Normal Form)",
    desc: "Menghilangkan transitive dependency — tidak ada non-key column yang bergantung pada non-key column lain",
    rules: [
      "Sudah memenuhi 2NF",
      "Tidak ada transitive dependency (A → B → C, maka C tidak boleh di tabel A)",
      "Setiap non-key column bergantung langsung hanya pada primary key",
    ],
    tables: [
      { name: "users", pk: "user_id", columns: ["user_id", "email", "password_hash", "name", "role", "phone", "avatar_url", "is_verified", "created_at", "updated_at"], note: "✅ Sudah 3NF — semua kolom bergantung langsung pada user_id" },
      { name: "students", pk: "student_id", columns: ["student_id", "user_id(FK)", "nisn", "school_name", "class", "parent_name", "address", "academic_year", "enrollment_status", "created_at"], note: "✅ 3NF — school_name tidak dipecah karena single-tenant (1 sekolah). Jika multi-sekolah, perlu tabel schools terpisah." },
      { name: "bills", pk: "bill_id", columns: ["bill_id", "student_id(FK)", "month", "total_amount", "status", "due_date", "created_at", "paid_at"], note: "✅ 3NF — total_amount bisa derived dari SUM(bill_items.amount), tapi disimpan untuk performa query" },
      { name: "bill_items", pk: "item_id", columns: ["item_id", "bill_id(FK)", "item_name", "amount"], note: "✅ 3NF — setiap kolom bergantung langsung pada item_id" },
      { name: "payments", pk: "payment_id", columns: ["payment_id", "user_id(FK)", "bill_id(FK)", "donation_id(FK)", "payment_type", "amount", "method", "installment_plan", "installment_number", "receipt_number", "status", "paid_at"], note: "✅ 3NF — receipt_number bergantung langsung pada payment_id (unik per transaksi)" },
      { name: "campaigns", pk: "campaign_id", columns: ["campaign_id", "created_by(FK)", "title", "description", "reason", "category", "target_amount", "collected_amount", "cover_image_url", "school_name", "location", "is_verified", "status", "start_date", "end_date", "created_at"], note: "✅ 3NF — collected_amount = derived tapi disimpan. school_name redundan tapi acceptable (single-tenant)" },
      { name: "donations", pk: "donation_id", columns: ["donation_id", "campaign_id(FK)", "donor_id(FK)", "amount", "payment_method", "message", "is_anonymous", "status", "donated_at"], note: "✅ 3NF — semua kolom bergantung langsung pada donation_id" },
      { name: "aid_requests", pk: "request_id", columns: ["request_id", "student_id(FK)", "request_type", "amount", "purpose", "installment_period", "document_url", "status", "reviewed_by(FK)", "reviewed_at", "created_at"], note: "✅ 3NF — semua kolom bergantung langsung pada request_id" },
    ],
    changes: [
      "Semua tabel sudah 3NF. Tidak ada transitive dependency yang perlu dipecah lagi.",
      "Catatan: school_name ada di students & campaigns — ini acceptable karena single-tenant (1 sekolah). Jika multi-sekolah, perlu tabel `schools` dengan school_id sebagai FK.",
      "Catatan: total_amount di bills dan collected_amount di campaigns adalah derived attributes, disimpan untuk optimasi query (denormalisasi terkontrol).",
    ],
  },
};

// ─── Relasi antar tabel ──────────────────────────────────────────────────────
const RELATIONS = [
  { from: "users", to: "students", type: "1:1", fk: "students.user_id → users.user_id", desc: "Setiap siswa terhubung dengan 1 akun user" },
  { from: "students", to: "bills", type: "1:N", fk: "bills.student_id → students.student_id", desc: "1 siswa memiliki banyak tagihan bulanan" },
  { from: "bills", to: "bill_items", type: "1:N", fk: "bill_items.bill_id → bills.bill_id", desc: "1 tagihan memiliki banyak komponen (SPP, Lab, dll)" },
  { from: "users", to: "payments", type: "1:N", fk: "payments.user_id → users.user_id", desc: "1 user bisa melakukan banyak pembayaran" },
  { from: "bills", to: "payments", type: "1:N", fk: "payments.bill_id → bills.bill_id", desc: "1 tagihan bisa dibayar dalam beberapa cicilan" },
  { from: "users", to: "campaigns", type: "1:N", fk: "campaigns.created_by → users.user_id", desc: "1 user bisa mengajukan banyak kampanye" },
  { from: "campaigns", to: "donations", type: "1:N", fk: "donations.campaign_id → campaigns.campaign_id", desc: "1 kampanye menerima banyak donasi" },
  { from: "users", to: "donations", type: "1:N", fk: "donations.donor_id → users.user_id", desc: "1 donatur bisa berdonasi ke banyak kampanye" },
  { from: "donations", to: "payments", type: "1:1", fk: "payments.donation_id → donations.donation_id", desc: "1 donasi terhubung 1 payment" },
  { from: "students", to: "aid_requests", type: "1:N", fk: "aid_requests.student_id → students.student_id", desc: "1 siswa bisa ajukan banyak bantuan" },
  { from: "users", to: "aid_requests", type: "1:N", fk: "aid_requests.reviewed_by → users.user_id", desc: "1 admin bisa review banyak pengajuan" },
];

// ─── ERD Visual Component ────────────────────────────────────────────────────
function ERDDiagram() {
  const tables = [
    { name: "users", x: 320, y: 20, color: "#1677FF" },
    { name: "students", x: 60, y: 180, color: "#52C41A" },
    { name: "bills", x: 60, y: 380, color: "#EA4E0D" },
    { name: "bill_items", x: 60, y: 560, color: "#FDD504" },
    { name: "payments", x: 320, y: 280, color: "#722ED1" },
    { name: "campaigns", x: 580, y: 180, color: "#EB2F96" },
    { name: "donations", x: 580, y: 380, color: "#FA541C" },
    { name: "aid_requests", x: 320, y: 500, color: "#13C2C2" },
  ];

  const lines = [
    { from: [420, 110], to: [180, 180], label: "1:1" },    // users → students
    { from: [140, 280], to: [140, 380], label: "1:N" },    // students → bills
    { from: [140, 470], to: [140, 560], label: "1:N" },    // bills → bill_items
    { from: [420, 110], to: [420, 280], label: "1:N" },    // users → payments
    { from: [200, 420], to: [320, 340], label: "1:N" },    // bills → payments
    { from: [520, 110], to: [680, 180], label: "1:N" },    // users → campaigns
    { from: [680, 280], to: [680, 380], label: "1:N" },    // campaigns → donations
    { from: [520, 110], to: [640, 380], label: "1:N" },    // users → donations
    { from: [620, 440], to: [500, 340], label: "1:1" },    // donations → payments
    { from: [200, 260], to: [380, 500], label: "1:N" },    // students → aid_requests
    { from: [460, 110], to: [460, 500], label: "1:N" },    // users → aid_requests (reviewer)
  ];

  return (
    <div className="w-full overflow-x-auto">
      <svg width="840" height="680" viewBox="0 0 840 680" style={{ minWidth: 840 }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
            <polygon points="0 0, 10 3.5, 0 7" fill="#8C8C8C" />
          </marker>
        </defs>

        {/* Connection lines */}
        {lines.map((l, i) => {
          const mx = (l.from[0] + l.to[0]) / 2;
          const my = (l.from[1] + l.to[1]) / 2;
          return (
            <g key={`line-${i}`}>
              <line
                x1={l.from[0]} y1={l.from[1]}
                x2={l.to[0]} y2={l.to[1]}
                stroke="#D9D9D9" strokeWidth={2}
                markerEnd="url(#arrow)"
              />
              <rect x={mx - 14} y={my - 10} width={28} height={20} rx={10} fill="white" stroke="#D9D9D9" />
              <text x={mx} y={my + 4} textAnchor="middle" fontSize={10} fill="#8C8C8C" fontWeight={700}>
                {l.label}
              </text>
            </g>
          );
        })}

        {/* Table boxes */}
        {tables.map((t) => {
          const tbl = DB_TABLES.find(d => d.name === t.name)!;
          const pkCol = tbl.columns.find(c => c.pk)?.name || "";
          const fkCols = tbl.columns.filter(c => c.fk).map(c => c.name);
          const h = 80 + Math.min(tbl.columns.length, 5) * 14;
          return (
            <g key={t.name}>
              <rect x={t.x} y={t.y} width={220} height={h} rx={12} fill="white"
                stroke={t.color} strokeWidth={2}
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }} />
              <rect x={t.x} y={t.y} width={220} height={32} rx={12} fill={t.color} />
              <rect x={t.x} y={t.y + 20} width={220} height={12} fill={t.color} />
              <text x={t.x + 110} y={t.y + 21} textAnchor="middle" fill="white" fontSize={13} fontWeight={800}>
                {t.name}
              </text>
              {/* PK */}
              <text x={t.x + 12} y={t.y + 50} fontSize={10} fill={t.color} fontWeight={700}>
                🔑 {pkCol}
              </text>
              {/* FKs */}
              {fkCols.slice(0, 3).map((fk, fi) => (
                <text key={fk} x={t.x + 12} y={t.y + 64 + fi * 14} fontSize={10} fill="#8C8C8C">
                  🔗 {fk}
                </text>
              ))}
              {/* Count */}
              <text x={t.x + 12} y={t.y + h - 8} fontSize={9} fill="#BFBFBF">
                {tbl.columns.length} kolom
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Collapsible Section ─────────────────────────────────────────────────────
function Section({ title, icon, children, defaultOpen = false }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#EEF4FF" }}>
            {icon}
          </div>
          <span style={{ fontWeight: 700, color: DARK, fontSize: "0.92rem" }}>{title}</span>
        </div>
        <ChevronDown
          size={18} color={GRAY}
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function DatabaseDocs() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("analysis");
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const copySQL = () => {
    const sql = generateSQL();
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDrawIO = () => {
    const xml = generateDrawIOXML();
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "EDUFIN_ERD_Complete.drawio";
    a.click();
    URL.revokeObjectURL(url);
  };

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "analysis", label: "Analisis", icon: <Search size={16} /> },
    { key: "erd", label: "ERD", icon: <GitBranch size={16} /> },
    { key: "normalization", label: "Normalisasi", icon: <Layers size={16} /> },
    { key: "relations", label: "Relasi", icon: <Link2 size={16} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-4" style={{ background: "linear-gradient(145deg,#0D5FD6,#108EE9)" }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate("/wireframes")} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Dokumentasi Database EDUFIN</p>
            <h1 style={{ color: "white", fontWeight: 900, fontSize: "1.15rem" }}>ERD, Normalisasi & Relasi</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { v: "8", l: "Tabel" },
            { v: "72", l: "Kolom" },
            { v: "11", l: "Relasi" },
            { v: "3NF", l: "Level" },
          ].map(s => (
            <div key={s.l} className="rounded-xl p-2 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              <p style={{ color: "white", fontWeight: 900, fontSize: "1rem" }}>{s.v}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.62rem" }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{
                background: tab === t.key ? "white" : "rgba(255,255,255,0.15)",
                color: tab === t.key ? BLUE : "white",
                fontWeight: 700, fontSize: "0.78rem",
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-3 flex gap-2">
        <button onClick={downloadDrawIO}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
          style={{ background: "#EEF4FF", color: BLUE, fontWeight: 700, fontSize: "0.8rem" }}>
          <Download size={15} /> Download .drawio
        </button>
        <button onClick={copySQL}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
          style={{ background: copied ? "#F6FFED" : "#F5F7FA", color: copied ? "#52C41A" : "#595959", fontWeight: 700, fontSize: "0.8rem" }}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Tersalin!" : "Copy SQL"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-24 overflow-y-auto">

        {/* ══ TAB: ANALYSIS ══════════════════════════════════ */}
        {tab === "analysis" && (
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                <Search size={16} color={GRAY} />
                <input
                  placeholder="Cari halaman..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "0.85rem", color: DARK }}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl p-4 mb-4" style={{ background: "#EEF4FF", border: "1px solid #C5D8FF" }}>
              <p style={{ fontWeight: 800, color: BLUE, fontSize: "0.88rem", marginBottom: "6px" }}>
                📋 Ringkasan Analisis Sistem
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: "Halaman dianalisis", v: `${USER_INPUTS.length}` },
                  { l: "Total user inputs", v: `${USER_INPUTS.reduce((s, p) => s + p.inputs.length, 0)}` },
                  { l: "Total button clicks", v: `${USER_INPUTS.reduce((s, p) => s + p.clicks.length, 0)}` },
                  { l: "Total validasi", v: `${USER_INPUTS.reduce((s, p) => s + p.validations.length, 0)}` },
                ].map(i => (
                  <div key={i.l} className="flex justify-between">
                    <span style={{ fontSize: "0.75rem", color: "#4A6FA5" }}>{i.l}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: BLUE }}>{i.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {USER_INPUTS
              .filter(p => !searchTerm || p.page.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((page) => (
              <Section key={page.page} title={page.page}
                icon={<FileText size={16} color={BLUE} />}>

                {page.inputs.length > 0 && (
                  <div className="mb-3">
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: GRAY, letterSpacing: "0.3px", marginBottom: "8px" }}>
                      📝 USER INPUTS ({page.inputs.length})
                    </p>
                    <div className="space-y-1.5">
                      {page.inputs.map(inp => (
                        <div key={inp.field} className="flex items-start gap-2 px-3 py-2 rounded-xl" style={{ background: "#FAFAFA" }}>
                          <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: "#EEF4FF", color: BLUE, fontWeight: 700, whiteSpace: "nowrap" }}>{inp.type}</span>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: "0.8rem", color: DARK }}>{inp.field}</p>
                            <p style={{ fontSize: "0.72rem", color: GRAY }}>{inp.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {page.clicks.length > 0 && (
                  <div className="mb-3">
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: GRAY, letterSpacing: "0.3px", marginBottom: "8px" }}>
                      👆 BUTTON CLICKS ({page.clicks.length})
                    </p>
                    <div className="space-y-1">
                      {page.clicks.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#FAFAFA" }}>
                          <span style={{ color: BLUE, fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap" }}>{c.btn}</span>
                          <span style={{ color: GRAY, fontSize: "0.68rem" }}>→ {c.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {page.validations.length > 0 && (
                  <div>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: GRAY, letterSpacing: "0.3px", marginBottom: "8px" }}>
                      ✅ VALIDASI ({page.validations.length})
                    </p>
                    <div className="space-y-1">
                      {page.validations.map((v, i) => (
                        <div key={i} className="flex items-start gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#F6FFED" }}>
                          <Shield size={12} color="#52C41A" className="mt-0.5 flex-shrink-0" />
                          <div>
                            <p style={{ fontSize: "0.75rem", color: DARK, fontWeight: 600 }}>{v.rule}</p>
                            <p style={{ fontSize: "0.65rem", color: GRAY }}>Field: {v.field} · Type: {v.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            ))}

            {/* NISN Validation Deep Dive */}
            <Section title="🔍 Deep Dive: Validasi NISN" icon={<Key size={16} color="#EA4E0D" />} defaultOpen>
              <div className="space-y-3">
                <div className="rounded-xl p-3" style={{ background: "#FFF2EE", border: "1px solid #FFCCC7" }}>
                  <p style={{ fontWeight: 700, color: "#EA4E0D", fontSize: "0.82rem", marginBottom: "4px" }}>
                    Alur Validasi NISN (RegisterPage)
                  </p>
                  <div className="space-y-2 mt-2">
                    {[
                      { step: "1", desc: "Input NISN — hanya angka, max 10 digit", code: "val.replace(/\\D/g, '').slice(0, 10)" },
                      { step: "2", desc: "Cek panjang — harus tepat 10 digit", code: "clean.length < 10 → error" },
                      { step: "3", desc: "Lookup ke database (mock NISN_DB)", code: "NISN_DB[clean] → studentData" },
                      { step: "4", desc: "Jika ditemukan → tampilkan data konfirmasi", code: "setStudentData(data); setStep('verify')" },
                      { step: "5", desc: "Jika tidak ditemukan → tampilkan error", code: "setNisnError('NISN tidak ditemukan...')" },
                      { step: "6", desc: "User konfirmasi data → lanjut ke password", code: "setStep('password')" },
                      { step: "7", desc: "NISN dikaitkan permanen ke akun", code: "register({ nisn: studentData.nisn, ... })" },
                    ].map(s => (
                      <div key={s.step} className="flex gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "#EA4E0D", color: "white", fontSize: "0.6rem", fontWeight: 800 }}>
                          {s.step}
                        </div>
                        <div>
                          <p style={{ fontSize: "0.78rem", fontWeight: 600, color: DARK }}>{s.desc}</p>
                          <code style={{ fontSize: "0.65rem", color: "#EA4E0D", background: "#FFF8F5", padding: "1px 4px", borderRadius: 4 }}>
                            {s.code}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-3" style={{ background: "#EEF4FF" }}>
                  <p style={{ fontWeight: 700, color: BLUE, fontSize: "0.82rem", marginBottom: "6px" }}>
                    Mock NISN Database (3 entries)
                  </p>
                  {[
                    { nisn: "0012345678", name: "Budi Santoso", school: "SDN 3 Malang" },
                    { nisn: "0087654321", name: "Citra Dewi Rahayu", school: "SMPN 5 Batu" },
                    { nisn: "0099887766", name: "Ahmad Rizki Pratama", school: "SMA Negeri 2 Kepanjen" },
                  ].map(n => (
                    <div key={n.nisn} className="flex items-center gap-2 py-1.5">
                      <code style={{ fontSize: "0.75rem", fontWeight: 700, color: BLUE, background: "white", padding: "2px 6px", borderRadius: 6 }}>{n.nisn}</code>
                      <span style={{ fontSize: "0.75rem", color: "#595959" }}>{n.name} · {n.school}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ══ TAB: ERD ═══════════════════════════════════════ */}
        {tab === "erd" && (
          <div>
            <div className="rounded-2xl p-4 mb-4" style={{ background: "#EEF4FF", border: "1px solid #C5D8FF" }}>
              <p style={{ fontWeight: 800, color: BLUE, fontSize: "0.85rem", marginBottom: "4px" }}>
                📐 Entity Relationship Diagram
              </p>
              <p style={{ fontSize: "0.75rem", color: "#4A6FA5" }}>
                8 tabel yang sudah dinormalisasi ke 3NF. Scroll horizontal untuk melihat selengkapnya.
              </p>
            </div>

            {/* Visual ERD */}
            <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "white", border: "1px solid #E8E8E8" }}>
              <div className="px-4 py-3" style={{ background: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
                <p style={{ fontWeight: 700, fontSize: "0.82rem", color: DARK }}>ERD Diagram — EDUFIN (8 Tabel)</p>
              </div>
              <div className="p-3">
                <ERDDiagram />
              </div>
            </div>

            {/* Table Details */}
            {DB_TABLES.map(tbl => (
              <Section key={tbl.name} title={`${tbl.name} — ${tbl.desc}`}
                icon={<Table size={16} color={tbl.color} />}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontSize: "0.75rem" }}>
                    <thead>
                      <tr style={{ background: "#FAFAFA" }}>
                        <th className="px-2 py-2 text-left" style={{ color: GRAY, fontWeight: 700 }}>Kolom</th>
                        <th className="px-2 py-2 text-left" style={{ color: GRAY, fontWeight: 700 }}>Tipe</th>
                        <th className="px-2 py-2 text-left" style={{ color: GRAY, fontWeight: 700 }}>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tbl.columns.map(col => (
                        <tr key={col.name} style={{ borderTop: "1px solid #F5F5F5" }}>
                          <td className="px-2 py-1.5">
                            <div className="flex items-center gap-1">
                              {col.pk && <Key size={10} color="#FDD504" />}
                              {col.fk && <Link2 size={10} color={BLUE} />}
                              <span style={{ fontWeight: col.pk ? 800 : 600, color: col.pk ? "#242424" : "#595959" }}>
                                {col.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-1.5">
                            <code style={{ fontSize: "0.68rem", background: "#F5F7FA", padding: "1px 4px", borderRadius: 4, color: "#595959" }}>
                              {col.type}
                            </code>
                          </td>
                          <td className="px-2 py-1.5" style={{ color: GRAY }}>
                            {col.desc}
                            {col.fk && (
                              <span style={{ color: BLUE, fontSize: "0.65rem" }}> → {col.fk}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            ))}
          </div>
        )}

        {/* ══ TAB: NORMALIZATION ══════════════════════════════ */}
        {tab === "normalization" && (
          <div>
            {/* Progress */}
            <div className="flex items-center gap-1 mb-4 px-1">
              {["UNF", "1NF", "2NF", "3NF"].map((label, i) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: i === 3 ? BLUE : i === 0 ? "#EA4E0D" : i === 1 ? "#FDD504" : "#52C41A",
                        color: "white", fontWeight: 800, fontSize: "0.68rem",
                      }}>
                      {label}
                    </div>
                  </div>
                  {i < 3 && <ArrowRight size={14} color="#D9D9D9" className="flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            {/* UNF */}
            <Section title={NORMALIZATION.unf.title} icon={<Database size={16} color="#EA4E0D" />} defaultOpen>
              <p style={{ fontSize: "0.78rem", color: GRAY, marginBottom: "10px" }}>{NORMALIZATION.unf.desc}</p>
              {NORMALIZATION.unf.tables.map(t => (
                <div key={t.name}>
                  <p style={{ fontWeight: 700, fontSize: "0.82rem", color: DARK, marginBottom: "6px" }}>{t.name}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {t.columns.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-full" style={{ background: "#FFF2EE", color: "#EA4E0D", fontSize: "0.65rem", fontWeight: 600 }}>
                        {c}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontWeight: 700, color: "#EA4E0D", fontSize: "0.75rem", marginBottom: "4px" }}>⚠ Masalah:</p>
                  <ul className="space-y-1">
                    {t.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span style={{ color: "#EA4E0D", fontSize: "0.7rem" }}>•</span>
                        <span style={{ fontSize: "0.72rem", color: "#595959" }}>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Section>

            {/* 1NF */}
            <Section title={NORMALIZATION.nf1.title} icon={<Database size={16} color="#FDD504" />}>
              <p style={{ fontSize: "0.78rem", color: GRAY, marginBottom: "8px" }}>{NORMALIZATION.nf1.desc}</p>
              <div className="rounded-xl p-3 mb-3" style={{ background: "#FFFBE6", border: "1px solid #FFE17A" }}>
                <p style={{ fontWeight: 700, color: "#B07D00", fontSize: "0.78rem", marginBottom: "4px" }}>Aturan 1NF:</p>
                {NORMALIZATION.nf1.rules.map((r, i) => (
                  <p key={i} style={{ fontSize: "0.72rem", color: "#8B6A00" }}>✓ {r}</p>
                ))}
              </div>
              {NORMALIZATION.nf1.tables.map(t => (
                <div key={t.name} className="mb-3 rounded-xl p-3" style={{ background: "#FAFAFA" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ fontWeight: 700, fontSize: "0.8rem", color: DARK }}>{t.name}</p>
                    <span style={{ fontSize: "0.65rem", color: BLUE, fontWeight: 600 }}>PK: {t.pk}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {t.columns.map(c => (
                      <span key={c} className="px-1.5 py-0.5 rounded"
                        style={{ background: c === t.pk ? "#FFF7E6" : "#F5F7FA", color: c === t.pk ? "#B07D00" : "#595959", fontSize: "0.65rem", fontWeight: c === t.pk ? 700 : 500 }}>
                        {c === t.pk ? `🔑 ${c}` : c}
                      </span>
                    ))}
                  </div>
                  {(t as any).issue && (
                    <p style={{ fontSize: "0.68rem", color: "#EA4E0D", marginTop: "4px" }}>{(t as any).issue}</p>
                  )}
                </div>
              ))}
              <div className="rounded-xl p-3" style={{ background: "#EEF4FF" }}>
                <p style={{ fontWeight: 700, color: BLUE, fontSize: "0.78rem", marginBottom: "4px" }}>Perubahan dari UNF → 1NF:</p>
                {NORMALIZATION.nf1.changes.map((c, i) => (
                  <p key={i} style={{ fontSize: "0.72rem", color: "#4A6FA5" }}>→ {c}</p>
                ))}
              </div>
            </Section>

            {/* 2NF */}
            <Section title={NORMALIZATION.nf2.title} icon={<Database size={16} color="#52C41A" />}>
              <p style={{ fontSize: "0.78rem", color: GRAY, marginBottom: "8px" }}>{NORMALIZATION.nf2.desc}</p>
              <div className="rounded-xl p-3 mb-3" style={{ background: "#F6FFED", border: "1px solid #B7EB8F" }}>
                <p style={{ fontWeight: 700, color: "#237804", fontSize: "0.78rem", marginBottom: "4px" }}>Aturan 2NF:</p>
                {NORMALIZATION.nf2.rules.map((r, i) => (
                  <p key={i} style={{ fontSize: "0.72rem", color: "#389E0D" }}>✓ {r}</p>
                ))}
              </div>
              {NORMALIZATION.nf2.tables.map(t => (
                <div key={t.name} className="mb-3 rounded-xl p-3"
                  style={{ background: (t as any).highlight ? "#F6FFED" : "#FAFAFA", border: (t as any).highlight ? "1.5px solid #B7EB8F" : "none" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ fontWeight: 700, fontSize: "0.8rem", color: DARK }}>{t.name}</p>
                    {(t as any).highlight && <span className="px-1.5 py-0.5 rounded-full" style={{ background: "#52C41A", color: "white", fontSize: "0.6rem", fontWeight: 700 }}>BARU</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {t.columns.map(c => (
                      <span key={c} className="px-1.5 py-0.5 rounded"
                        style={{ background: c.includes("(FK)") ? "#EEF4FF" : c === t.pk ? "#FFF7E6" : "#F5F7FA", color: c.includes("(FK)") ? BLUE : c === t.pk ? "#B07D00" : "#595959", fontSize: "0.65rem", fontWeight: 600 }}>
                        {c === t.pk ? `🔑 ${c}` : c.includes("(FK)") ? `🔗 ${c}` : c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="rounded-xl p-3" style={{ background: "#EEF4FF" }}>
                <p style={{ fontWeight: 700, color: BLUE, fontSize: "0.78rem", marginBottom: "4px" }}>Perubahan dari 1NF → 2NF:</p>
                {NORMALIZATION.nf2.changes.map((c, i) => (
                  <p key={i} style={{ fontSize: "0.72rem", color: "#4A6FA5" }}>→ {c}</p>
                ))}
              </div>
            </Section>

            {/* 3NF */}
            <Section title={NORMALIZATION.nf3.title} icon={<Database size={16} color={BLUE} />} defaultOpen>
              <p style={{ fontSize: "0.78rem", color: GRAY, marginBottom: "8px" }}>{NORMALIZATION.nf3.desc}</p>
              <div className="rounded-xl p-3 mb-3" style={{ background: "#EEF4FF", border: "1px solid #C5D8FF" }}>
                <p style={{ fontWeight: 700, color: BLUE, fontSize: "0.78rem", marginBottom: "4px" }}>Aturan 3NF:</p>
                {NORMALIZATION.nf3.rules.map((r, i) => (
                  <p key={i} style={{ fontSize: "0.72rem", color: "#4A6FA5" }}>✓ {r}</p>
                ))}
              </div>
              {NORMALIZATION.nf3.tables.map(t => (
                <div key={t.name} className="mb-3 rounded-xl p-3" style={{ background: "#FAFAFA" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ fontWeight: 700, fontSize: "0.8rem", color: DARK }}>{t.name}</p>
                    <span className="px-1.5 py-0.5 rounded-full" style={{ background: "#F6FFED", color: "#52C41A", fontSize: "0.6rem", fontWeight: 700 }}>✓ 3NF</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {t.columns.map(c => (
                      <span key={c} className="px-1.5 py-0.5 rounded"
                        style={{ background: c.includes("(FK)") ? "#EEF4FF" : c === t.pk ? "#FFF7E6" : "#F5F7FA", color: c.includes("(FK)") ? BLUE : c === t.pk ? "#B07D00" : "#595959", fontSize: "0.65rem", fontWeight: 600 }}>
                        {c === t.pk ? `🔑 ${c}` : c.includes("(FK)") ? `🔗 ${c}` : c}
                      </span>
                    ))}
                  </div>
                  {(t as any).note && (
                    <p style={{ fontSize: "0.68rem", color: "#52C41A", fontStyle: "italic" }}>{(t as any).note}</p>
                  )}
                </div>
              ))}
              <div className="rounded-xl p-3" style={{ background: "#F6FFED", border: "1px solid #B7EB8F" }}>
                <p style={{ fontWeight: 700, color: "#237804", fontSize: "0.78rem", marginBottom: "4px" }}>Catatan 3NF:</p>
                {NORMALIZATION.nf3.changes.map((c, i) => (
                  <p key={i} style={{ fontSize: "0.72rem", color: "#389E0D" }}>📌 {c}</p>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ══ TAB: RELATIONS ═════════════════════════════════ */}
        {tab === "relations" && (
          <div>
            <div className="rounded-2xl p-4 mb-4" style={{ background: "#EEF4FF", border: "1px solid #C5D8FF" }}>
              <p style={{ fontWeight: 800, color: BLUE, fontSize: "0.85rem", marginBottom: "4px" }}>
                🔗 Tabel Relasi Antar Entitas
              </p>
              <p style={{ fontSize: "0.75rem", color: "#4A6FA5" }}>
                Total {RELATIONS.length} relasi antara 8 tabel database EDUFIN
              </p>
            </div>

            {/* Relation Table */}
            <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "white", border: "1px solid #E8E8E8" }}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: "0.72rem" }}>
                  <thead>
                    <tr style={{ background: BLUE }}>
                      <th className="px-3 py-2.5 text-left" style={{ color: "white", fontWeight: 700 }}>No</th>
                      <th className="px-3 py-2.5 text-left" style={{ color: "white", fontWeight: 700 }}>Dari</th>
                      <th className="px-3 py-2.5 text-center" style={{ color: "white", fontWeight: 700 }}>Tipe</th>
                      <th className="px-3 py-2.5 text-left" style={{ color: "white", fontWeight: 700 }}>Ke</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RELATIONS.map((r, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #F5F5F5", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                        <td className="px-3 py-2" style={{ fontWeight: 700, color: GRAY }}>{i + 1}</td>
                        <td className="px-3 py-2">
                          <span className="px-1.5 py-0.5 rounded" style={{ background: DB_TABLES.find(t => t.name === r.from)?.color + "15", color: DB_TABLES.find(t => t.name === r.from)?.color, fontWeight: 700 }}>
                            {r.from}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="px-2 py-0.5 rounded-full" style={{ background: r.type === "1:1" ? "#F6FFED" : "#EEF4FF", color: r.type === "1:1" ? "#52C41A" : BLUE, fontWeight: 800, fontSize: "0.7rem" }}>
                            {r.type}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="px-1.5 py-0.5 rounded" style={{ background: DB_TABLES.find(t => t.name === r.to)?.color + "15", color: DB_TABLES.find(t => t.name === r.to)?.color, fontWeight: 700 }}>
                            {r.to}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Relations */}
            {RELATIONS.map((r, i) => (
              <div key={i} className="rounded-2xl p-4 mb-3" style={{ background: "white", border: "1px solid #F0F0F0" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded" style={{ background: DB_TABLES.find(t => t.name === r.from)?.color, color: "white", fontWeight: 700, fontSize: "0.72rem" }}>
                    {r.from}
                  </span>
                  <span className="px-2 py-0.5 rounded-full" style={{ background: "#F5F7FA", fontWeight: 800, fontSize: "0.72rem", color: DARK }}>
                    {r.type}
                  </span>
                  <span className="px-2 py-0.5 rounded" style={{ background: DB_TABLES.find(t => t.name === r.to)?.color, color: "white", fontWeight: 700, fontSize: "0.72rem" }}>
                    {r.to}
                  </span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#595959", marginBottom: "4px" }}>{r.desc}</p>
                <code style={{ fontSize: "0.68rem", color: BLUE, background: "#EEF4FF", padding: "3px 8px", borderRadius: 6, display: "inline-block" }}>
                  {r.fk}
                </code>
              </div>
            ))}

            {/* Relationship Diagram */}
            <Section title="Diagram Relasi Visual" icon={<GitBranch size={16} color={BLUE} />} defaultOpen>
              <ERDDiagram />
            </Section>
          </div>
        )}

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE SQL
// ═══════════════════════════════════════════════════════════════════════════════
function generateSQL(): string {
  return `-- ═══════════════════════════════════════════════════════════════
-- EDUFIN Database Schema — 8 Tabel (3NF)
-- Platform Keuangan Pendidikan Single-Tenant
-- Generated: ${new Date().toLocaleDateString("id-ID")}
-- ═══════════════════════════════════════════════════════════════

-- 1. USERS
CREATE TABLE users (
  user_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  role          VARCHAR(10) NOT NULL CHECK (role IN ('siswa','sekolah','donatur')),
  phone         VARCHAR(20),
  avatar_url    TEXT,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- 2. STUDENTS
CREATE TABLE students (
  student_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  nisn              CHAR(10) NOT NULL UNIQUE,
  school_name       VARCHAR(150) NOT NULL,
  class             VARCHAR(20) NOT NULL,
  parent_name       VARCHAR(100),
  address           TEXT,
  academic_year     VARCHAR(9),
  enrollment_status VARCHAR(10) DEFAULT 'aktif' CHECK (enrollment_status IN ('aktif','lulus','pindah')),
  created_at        TIMESTAMP DEFAULT NOW()
);

-- 3. BILLS
CREATE TABLE bills (
  bill_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  month        VARCHAR(20) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status       VARCHAR(15) NOT NULL CHECK (status IN ('lunas','tertunggak','cicilan')),
  due_date     DATE NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW(),
  paid_at      TIMESTAMP
);

-- 4. BILL_ITEMS
CREATE TABLE bill_items (
  item_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id   UUID NOT NULL REFERENCES bills(bill_id) ON DELETE CASCADE,
  item_name VARCHAR(50) NOT NULL,
  amount    DECIMAL(12,2) NOT NULL
);

-- 5. PAYMENTS
CREATE TABLE payments (
  payment_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES users(user_id),
  bill_id            UUID REFERENCES bills(bill_id),
  donation_id        UUID REFERENCES donations(donation_id),
  payment_type       VARCHAR(15) NOT NULL CHECK (payment_type IN ('spp_penuh','cicilan','donasi')),
  amount             DECIMAL(12,2) NOT NULL,
  method             VARCHAR(15) NOT NULL CHECK (method IN ('bca','bni','qris','indomaret')),
  installment_plan   VARCHAR(5) CHECK (installment_plan IN ('1x','2x','3x')),
  installment_number INT,
  receipt_number     VARCHAR(20) UNIQUE,
  status             VARCHAR(10) NOT NULL CHECK (status IN ('berhasil','pending','gagal')),
  paid_at            TIMESTAMP DEFAULT NOW()
);

-- 6. CAMPAIGNS
CREATE TABLE campaigns (
  campaign_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by       UUID NOT NULL REFERENCES users(user_id),
  title            VARCHAR(200) NOT NULL,
  description      TEXT,
  reason           TEXT,
  category         VARCHAR(20) NOT NULL CHECK (category IN ('beasiswa','fasilitas','perlengkapan','ujian')),
  target_amount    DECIMAL(12,2) NOT NULL,
  collected_amount DECIMAL(12,2) DEFAULT 0,
  cover_image_url  TEXT,
  school_name      VARCHAR(150),
  location         VARCHAR(100),
  is_verified      BOOLEAN DEFAULT FALSE,
  status           VARCHAR(10) NOT NULL CHECK (status IN ('pending','aktif','selesai','ditolak')),
  start_date       DATE,
  end_date         DATE,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- 7. DONATIONS
CREATE TABLE donations (
  donation_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id    UUID NOT NULL REFERENCES campaigns(campaign_id),
  donor_id       UUID NOT NULL REFERENCES users(user_id),
  amount         DECIMAL(12,2) NOT NULL CHECK (amount >= 10000),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('qris','va','bank_transfer')),
  message        TEXT,
  is_anonymous   BOOLEAN DEFAULT FALSE,
  status         VARCHAR(10) NOT NULL CHECK (status IN ('berhasil','pending','gagal')),
  donated_at     TIMESTAMP DEFAULT NOW()
);

-- 8. AID_REQUESTS
CREATE TABLE aid_requests (
  request_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id         UUID NOT NULL REFERENCES students(student_id),
  request_type       VARCHAR(15) NOT NULL CHECK (request_type IN ('pinjaman','bantuan_spp')),
  amount             DECIMAL(12,2) NOT NULL,
  purpose            VARCHAR(100) NOT NULL,
  installment_period INT,
  document_url       TEXT,
  status             VARCHAR(15) NOT NULL CHECK (status IN ('pending','disetujui','ditolak','lunas')),
  reviewed_by        UUID REFERENCES users(user_id),
  reviewed_at        TIMESTAMP,
  created_at         TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX idx_students_nisn ON students(nisn);
CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_bills_student ON bills(student_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_bill ON payments(bill_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_aid_student ON aid_requests(student_id);
`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE DRAW.IO XML
// ═══════════════════════════════════════════════════════════════════════════════
function generateDrawIOXML(): string {
  const positions: Record<string, { x: number; y: number }> = {
    users: { x: 480, y: 80 },
    students: { x: 40, y: 350 },
    bills: { x: 40, y: 750 },
    bill_items: { x: 40, y: 1150 },
    payments: { x: 480, y: 580 },
    campaigns: { x: 920, y: 350 },
    donations: { x: 920, y: 750 },
    aid_requests: { x: 480, y: 1000 },
  };

  const colors: Record<string, string> = {
    users: "#1677FF",
    students: "#52C41A",
    bills: "#EA4E0D",
    bill_items: "#FDD504",
    payments: "#722ED1",
    campaigns: "#EB2F96",
    donations: "#FA541C",
    aid_requests: "#13C2C2",
  };

  let cellId = 100;
  const tableIds: Record<string, string> = {};
  let cells = "";

  // Generate tables
  DB_TABLES.forEach(tbl => {
    const pos = positions[tbl.name];
    const color = colors[tbl.name];
    const tableId = `tbl_${cellId++}`;
    tableIds[tbl.name] = tableId;

    const w = 280;
    const headerH = 40;
    const rowH = 26;
    const totalH = headerH + tbl.columns.length * rowH;

    // Table header
    cells += `<mxCell id="${tableId}" value="${tbl.name.toUpperCase()}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${color};strokeColor=${color};fontColor=#FFFFFF;fontStyle=1;fontSize=14;align=center;verticalAlign=top;spacing=10;arcSize=5;" vertex="1" parent="1"><mxGeometry x="${pos.x}" y="${pos.y}" width="${w}" height="${totalH}" as="geometry"/></mxCell>`;

    // Column rows
    tbl.columns.forEach((col, idx) => {
      const rowId = `row_${cellId++}`;
      const y = pos.y + headerH + (idx * rowH);

      const prefix = col.pk ? "PK  " : col.fk ? "FK  " : "      ";
      const label = `${prefix}${col.name}`;
      const bgColor = col.pk ? "#FFF7E6" : col.fk ? "#E6F7FF" : "#FFFFFF";
      const textColor = col.pk ? "#FA8C16" : col.fk ? "#1890FF" : "#262626";
      const bold = col.pk ? "1" : "0";

      cells += `<mxCell id="${rowId}" value="${escapeXml(label)}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${bgColor};strokeColor=${color};fontColor=${textColor};fontSize=11;align=left;spacingLeft=10;fontStyle=${bold};" vertex="1" parent="1"><mxGeometry x="${pos.x}" y="${y}" width="${w}" height="${rowH}" as="geometry"/></mxCell>`;
    });
  });

  // Generate relations
  RELATIONS.forEach((rel, idx) => {
    const srcId = tableIds[rel.from];
    const tgtId = tableIds[rel.to];
    const edgeId = `edge_${cellId++}`;

    const arrow = rel.type === "1:1" ? "endArrow=block;endFill=1;" : "endArrow=ERmany;startArrow=ERone;";

    cells += `<mxCell id="${edgeId}" value="${rel.type}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;${arrow}strokeColor=#8C8C8C;strokeWidth=2;fontSize=10;fontColor=#595959;labelBackgroundColor=#FFFFFF;" edge="1" parent="1" source="${srcId}" target="${tgtId}"><mxGeometry relative="1" as="geometry"/></mxCell>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="EDUFIN" version="24.0.0" type="device">
  <diagram id="edufin-erd" name="EDUFIN ERD">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="1654" background="#FFFFFF" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="title" value="EDUFIN - Entity Relationship Diagram (8 Tabel, 3NF)" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=18;fontStyle=1;fontColor=#1677FF;" vertex="1" parent="1"><mxGeometry x="300" y="10" width="500" height="40" as="geometry"/></mxCell>
        ${cells}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
