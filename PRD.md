# Product Requirements Document (PRD)
# EDUFIN - Platform Manajemen Keuangan Pendidikan

**Version:** 1.0  
**Last Updated:** 31 Mei 2025  
**Status:** Draft  
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

---

## 1. EXECUTIVE SUMMARY

### 1.1 Vision

**EDUFIN** adalah platform manajemen keuangan pendidikan yang bertujuan menjadi **platform #1 untuk manajemen SPP di Indonesia**. Dimulai dengan implementasi di **SDN 3 Malang** sebagai pilot school, EDUFIN menghubungkan tiga stakeholder utama: **Siswa/Orang Tua**, **Sekolah**, dan **Donatur** dalam satu ekosistem pembayaran dan fundraising yang terintegrasi.

### 1.2 Current Scope

- **School:** SDN 3 Malang (single tenant)
- **Students:** 100-500 siswa
- **Users:** 3 roles (Admin Sekolah, Siswa/Orang Tua, Donatur)
- **Core Function:** SPP payment tracking + Fundraising platform

### 1.3 Strategic Goals

1. **Primary:** Menyelesaikan masalah tracking pembayaran SPP yang manual dan ribet
2. **Secondary:** Menyediakan platform fundraising untuk siswa yang membutuhkan bantuan finansial
3. **Long-term:** Menjadi standar platform keuangan sekolah di Indonesia

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

### 2.2 Opportunity

Dengan digitalisasi proses pembayaran SPP dan fundraising, EDUFIN dapat:
- ✅ Mengurangi manual work admin sekolah hingga 80%
- ✅ Meningkatkan payment collection rate (on-time payment)
- ✅ Memberikan transparency penuh ke semua stakeholder
- ✅ Memfasilitasi akses pendidikan melalui fundraising

---

## 3. GOALS & SUCCESS METRICS

### 3.1 Business Goals

**Year 1 (SDN 3 Malang):**
- 📊 **Adoption Rate:** 80% siswa terdaftar & aktif menggunakan platform
- 💰 **Payment Collection:** 90% pembayaran SPP on-time (sebelum jatuh tempo)
- 🎯 **Campaign Success:** 50% kampanye fundraising mencapai target
- ⏱️ **Admin Time Saved:** 70% reduction in manual recording time

**Platform Metrics:**
- 📈 **Monthly Active Users (MAU):** 300+ (siswa + orang tua + admin)
- 💳 **Transaction Volume:** Rp 300-500 juta/bulan (SPP + donations)
- 🎓 **Campaign Completion Rate:** 60% kampanye selesai dalam 30 hari

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
- 🔒 PCI DSS compliance (via Midtrans)
- 📧 Email verification for all users

### 3.3 User Satisfaction Metrics

- ⭐ Net Promoter Score (NPS): > 50
- 😊 User satisfaction: > 4.0/5.0
- 📱 Mobile usability score: > 90/100 (Google PageSpeed)

---

## 4. USER PERSONAS

### 4.1 Persona 1: Siswa/Orang Tua

**Profile:**
- **Name:** Ibu Siti (Orang Tua) / Ahmad (Siswa SMP)
- **Age:** Orang tua: 35-45 tahun, Siswa: 13-15 tahun
- **Device:** Smartphone Android (mayoritas), iOS (sebagian)
- **Tech Literacy:** Medium (familiar dengan e-wallet, social media)
- **Internet:** 4G/WiFi, kadang 3G

**Goals:**
- Bayar SPP dengan mudah dan cepat
- Lihat status pembayaran real-time
- Terima reminder sebelum jatuh tempo
- Request cicilan jika kesulitan finansial

**Pain Points:**
- Harus datang ke sekolah untuk bayar
- Lupa jatuh tempo → kena denda
- Tidak ada bukti pembayaran digital
- Sulit komunikasi dengan sekolah

**User Journey:**
1. Login via mobile app/web
2. Lihat tagihan SPP bulan ini
3. Pilih metode pembayaran (QRIS/VA)
4. Bayar & terima notifikasi sukses
5. Download bukti pembayaran PDF

---

### 4.2 Persona 2: Admin Sekolah

**Profile:**
- **Name:** Ibu Dewi (Bendahara Sekolah)
- **Age:** 40-55 tahun
- **Device:** Laptop/Desktop (primary), Smartphone (secondary)
- **Tech Literacy:** Medium (familiar with Excel, email)
- **Work Hours:** 07:00 - 15:00 WIB

