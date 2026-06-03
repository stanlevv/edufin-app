# 📚 DOKUMENTASI DATABASE EDUFIN - PANDUAN PENGGUNAAN

## 📂 File yang Tersedia

### 1. **EDUFIN_ERD.drawio**
   - **Format:** Draw.io / diagrams.net XML
   - **Isi:** Entity Relationship Diagram (ERD) lengkap
   - **Cara Buka:**
     1. Buka https://app.diagrams.net (atau https://draw.io)
     2. Klik **File → Open from... → Device**
     3. Pilih file `EDUFIN_ERD.drawio`
     4. Diagram akan terbuka dan bisa diedit

### 2. **NORMALISASI_DATABASE.md**
   - **Format:** Markdown
   - **Isi:** Tahapan normalisasi (UNF → 1NF → 2NF → 3NF)
   - **Untuk:** Laporan BAB III - Analisis & Perancangan

### 3. **TABEL_DATABASE.md**
   - **Format:** Markdown dengan tabel
   - **Isi:** Dokumentasi lengkap 8 tabel database
   - **Untuk:** Lampiran dokumentasi skripsi/TA

### 4. **schema.sql**
   - **Format:** SQL DDL
   - **Isi:** Script create table untuk Supabase
   - **Untuk:** Implementasi database

---

## 🎯 Cara Menggunakan untuk Tugas Akhir

### **Untuk BAB III - Perancangan Database**

#### A. **ERD (Entity Relationship Diagram)**

**Cara 1 - Screenshot dari draw.io:**
1. Buka `EDUFIN_ERD.drawio` di https://app.diagrams.net
2. Klik **File → Export as → PNG** (atau PDF)
3. Pilih resolusi **High (300 DPI)** untuk kualitas terbaik
4. Save dan insert ke dokumen Word/Google Docs

**Cara 2 - Edit warna/layout:**
1. Di draw.io, klik tabel yang mau diedit
2. Ubah warna di panel **Style** (kanan)
3. Drag & drop untuk atur posisi
4. Export ulang

#### B. **Dokumentasi Tabel**

**Copy-paste ke Word:**
1. Buka `TABEL_DATABASE.md`
2. Copy tabel yang dibutuhkan
3. Paste ke Word → akan otomatis jadi tabel
4. Format sesuai template kampus

**Struktur Laporan yang Disarankan:**
```
3.2 Perancangan Database
3.2.1 Normalisasi Database
   - UNF → 1NF
   - 1NF → 2NF
   - 2NF → 3NF
   (copy dari NORMALISASI_DATABASE.md)

3.2.2 Entity Relationship Diagram (ERD)
   [Insert gambar dari EDUFIN_ERD.png]

3.2.3 Struktur Tabel
   3.2.3.1 Tabel users
   3.2.3.2 Tabel students
   ... dst
   (copy dari TABEL_DATABASE.md)

3.2.4 Relasi Antar Tabel
   (copy bagian "Ringkasan Relasi" dari TABEL_DATABASE.md)
```

---

## 🖼️ Preview ERD

ERD terdiri dari:
- **8 tabel utama** dengan warna berbeda per modul:
  - 🔵 Biru: Modul SPP & Pembayaran (users, students, bills, payments)
  - 🟢 Hijau: Modul Donasi (campaigns, donations)
  - 🟠 Orange: Modul Bantuan SPP (aid_requests)
  - 🟣 Ungu: Modul Support IT (support_tickets)

- **Relasi jelas** dengan tanda panah dan label
- **Legend** di bawah untuk penjelasan

---

## 📊 Contoh Penggunaan Tabel dalam Laporan

### Format Tabel untuk Word/Docs:

**Tabel 3.1 Struktur Tabel users**

| No | Field Name    | Type         | Constraint  | Keterangan                |
|----|---------------|--------------|-------------|---------------------------|
| 1  | id            | UUID         | PRIMARY KEY | ID unik pengguna          |
| 2  | email         | TEXT         | UNIQUE      | Email login pengguna      |
| 3  | password_hash | TEXT         | NOT NULL    | Password terenkripsi      |
| 4  | role          | TEXT         | NOT NULL    | Role: parent/donor/admin  |
| 5  | name          | TEXT         | NOT NULL    | Nama lengkap pengguna     |

**Penjelasan:**
Tabel users digunakan untuk menyimpan seluruh data pengguna aplikasi EDUFIN, termasuk parent (orang tua siswa), donor (donatur), dan admin (pengelola sekolah). Penggunaan satu tabel untuk semua role bertujuan untuk menyederhanakan autentikasi dan manajemen sesi.

---

## 🔄 Cara Update Diagram

### Jika ada perubahan struktur database:

1. **Edit di draw.io:**
   - Buka file `EDUFIN_ERD.drawio`
   - Double-click pada tabel untuk edit field
   - Klik relasi untuk ubah kardinalitas

2. **Tambah Tabel Baru:**
   - Copy tabel existing (Ctrl+C, Ctrl+V)
   - Edit nama tabel & field
   - Drag relasi dari tabel lain ke tabel baru

3. **Save & Export:**
   - Save file drawio (Ctrl+S)
   - Export PNG untuk dokumentasi

---

## 💡 Tips untuk Presentasi/Sidang

1. **Jelaskan Alur Normalisasi:**
   - Tunjukkan data awal (UNF) yang masih redundan
   - Jelaskan langkah-langkah normalisasi
   - Tunjukkan hasil akhir (3NF) yang optimal

2. **Highlight Poin Penting ERD:**
   - **Kardinalitas:** Parent (1) bisa punya siswa (N)
   - **Cascade Delete:** Jika parent dihapus, siswa ikut terhapus
   - **JSONB:** Untuk data fleksibel (breakdown biaya)

3. **Siapkan Penjelasan Teknis:**
   - Kenapa pakai UUID bukan auto-increment?
   - Kenapa pakai 1 tabel users untuk semua role?
   - Kenapa tidak pakai wallet system?

---

## 📝 Checklist untuk Laporan TA

- [ ] ERD sudah di-export ke format gambar (PNG/PDF)
- [ ] Tabel struktur database sudah dicopy ke Word
- [ ] Tahapan normalisasi sudah dijelaskan
- [ ] Relasi antar tabel sudah dijelaskan
- [ ] SQL script (schema.sql) sudah ditest di Supabase
- [ ] Penjelasan constraint & index sudah ditambahkan
- [ ] Nomor gambar & tabel sudah sesuai template kampus

---

## 🚀 Next Steps

1. ✅ **Selesai:** ERD & Dokumentasi tabel
2. ⏳ **Selanjutnya:** Use Case Diagram
3. ⏳ **Selanjutnya:** Activity Diagram
4. ⏳ **Selanjutnya:** Sequence Diagram
5. ⏳ **Selanjutnya:** UI/UX Mockup

---

## 🤝 Support

Jika ada yang perlu ditambahkan atau diubah:
1. Edit langsung file `.drawio` di diagrams.net
2. Update file markdown sesuai kebutuhan
3. Re-export diagram setelah perubahan

**Database EDUFIN sudah optimal untuk aplikasi single-school!** 🎉
