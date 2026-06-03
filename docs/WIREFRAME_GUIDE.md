# EDUFIN - Panduan Wireframe untuk Dokumentasi TA/Skripsi

Panduan lengkap menggunakan wireframe visual EDUFIN untuk dokumentasi tugas akhir atau skripsi.

---

## 🎯 Akses Wireframe Viewer

### Online (Development Mode)
Jika aplikasi sedang running di development:
```bash
npm run dev
```

Akses wireframe di browser:
```
http://localhost:5173/wireframes
```

### Production (Setelah Deploy)
Setelah deploy ke Netlify/Vercel:
```
https://your-app-url.com/wireframes
```

---

## 📸 Cara Export Wireframe untuk Dokumentasi

### Method 1: Screenshot (Recommended untuk Word/Docs)

1. **Buka halaman wireframe** di browser
   - URL: `http://localhost:5173/wireframes`

2. **Pilih screen** yang ingin di-screenshot
   - Gunakan tombol navigasi di bagian atas
   - Total ada 12 screen penting

3. **Ambil screenshot:**

   **Windows:**
   - Tekan `Win + Shift + S`
   - Pilih area yang ingin di-screenshot
   - Screenshot otomatis masuk clipboard
   - Paste langsung ke Word/Docs (`Ctrl + V`)

   **Mac:**
   - Tekan `Cmd + Shift + 4`
   - Pilih area yang ingin di-screenshot
   - File tersimpan di Desktop

   **Chrome/Edge:**
   - Klik kanan → "Inspect" (F12)
   - Tekan `Ctrl + Shift + P` (Windows) atau `Cmd + Shift + P` (Mac)
   - Ketik "screenshot" → pilih "Capture screenshot"

4. **Insert ke dokumen**
   - Paste atau insert image ke Word/Google Docs
   - Tambahkan caption: "Gambar X. Wireframe [Nama Screen]"

---

### Method 2: Print to PDF (Untuk Dokumentasi Lengkap)

1. **Buka wireframe viewer** di browser

2. **Print halaman:**
   - Tekan `Ctrl + P` (Windows) atau `Cmd + P` (Mac)
   - Pilih "Save as PDF" di bagian Destination/Printer
   - Settings:
     - Layout: Portrait
     - Margins: None atau Minimum
     - Scale: 100% atau Custom (80-90%)
     - Background graphics: ON (centang)

3. **Save PDF:**
   - Beri nama: `EDUFIN_Wireframes_[NamaAnda].pdf`
   - Simpan di folder dokumentasi TA

4. **Insert ke Word:**
   - Insert → Object → "Create from file" → Browse PDF
   - Atau: Buka PDF, screenshot per halaman, insert ke Word

---

### Method 3: Browser Extension (Advanced)

Install extension untuk screenshot full page:

**Chrome/Edge:**
- "GoFullPage - Full Page Screen Capture"
- "Awesome Screenshot"

**Firefox:**
- "Fireshot"

Cara pakai:
1. Install extension
2. Buka wireframe viewer
3. Klik icon extension
4. Pilih "Capture full page"
5. Download sebagai PNG/PDF

---

## 📋 Struktur Wireframe yang Tersedia

### 12 Screen Wireframe:

1. **Login** - Semua Role
   - Form login dengan email & password
   - Link registrasi

2. **Dashboard Siswa** - Student Role
   - Card tagihan SPP
   - Stats pembayaran
   - Grafik riwayat
   - List kampanye

3. **Pembayaran SPP** - Student Role
   - Detail breakdown tagihan
   - Pilihan metode pembayaran
   - Total dan konfirmasi

4. **Ajukan Kampanye** - Student/Parent Role
   - Upload foto kampanye
   - Form detail kampanye
   - Target dan periode
   - Pilihan jenis kampanye

5. **Daftar Kampanye** - All Roles
   - Search dan filter
   - Card kampanye dengan progress bar
   - Info target dan terkumpul

6. **Detail Kampanye & Donasi** - Donor Role
   - Cover image kampanye
   - Deskripsi lengkap
   - Form input jumlah donasi
   - Pilihan metode pembayaran

7. **Dashboard Sekolah** - School/Admin Role
   - Stats overview (siswa, lunas, tunggakan)
   - Chart pembayaran
   - Quick action menu