**Goals:**
- Track semua pembayaran SPP siswa
- Generate laporan keuangan bulanan
- Approve/reject kampanye fundraising
- Kirim reminder otomatis ke siswa yang belum bayar

**Pain Points:**
- Manual recording di Excel prone to error
- Sulit rekonsiliasi bank transfer vs cash
- Harus cek payment gateway 1-by-1
- Laporan manual memakan waktu lama

**User Journey:**
1. Login via desktop
2. Lihat dashboard: total penerimaan, outstanding payments
3. Approve kampanye fundraising dari siswa
4. Export laporan keuangan bulanan
5. Kirim notifikasi reminder ke siswa

---

### 4.3 Persona 3: Donatur

**Profile:**
- **Name:** Pak Budi (Alumni / Masyarakat Umum)
- **Age:** 25-50 tahun
- **Device:** Smartphone (mobile-first)
- **Tech Literacy:** Medium-High
- **Motivation:** Charity, membantu pendidikan

**Goals:**
- Temukan kampanye siswa yang butuh bantuan
- Donasi dengan mudah dan aman
- Track penggunaan donasi (transparency)
- Terima update perkembangan kampanye

**Pain Points:**
- Tidak tahu siswa mana yang butuh bantuan
- Tidak percaya dana terpakai dengan benar
- Proses donasi ribet
- Tidak ada update setelah donasi

**User Journey:**
1. Browse kampanye fundraising (public page)
2. Pilih kampanye yang ingin didukung
3. Donasi via QRIS/VA (guest checkout OK)
4. Terima konfirmasi donasi + receipt
5. Dapat update saat kampanye selesai

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

**Auth-001: User Registration**
- **Siswa:** Register dengan NISN + Email + Password
- **Sekolah:** Register dengan NPSN + Credential (pre-created account)
- **Donatur:** Register dengan Email + Password (atau guest checkout)
- Email verification required untuk aktivasi akun

**Auth-002: Login System**
- Multi-role login (siswa, sekolah, donatur)
- Session management dengan JWT tokens
- "Remember me" functionality
- Logout (clear session)

**Auth-003: Password Management**
- Forgot password (email reset link)
- Password strength requirement (min 8 char, 1 uppercase, 1 number)
- Change password (dalam profile settings)

#### **SHOULD HAVE (P1)**

**Auth-004: OAuth Integration**
- Google OAuth untuk donatur
- Facebook OAuth (optional)

**Auth-005: Two-Factor Authentication (2FA)**
- SMS OTP untuk transaksi besar (> Rp 1 juta)
- Email OTP sebagai alternatif

---

### 5.2 SPP Payment Management

#### **MUST HAVE (P0)**

**Pay-001: View Tagihan SPP**
- Siswa lihat tagihan SPP per bulan
- Status: Lunas, Belum Bayar, Terlambat, Cicilan
- Detail: Amount, Due Date, Late Fee (if any)
- History pembayaran sebelumnya

**Pay-002: Payment Methods**
- QRIS (via Midtrans)
- Virtual Account BCA
- Virtual Account Mandiri
- Manual transfer bank (input bukti transfer, pending approval)
- Cash payment (input by admin)

**Pay-003: Payment Flow**
- Select tagihan yang mau dibayar
- Choose payment method
- Redirect to payment gateway (QRIS/VA)
- Payment confirmation webhook
- Auto-update status pembayaran
- Send notification (email + in-app)

**Pay-004: Payment Receipt**
- Digital receipt (PDF download)
- Receipt contains: School name, Student name, Amount, Date, Payment method, Transaction ID
- Send receipt via email

**Pay-005: Admin - Tagihan Management**
- Create tagihan SPP untuk siswa (bulk/individual)
- Set due date & amount per siswa
- Edit tagihan (before payment)
- Cancel tagihan (jika salah input)

**Pay-006: Admin - Payment Verification**
- Approve/reject manual transfer payment
- View payment proof uploaded by student
- Mark as paid (for cash payment)

#### **SHOULD HAVE (P1)**

**Pay-007: Payment Reminder**
- Auto email reminder 7 hari sebelum due date
- Auto email reminder 1 hari sebelum due date
- Auto email notification saat terlambat bayar

