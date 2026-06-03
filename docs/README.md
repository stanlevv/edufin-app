# EDUFIN - Dokumentasi Lengkap

Kumpulan dokumentasi lengkap untuk sistem EDUFIN, termasuk database, wireframe, deployment, dan panduan penggunaan.

---

## 📁 Daftar File Dokumentasi

### 1. Database & Normalisasi

#### `schema.sql`
**Tujuan:** File SQL DDL untuk setup database EDUFIN
**Isi:**
- 8 tabel utama (users, students, bills, payments, campaigns, donations, aid_requests, support_tickets)
- Foreign key relationships dengan CASCADE
- Indexes untuk optimasi query
- Row Level Security (RLS) policies
- Triggers untuk auto-update timestamps

**Cara pakai:**
```bash
# Di Supabase SQL Editor
psql -d your_database < database/schema.sql
```

---

#### `NORMALISASI_DATABASE.md`
**Tujuan:** Dokumentasi tahapan normalisasi database untuk TA/Skripsi
**Isi:**
- Tahapan UNF (Unnormalized Form)
- Tahapan 1NF (First Normal Form)
- Tahapan 2NF (Second Normal Form)
- Tahapan 3NF (Third Normal Form)
- Contoh data di setiap tahapan
- Penjelasan partial dependency dan transitive dependency
- Final relational model dengan kardinalitas

**Untuk:** Bab Perancangan Database di dokumen TA

---

#### `TABEL_DATABASE.md`
**Tujuan:** Spesifikasi detail setiap tabel database
**Format:**
```
Tabel: [nama_tabel]
| No | Field Name | Type | Length | Constraint | Keterangan |
|----|------------|------|--------|------------|------------|
```

**Isi:** 8 tabel lengkap dengan:
- Field names dan tipe data
- Primary keys dan foreign keys
- Constraints (NOT NULL, UNIQUE, CHECK)
- Indexes
- Relational summary

**Untuk:** Lampiran spesifikasi database di dokumen TA

---

#### `EDUFIN_ERD.drawio`
**Tujuan:** Entity Relationship Diagram (ERD) visual
**Format:** XML untuk draw.io / diagrams.net

**Cara buka:**
1. Buka https://app.diagrams.net/
2. File → Open from → Device
3. Pilih `EDUFIN_ERD.drawio`

**Fitur:**
- 8 entitas dengan color coding
- Relationships dengan kardinalitas (1:N)
- Primary key dan foreign key ditandai
- Legend untuk penjelasan

**Export untuk TA:**
- File → Export as → PNG/JPEG (untuk Word)
- File → Export as → PDF (untuk lampiran)
- Resolusi recommended: 300 DPI

**Untuk:** Bab Perancangan Database - ERD

---

#### `DATABASE_OPTIMIZATION.md`
**Tujuan:** Dokumentasi optimasi database dari multi-tenant ke single-tenant
**Isi:**
- Before/after comparison
- Pengurangan 80% jumlah tabel
- Performance improvements (3.4x faster)
- Simplified payment flow
- Migration guide
- Rationale untuk single-school deployment

**Untuk:** Bab Implementasi - Optimasi Sistem

---

#### `README_DOKUMENTASI.md`
**Tujuan:** Panduan menggunakan dokumentasi database untuk TA
**Isi:**
- Cara buka file .drawio
- Export instructions untuk PNG/PDF
- Copy-paste guidelines untuk Word/Docs
- Recommended chapter structure
- Tips untuk dosen pembimbing

---

### 2. Wireframe & Design

#### `LOW_FIDELITY_WIREFRAMES.md`
**Tujuan:** ASCII wireframe untuk referensi cepat
**Isi:**
- 12 wireframe halaman penting
- ASCII art representation
- Design system (colors, typography, spacing)
- User flow diagrams
- Interaction notes
- Accessibility guidelines

**Untuk:** Referensi struktur halaman

---