8. **Kelola Tagihan** - School/Admin Role
   - Search siswa
   - Filter status pembayaran
   - List siswa dengan status

9. **Kelola Kampanye** - School/Admin Role
   - Filter kampanye (aktif/pending/selesai)
   - Review dan approval kampanye
   - Edit dan tutup kampanye

10. **Profil Donatur** - Donor Role
    - Avatar dan info donatur
    - Stats donasi
    - Menu pengaturan

11. **Review Bantuan SPP** - School/Admin Role
    - List pengajuan bantuan
    - Detail siswa dan alasan
    - Approve/reject bantuan

12. **Riwayat Transaksi** - All Roles
    - Filter tipe transaksi
    - List transaksi grouped by month
    - Status dan nominal

---

## 📝 Template Caption untuk Dokumen TA

### Format Caption Gambar:

```
Gambar 4.1 Wireframe Halaman Login
Gambar 4.2 Wireframe Dashboard Siswa
Gambar 4.3 Wireframe Pembayaran SPP
Gambar 4.4 Wireframe Pengajuan Kampanye Donasi
Gambar 4.5 Wireframe Daftar Kampanye
Gambar 4.6 Wireframe Detail Kampanye dan Form Donasi
Gambar 4.7 Wireframe Dashboard Sekolah/Admin
Gambar 4.8 Wireframe Kelola Tagihan SPP
Gambar 4.9 Wireframe Kelola Kampanye
Gambar 4.10 Wireframe Profil Donatur
Gambar 4.11 Wireframe Review Pengajuan Bantuan
Gambar 4.12 Wireframe Riwayat Transaksi
```

### Contoh Penjelasan di Dokumen:

```
4.2 Perancangan Antarmuka (Wireframe)

Wireframe merupakan rancangan awal antarmuka sistem EDUFIN yang
menggambarkan tata letak, navigasi, dan elemen-elemen penting
pada setiap halaman. Wireframe dibuat dengan gaya low-fidelity
untuk fokus pada struktur dan flow aplikasi sebelum implementasi
high-fidelity design.

4.2.1 Wireframe Halaman Login

Gambar 4.1 menunjukkan wireframe halaman login yang merupakan
halaman awal aplikasi. Halaman ini terdiri dari:
- Logo EDUFIN di bagian atas
- Input field untuk email
- Input field untuk password
- Button "Masuk" sebagai primary action
- Link "Daftar Akun Baru" untuk registrasi

[Insert Gambar 4.1 di sini]

4.2.2 Wireframe Dashboard Siswa

Gambar 4.2 menunjukkan wireframe dashboard siswa yang menampilkan:
- Header dengan informasi user dan notifikasi
- Card tagihan SPP bulan berjalan
- Quick action buttons (Bayar Penuh/Cicilan)
- Statistics cards (Total bayar, Tagihan, Rata-rata)
- Grafik riwayat pembayaran
- List kampanye donasi yang sedang berjalan
- Bottom navigation dengan 4 menu utama

[Insert Gambar 4.2 di sini]

... dan seterusnya untuk setiap wireframe
```

---

## 🎨 Penjelasan Elemen Visual Wireframe

### Color Coding:

- **Biru (#1677FF):** Warna utama EDUFIN
  - Digunakan untuk header, primary buttons, dan elemen penting

- **Abu-abu (#F5F5F5):** Background dan placeholder
  - Kotak dengan border dashed untuk konten dinamis (gambar, chart)

- **Putih dengan border (#D9D9D9):** Container
  - Card, list items, dan grouping elements

- **Abu muda (#FAFAFA):** Input fields
  - Form input dengan border solid

### Typography Hierarchy:

- **Bold 14-16px:** Judul dan header
- **Regular 12-13px:** Body text dan labels
- **Light 10-11px:** Caption dan metadata

### Interactive Elements:

- **Primary Button:** Background biru, text putih
- **Secondary Button:** Background putih, border biru, text biru
- **List Item:** Border abu, rounded corners
- **Input Field:** Background abu muda, border abu

---

## 💡 Tips untuk Dokumentasi TA

### 1. Konsistensi Format
- Gunakan format gambar yang sama (PNG/JPG) untuk semua wireframe
- Pastikan resolusi cukup tinggi (minimal 1920x1080 untuk screenshot)
- Gunakan numbering yang konsisten

### 2. Penjelasan Lengkap
Untuk setiap wireframe, jelaskan:
- **Tujuan halaman:** Untuk apa halaman ini?
- **User role:** Siapa yang mengakses?
- **Elemen utama:** Apa saja komponen penting?
- **Interaksi:** User bisa melakukan apa?
- **Flow:** Dari/ke halaman mana?

### 3. Mapping ke Use Case
Hubungkan wireframe dengan use case diagram:
```
UC-001: Login System
Wireframe terkait: Gambar 4.1 (Halaman Login)

UC-002: Pembayaran SPP
Wireframe terkait:
- Gambar 4.2 (Dashboard Siswa - melihat tagihan)
- Gambar 4.3 (Halaman Pembayaran SPP)
```

### 4. User Flow Diagram
Buat flow diagram yang menunjukkan navigasi antar wireframe:
```
Login → Dashboard → Pilih Aksi → Form → Konfirmasi → Success
```

---

## 📦 Export untuk Presentasi

### PowerPoint/Google Slides:

1. Screenshot setiap wireframe dengan background
2. Insert ke slide dengan layout "Title and Content"
3. Tambahkan annotations (panah, highlight) untuk presentasi
4. Group wireframes berdasarkan user role atau flow

### Figma/Design Tools:

Jika ingin edit lebih lanjut:
1. Screenshot wireframe dalam resolusi tinggi
2. Import ke Figma/Adobe XD
3. Trace atau recreate dengan design tools
4. Export sebagai high-fidelity mockup

---

## 🔄 Update Wireframe

Jika ada perubahan requirement:

1. Edit file: `/src/app/components/wireframes/WireframeViewer.tsx`
2. Modifikasi screen components sesuai kebutuhan
3. Save dan refresh browser
4. Screenshot ulang yang berubah
5. Update di dokumen TA

---

## ✅ Checklist untuk Dokumen TA

- [ ] Screenshot semua 12 wireframe dengan resolusi bagus
- [ ] Beri caption dan numbering konsisten
- [ ] Tulis penjelasan untuk setiap wireframe (minimal 1 paragraf)
- [ ] Hubungkan dengan use case diagram
- [ ] Buat user flow diagram
- [ ] Jelaskan design rationale (kenapa layout seperti ini?)
- [ ] Mapping wireframe ke functional requirements
- [ ] Include design system (colors, typography, spacing)
- [ ] Peer review dengan dosen pembimbing

---

## 📞 FAQ

**Q: Apakah wireframe ini bisa diedit?**
A: Ya, edit file `WireframeViewer.tsx` sesuai kebutuhan.

**Q: Apakah harus screenshot satu-satu?**
A: Bisa print to PDF sekaligus, tapi screenshot per halaman lebih fleksibel untuk layout dokumen.

**Q: Resolusi berapa yang bagus untuk dokumen?**
A: Minimal 1920x1080 untuk screenshot, atau zoom browser ke 100-125% sebelum screenshot.

**Q: Bisa export ke Figma?**
A: Tidak langsung, tapi bisa screenshot lalu import ke Figma untuk diedit lebih lanjut.

**Q: Apakah wireframe ini sudah cukup untuk TA?**
A: Wireframe low-fidelity ini cukup untuk tahap perancangan. Untuk implementasi, gunakan screenshot aplikasi yang sudah jadi.

---

## 📚 Referensi Tambahan

### Buku/Paper tentang Wireframing:
- "Wireframing Essentials" - Matthew J. Hamm
- "The Elements of User Experience" - Jesse James Garrett
- "Don't Make Me Think" - Steve Krug

### Tools Alternatif:
- Balsamiq (sketchy wireframe)
- Figma (collaborative design)
- Adobe XD (UX design)
- Sketch (Mac only)

### Artikel:
- Nielsen Norman Group: "Wireflows: A UX Deliverable"
- UX Design: "Low-Fidelity vs High-Fidelity Wireframes"

---

**Dibuat:** 9 April 2026
**Platform:** EDUFIN - Sistem Keuangan Pendidikan
**Untuk:** Dokumentasi Tugas Akhir / Skripsi
**Author:** Tim EDUFIN