**Pay-008: Late Payment Fee**
- Auto-calculate late fee (configurable by admin)
- Add late fee to outstanding amount
- Waive late fee (admin override)

**Pay-009: Bulk Operations**
- Bulk create tagihan untuk semua siswa
- Bulk send reminder
- Bulk export payment data

#### **COULD HAVE (P2)**

**Pay-010: Recurring Payment**
- Auto-generate tagihan SPP setiap bulan
- Recurring payment setup (auto-debit)

**Pay-011: Payment Plan Customization**
- Custom amount per siswa (e.g., beasiswa siswa bayar lebih rendah)
- Multi-tier SPP (based on class/grade)

---

### 5.3 Cicilan (Installment) Management

#### **MUST HAVE (P0)**

**Inst-001: Request Cicilan**
- Siswa request cicilan untuk tagihan tertentu
- Input: Number of periods (2x, 3x, 4x, max 6x)
- Input: Reason (optional)
- Submit request to school for approval

**Inst-002: Approve/Reject Cicilan**
- Admin review installment request
- Approve → auto-split tagihan menjadi X periods
- Reject → send notification dengan reason

**Inst-003: Installment Payment**
- Siswa lihat cicilan per periode
- Bayar per periode (same payment flow as regular SPP)
- Track progress (e.g., "Periode 2/4 telah dibayar")

**Inst-004: Installment Status**
- Status: Active, Completed, Defaulted
- Auto-mark as "Defaulted" jika 1 periode terlambat > 30 hari

#### **SHOULD HAVE (P1)**

**Inst-005: Installment Fee**
- Admin configurable: Fixed fee atau percentage
- Default: No fee (for MVP)

**Inst-006: Installment Default Handling**
- Grace period: 7 hari setelah due date
- Auto-send reminder saat mendekati due date
- Convert kembali ke full payment jika default

---

### 5.4 Fundraising/Campaign Management

#### **MUST HAVE (P0)**

**Camp-001: Create Campaign**
- Siswa create campaign dengan:
  - Title
  - Description (why need help)
  - Target amount
  - Campaign duration (default: 30 hari)
  - Category (e.g., Buku Pelajaran, Seragam, Study Tour)
- Upload supporting document (optional: surat keterangan tidak mampu)

**Camp-002: Campaign Approval Flow**
- Siswa submit campaign → status "Pending"
- Admin review campaign
- Admin approve → status "Approved" (go live)
- Admin reject → status "Rejected" + rejection reason

**Camp-003: Browse Campaigns**
- Public page: Donatur browse semua approved campaigns
- Filter by: Category, Target amount, Progress
- Sort by: Newest, Most funded, Urgent (ending soon)
- Search by student name or campaign title

**Camp-004: Donate to Campaign**
- Donatur pilih campaign
- Input donation amount (min Rp 10.000)
- Choose payment method (QRIS/VA)
- Complete payment
- Terima receipt + thank you email

**Camp-005: Campaign Progress Tracking**
- Real-time progress bar (% funded)
- List of donors (anonymous option available)
- Donation history & timeline
- Auto-close campaign when target reached

**Camp-006: Fund Disbursement**
- Admin request disbursement saat campaign selesai
- Transfer ke rekening sekolah
- Mark campaign as "Completed"
- Send notification ke siswa & donors

#### **SHOULD HAVE (P1)**

**Camp-007: Campaign Updates**
- Siswa post update (e.g., "Terima kasih, buku sudah dibeli")
- Upload photo proof (e.g., foto buku yang dibeli)
- Send notification ke semua donors

**Camp-008: Donation Receipt & Tax Deduction**
- Official donation receipt (for tax deduction)
- Include: Donor name, Amount, School info, Tax ID

**Camp-009: Anonymous Donation**
- Donatur pilih: Public (nama ditampilkan) atau Anonymous
- Anonymous: Tampil sebagai "Donatur Anonim"

#### **COULD HAVE (P2)**

**Camp-010: Recurring Donation**
- Monthly recurring donation to specific campaign
- Auto-debit setup

**Camp-011: Campaign Sharing**
- Share campaign link via WhatsApp, Facebook, Twitter
- Campaign page optimized for social media preview

---

### 5.5 Admin Dashboard & Reporting

#### **MUST HAVE (P0)**