#### `WIREFRAME_GUIDE.md` ⭐
**Tujuan:** Panduan lengkap export wireframe visual untuk TA
**Isi:**
- Cara akses wireframe viewer di `/wireframes`
- 3 method export (Screenshot, Print PDF, Browser Extension)
- Template caption untuk dokumen TA
- Penjelasan elemen visual
- Tips dokumentasi TA
- Checklist untuk dokumen
- FAQ dan troubleshooting

**Untuk:** Bab Perancangan UI/UX

**Akses wireframe:**
```bash
npm run dev
# Buka: http://localhost:5173/wireframes
```

---

### 3. Deployment & Production

#### `DEPLOYMENT_GUIDE.md`
**Tujuan:** Panduan deploy aplikasi ke production
**Isi:**
- Penjelasan kenapa URL Figma Make tidak bisa diubah
- 4 opsi deployment (Netlify, Vercel, GitHub Pages, Self-hosting)
- Step-by-step untuk setiap platform
- Custom domain setup
- Environment variables configuration
- Performance optimization
- Continuous deployment (CD)
- Troubleshooting common issues

**Untuk:** Deployment aplikasi agar bisa diakses publik tanpa `/make/`

**Quick commands:**
```bash
# Netlify
npm run build && netlify deploy --prod

# Vercel
vercel --prod

# GitHub Pages
npm run deploy
```

---

## 🎯 Panduan Penggunaan untuk Tugas Akhir/Skripsi

### Struktur Bab yang Disarankan

#### BAB 1: PENDAHULUAN
- Latar belakang
- Rumusan masalah
- Tujuan
- Manfaat
- Batasan masalah

#### BAB 2: LANDASAN TEORI
- Sistem informasi keuangan pendidikan
- Payment gateway
- Crowdfunding/fundraising
- React & TypeScript
- Supabase & PostgreSQL
- Mobile-first design

#### BAB 3: ANALISIS DAN PERANCANGAN SISTEM

**3.1 Analisis Kebutuhan**
- Functional requirements
- Non-functional requirements
- User stories

**3.2 Use Case Diagram**
- Use case untuk Student
- Use case untuk School/Admin
- Use case untuk Donor

**3.3 Activity Diagram**
- Flow pembayaran SPP
- Flow pengajuan kampanye
- Flow donasi

**3.4 Perancangan Database**
- **ERD:** Gunakan `EDUFIN_ERD.drawio` (export PNG/PDF)
- **Normalisasi:** Copy dari `NORMALISASI_DATABASE.md`
- **Spesifikasi Tabel:** Copy dari `TABEL_DATABASE.md`

**3.5 Perancangan Antarmuka (UI/UX)**
- **Wireframe:** Screenshot dari `/wireframes` (gunakan `WIREFRAME_GUIDE.md`)
- Design system (colors, typography)
- User flow

#### BAB 4: IMPLEMENTASI

**4.1 Lingkungan Pengembangan**
- Tools & technologies
- Development setup

**4.2 Implementasi Database**
- Copy `schema.sql`
- Setup Supabase
- RLS policies

**4.3 Implementasi Frontend**
- React components
- Routing
- State management

**4.4 Implementasi Payment Gateway**
- QRIS integration
- Virtual Account
- Bank Transfer

**4.5 Optimasi Sistem**
- Gunakan `DATABASE_OPTIMIZATION.md`
- Performance optimization
- Single-tenant architecture

#### BAB 5: PENGUJIAN DAN EVALUASI

**5.1 Pengujian Unit**
- Test cases

**5.2 Pengujian Integrasi**
- Payment flow testing
- Database integration testing

**5.3 Pengujian User Acceptance (UAT)**
- Feedback dari SDN 3 Malang

**5.4 Hasil Evaluasi**
- Metrics & KPI

#### BAB 6: PENUTUP

**6.1 Kesimpulan**

**6.2 Saran**

---

## 📊 Quick Reference

