# GRILL-ME: EDUFIN Platform Requirements Discovery

> **Tujuan:** Mengumpulkan informasi detail untuk membuat Product Requirements Document (PRD) yang komprehensif untuk keseluruhan project EDUFIN.
>
> **Proses:** Jawab pertanyaan di bawah ini sebisa Anda. Setelah semua pertanyaan terjawab, akan dilanjutkan dengan:
> 1. ✅ Membuat PRD lengkap → `PRD.md`
> 2. ✅ Convert PRD ke GitHub Issues → `ISSUES.md`

---

## 📋 TABLE OF CONTENTS

1. [Vision & Business Goals](#1-vision--business-goals)
2. [Target Users & Personas](#2-target-users--personas)
3. [Core Features & Functionality](#3-core-features--functionality)
4. [Technical Architecture](#4-technical-architecture)
5. [User Experience & Design](#5-user-experience--design)
6. [Compliance & Security](#6-compliance--security)
7. [Success Metrics](#7-success-metrics)
8. [Roadmap & Priorities](#8-roadmap--priorities)

---

## 1. VISION & BUSINESS GOALS

### 1.1 Strategic Vision

**Q1.1:** Apa visi EDUFIN dalam 1-2 tahun ke depan?
- [ ] Platform #1 untuk manajemen SPP di Indonesia
- [ ] Fokus regional (Jawa Timur, Malang)
- [ ] Ekspansi nasional ke seluruh Indonesia
- [ ] Ekspansi internasional (ASEAN)
- [ ] Lainnya: _____________________

**Q1.2:** Target market size:
- Berapa jumlah sekolah yang ditargetkan di tahun pertama? _____
- Berapa jumlah siswa aktif di tahun pertama? _____
- Target GMV (Gross Merchandise Value) bulanan? Rp _____

**Q1.3:** Posisi pasar:
- [ ] B2B (fokus ke sekolah)
- [ ] B2C (fokus ke siswa/orang tua)
- [ ] B2B2C (sekolah sebagai channel, siswa sebagai end-user)

### 1.2 Problem Statement

**Q1.4:** Apa 3 masalah terbesar yang diselesaikan EDUFIN? (urut berdasarkan prioritas)
1. _____________________
2. _____________________
3. _____________________

**Q1.5:** Pain points spesifik dari setiap user:

**Siswa/Orang Tua:**
- [ ] Sulit tracking pembayaran SPP
- [ ] Tidak ada reminder jatuh tempo
- [ ] Proses pembayaran ribet (harus ke sekolah)
- [ ] Tidak ada bukti pembayaran digital
- [ ] Lainnya: _____________________

**Sekolah:**
- [ ] Manual recording pembayaran SPP
- [ ] Sulit tracking siswa yang menunggak
- [ ] Rekonsiliasi payment gateway ribet
- [ ] Tidak ada laporan keuangan otomatis
- [ ] Lainnya: _____________________

**Donatur:**
- [ ] Tidak tahu siswa mana yang butuh bantuan
- [ ] Tidak percaya dana terpakai dengan benar
- [ ] Proses donasi ribet
- [ ] Tidak ada update perkembangan kampanye
- [ ] Lainnya: _____________________

### 1.3 Unique Value Proposition

**Q1.6:** Apa yang membedakan EDUFIN dari kompetitor (e.g., Schoolmedia, Gredu, Jurnal Sekolah)?
- [ ] Fitur fundraising peer-to-peer untuk siswa
- [ ] LocalStorage fallback untuk sekolah di daerah dengan internet tidak stabil
- [ ] Integrasi payment gateway lokal (QRIS, VA Bank)
- [ ] Gratis untuk sekolah, revenue dari donation fee
- [ ] Lainnya: _____________________

---

## 2. TARGET USERS & PERSONAS

### 2.1 Siswa

**Q2.1:** Profil Siswa:
- Jenjang pendidikan:
  - [ ] SD (6-12 tahun)
  - [ ] SMP (13-15 tahun)
  - [ ] SMA/SMK (16-18 tahun)
  - [ ] Semua jenjang
  
- Device utama:
  - [ ] Smartphone Android (mayoritas)
  - [ ] Smartphone iOS
  - [ ] Laptop/Desktop
  - [ ] Feature phone
  
- Internet access:
  - [ ] Selalu online (4G/WiFi)
  - [ ] Intermittent (3G/2G)
  - [ ] Offline-capable required

**Q2.2:** User behavior siswa:
- Apakah siswa menggunakan sendiri atau melalui orang tua? _____
- Frequency of use: Harian / Mingguan / Bulanan (saat bayar SPP) / _____
- Tech literacy: Low / Medium / High

### 2.2 Sekolah

**Q2.3:** Profil Sekolah:
- Ukuran sekolah target:
  - [ ] Kecil (<100 siswa)
  - [ ] Menengah (100-500 siswa)
  - [ ] Besar (>500 siswa)
  - [ ] Semua ukuran
  
- Tipe sekolah:
  - [ ] Negeri
  - [ ] Swasta
  - [ ] Pesantren/Madrasah
  - [ ] Semua tipe

**Q2.4:** Admin sekolah:
- Jumlah admin per sekolah: Single admin / Multi-user (kepala sekolah, bendahara, guru) / _____
- Tech literacy: Low / Medium / High
- Device utama: Desktop / Laptop / Tablet / Smartphone

**Q2.5:** School workflow:
- Apakah sekolah perlu multi-level approval untuk kampanye? Ya / Tidak
- Apakah sekolah perlu role-based access (read-only, editor, admin)? Ya / Tidak

### 2.3 Donatur

**Q2.6:** Profil Donatur:
- Kategori:
  - [ ] Alumni sekolah
  - [ ] Orang tua siswa lain
  - [ ] Masyarakat umum (CSR, charity)
  - [ ] Semua kategori
  
- Motivasi:
  - [ ] Charity/sosial
  - [ ] Tax deduction
  - [ ] CSR company
  - [ ] Lainnya: _____

**Q2.7:** Donation behavior:
- Frequency: One-time / Recurring (monthly) / Event-based
- Average donation amount: Rp _____
- Prefer: Anonim / Public (nama ditampilkan)

---

## 3. CORE FEATURES & FUNCTIONALITY

### 3.1 SPP Payment Flow

**Q3.1:** Payment methods:

**Prioritas TINGGI (MUST HAVE di MVP):**
- [ ] QRIS
- [ ] Virtual Account BCA
- [ ] Virtual Account Mandiri
- [ ] Transfer Bank Manual
- [ ] Cash (manual input by school)
- [ ] Lainnya: _____

**Prioritas MEDIUM (SHOULD HAVE post-MVP):**
- [ ] Virtual Account Bank lain (BNI, BRI, dll)
- [ ] E-wallet (GoPay, OVO, DANA)
- [ ] Kartu Kredit/Debit
- [ ] Lainnya: _____

**Q3.2:** Payment workflow:
- Apakah siswa bisa bayar partial (sebagian dari tagihan)? Ya / Tidak
- Apakah perlu reminder otomatis sebelum jatuh tempo? Ya (berapa hari sebelum? _____ ) / Tidak
- Late payment fee:
  - [ ] Tidak ada
  - [ ] Fixed fee (Rp _____ )
  - [ ] Percentage (_____ %)
  - [ ] Progressive (bertambah per hari/minggu/bulan)

**Q3.3:** Payment confirmation:
- Siapa yang verifikasi pembayaran:
  - [ ] Otomatis via payment gateway callback
  - [ ] Manual oleh sekolah (untuk cash/transfer)
  - [ ] Hybrid (otomatis untuk digital, manual untuk cash)

### 3.2 Fundraising/Campaign

**Q3.4:** Campaign creation:
- Siapa yang bisa buat kampanye:
  - [ ] Siswa (dengan approval sekolah)
  - [ ] Sekolah atas nama siswa
  - [ ] Keduanya

**Q3.5:** Campaign approval:
- Approval flow:
  - [ ] Single approval (sekolah saja)
  - [ ] Multi-level (guru wali kelas → kepala sekolah)
  - [ ] EDUFIN admin review (untuk fraud prevention)

**Q3.6:** Campaign limits:
- Minimum target: Rp _____
- Maximum target: Rp _____ (atau unlimited)
- Campaign duration: Min _____ hari, Max _____ hari

**Q3.7:** Fund disbursement:
- Kapan dana dicairkan:
  - [ ] Otomatis saat target tercapai
  - [ ] Manual request by school
  - [ ] Scheduled (weekly/monthly batch)
  
- Metode pencairan:
  - [ ] Transfer ke rekening sekolah
  - [ ] Langsung ke supplier (e.g., toko buku untuk beli buku)
  - [ ] Cash pickup

**Q3.8:** Campaign fee:
- Business model:
  - [ ] Gratis (no fee)
  - [ ] Platform fee ( _____ % dari donasi)
  - [ ] Payment gateway fee only (pass-through)
  - [ ] Subscription fee untuk sekolah (Rp _____ /bulan)

### 3.3 Cicilan (Installment)

**Q3.9:** Installment rules:
- Siapa yang tentukan jumlah periode cicilan:
  - [ ] Siswa (pilih 2x, 3x, 4x, dll)
  - [ ] Sekolah (set fixed policy)
  - [ ] Negotiable (siswa request, sekolah approve)

**Q3.10:** Installment fees:
- Biaya admin cicilan:
  - [ ] Tidak ada
  - [ ] Fixed fee (Rp _____ per periode)
  - [ ] Percentage ( _____ % dari total tagihan)

**Q3.11:** Installment default:
- Jika siswa gagal bayar cicilan:
  - [ ] Grace period ( _____ hari)
  - [ ] Late fee otomatis
  - [ ] Cicilan dibatalkan, kembali ke full payment
  - [ ] Manual follow-up by school

### 3.4 Reporting & Analytics

**Q3.12:** Reports untuk Sekolah:

**Daily/Real-time:**
- [ ] Total penerimaan hari ini
- [ ] Outstanding payments
- [ ] Pending campaigns
- [ ] Lainnya: _____

**Monthly:**
- [ ] Monthly revenue report
- [ ] Student payment status (lunas, belum bayar, terlambat)
- [ ] Campaign performance (total raised, success rate)
- [ ] Payment method breakdown
- [ ] Lainnya: _____

**Q3.13:** Export format:
- [ ] Excel (.xlsx)
- [ ] PDF
- [ ] CSV
- [ ] JSON (for integration)

**Q3.14:** Analytics untuk Admin EDUFIN:
- [ ] Platform-wide GMV
- [ ] Active schools
- [ ] Payment success rate
- [ ] Campaign conversion rate
- [ ] Lainnya: _____

---

## 4. TECHNICAL ARCHITECTURE

### 4.1 Backend Strategy

**Q4.1:** Database:
- Primary database:
  - [ ] Supabase (PostgreSQL)
  - [ ] Firebase
  - [ ] MongoDB
  - [ ] Lainnya: _____

**Q4.2:** LocalStorage fallback:
- Kapan migrasi penuh ke cloud:
  - [ ] MVP sudah full cloud (no localStorage)
  - [ ] Hybrid (localStorage fallback untuk offline)
  - [ ] Tetap localStorage untuk demo mode

**Q4.3:** API Architecture:
- [ ] REST API
- [ ] GraphQL
- [ ] tRPC
- [ ] Lainnya: _____

### 4.2 Payment Gateway

**Q4.4:** Payment partner:
- Pilih payment gateway:
  - [ ] Midtrans
  - [ ] Xendit
  - [ ] Faspay
  - [ ] DOKU
  - [ ] Lainnya: _____

**Q4.5:** Payment reconciliation:
- Siapa yang handle reconciliation:
  - [ ] Otomatis via webhook
  - [ ] Manual daily check oleh EDUFIN team
  - [ ] Sekolah self-service

### 4.3 Authentication

**Q4.6:** Auth methods:

**Siswa:**
- [ ] Email + Password
- [ ] NISN + Password
- [ ] Google OAuth
- [ ] Facebook OAuth
- [ ] Phone number OTP
- [ ] Lainnya: _____

**Sekolah:**
- [ ] Email + Password
- [ ] NPSN + Credential
- [ ] Google Workspace SSO
- [ ] Lainnya: _____

**Donatur:**
- [ ] Email + Password
- [ ] Google OAuth
- [ ] Guest checkout (no registration)
- [ ] Lainnya: _____

**Q4.7:** NISN/NPSN verification:
- Apakah perlu verifikasi NISN siswa dengan database Kemendikbud? Ya / Tidak
- Apakah perlu verifikasi NPSN sekolah? Ya / Tidak

### 4.4 Scalability

**Q4.8:** Expected load:
- Concurrent users per sekolah: _____
- Peak hours: Kapan? (e.g., awal bulan saat bayar SPP)
- Data retention: History transaksi disimpan selama _____ tahun

**Q4.9:** Multi-tenancy:
- Arsitektur database:
  - [ ] Single database (shared tables with tenant_id)
  - [ ] Database per tenant (isolated)
  - [ ] Hybrid (shared for small schools, isolated for large schools)

---

## 5. USER EXPERIENCE & DESIGN

### 5.1 Platform Strategy

**Q5.1:** Web vs Native App:

**Siswa/Donatur:**
- [ ] Mobile web (responsive) only
- [ ] PWA (installable web app)
- [ ] Native app (React Native)
- [ ] Hybrid (web + native)

**Sekolah:**
- [ ] Desktop web only
- [ ] Desktop + mobile web
- [ ] Desktop app (Electron)

**Q5.2:** Offline capability:
- Apakah siswa perlu bisa lihat tagihan saat offline? Ya / Tidak
- Apakah sekolah perlu bisa input payment saat offline? Ya / Tidak

### 5.2 Localization

**Q5.3:** Language:
- [ ] Bahasa Indonesia only
- [ ] English support (untuk donatur internasional)
- [ ] Multi-language (Indonesia, English, Arab untuk pesantren)

**Q5.4:** Regional settings:
- Timezone: WIB only / WIB, WITA, WIT / Auto-detect
- Date format: DD/MM/YYYY / DD-MM-YYYY / Lainnya: _____
- Currency: IDR only / Multi-currency

### 5.3 Accessibility

**Q5.5:** WCAG compliance:
- Target level:
  - [ ] AA (recommended)
  - [ ] AAA
  - [ ] Not required for MVP

**Q5.6:** Minimum bandwidth:
- Target internet speed:
  - [ ] 3G (slow but acceptable)
  - [ ] 4G minimum
  - [ ] WiFi only

---

## 6. COMPLIANCE & SECURITY

### 6.1 Data Privacy

**Q6.1:** Privacy regulations:
- Compliance requirements:
  - [ ] GDPR (if accepting international donations)
  - [ ] UU PDP (Indonesia's data protection law)
  - [ ] SOC 2
  - [ ] Lainnya: _____

**Q6.2:** Minors data:
- Handling data siswa (under 18):
  - [ ] Parental consent required
  - [ ] School consent sufficient
  - [ ] No special treatment (treat as adult user)

**Q6.3:** Data retention:
- Personal data retention period: _____ tahun
- Transaction data retention: _____ tahun
- Right to be forgotten: Support / Not support

### 6.2 Financial Compliance

**Q6.4:** Licensing:
- Apakah EDUFIN sebagai:
  - [ ] Payment Facilitator (need OJK license)
  - [ ] Payment Aggregator (partner with licensed gateway)
  - [ ] Technology Provider only (no money handling)

**Q6.5:** KYC (Know Your Customer):
- KYC requirements:
  - **Sekolah:**
    - [ ] NPSN verification
    - [ ] Bank account verification
    - [ ] Principal ID verification
    - [ ] Lainnya: _____
  
  - **Donatur:**
    - [ ] No KYC for donation < Rp _____
    - [ ] Email verification only
    - [ ] Phone + email verification
    - [ ] Full KYC (ID card) for donation > Rp _____

### 6.3 Security

**Q6.6:** Security measures:
- [ ] SSL/TLS encryption
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting (prevent brute force)
- [ ] Data encryption at rest
- [ ] Regular security audits
- [ ] PCI DSS compliance (if handling card data)
- [ ] Lainnya: _____

---

## 7. SUCCESS METRICS

### 7.1 Business Metrics

**Q7.1:** Key metrics to track:

**Revenue Metrics:**
- Monthly GMV (Gross Merchandise Value): Rp _____
- Average transaction value: Rp _____
- Platform fee revenue (if applicable): Rp _____

**Growth Metrics:**
- Number of active schools: _____
- Number of active students: _____
- Number of donors: _____
- Month-over-month growth rate: _____ %

**Engagement Metrics:**
- Payment success rate: _____ % (target)
- Campaign success rate (reached target): _____ %
- Student retention (monthly active users): _____ %
- Average campaign duration: _____ hari

### 7.2 Technical Metrics

**Q7.2:** Performance targets:

**Speed:**
- Homepage load time: < _____ seconds
- Payment page load time: < _____ seconds
- API response time (p95): < _____ ms

**Reliability:**
- Uptime SLA: _____ % (e.g., 99.9%)
- Payment gateway success rate: _____ %

**User Experience:**
- Mobile-friendly score: _____ / 100 (Google PageSpeed)
- Time to first payment: < _____ minutes (from signup)

---

## 8. ROADMAP & PRIORITIES

### 8.1 MVP (Minimum Viable Product)

**Q8.1:** MVP features (must have in first launch):

**Prioritas P0 (BLOCKER - cannot launch without this):**
- [ ] User registration (siswa, sekolah)
- [ ] SPP payment (QRIS + 1 VA method)
- [ ] Payment history
- [ ] Basic admin dashboard (sekolah)
- [ ] Lainnya: _____________________

**Prioritas P1 (CRITICAL - needed soon after MVP):**
- [ ] Campaign creation & donation
- [ ] Email notifications
- [ ] Payment reminders
- [ ] Cicilan/installment
- [ ] Lainnya: _____________________

**Prioritas P2 (IMPORTANT - nice to have):**
- [ ] Advanced reporting
- [ ] Multi-payment methods
- [ ] Bulk operations (sekolah)
- [ ] Lainnya: _____________________

**Q8.2:** MVP timeline:
- Target launch date: _____ (bulan/tahun)
- Development time: _____ bulan
- Beta testing period: _____ minggu

### 8.2 Post-MVP Roadmap

**Q8.3:** Phase 2 features (after MVP):
1. _____________________
2. _____________________
3. _____________________

**Q8.4:** Phase 3 features (future):
1. _____________________
2. _____________________
3. _____________________

### 8.3 Known Constraints

**Q8.5:** Constraints & limitations:

**Budget:**
- Development budget: Rp _____ (atau unlimited)
- Marketing budget: Rp _____
- Infrastructure budget (server, payment gateway): Rp _____ /bulan

**Team:**
- Developers: _____ orang (frontend: _____, backend: _____)
- Designers: _____ orang
- Product Manager: _____ orang
- QA: _____ orang

**Timeline:**
- Fixed deadline: Ya (tanggal: _____ ) / Tidak (flexible)
- External dependencies: _____________________

---

## 📝 NEXT STEPS

Setelah semua pertanyaan di atas dijawab, saya akan:

1. **Membuat PRD lengkap** (`PRD.md`) dengan struktur:
   - Executive Summary
   - Problem Statement & Goals
   - User Personas
   - Feature Requirements (MoSCoW method)
   - Technical Architecture
   - Success Metrics
   - Timeline & Milestones
   - Risks & Mitigations

2. **Convert PRD to Issues** (`ISSUES.md`) dengan:
   - Epic-level issues untuk major features
   - Story-level issues untuk specific tasks
   - Bug template
   - Labels & priorities
   - Effort estimation (story points)

---

**Mulai dari mana?**

Anda tidak perlu jawab semua pertanyaan sekaligus. Kita bisa mulai dari:
- **Section 1: Vision & Business Goals** (paling penting untuk alignment)
- Atau bagian mana yang paling Anda yakin untuk dijawab terlebih dahulu

Silakan jawab pertanyaan-pertanyaan di atas, atau kita bisa diskusi interaktif jika ada yang perlu klarifikasi!