**Dash-001: Dashboard Overview**
- Summary cards:
  - Total Siswa (aktif, non-aktif)
  - Total Penerimaan SPP (bulan ini)
  - Outstanding Payments (belum bayar + terlambat)
  - Pending Campaigns (waiting approval)
- Chart: Persentase pembayaran per bulan (bar chart)
- Recent transactions (latest 10)

**Dash-002: Student Management**
- CRUD students:
  - Add student (NISN, Name, Class, Email, Phone, Parent info, SPP amount)
  - Edit student info
  - Deactivate student (graduated/pindah)
  - View student detail (payment history, campaigns)
- Bulk import students (CSV/Excel upload)
- Export student list (Excel)

**Dash-003: Payment Report**
- Filter by: Date range, Status, Class, Payment method
- View: Table view (student name, amount, status, date)
- Export: Excel/PDF

**Dash-004: Campaign Report**
- View all campaigns: Pending, Approved, Rejected, Completed
- Stats: Total raised, Success rate
- Export campaign data

**Dash-005: Transaction History**
- View all transactions (SPP + Donations)
- Filter by: Date, Type, Status
- Export transaction log

#### **SHOULD HAVE (P1)**

**Dash-006: Financial Summary Report**
- Monthly revenue breakdown (SPP vs Donations)
- Outstanding amount by class
- Payment method distribution (QRIS vs VA vs Cash)
- Export as PDF (printable report)

**Dash-007: Analytics Dashboard**
- Payment collection rate trend (month-over-month)
- Late payment trend
- Campaign conversion rate
- Donor retention rate

#### **COULD HAVE (P2)**

**Dash-008: Notifications Management**
- Bulk send announcement to all students
- Target specific class
- Schedule notification (send later)

**Dash-009: School Profile Settings**
- Edit school info (name, address, contact)
- Bank account settings
- Upload school logo
- Configure SPP amount default

---

### 5.6 Notifications System

#### **MUST HAVE (P0)**

**Notif-001: Email Notifications**
- Payment confirmation (siswa)
- Payment received (admin)
- Campaign approved/rejected (siswa)
- New donation received (siswa + admin)
- Installment request approved/rejected (siswa)

**Notif-002: In-App Notifications**
- Bell icon with unread count
- Notification center: List all notifications
- Mark as read/unread
- Delete notification

#### **SHOULD HAVE (P1)**

**Notif-003: Payment Reminders**
- Auto-send email 7 days before due date
- Auto-send email 1 day before due date
- Auto-send email when overdue

**Notif-004: WhatsApp Notifications (via API)**
- Send receipt via WhatsApp
- Send reminder via WhatsApp
- Requires WhatsApp Business API integration

#### **COULD HAVE (P2)**

**Notif-005: Push Notifications (PWA)**
- Browser push notifications
- Mobile app push (jika ada native app)

---

### 5.7 User Profile & Settings

#### **MUST HAVE (P0)**

**Prof-001: View Profile**
- Siswa: NISN, Name, Class, Email, Phone, Parent info
- Admin: Name, Email, School info
- Donatur: Name, Email, Total donations

**Prof-002: Edit Profile**
- Update: Name, Email, Phone
- Cannot edit: NISN (immutable)
- Email change requires re-verification

**Prof-003: Change Password**
- Enter old password
- Enter new password (with strength indicator)
- Confirm new password

#### **SHOULD HAVE (P1)**

**Prof-004: Upload Avatar**
- Upload profile photo
- Crop/resize image
- Default: Generated initials avatar

**Prof-005: Notification Preferences**
- Toggle: Email notifications ON/OFF
- Toggle: In-app notifications ON/OFF
- Select notification types (payment, campaign, etc.)

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 Technology Stack

#### **Frontend**
- **Framework:** React 18 + TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **State Management:** React Context API + useState
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Fetch API (native)

#### **Backend**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + JWT
- **Storage:** Supabase Storage (for file uploads)
- **Edge Functions:** Supabase Edge Functions (Deno runtime)
- **Fallback:** LocalStorage (offline mode)

#### **Payment Gateway**
- **Provider:** Midtrans
- **Methods:** QRIS, Virtual Account (BCA, Mandiri)
- **Integration:** Snap.js (frontend) + Server-side webhook

#### **Email Service**
- **Provider:** Supabase (built-in email) atau SendGrid
- **Templates:** HTML email templates