### Akses Lokal
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Akses aplikasi: http://localhost:5173
# Akses wireframes: http://localhost:5173/wireframes
```

### Database
```sql
-- File: database/schema.sql
-- Import ke Supabase SQL Editor
```

### ERD
```
File: database/EDUFIN_ERD.drawio
Buka di: https://app.diagrams.net/
Export: PNG (300 DPI) untuk dokumen
```

### Wireframes
```
URL: http://localhost:5173/wireframes
Method: Screenshot (Win+Shift+S atau Cmd+Shift+4)
Format: PNG untuk insert ke Word/Docs
```

---

## 🔗 Link Penting

### Online Tools
- **Draw.io:** https://app.diagrams.net/
- **Supabase Dashboard:** https://app.supabase.com/
- **Netlify:** https://app.netlify.com/
- **Vercel:** https://vercel.com/

### Demo Accounts
```
Siswa:
  Email: siswa@edufin.id
  Password: demo123

Sekolah/Admin:
  Email: sekolah@edufin.id
  Password: demo123

Donatur:
  Email: donatur@edufin.id
  Password: demo123
```

---

## 📝 Checklist Dokumentasi TA

### Perancangan Database ✓
- [x] ERD (EDUFIN_ERD.drawio → export PNG)
- [x] Tahapan normalisasi (NORMALISASI_DATABASE.md)
- [x] Spesifikasi tabel (TABEL_DATABASE.md)
- [x] SQL DDL (schema.sql)

### Perancangan UI/UX ✓
- [x] Wireframe low-fidelity (LOW_FIDELITY_WIREFRAMES.md)
- [x] Wireframe visual interactive (/wireframes)
- [x] Design system (colors, typography, spacing)
- [x] User flow diagram

### Implementasi ✓
- [x] Source code lengkap
- [x] Database optimization guide
- [x] Deployment guide
- [x] Demo accounts untuk testing

### Tambahan
- [ ] Screenshot aplikasi high-fidelity (aplikasi jadi)
- [ ] User testing results
- [ ] Performance metrics
- [ ] UAT feedback dari sekolah

---

## 💡 Tips untuk Dosen Pembimbing

### Presentasi Progress
1. **Perancangan Database:**
   - Tunjukkan ERD dari draw.io
   - Jelaskan proses normalisasi
   - Demo query performance

2. **Perancangan UI/UX:**
   - Buka `/wireframes` untuk preview
   - Jelaskan user flow
   - Tunjukkan mobile-first approach

3. **Implementasi:**
   - Demo aplikasi live
   - Login dengan 3 role berbeda
   - Tunjukkan fitur utama

4. **Deployment:**
   - Share URL production (Netlify/Vercel)
   - Tunjukkan aplikasi bisa diakses publik
   - No `/make/` in URL

---

## 🆘 Troubleshooting

### "File .drawio tidak bisa dibuka"
**Solusi:** Buka di https://app.diagrams.net/, jangan pakai aplikasi lain

### "Wireframe tidak muncul"
**Solusi:**
```bash
# Pastikan dev server running
npm run dev

# Akses langsung
http://localhost:5173/wireframes
```

### "Export ERD buram/pecah"
**Solusi:** Export dengan settings:
- Format: PNG
- DPI: 300 atau lebih
- Zoom: 100%
- Border: 10px

### "Screenshot wireframe kecil"
**Solusi:**
- Zoom browser ke 125-150%
- Atau screenshot dengan resolution tinggi
- Atau print to PDF lalu screenshot PDF

---

## 📞 Kontak & Support

Jika ada pertanyaan tentang dokumentasi:

1. **Baca FAQ** di masing-masing file dokumentasi
2. **Check WIREFRAME_GUIDE.md** untuk panduan wireframe
3. **Check DEPLOYMENT_GUIDE.md** untuk panduan deployment
4. **Check README_DOKUMENTASI.md** untuk panduan database

---

## 📅 Update Log

### 2026-04-09
- ✅ Initial documentation
- ✅ Database schema & normalization
- ✅ ERD draw.io format
- ✅ Interactive wireframe viewer
- ✅ Deployment guide
- ✅ Wireframe export guide
- ✅ Complete documentation structure

---

**Platform:** EDUFIN - Sistem Keuangan Pendidikan
**Target:** SDN 3 Malang
**Tujuan:** Dokumentasi Tugas Akhir/Skripsi
**Version:** 1.0.0
**Last Update:** 9 April 2026
