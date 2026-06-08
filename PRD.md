# Product Requirements Document (PRD)
# EDUFIN - Platform Manajemen Keuangan Pendidikan

**Version:** 2.0  
**Last Updated:** 7 Juni 2026  
**Status:** Active  
**Owner:** Product Team  

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Personas](#4-user-personas)
5. [Feature Requirements](#5-feature-requirements)
6. [Technical Architecture](#6-technical-architecture)
7. [User Experience](#7-user-experience)
8. [Security & Compliance](#8-security--compliance)
9. [Timeline & Milestones](#9-timeline--milestones)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Appendix](#11-appendix)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Vision

**EDUFIN** adalah platform manajemen keuangan pendidikan yang bertujuan menjadi **platform #1 untuk manajemen SPP di Indonesia**. Dimulai dengan implementasi di **SDN 3 Malang** sebagai pilot school, EDUFIN menghubungkan empat stakeholder utama: **Siswa/Orang Tua**, **Sekolah (Admin)**, **Donatur**, dan **EDUFIN Super Admin** dalam satu ekosistem pembayaran dan fundraising yang terintegrasi.

### 1.2 Strategic Scope

| Item | Detail |
|------|--------|
| **Pilot School** | SDN 3 Malang (single tenant untuk validasi) |
| **Target 12 Bulan** | 50+ sekolah di Jawa Timur |
| **Target Jenjang** | SD, SMP, SMA/SMK (semua jenjang) |
| **Target Siswa** | Ratusan hingga ribuan siswa aktif |
| **User Roles** | 4 roles (EDUFIN Super Admin, Admin Sekolah, Siswa/Orang Tua, Donatur) |
| **Core Function** | SPP payment tracking + Fundraising platform |

### 1.3 Strategic Goals

1. **Primary:** Menyelesaikan masalah tracking pembayaran SPP yang manual dan ribet
2. **Secondary:** Menyediakan platform fundraising untuk siswa yang membutuhkan bantuan finansial
3. **Medium-term:** Ekspansi ke 50+ sekolah di Jawa Timur
4. **Long-term:** Menjadi standar platform keuangan sekolah di Indonesia

### 1.4 Business Model

**Gratis untuk semua pengguna** (fase saat ini — fokus ke adoption dan user growth):
- Tidak ada subscription fee untuk sekolah
- Tidak ada platform fee untuk donasi
- Revenue model akan diputuskan setelah adoption terbukti
- Project hybrid: mulai sebagai project akademik (MIT), roadmap ke startup nyata

---

## 2. PROBLEM STATEMENT

### 2.1 Current Challenges

#### **Pain Points - Admin Sekolah:**
- ❌ Manual recording pembayaran SPP (prone to error)
- ❌ Sulit tracking siswa yang belum/terlambat bayar
- ❌ Rekonsiliasi payment ribet (bank transfer vs cash)
- ❌ Tidak ada laporan keuangan otomatis
- ❌ Notifikasi reminder manual via WhatsApp

#### **Pain Points - Siswa/Orang Tua:**
- ❌ Tidak tahu status pembayaran SPP secara real-time
- ❌ Harus datang ke sekolah untuk bayar (inconvenient)
- ❌ Tidak ada bukti pembayaran digital
- ❌ Tidak ada reminder sebelum jatuh tempo
- ❌ Sulit request cicilan/bantuan finansial

#### **Pain Points - Donatur:**
- ❌ Tidak tahu siswa mana yang butuh bantuan
- ❌ Tidak percaya dana terpakai dengan benar (lack of transparency)
- ❌ Proses donasi ribet dan tidak trackable
- ❌ Tidak ada update perkembangan setelah donasi

#### **Pain Points - EDUFIN (Platform Level):**
- ❌ Tidak ada visibilitas ke semua sekolah yang terdaftar
- ❌ Tidak ada tools untuk onboarding sekolah baru
- ❌ Tidak ada mekanisme suspend/moderate konten bermasalah

### 2.2 Opportunity

Dengan digitalisasi proses pembayaran SPP dan fundraising, EDUFIN dapat:
- ✅ Mengurangi manual work admin sekolah hingga 80%
- ✅ Meningkatkan payment collection rate (on-time payment)
- ✅ Memberikan transparency penuh ke semua stakeholder
- ✅ Memfasilitasi akses pendidikan melalui fundraising
- ✅ Scale ke seluruh Jawa Timur dengan arsitektur multi-tenant

---

## 3. GOALS & SUCCESS METRICS

### 3.1 Business Goals

**Pilot (SDN 3 Malang):**
- 📊 **Adoption Rate:** 80% siswa terdaftar & aktif menggunakan platform
- 💰 **Payment Collection:** 90% pembayaran SPP on-time (sebelum jatuh tempo)
- 🎯 **Campaign Success:** 50% kampanye fundraising mencapai target
- ⏱️ **Admin Time Saved:** 70% reduction in manual recording time

**Year 1 (Jawa Timur - 50+ Sekolah):**
- 🏫 **Schools Onboarded:** 50 sekolah aktif (SD + SMP + SMA/SMK)
- 👥 **Monthly Active Users (MAU):** 5.000+ (siswa + orang tua + admin)
- 💳 **Transaction Volume:** Rp 1-5 miliar/bulan (SPP + donations)

### 3.2 Technical Success Metrics

**Performance:**
- ⚡ Homepage load time: < 2 seconds
- ⚡ Payment page load time: < 3 seconds
- ⚡ API response time (p95): < 500ms

**Reliability:**
- 🟢 Uptime SLA: 99.5% (max 3.6 hours downtime/month)
- ✅ Payment success rate: 95%+ (excluding user errors)
- 💾 Data backup: Daily automated backups

**Security:**
- 🔐 Zero data breaches
- 🔒 PCI DSS compliance (via Xendit)
- 📧 Email verification for all users

### 3.3 User Satisfaction Metrics

- ⭐ Net Promoter Score (NPS): > 50
- 😊 User satisfaction: > 4.0/5.0
- 📱 PWA performance score: > 90/100 (Google PageSpeed)

---

## 4. USER PERSONAS

### 4.1 Persona 1: Orang Tua Siswa (Primary User)

**Profile:**
- **Name:** Ibu Siti (Orang Tua) / Ahmad (Siswa SMP)
- **Age:** Orang tua: 35-45 tahun, Siswa: 6-18 tahun (SD s/d SMA)
- **Device:** Smartphone Android (mayoritas), iOS (sebagian kecil)
- **Tech Literacy:** Medium (familiar dengan WhatsApp, e-wallet, social media)
- **Internet:** 4G/WiFi, kadang 3G
- **Platform:** Mobile PWA (primary), desktop web (secondary)

**Goals:**
- Bayar SPP dengan mudah dan cepat
- Lihat status pembayaran real-time
- Terima reminder sebelum jatuh tempo (via WhatsApp)
- Request cicilan jika kesulitan finansial

**Pain Points:**
- Harus datang ke sekolah untuk bayar
- Lupa jatuh tempo → kena denda
- Tidak ada bukti pembayaran digital
- Sulit komunikasi dengan sekolah

**User Journey:**
1. Terima notifikasi WhatsApp "tagihan SPP bulan ini sudah tersedia"
2. Login via mobile PWA (email + password)
3. Lihat tagihan SPP bulan ini
4. Pilih metode pembayaran (QRIS/VA/GoPay)
5. Bayar & terima notifikasi sukses via WhatsApp
6. Download bukti pembayaran PDF

---

### 4.2 Persona 2: Admin Sekolah

**Profile:**
- **Name:** Ibu Dewi (Bendahara Sekolah)
- **Age:** 40-55 tahun
- **Device:** Laptop/Desktop (primary), Smartphone (secondary)
- **Tech Literacy:** Medium (familiar with Excel, email, WhatsApp)
- **Work Hours:** 07:00 - 15:00 WIB
- **Platform:** Desktop web (primary)

**Goals:**
- Track semua pembayaran SPP siswa
- Generate laporan keuangan bulanan
- Approve/reject kampanye fundraising
- Kirim reminder otomatis ke siswa yang belum bayar
- Manage multi-admin dengan permission berbeda

**Pain Points:**
- Manual recording di Excel prone to error
- Sulit rekonsiliasi bank transfer vs cash
- Harus cek payment gateway 1-by-1
- Laporan manual memakan waktu lama

**User Journey:**
1. Login via desktop
2. Lihat dashboard: total penerimaan, outstanding payments, pending campaigns
3. Approve kampanye fundraising dari siswa
4. Export laporan keuangan bulanan
5. Kirim notifikasi reminder ke siswa via WhatsApp blast

---

### 4.3 Persona 3: Donatur

**Profile:**
- **Name:** Pak Budi (Alumni / Masyarakat Umum / CSR)
- **Age:** 25-50 tahun
- **Device:** Smartphone (mobile-first)
- **Tech Literacy:** Medium-High
- **Motivation:** Charity, membantu pendidikan, CSR

**Goals:**
- Temukan kampanye siswa yang butuh bantuan
- Donasi dengan mudah dan aman
- Track penggunaan donasi (transparency)
- Terima update perkembangan kampanye

**User Journey:**
1. Browse kampanye fundraising (public page - tanpa login)
2. Pilih kampanye yang ingin didukung
3. Donasi via QRIS/VA/GoPay (guest checkout OK, atau login)
4. Terima konfirmasi donasi + receipt
5. Dapat update via notifikasi saat kampanye selesai

---

### 4.4 Persona 4: EDUFIN Super Admin

**Profile:**
- **Name:** Tim EDUFIN (internal)
- **Device:** Desktop (primary)
- **Access:** Full platform visibility

**Goals:**
- Onboarding sekolah baru ke platform
- Monitor aktivitas semua sekolah
- Suspend sekolah/kampanye jika ada masalah
- Lihat platform-wide analytics (GMV, aktif sekolah, dll)

**User Journey:**
1. Login via special super admin URL
2. Lihat dashboard: jumlah sekolah aktif, total transaksi, kampanye aktif
3. Onboard sekolah baru (create akun sekolah, set tenant)
4. Review laporan dari sekolah
5. Suspend/reactivate sekolah jika diperlukan

---

## 5. FEATURE REQUIREMENTS

Menggunakan **MoSCoW Method** untuk prioritas:
- **MUST HAVE (P0):** Critical untuk MVP, blocker jika tidak ada
- **SHOULD HAVE (P1):** Important, tapi bisa ditunda post-MVP
- **COULD HAVE (P2):** Nice to have, optional
- **WON'T HAVE:** Out of scope untuk sekarang

---

### 5.1 Authentication & User Management

#### **MUST HAVE (P0)**

**Auth-001: User Registration — Orang Tua/Siswa**
- Login via **Email + Password** (NISN sebagai identifier profil, bukan untuk login)
- Admin sekolah import CSV siswa (nama, NISN, kelas, nama ortu, email ortu, no. HP)
- Sistem kirim **email undangan** ke email orang tua
- Orang tua klik link undangan → set password sendiri
- Email verification required untuk aktivasi akun

**Auth-002: User Registration — Sekolah**
- Admin sekolah didaftarkan oleh EDUFIN Super Admin
- Login dengan Email + Password
- Multi-admin per sekolah dengan custom permissions
- NPSN terdaftar sebagai identifier sekolah

**Auth-003: User Registration — Donatur**
- Register dengan Email + Password
- Google OAuth sebagai alternatif (opsional)
- Guest checkout tersedia (tanpa registrasi, untuk donasi)

**Auth-004: Login System**
- Multi-role login (orang tua/siswa, sekolah, donatur, super admin)
- Session management dengan JWT tokens via Supabase Auth
- "Remember me" functionality
- Logout (clear session)

**Auth-005: Password Management**
- Forgot password (email reset link)
- Password strength requirement (min 8 char, 1 uppercase, 1 number)
- Change password (dalam profile settings)

#### **SHOULD HAVE (P1)**

**Auth-006: Multi-Admin Permission System**
- Admin sekolah dapat tambah admin lain dengan permission berbeda:
  - **Full Admin:** CRUD semua fitur
  - **Finance Only:** Hanya lihat & manage pembayaran
  - **View Only:** Hanya baca laporan
  - **Custom:** Pilih permission secara granular
- Permission audit log

**Auth-007: EDUFIN Super Admin Panel**
- Akses via URL khusus (e.g., `/superadmin`)
- Lihat semua tenant sekolah
- Create/suspend/reactivate akun sekolah
- Impersonate admin sekolah (untuk support)

---

### 5.2 School Onboarding (Multi-Tenant)

#### **MUST HAVE (P0)**

**Onboard-001: EDUFIN Super Admin — Daftarkan Sekolah**
- Input data sekolah: Nama, NPSN, Alamat, Kota, Jenjang (SD/SMP/SMA/SMK)
- Create akun admin sekolah pertama (email + temp password)
- Kirim email welcome + credential ke kepala sekolah
- Tenant terisolasi di database (school_id sebagai tenant identifier)

**Onboard-002: Admin Sekolah — Setup Sekolah**
- Upload logo sekolah
- Set rekening bank untuk pencairan donasi (nama bank, nomor rekening, atas nama)
- Set default nominal SPP per kelas/jenjang
- Configure late fee policy

**Onboard-003: Bulk Import Siswa**
- Upload file CSV/Excel dengan kolom wajib: Nama, NISN, Kelas, Tahun Ajaran, Nama Ortu, Email Ortu, No. HP Ortu
- Preview data sebelum import
- Validasi format (NISN 10 digit, email valid)
- Kirim email undangan massal ke orang tua setelah import
- Progress indicator saat import berlangsung

---

### 5.3 SPP Payment Management

#### **MUST HAVE (P0)**

**Pay-001: View Tagihan SPP**
- Siswa/orang tua lihat tagihan SPP per bulan
- Status: Lunas, Belum Bayar, Terlambat, Cicilan
- Detail: Amount, Due Date, Late Fee (if any)
- History pembayaran sebelumnya

**Pay-002: Payment Methods via Xendit**
- **QRIS** (scan QR, berlaku semua bank/e-wallet)
- **Virtual Account:** BCA, Mandiri, BNI, BRI
- **E-Wallet:** GoPay, OVO, DANA
- **Transfer Manual:** Siswa upload foto bukti transfer → admin verifikasi
- **Cash:** Admin input manual sebagai paid

**Pay-003: Payment Flow (Xendit)**
- Siswa select tagihan yang mau dibayar
- Pilih payment method
- Backend create Xendit invoice/payment request
- Xendit tampilkan payment page atau instruksi VA
- Xendit kirim webhook saat payment sukses
- Auto-update status tagihan ke "Lunas"
- Kirim notifikasi (WhatsApp + in-app)

**Pay-004: Payment Receipt**
- Digital receipt (PDF download)
- Receipt contains: Nama Sekolah, Nama Siswa, NISN, Kelas, Amount, Bulan SPP, Tanggal, Payment method, Transaction ID
- Send receipt via WhatsApp (image/PDF)

**Pay-005: Admin — Tagihan Management**
- Bulk create tagihan SPP untuk semua siswa (per kelas, atau semua)
- Set due date & amount (dapat berbeda per siswa)
- Edit tagihan (before payment)
- Cancel tagihan (jika salah input)

**Pay-006: Admin — Payment Verification**
- Approve/reject manual transfer payment
- View foto bukti transfer yang di-upload siswa
- Mark as paid (for cash payment)
- Input catatan untuk rejected payment

#### **SHOULD HAVE (P1)**

**Pay-007: Payment Reminder via WhatsApp**
- Auto-send WhatsApp reminder 7 hari sebelum due date
- Auto-send WhatsApp reminder 1 hari sebelum due date
- Auto-send WhatsApp notification saat terlambat bayar
- Admin bisa trigger manual blast reminder per kelas/semua siswa

**Pay-008: Late Payment Fee**
- Admin configure late fee policy (fixed atau percentage)
- Auto-calculate late fee saat due date terlewat
- Tampilkan komponen late fee terpisah di tagihan
- Admin bisa waive late fee secara manual

**Pay-009: Bulk Operations**
- Bulk create tagihan untuk semua siswa sekaligus
- Bulk send reminder WhatsApp
- Bulk export payment data (Excel/PDF)

---

### 5.4 Cicilan (Installment) Management

#### **MUST HAVE (P0)**

**Inst-001: Request Cicilan**
- Orang tua/siswa request cicilan untuk tagihan tertentu
- Input: Jumlah periode (2x, 3x, 4x, max 6x)
- Input: Alasan permohonan (optional tapi recommended)
- Submit request ke sekolah untuk approval

**Inst-002: Approve/Reject Cicilan**
- Admin review installment request
- Approve → auto-split tagihan menjadi X periode dengan due date per periode
- Reject → send notifikasi WhatsApp ke orang tua dengan alasan

**Inst-003: Installment Payment**
- Orang tua lihat cicilan per periode
- Bayar per periode (same payment flow as regular SPP via Xendit)
- Track progress (e.g., "Periode 2/4 telah dibayar")

**Inst-004: Installment Status**
- Status: Active, Completed, Defaulted
- Auto-mark as "Defaulted" jika 1 periode terlambat > 30 hari

#### **SHOULD HAVE (P1)**

**Inst-005: Installment Default Handling**
- Grace period: 7 hari setelah due date cicilan
- Auto-send WhatsApp reminder saat mendekati due date cicilan
- Admin notification jika cicilan default

---

### 5.5 Fundraising/Campaign Management

#### **MUST HAVE (P0)**

**Camp-001: Create Campaign**
- Siswa (via orang tua) create campaign dengan:
  - Title
  - Description (kenapa butuh bantuan)
  - Target amount (minimum Rp 100.000, tidak ada maksimum)
  - Campaign duration (min 7 hari, max 90 hari)
  - Category (Buku Pelajaran, Seragam, Study Tour, Biaya Ujian, dll)
- Upload dokumen pendukung (opsional: foto, surat keterangan tidak mampu)

**Camp-002: Campaign Approval Flow**
- Siswa submit campaign → status "Pending"
- **Admin Sekolah** review campaign (single approval — admin sekolah adalah gatekeeper utama)
- Admin approve → status "Approved" (go live di halaman publik)
- Admin reject → status "Rejected" + alasan rejection dikirim via WhatsApp

**Camp-003: Browse Campaigns (Public)**
- Public page: Donatur browse semua approved campaigns dari semua sekolah
- Filter by: Kategori, Sekolah, Jenjang, Progress (% funded)
- Sort by: Terbaru, Paling banyak didukung, Mendekati deadline
- Search by: Nama siswa, judul kampanye, nama sekolah

**Camp-004: Donate to Campaign**
- Donatur pilih campaign
- Input donation amount (min Rp 10.000)
- Pilih metode pembayaran (QRIS/VA/GoPay via Xendit)
- Guest checkout OK (no login required)
- Terima receipt + WhatsApp/email thank you

**Camp-005: Campaign Progress Tracking**
- Real-time progress bar (% funded dari target)
- List donors (anonymous option tersedia)
- Donation history & timeline
- Auto-close campaign saat target tercapai atau expired

**Camp-006: Fund Disbursement**
- Dana terkumpul → masuk ke rekening sekolah (via Xendit disbursement)
- Admin sekolah request disbursement saat campaign selesai
- Mark campaign as "Completed"
- Kirim notifikasi WhatsApp ke siswa & donors

#### **SHOULD HAVE (P1)**

**Camp-007: Campaign Updates dari Siswa**
- Siswa/orang tua post update progress (e.g., "Terima kasih, buku sudah dibeli")
- Upload foto bukti penggunaan dana
- Kirim notifikasi WhatsApp ke semua donors yang sudah donasi

**Camp-008: Anonymous Donation**
- Donatur pilih: Publik (nama ditampilkan) atau Anonim
- Anonim: Tampil sebagai "Donatur Anonim" di halaman kampanye

**Camp-009: EDUFIN Super Admin — Campaign Moderation**
- Super admin bisa suspend kampanye yang terindikasi fraud
- Alert otomatis jika campaign dari sekolah yang di-suspend

#### **COULD HAVE (P2)**

**Camp-010: Campaign Sharing**
- Share campaign link via WhatsApp langsung
- Campaign page optimized untuk social media preview (Open Graph)

---

### 5.6 Admin Dashboard & Reporting

#### **MUST HAVE (P0)**

**Dash-001: Dashboard Overview (Per Sekolah)**
- Summary cards:
  - Total Siswa (aktif)
  - Total Penerimaan SPP bulan ini
  - Outstanding Payments (belum bayar + terlambat)
  - Pending Campaigns (waiting approval)
- Chart: Persentase pembayaran per bulan (bar chart)
- Recent transactions (latest 10)

**Dash-002: Student Management**
- CRUD students:
  - Add student manual (NISN, Nama, Kelas, Tahun Ajaran, Email Ortu, No. HP Ortu)
  - Bulk import via CSV
  - Edit data siswa
  - Deactivate student (lulus/pindah)
  - View student detail (payment history, campaigns, cicilan)
- Export student list (Excel)

**Dash-003: Payment Report**
- Filter by: Date range, Status, Kelas, Payment method
- View: Table (Nama Siswa, NISN, Kelas, Bulan, Amount, Status, Tanggal Bayar)
- Export: Excel/PDF

**Dash-004: Campaign Report**
- View all campaigns milik sekolah ini: Pending, Approved, Rejected, Completed
- Stats: Total terkumpul, Success rate
- Export campaign data

**Dash-005: Transaction History**
- View semua transaksi (SPP + Donations) dari sekolah ini
- Filter by: Date, Type, Status
- Export transaction log

#### **SHOULD HAVE (P1)**

**Dash-006: Financial Summary Report**
- Monthly revenue breakdown (SPP vs Donations)
- Outstanding amount by kelas
- Payment method distribution (QRIS vs VA vs E-wallet vs Cash)
- Export as PDF (printable untuk kepala sekolah)

**Dash-007: WhatsApp Blast**
- Kirim pesan massal ke semua siswa/orang tua
- Target specific kelas
- Template pesan (reminder SPP, pengumuman, dll)

---

### 5.7 EDUFIN Super Admin Dashboard

#### **MUST HAVE (P0)**

**Super-001: Platform Overview Dashboard**
- Total sekolah terdaftar (aktif/suspended)
- Total siswa aktif di semua sekolah
- Platform GMV (total transaksi bulan ini)
- Total kampanye aktif

**Super-002: School Management**
- Daftar semua sekolah (nama, NPSN, kota, jenjang, status)
- Onboard sekolah baru
- Edit data sekolah
- Suspend / Reactivate sekolah
- View detail sekolah (transaksi, siswa, admin)

**Super-003: Platform Moderation**
- View semua kampanye aktif di semua sekolah
- Suspend kampanye yang terindikasi fraud
- View laporan dari pengguna

---

### 5.8 Notifications System

#### **MUST HAVE (P0)**

**Notif-001: WhatsApp Notifications (via Fonnte/Wablas)**
- Konfirmasi pembayaran SPP (ke orang tua)
- Tagihan SPP baru tersedia (ke orang tua)
- Payment reminder 7 hari & 1 hari sebelum due date
- Cicilan request approved/rejected
- Campaign approved/rejected (ke orang tua)
- Donasi diterima (ke orang tua siswa pemilik campaign)
- Receipt donasi (ke donatur)

**Notif-002: In-App Notifications (Bell Icon)**
- Bell icon dengan unread count
- Notification center: List semua notifikasi
- Mark as read/unread
- Delete notification
- Kategori: Info, Success, Warning, Urgent

#### **SHOULD HAVE (P1)**

**Notif-003: Push Notifications (PWA)**
- Browser push notifications
- Opt-in saat install PWA
- Sama dengan konten WhatsApp notifications

**Notif-004: Email Notifications**
- Backup channel jika WhatsApp gagal
- Payment receipt (PDF attachment)
- Email undangan onboarding orang tua baru

---

### 5.9 User Profile & Settings

#### **MUST HAVE (P0)**

**Prof-001: View Profile — Orang Tua/Siswa**
- Profil Siswa: NISN, Nama, Kelas, Nama Ortu, Email, No. HP
- Riwayat pembayaran SPP
- Riwayat kampanye

**Prof-002: View Profile — Admin Sekolah**
- Nama, Email, Jabatan, Sekolah, Permission level
- Manage admin lain (jika Full Admin)

**Prof-003: Edit Profile**
- Update: Nama, Email, No. HP
- Email change requires re-verification
- Tidak bisa edit: NISN (immutable)

**Prof-004: Change Password**
- Enter old password
- Enter new password (dengan strength indicator)
- Confirm new password

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 Technology Stack

#### **Frontend**
- **Framework:** React 18 + TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **State Management:** React Context API + useState + React Query (untuk server state)
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Fetch API (native)
- **PWA:** Vite PWA plugin (service worker, manifest, offline cache)

#### **Backend**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + JWT
- **Storage:** Supabase Storage (file upload: bukti transfer, foto kampanye, logo sekolah)
- **Edge Functions:** Supabase Edge Functions (Deno runtime) — untuk webhook & business logic

#### **Payment Gateway**
- **Provider:** Xendit (pengganti Midtrans)
- **Methods:** QRIS, Virtual Account (BCA, Mandiri, BNI, BRI), E-wallet (GoPay, OVO, DANA), Manual transfer, Cash
- **Integration:** Xendit Invoice API (frontend redirect) + Webhook (backend)
- **Disbursement:** Xendit Disbursement API (pencairan dana kampanye ke rekening sekolah)

#### **WhatsApp Notifications**
- **Provider:** Fonnte atau Wablas (WhatsApp Business API)
- **Trigger:** Server-side via Supabase Edge Functions
- **Templates:** Pesan terstandarisasi per event type

#### **Hosting & Deployment**
- **Frontend:** Vercel
- **Backend:** Supabase (managed)
- **Domain:** Custom domain (e.g., edufin.sch.id)
- **SSL:** Auto SSL via Vercel + Supabase

---

### 6.2 Multi-Tenancy Architecture

```
Architecture: Single Database, Shared Tables dengan school_id

sekolah_1 → school_id: uuid-a
sekolah_2 → school_id: uuid-b
...

Semua table utama (students, bills, campaigns, dll) memiliki kolom school_id
Row Level Security (RLS) Supabase memastikan setiap sekolah hanya bisa akses data mereka sendiri
Super Admin bypass RLS menggunakan service_role key
```

**Tenant Isolation:**
- Supabase RLS policy: `WHERE school_id = auth.jwt() -> 'school_id'`
- Super Admin menggunakan `service_role` key (bypass RLS)
- Setiap JWT token menyertakan `school_id` dan `role` sebagai custom claims

---

### 6.3 Database Schema (Key Tables)

#### **schools (Tenant Master)**
```sql
- id: uuid (PK)
- npsn: string (unique, 8 digits)
- name: string
- address: text
- city: string
- province: string
- level: enum ('sd', 'smp', 'sma', 'smk')
- logo_url: string (nullable)
- bank_name: string
- bank_account_number: string
- bank_account_name: string
- xendit_account_id: string (nullable, for disbursement)
- status: enum ('active', 'suspended')
- created_at: timestamp
```

#### **school_admins**
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- school_id: uuid (FK → schools)
- name: string
- email: string
- role: string
- permissions: jsonb (e.g., {"finance": true, "students": true, "campaigns": true})
- is_super_admin: boolean (default false)
- created_at: timestamp
```

#### **students**
```sql
- id: uuid (PK)
- school_id: uuid (FK → schools)
- user_id: uuid (FK → auth.users, nullable — linked saat orang tua accept invite)
- nisn: string (10 digits)
- name: string
- class: string (e.g., "7A", "10 IPA 1")
- grade: integer (kelas ke berapa)
- academic_year: string (e.g., "2025/2026")
- parent_name: string
- parent_email: string
- parent_phone: string
- address: text
- spp_amount: integer
- status: enum ('aktif', 'nonaktif', 'lulus')
- invite_sent_at: timestamp (nullable)
- invite_accepted_at: timestamp (nullable)
- created_at: timestamp
```

#### **bills**
```sql
- id: uuid (PK)
- school_id: uuid (FK → schools)
- student_id: uuid (FK → students)
- amount: integer
- late_fee: integer (default 0)
- month: string (e.g., "Juni 2026")
- due_date: date
- status: enum ('lunas', 'belum_bayar', 'terlambat', 'cicilan')
- paid_date: timestamp (nullable)
- payment_method: enum ('qris', 'va_bca', 'va_mandiri', 'va_bni', 'va_bri', 'gopay', 'ovo', 'dana', 'transfer', 'tunai')
- xendit_invoice_id: string (nullable)
- xendit_payment_url: string (nullable)
- transfer_proof_url: string (nullable — untuk manual transfer)
- notes: text (nullable)
- created_at: timestamp
```

#### **installments**
```sql
- id: uuid (PK)
- school_id: uuid (FK → schools)
- bill_id: uuid (FK → bills)
- student_id: uuid (FK → students)
- total_periods: integer
- current_period: integer (default 0)
- amount_per_period: integer
- reason: text (nullable)
- status: enum ('pending_approval', 'active', 'completed', 'defaulted', 'rejected')
- rejection_reason: text (nullable)
- created_at: timestamp
```

#### **installment_periods**
```sql
- id: uuid (PK)
- installment_id: uuid (FK → installments)
- period_number: integer
- amount: integer
- due_date: date
- paid_date: timestamp (nullable)
- status: enum ('belum_bayar', 'lunas', 'terlambat')
- xendit_invoice_id: string (nullable)
```

#### **campaigns**
```sql
- id: uuid (PK)
- school_id: uuid (FK → schools)
- student_id: uuid (FK → students)
- title: string
- description: text
- target_amount: integer
- current_amount: integer (default 0)
- category: string
- status: enum ('pending', 'approved', 'rejected', 'completed', 'expired', 'suspended')
- rejection_reason: text (nullable)
- suspension_reason: text (nullable, diisi super admin)
- start_date: date
- end_date: date
- documents: jsonb (array of file URLs)
- created_at: timestamp
- approved_at: timestamp (nullable)
- completed_at: timestamp (nullable)
```

#### **donations**
```sql
- id: uuid (PK)
- campaign_id: uuid (FK → campaigns)
- donor_user_id: uuid (FK → auth.users, nullable for guest)
- donor_name: string
- donor_email: string
- donor_phone: string (nullable)
- amount: integer
- message: text (nullable)
- is_anonymous: boolean (default false)
- payment_status: enum ('pending', 'success', 'failed', 'expired')
- xendit_invoice_id: string (nullable)
- xendit_payment_url: string (nullable)
- created_at: timestamp
```

#### **notifications**
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- school_id: uuid (FK → schools, nullable)
- title: string
- message: text
- type: enum ('info', 'success', 'warning', 'urgent')
- category: enum ('payment', 'campaign', 'installment', 'system')
- read: boolean (default false)
- action_url: string (nullable — deep link ke halaman terkait)
- created_at: timestamp
```

#### **whatsapp_logs**
```sql
- id: uuid (PK)
- recipient_phone: string
- message: text
- event_type: string (e.g., 'payment_reminder', 'payment_success', 'campaign_approved')
- status: enum ('queued', 'sent', 'failed')
- error_message: text (nullable)
- sent_at: timestamp (nullable)
- created_at: timestamp
```

---

### 6.4 API Architecture

**Base:** Supabase REST API + Edge Functions

**Authentication:**
- Bearer token in `Authorization` header
- JWT token dari Supabase Auth (berisi `school_id`, `role`, `permissions` sebagai custom claims)

**Key Edge Functions:**

```
# Payment
POST   /functions/v1/xendit-create-invoice    # Create Xendit invoice untuk SPP/cicilan
POST   /functions/v1/xendit-webhook           # Handle Xendit webhook callback
POST   /functions/v1/xendit-disbursement      # Request pencairan dana kampanye

# WhatsApp
POST   /functions/v1/whatsapp-send            # Send WhatsApp message
POST   /functions/v1/whatsapp-blast           # Bulk WhatsApp blast

# Scheduled Jobs
POST   /functions/v1/payment-reminder-cron    # Daily cron untuk payment reminders
POST   /functions/v1/campaign-expiry-cron     # Daily cron untuk expire campaigns

# Onboarding
POST   /functions/v1/import-students-csv      # Process CSV import & send invites
POST   /functions/v1/send-parent-invite       # Send invite email ke orang tua
```

---

### 6.5 Payment Integration (Xendit)

#### **Flow — SPP Payment:**

1. **Frontend:** User klik "Bayar SPP"
2. **Backend (Edge Function):** Create Xendit Invoice
   ```javascript
   POST https://api.xendit.co/v2/invoices
   {
     "external_id": "BILL-{billId}-{timestamp}",
     "amount": 725000,
     "description": "SPP Ahmad Fauzi - Juni 2026",
     "invoice_duration": 86400,  // 24 jam
     "customer": {
       "given_names": "Ibu Siti",
       "email": "siti@email.com",
       "mobile_number": "+6281234567890"
     },
     "payment_methods": ["QRIS", "BCA", "MANDIRI", "BNI", "BRI", "GOPAY", "OVO", "DANA"]
   }
   ```
3. **Backend:** Simpan `invoice_id` & `invoice_url` ke tabel `bills`
4. **Frontend:** Redirect ke Xendit invoice page (atau embed via iframe)
5. **Xendit:** Kirim webhook saat payment sukses
6. **Backend:** Update bill status ke "Lunas", kirim WhatsApp notifikasi

#### **Flow — Disbursement Kampanye:**

1. Admin sekolah klik "Request Pencairan" di campaign yang selesai
2. Backend create Xendit Disbursement ke rekening sekolah
3. Update campaign status ke "Completed"
4. Kirim WhatsApp notifikasi ke siswa & semua donors

#### **Webhook Verification:**
- Verify `x-callback-token` dari Xendit (secret token)
- Check `status` dari payload
- Update database atomically

---

### 6.6 PWA Configuration

**Service Worker:**
- Cache strategy: Cache-first untuk assets statis
- Network-first untuk API calls
- Background sync untuk actions saat offline

**Manifest:**
- App name: "EDUFIN"
- Short name: "EDUFIN"
- Start URL: `/`
- Display: `standalone`
- Theme color: `#1677FF`
- Icons: 192x192, 512x512

**Offline Capability:**
- Siswa bisa lihat tagihan & riwayat bayar saat offline (dari cache)
- Tidak bisa bayar saat offline (perlu koneksi ke Xendit)
- Show "Mode Offline" indicator

---

## 7. USER EXPERIENCE

### 7.1 Platform Strategy

#### **Siswa/Orang Tua: Mobile PWA (Primary)**
- **Primary Platform:** Mobile PWA (installable, offline-capable, push notifications)
- **Secondary:** Desktop web (responsive)

**Mobile Design Principles:**
- Max container width: 430px
- Base font size: 14px
- Touch-friendly buttons: min 44px height
- Bottom navigation untuk easy thumb reach
- Swipeable cards/modals
- PWA install prompt

#### **Donatur: Mobile Web (Primary)**
- **Primary:** Mobile web (public campaign browsing)
- Tidak perlu install PWA untuk guest checkout
- Optimized untuk share via WhatsApp

#### **Admin Sekolah: Desktop Web (Primary)**
- **Primary:** Desktop web (full-width layout)
- **Secondary:** Tablet (responsive sidebar)
- **Not optimized for:** Mobile

**Desktop Design Principles:**
- Sidebar navigation (fixed, collapsible)
- Multi-column layouts (2-4 columns)
- Data tables dengan sorting & filtering
- Keyboard-friendly

#### **EDUFIN Super Admin: Desktop Web**
- Dedicated super admin UI
- Platform-level dashboard

---

### 7.2 Design System

#### **Color Palette:**
- **Primary Blue:** `#1677FF` (CTA, links, active states)
- **Success Green:** `#52C41A` (lunas, approved, positive)
- **Warning Orange:** `#FD9A16` (pending, belum bayar, alerts)
- **Danger Red:** `#F95654` (terlambat, rejected, errors)
- **Purple:** `#722ED1` (stats, charts, growth)
- **Gray Scale:** `#F5F7FA` (background), `#8C8C8C` (secondary text)

#### **Typography:**
- **Font Family:** Inter (Google Fonts)
- **Base Size:** 14px (mobile), 16px (desktop)
- **Headings:** Bold, 1.5x-2x base size

#### **Components:**
- **Buttons:** Rounded corners (8px), solid color, hover states, loading state
- **Cards:** White bg, subtle shadow (0 2px 8px rgba(0,0,0,0.08)), 12px radius
- **Inputs:** Border (1px #d9d9d9), focus state (blue border), error state (red)
- **Status Badges:** Color-coded, rounded pill shape

---

### 7.3 Localization

#### **Language:**
- **Primary:** Bahasa Indonesia (semua UI teks)
- **Future:** English (untuk donatur internasional)

#### **Regional Settings:**
- **Timezone:** WIB (UTC+7)
- **Date Format:** "7 Juni 2026" atau DD/MM/YYYY
- **Currency:** Rupiah (Rp) — format: `Rp 1.000.000`
- **Number Format:** Dot separator — `1.000.000`

---

### 7.4 Accessibility

**Target:** WCAG 2.1 Level AA

**Key Requirements:**
- Color contrast ratio: 4.5:1 minimum
- Keyboard navigation support
- Screen reader friendly (semantic HTML)
- Alt text untuk semua images
- Error messages jelas dan spesifik
- Form labels properly associated

**Network Performance:**
- Target: 3G compatible (data-light pages)
- Payment flow: 4G minimum recommended
- PWA offline: View-only mode dari cached data

---

## 8. SECURITY & COMPLIANCE

### 8.1 Data Privacy

#### **Compliance:**
- **UU PDP (Indonesia):** Personal data protection law — wajib comply
- **GDPR:** Jika ada donatur internasional

#### **Data Handling:**
- **Minors (< 18 tahun):** Consent via orang tua (implied dalam proses onboarding — email undangan ke orang tua)
- **Retention:** Transaction data: 5 tahun, Personal data: Sampai akun dihapus
- **Right to be Forgotten:** Orang tua bisa request penghapusan data anak

---

### 8.2 Financial Compliance

#### **EDUFIN's Role:**
- **Technology Provider** (bukan payment facilitator)
- Semua pembayaran diproses via **Xendit** (licensed payment gateway OJK)
- EDUFIN tidak menyimpan atau mengelola uang secara langsung
- Dana kampanye ditransfer langsung dari Xendit ke rekening sekolah

---

### 8.3 Security Measures

#### **Infrastructure Security:**
- ✅ SSL/TLS encryption (HTTPS only, enforce di Vercel)
- ✅ Supabase Row Level Security (RLS) — isolasi data per sekolah
- ✅ API rate limiting (Supabase built-in + edge function limits)
- ✅ CORS policy (restrict origins ke domain EDUFIN)

#### **Application Security:**
- ✅ Password hashing (bcrypt via Supabase Auth)
- ✅ JWT token expiration (configurable, default 1 jam access token)
- ✅ Refresh token rotation
- ✅ SQL injection prevention (Supabase PostgREST parameterized queries)
- ✅ XSS protection (React auto-escaping)

#### **Payment Security:**
- ✅ PCI DSS compliance (via Xendit — no card data stored by EDUFIN)
- ✅ Xendit webhook signature verification (`x-callback-token`)
- ✅ Idempotency check (prevent duplicate payment processing)
- ✅ Order ID uniqueness validation

#### **Data Backup:**
- ✅ Daily automated backups (Supabase)
- ✅ Point-in-time recovery (Supabase Pro: 7 hari)
- ✅ Disaster recovery plan

---

## 9. TIMELINE & MILESTONES

**Status:** Ongoing project — no fixed deadline

### 9.1 Development Phases

#### **Phase 1: Foundation — Multi-Tenant Architecture (Current)**
- ✅ Setup project (React + Tailwind + Supabase)
- ✅ Authentication system (register, login, logout)
- ✅ Basic user roles (siswa, sekolah, donatur)
- ✅ Basic dashboard layouts
- [ ] Refactor database schema untuk multi-tenancy (add `school_id` everywhere)
- [ ] Implement Supabase RLS policies per tenant
- [ ] EDUFIN Super Admin panel (basic)
- [ ] School onboarding flow

**Deliverable:** Multi-tenant architecture working, super admin bisa onboard sekolah baru

---

#### **Phase 2: Onboarding & Student Management**
- [ ] Bulk CSV import siswa
- [ ] Email invitation system (orang tua)
- [ ] Multi-admin per sekolah dengan custom permissions
- [ ] Student profile lengkap
- [ ] Admin sekolah CRUD students

**Deliverable:** SDN 3 Malang onboarding selesai dengan semua siswa dan orang tua aktif

---

#### **Phase 3: SPP Payment via Xendit**
- [ ] Xendit integration (Invoice API + Webhook)
- [ ] Tagihan management (admin CRUD)
- [ ] Payment flow (QRIS, VA, E-wallet)
- [ ] Manual transfer flow (upload bukti)
- [ ] Cash payment input (admin)
- [ ] Payment receipt (PDF + WhatsApp)
- [ ] WhatsApp notifications (payment success, reminder)

**Deliverable:** End-to-end SPP payment working dengan Xendit

---

#### **Phase 4: Cicilan & Notifications**
- [ ] Installment request flow
- [ ] Installment approval (admin)
- [ ] Installment payment per periode
- [ ] WhatsApp reminder system (cron-based)
- [ ] In-app notification center
- [ ] PWA push notifications

**Deliverable:** Cicilan feature + full notification system

---

#### **Phase 5: Fundraising Platform**
- [ ] Campaign creation (siswa/orang tua)
- [ ] Campaign approval (admin sekolah)
- [ ] Public campaign browsing (semua sekolah)
- [ ] Donation flow via Xendit
- [ ] Xendit disbursement ke rekening sekolah
- [ ] Campaign progress tracking
- [ ] Campaign updates (foto proof)
- [ ] Super admin moderation tools

**Deliverable:** Full fundraising platform live

---

#### **Phase 6: Reporting & Analytics**
- [ ] Admin dashboard analytics (per sekolah)
- [ ] Payment reports (filter, export Excel/PDF)
- [ ] Campaign reports
- [ ] Financial summary
- [ ] Super admin platform analytics

**Deliverable:** Complete reporting tools

---

#### **Phase 7: PWA & Polish**
- [ ] PWA configuration (service worker, manifest, offline cache)
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] UI/UX refinement
- [ ] Bug fixes
- [ ] Security audit
- [ ] UAT dengan SDN 3 Malang

**Deliverable:** Production-ready PWA

---

#### **Phase 8: Multi-School Expansion (Jawa Timur)**
- [ ] Onboarding toolkit untuk sekolah baru (docs, training video)
- [ ] Self-service onboarding (sekolah bisa daftar sendiri)
- [ ] Scale testing (simulasi 50+ sekolah concurrent)
- [ ] Customer support channel setup

**Deliverable:** Platform ready untuk 50+ sekolah di Jawa Timur

---

### 9.2 Post-Expansion Roadmap

#### **v2.0 — Revenue Model**
- [ ] Define dan implement business model (subscription/platform fee)
- [ ] Billing system untuk sekolah (jika subscription)
- [ ] Advanced analytics untuk super admin

#### **v2.1 — Ecosystem Features**
- [ ] Recurring payment (auto-debit bulanan)
- [ ] Integrasi dengan sistem akademik (nilai, absensi)
- [ ] API untuk sekolah yang mau integrasi dengan sistem existing

#### **v3.0 — National Expansion**
- [ ] Ekspansi ke luar Jawa Timur
- [ ] White-label untuk dinas pendidikan kabupaten/kota
- [ ] Mobile native app (React Native)

---

## 10. RISKS & MITIGATIONS

### 10.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Xendit API changes/downtime** | High | Low | Monitor Xendit status page; fallback ke manual transfer sementara; test di sandbox |
| **Supabase RLS misconfiguration** | High | Medium | Comprehensive testing per role; security audit sebelum launch |
| **WhatsApp API blocked/limited** | Medium | Medium | Backup via email; gunakan Fonnte (resmi) untuk avoid spam |
| **PWA not supported** | Low | Low | Fallback ke mobile web biasa tanpa install prompt |
| **CSV import data corrupt** | Medium | Medium | Validasi ketat saat import; preview sebelum confirm; rollback capability |
| **Supabase downtime** | High | Low | LocalStorage cache untuk view-only; monitor uptime |

---

### 10.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Low school adoption** | High | Medium | Start dengan SDN 3 Malang sebagai success story; testimonial; demo hands-on |
| **Orang tua resistance** | Medium | Medium | UI super simple; training di sekolah; WA support group per sekolah |
| **Donor trust** | High | Medium | Transparency penuh (campaign updates, foto bukti); school verification badge |
| **Admin sekolah tidak mau ganti dari Excel** | High | High | Import dari Excel existing; migration assistance; tunjukkan time-saving |
| **Regulatory issue (OJK)** | High | Low | EDUFIN sebagai tech provider; Xendit yang licensed; consult legal expert |

---

### 10.3 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Campaign fraud** | High | Low | School approval required; document verification; super admin moderation |
| **Disbursement ke rekening salah** | High | Low | Double-confirm rekening sekolah saat setup; admin re-enter rekening saat request disbursement |
| **Data breach** | High | Very Low | RLS ketat; encrypt sensitive data; regular audit; responsible disclosure policy |
| **Scale issues saat 50+ sekolah** | Medium | Medium | Load testing sebelum ekspansi; optimize query dengan index; cache heavy queries |

---

## 11. APPENDIX

### 11.1 Glossary

- **SPP:** Sumbangan Pembinaan Pendidikan (monthly school fee)
- **NISN:** Nomor Induk Siswa Nasional (national student ID, 10 digits)
- **NPSN:** Nomor Pokok Sekolah Nasional (national school ID, 8 digits)
- **QRIS:** Quick Response Code Indonesian Standard (unified QR payment)
- **VA:** Virtual Account (bank transfer via unique virtual account number)
- **Cicilan:** Installment payment plan
- **Kampanye:** Fundraising campaign
- **Donatur:** Donor
- **Tenant:** Satu sekolah dalam arsitektur multi-tenant
- **PWA:** Progressive Web App (web app yang bisa di-install di smartphone)
- **RLS:** Row Level Security (Supabase feature untuk isolasi data per user/tenant)
- **Xendit:** Payment gateway Indonesia (pengganti Midtrans dalam arsitektur EDUFIN v2)

### 11.2 Key Decisions Log (dari Grill-Me Session — 7 Juni 2026)

| Keputusan | Pilihan |
|-----------|---------|
| Target ekspansi 12 bulan | 50+ sekolah di Jawa Timur |
| Jenjang target | SD + SMP + SMA/SMK |
| Business model | Gratis semua (fokus adoption dulu) |
| Payment gateway | **Xendit** (ganti dari Midtrans) |
| Payment methods | QRIS, VA (BCA/Mandiri/BNI/BRI), GoPay/OVO/DANA, Transfer Manual, Cash |
| Admin per sekolah | Multi-admin dengan custom permissions |
| Campaign approval | Single approval — admin sekolah |
| Dana kampanye | Masuk rekening sekolah (sekolah salurkan ke siswa) |
| Student registration | Admin import CSV → sistem kirim email undangan ke orang tua |
| Student login | Email + Password (NISN sebagai identifier profil, bukan login) |
| Donatur login | Email + Password atau Google OAuth atau Guest checkout |
| Platform siswa | **PWA** (Progressive Web App) |
| Notifikasi | **WhatsApp** (primary) + In-app + PWA push |
| Super Admin | Ada — EDUFIN tim bisa manage semua sekolah |
| Timeline | Ongoing (no fixed deadline) |
| Project status | Hybrid — akademik dengan roadmap ke startup |

### 11.3 References

- **CONTEXT.md:** Domain vocabulary & architecture decisions
- **DESIGN_SYSTEM.md:** UI component specifications
- **TECH_STACK.md:** Detailed technology decisions
- **Xendit Documentation:** https://docs.xendit.co
- **Supabase Documentation:** https://supabase.com/docs
- **Fonnte Documentation:** https://fonnte.com/docs (WhatsApp API)

### 11.4 Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-05-31 | Product Team | Initial PRD |
| 2.0 | 2026-06-07 | Product Team | Major update: Xendit, PWA, multi-tenant, WhatsApp notif, multi-admin, EDUFIN super admin, expansion ke 50+ sekolah Jawa Timur |

---

**END OF DOCUMENT**

---

## 📌 Next Steps

1. ✅ **PRD v2.0 Complete** — dokumen ini
2. ⏭️ **Refactor ke Multi-Tenant:** Tambahkan `school_id` ke semua tabel + RLS policies
3. ⏭️ **Migrasi ke Xendit:** Ganti semua Midtrans integration ke Xendit
4. ⏭️ **Implement WhatsApp:** Integrasi Fonnte/Wablas untuk notifikasi
5. ⏭️ **PWA Setup:** Configure Vite PWA plugin

**Questions or feedback?** Contact: product@edufin.sch.id