#### **Hosting & Deployment**
- **Frontend:** Vercel / Netlify
- **Backend:** Supabase (managed)
- **Domain:** Custom domain (e.g., edufin.sch.id)
- **SSL:** Auto SSL via hosting provider

---

### 6.2 Database Schema (Key Tables)

#### **users**
```sql
- id: uuid (PK)
- email: string (unique)
- password_hash: string
- role: enum ('siswa', 'sekolah', 'donatur')
- verified: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### **students**
```sql
- id: uuid (PK)
- user_id: uuid (FK → users)
- nisn: string (unique, 10 digits)
- name: string
- class: string
- phone: string
- parent_name: string
- parent_phone: string
- address: text
- spp_amount: integer (default SPP amount)
- status: enum ('aktif', 'nonaktif')
- created_at: timestamp
```

#### **bills**
```sql
- id: uuid (PK)
- student_id: uuid (FK → students)
- amount: integer
- month: string (e.g., "Mei 2025")
- due_date: date
- status: enum ('lunas', 'belum_bayar', 'terlambat', 'cicilan')
- paid_date: timestamp (nullable)
- payment_method: enum ('qris', 'va_bca', 'va_mandiri', 'transfer', 'tunai')
- transaction_id: string (nullable, from payment gateway)
- created_at: timestamp
```

#### **installments**
```sql
- id: uuid (PK)
- bill_id: uuid (FK → bills)
- total_periods: integer
- current_period: integer
- amount_per_period: integer
- next_due_date: date
- status: enum ('active', 'completed', 'defaulted')
- created_at: timestamp
```

#### **campaigns**
```sql
- id: uuid (PK)
- student_id: uuid (FK → students)
- title: string
- description: text
- target_amount: integer
- current_amount: integer (default 0)
- category: string
- status: enum ('pending', 'approved', 'rejected', 'completed', 'cancelled')
- rejection_reason: text (nullable)
- start_date: date
- end_date: date
- created_at: timestamp
- approved_at: timestamp (nullable)
```

#### **donations**
```sql
- id: uuid (PK)
- campaign_id: uuid (FK → campaigns)
- donor_id: uuid (FK → users, nullable for guest)
- donor_name: string
- amount: integer
- message: text (nullable)
- is_anonymous: boolean
- payment_status: enum ('pending', 'success', 'failed')
- transaction_id: string (nullable)
- created_at: timestamp
```

#### **notifications**
```sql
- id: uuid (PK)
- user_id: uuid (FK → users)
- title: string
- message: text
- type: enum ('info', 'success', 'warning', 'urgent')
- read: boolean (default false)
- created_at: timestamp
```

#### **transactions**
```sql
- id: uuid (PK)
- type: enum ('spp_payment', 'donation', 'installment_payment')
- related_id: uuid (FK → bills or donations)
- amount: integer
- status: enum ('pending', 'success', 'failed')
- payment_method: string
- transaction_id: string (from payment gateway)
- created_at: timestamp
```

---

### 6.3 API Architecture

#### **REST API Structure**

**Base URL:** `https://api.edufin.sch.id/v1` (atau Supabase URL)

**Authentication:**
- Bearer token in `Authorization` header
- JWT token from Supabase Auth

**Key Endpoints:**

```
# Authentication
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password

# Students (Admin only)
GET    /students
POST   /students
GET    /students/:id
PUT    /students/:id
DELETE /students/:id

# Bills
GET    /bills                    # List all bills (admin) or my bills (student)
POST   /bills                    # Create bill (admin)
GET    /bills/:id
PUT    /bills/:id
DELETE /bills/:id

# Payments
POST   /payments/initiate        # Initiate payment (returns payment URL)
POST   /payments/webhook         # Midtrans webhook callback
GET    /payments/:id/receipt     # Download receipt PDF

# Installments
POST   /installments/request     # Student request installment
PUT    /installments/:id/approve # Admin approve installment
PUT    /installments/:id/reject  # Admin reject installment

# Campaigns
GET    /campaigns                # List campaigns (public or admin view)
POST   /campaigns                # Create campaign (student)
GET    /campaigns/:id
PUT    /campaigns/:id/approve    # Admin approve
PUT    /campaigns/:id/reject     # Admin reject

# Donations
POST   /donations                # Make donation
GET    /donations/campaign/:id   # List donations for campaign

# Reports
GET    /reports/payments         # Payment report (admin)
GET    /reports/campaigns        # Campaign report (admin)
GET    /reports/financial        # Financial summary (admin)

# Notifications
GET    /notifications            # Get my notifications
PUT    /notifications/:id/read   # Mark as read
DELETE /notifications/:id
```

---

### 6.4 Payment Integration (Midtrans)

#### **Flow:**

1. **Frontend:** User klik "Bayar"
2. **Backend:** Create transaction di Midtrans
   ```javascript
   POST https://app.sandbox.midtrans.com/snap/v1/transactions
   {
     "transaction_details": {
       "order_id": "BILL-001-20250531",
       "gross_amount": 725000
     },
     "customer_details": {
       "first_name": "Ahmad Fauzi",
       "email": "ahmad@example.com",
       "phone": "081234567890"
     }
   }
   ```
3. **Backend:** Return `snap_token` to frontend
4. **Frontend:** Show Midtrans Snap popup
   ```javascript
   window.snap.pay(snapToken, {
     onSuccess: (result) => { /* update status */ },
     onPending: (result) => { /* wait for payment */ },
     onError: (result) => { /* handle error */ },
     onClose: () => { /* user closed popup */ }
   })
   ```
5. **Midtrans:** Send webhook to backend when payment success
6. **Backend:** Update bill status to "lunas"
7. **Backend:** Send notification to student & admin

#### **Webhook Verification:**
- Verify signature hash dari Midtrans
- Check transaction status
- Update database atomically

---

### 6.5 LocalStorage Fallback Strategy

#### **When to Use LocalStorage:**
- User offline (no internet connection)
- Supabase unavailable (downtime)
- Demo mode (no database setup)

#### **What to Store:**
- User session (JWT token)
- Cached bills & payment history
- Draft campaign (before submit)
- Notification history

#### **Sync Strategy:**
- On reconnect: Sync local changes to Supabase
- Conflict resolution: Server wins (last write wins)
- Show "Offline Mode" indicator in UI

---

## 7. USER EXPERIENCE

### 7.1 Platform Strategy

#### **Siswa/Donatur: Mobile-First**
- **Primary:** Mobile web (responsive)
- **Secondary:** Desktop web (same responsive design)
- **Future:** PWA (installable, offline-capable)

**Mobile Design Principles:**
- Max container width: 430px
- Base font size: 14px
- Touch-friendly buttons: min 44px height
- Bottom navigation for easy thumb reach
- Swipeable cards/modals

#### **Admin Sekolah: Desktop-First**
- **Primary:** Desktop web (full-width layout)
- **Secondary:** Tablet (responsive sidebar)
- **Not optimized for:** Mobile (admin use desktop)

**Desktop Design Principles:**
- Sidebar navigation (fixed)
- Multi-column layouts (2-4 columns)
- Data tables for large datasets
- Keyboard shortcuts (future enhancement)

---

### 7.2 Design System

#### **Color Palette:**
- **Primary Blue:** `#1677FF` (CTA, links, active states)
- **Success Green:** `#52C41A` (lunas, approved, positive actions)
- **Warning Orange:** `#FD9A16` (pending, belum bayar, alerts)
- **Danger Red:** `#F95654` (terlambat, rejected, errors)
- **Purple:** `#722ED1` (stats, charts, growth indicators)
- **Gray Scale:** `#F5F7FA` (background), `#8C8C8C` (text secondary)

#### **Typography:**
- **Font Family:** System font stack (sans-serif)
- **Base Size:** 14px (mobile), 16px (desktop)
- **Headings:** Bold, 1.5x-2x base size
- **Body:** Regular, 14-16px

#### **Components:**
- **Buttons:** Rounded corners (8px), solid color, hover effects
- **Cards:** White background, subtle shadow, 12px border radius
- **Inputs:** Border, focus state, error state
- **Status Badges:** Color-coded, rounded pill shape

---

### 7.3 Localization

#### **Language:**
- **Primary:** Bahasa Indonesia
- **Future:** English (for international donors)

#### **Regional Settings:**
- **Timezone:** WIB (UTC+7)
- **Date Format:** DD/MM/YYYY atau "31 Mei 2025"
- **Currency:** Rupiah (Rp) dengan format: `Rp 1.000.000`
- **Number Format:** Dot separator untuk ribuan: `1.000.000`

---

### 7.4 Accessibility

#### **Target:** WCAG 2.1 Level AA (recommended standard)

**Key Requirements:**
- Color contrast ratio: 4.5:1 minimum
- Keyboard navigation support
- Screen reader friendly (semantic HTML)
- Alt text for images
- Error messages clear and specific
- Form labels properly associated

#### **Performance:**
- **Target:** 3G network compatibility
- **Minimum:** 4G recommended for payment flow
- **Offline:** View-only mode for cached data

---

## 8. SECURITY & COMPLIANCE

### 8.1 Data Privacy

#### **Compliance:**
- **UU PDP (Indonesia):** Personal data protection law
- **GDPR (if applicable):** For international donors
- **Internal Policy:** Minimal data collection, clear consent

#### **Data Handling:**
- **Minors (< 18 years):** Parental/school consent implied via school enrollment
- **Retention:** Transaction data: 5 years, Personal data: Until account deletion
- **Right to be Forgotten:** User can request data deletion (GDPR compliance)

---

### 8.2 Financial Compliance

#### **EDUFIN's Role:**
- **Technology Provider** (not payment facilitator)
- All payments processed via **Midtrans** (licensed payment gateway)
- No direct money handling by EDUFIN platform

#### **KYC Requirements:**

**Sekolah:**
- ✅ NPSN verification
- ✅ Bank account verification (for disbursement)
- ✅ Principal/admin identity verification

**Siswa:**
- ✅ NISN verification (against school records)
- ✅ Email verification
- ❌ No ID card required (minor)

**Donatur:**
- ✅ Email verification
- ❌ No KYC for donations < Rp 1 juta
- ✅ Phone verification for donations > Rp 1 juta (optional)

---

### 8.3 Security Measures

#### **Infrastructure Security:**
- ✅ SSL/TLS encryption (HTTPS only)
- ✅ Supabase Row Level Security (RLS) enabled
- ✅ API rate limiting (prevent DDoS)
- ✅ CORS policy (restrict origins)

#### **Application Security:**
- ✅ Password hashing (bcrypt via Supabase Auth)
- ✅ JWT token expiration (24 hours)
- ✅ SQL injection prevention (Supabase ORM)
- ✅ XSS protection (React escaping)
- ✅ CSRF tokens (for sensitive actions)

#### **Payment Security:**
- ✅ PCI DSS compliance (via Midtrans)
- ✅ No card data stored locally
- ✅ Payment webhook signature verification
- ✅ Transaction ID uniqueness validation

#### **Data Backup:**
- ✅ Daily automated backups (Supabase)
- ✅ Point-in-time recovery (7 days retention)
- ✅ Disaster recovery plan (restore from backup)

---

## 9. TIMELINE & MILESTONES

### 9.1 MVP Development Phases

**Status:** Flexible timeline (no fixed deadline)

#### **Phase 1: Foundation (Weeks 1-4)**
- ✅ Setup project structure (React + Tailwind + Supabase)
- ✅ Authentication system (register, login, logout)
- ✅ User roles implementation (siswa, sekolah, donatur)
- ✅ Basic dashboard layouts (mobile & desktop)
- ✅ Database schema design & implementation

**Deliverable:** Working auth system + empty dashboards

---

#### **Phase 2: SPP Payment Core (Weeks 5-8)**
- [ ] Tagihan management (CRUD by admin)
- [ ] View tagihan (student side)
- [ ] Midtrans integration (QRIS + VA)
- [ ] Payment flow (initiate → pay → confirm)
- [ ] Payment history & receipt

**Deliverable:** End-to-end SPP payment working

---

#### **Phase 3: Cicilan & Notifications (Weeks 9-10)**
- [ ] Installment request flow
- [ ] Installment approval (admin)
- [ ] Installment payment tracking
- [ ] Email notification system
- [ ] In-app notifications

**Deliverable:** Installment feature + notification system

---

#### **Phase 4: Fundraising/Campaign (Weeks 11-14)**
- [ ] Campaign creation (student)
- [ ] Campaign approval (admin)
- [ ] Public campaign browsing
- [ ] Donation flow
- [ ] Campaign progress tracking
- [ ] Fund disbursement

**Deliverable:** Full fundraising platform

---

#### **Phase 5: Reporting & Analytics (Weeks 15-16)**
- [ ] Admin dashboard analytics
- [ ] Payment reports (filter, export)
- [ ] Campaign reports
- [ ] Financial summary
- [ ] Transaction history

**Deliverable:** Complete admin reporting tools

---

#### **Phase 6: Polish & Testing (Weeks 17-18)**
- [ ] UI/UX refinement
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Security audit
- [ ] User acceptance testing (UAT) with SDN 3 Malang

**Deliverable:** Production-ready MVP

---

#### **Phase 7: Deployment & Launch (Week 19)**
- [ ] Production deployment (Vercel + Supabase)
- [ ] Domain setup & SSL
- [ ] Data migration (if any existing data)
- [ ] User training (admin sekolah)
- [ ] Soft launch (beta testing with limited users)

**Deliverable:** Live platform

---

### 9.2 Post-MVP Roadmap

#### **v1.1 (Post-Launch + 1 month)**
- [ ] WhatsApp notifications integration
- [ ] Bulk operations (admin)
- [ ] Advanced filtering & search
- [ ] Mobile app (PWA conversion)

#### **v1.2 (Post-Launch + 3 months)**
- [ ] Recurring payments (auto-debit)
- [ ] Multiple payment methods (e-wallet: GoPay, OVO, DANA)
- [ ] Campaign sharing (social media integration)
- [ ] Donor leaderboard & recognition

#### **v2.0 (Long-term: Multi-School Platform)**
- [ ] Multi-tenancy architecture
- [ ] School onboarding flow
- [ ] Platform admin dashboard
- [ ] White-label option for schools

---

## 10. RISKS & MITIGATIONS

### 10.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Midtrans integration failure** | High | Low | Use sandbox mode for testing; have fallback to manual payment |
| **Supabase downtime** | High | Low | LocalStorage fallback; monitor uptime; have backup plan |
| **Payment webhook not received** | Medium | Medium | Implement retry mechanism; manual verification by admin |
| **Database performance** | Medium | Low | Use indexes; optimize queries; cache frequently accessed data |
| **Security breach** | High | Low | Regular security audits; follow OWASP best practices; use Supabase RLS |

---

### 10.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Low user adoption** | High | Medium | User training; onboarding assistance; gather feedback early |
| **Payment gateway fees too high** | Medium | Low | Negotiate rates with Midtrans; consider alternative gateways |
| **Donors don't trust platform** | High | Medium | Transparency (show campaign updates); social proof (testimonials) |
| **Admin resistance to change** | Medium | Medium | Involve admin early in design; provide comprehensive training |
| **Regulatory compliance issues** | High | Low | Consult legal expert; follow OJK guidelines; use licensed payment gateway |

---

### 10.3 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Lack of technical support** | Medium | Low | Document everything; provide admin training; have support channel (WhatsApp/email) |
| **Data loss** | High | Very Low | Daily backups; test restore procedure; have disaster recovery plan |
| **User error (wrong payment amount)** | Low | Medium | Clear UI; confirmation dialogs; allow payment cancellation (before processing) |
| **Campaign fraud** | Medium | Low | School approval required; verify documents; monitor suspicious activity |

---

## 11. APPENDIX

### 11.1 Glossary

- **SPP:** Sumbangan Pembinaan Pendidikan (monthly school fee in Indonesia)
- **NISN:** Nomor Induk Siswa Nasional (national student ID number, 10 digits)
- **NPSN:** Nomor Pokok Sekolah Nasional (national school ID number, 8 digits)
- **QRIS:** Quick Response Code Indonesian Standard (unified QR payment)
- **VA:** Virtual Account (bank transfer via unique account number)
- **Cicilan:** Installment payment plan
- **Kampanye:** Fundraising campaign
- **Donatur:** Donor (person who donates to campaign)

### 11.2 References

- **CONTEXT.md:** Domain vocabulary & architecture decisions
- **Database Schema:** See Section 6.2
- **API Endpoints:** See Section 6.3
- **Midtrans Documentation:** https://docs.midtrans.com
- **Supabase Documentation:** https://supabase.com/docs

### 11.3 Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-05-31 | Product Team | Initial PRD based on GRILL-ME session |

---

**END OF DOCUMENT**

---

## 📌 Next Steps

1. ✅ **Review PRD:** Stakeholders review & approve this document
2. ⏭️ **Convert to Issues:** Create `ISSUES.md` with GitHub Issues breakdown
3. 🚀 **Start Development:** Begin Phase 1 (Foundation)

**Questions or feedback?** Contact: product@edufin.sch.id
