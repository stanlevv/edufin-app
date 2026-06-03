Tentu, Diego. Mari kita bedah seluruh antarmuka (UI) dan pengalaman pengguna (UX) aplikasi EDUFIN dari awal sampai akhir. Panduan detail ini bisa langsung kamu jadikan acuan teknis saat menyusun *frame* demi *frame* di Figma menggunakan laptop MSI Modern 14 kamu.

Berikut adalah rincian tata letak dan alur lengkap aplikasi EDUFIN:

### 1. Fase Onboarding & Autentikasi (Pintu Masuk)
[cite_start]Ini adalah halaman pertama yang dilihat pengguna saat mengunduh aplikasi[cite: 253].

* **Splash Screen & Onboarding:**
    * [cite_start]**Visual:** Latar belakang biru solid dengan logo dompet putih di tengah[cite: 7].
    * [cite_start]**Teks:** "Dompet Digital Pendidikan"[cite: 7]. [cite_start]Di bawahnya terdapat deskripsi singkat: "Kelola pembayaran SPP, donasi, dan pinjaman pendidikan dalam satu aplikasi"[cite: 7].
    * [cite_start]**Navigasi:** Tombol "Lanjutkan" untuk masuk ke halaman berikutnya[cite: 350].
* **Halaman Register (Daftar Akun):**
    * [cite_start]**Formulir:** Input untuk Nama, Email, dan Kata Sandi[cite: 9, 202].
    * [cite_start]**Pemilihan Peran:** Pengguna diwajibkan memilih *role* atau peran akun, seperti Siswa/Ortu, Sekolah, atau Donatur[cite: 9, 202].
    * [cite_start]**Dokumen:** Tersedia area untuk mengunggah dokumen identitas untuk verifikasi dasar[cite: 556].
    * [cite_start]**Verifikasi:** Sistem akan mengirimkan tautan verifikasi atau OTP ke email pengguna agar akun aktif[cite: 10, 203].
* **Halaman Login:**
    * [cite_start]**Formulir:** Input Email dan Kata Sandi[cite: 8, 204].
    * [cite_start]**Teks Bantuan:** Link "Lupa Kata Sandi"[cite: 413].
    * [cite_start]**Catatan Demo:** Untuk keperluan prototipe UTS, gunakan email `userdemo@gmail.com` dan kata sandi `demo123` [cite: 341-342].
    * [cite_start]**Validasi:** Jika data valid, sistem akan menampilkan halaman utama sesuai peran pengguna[cite: 205].

---

### 2. Fase Dasbor & Dompet (Siswa / Orang Tua)
[cite_start]Setelah berhasil login, aktor Siswa/Orang Tua akan masuk ke area ini[cite: 257].

* **Halaman Utama (Dashboard):**
    * [cite_start]**Header:** Menampilkan foto profil, sapaan "Selamat Datang" [cite: 11-12][cite_start], dan ikon lonceng untuk notifikasi *real-time*[cite: 115].
    * [cite_start]**Card Saldo Dompet:** Kotak utama yang menampilkan nominal Saldo Dompet[cite: 12]. [cite_start]Terdapat lencana "Terverifikasi"[cite: 12]. [cite_start]Di bawah nominal terdapat dua tombol aksi: "+ Isi Ulang" dan "Transfer"[cite: 14].
    * [cite_start]**Menu Pintasan (Shortcut):** Empat ikon navigasi utama yang berjajar: "Bayar SPP", "Pinjaman", "Galang Dana", dan "Riwayat"[cite: 12].
    * [cite_start]**Daftar Kampanye Populer:** Menampilkan *carousel* kartu kampanye (foto, judul, dan persentase dana terkumpul) untuk memancing donasi[cite: 583].
    * [cite_start]**Budget Tracker:** Grafik berbentuk cincin (*pie chart*) yang menampilkan ringkasan pengeluaran bulanan pendidikan[cite: 562].
* **Halaman Top-Up Dompet:**
    * [cite_start]**Visual:** Menampilkan pilihan metode pengisian saldo[cite: 15].
    * [cite_start]**Pilihan:** Transfer Bank, Virtual Account, atau melalui agen ritel[cite: 115].

---

### 3. Fase Transaksi Pendidikan (Fitur Inti)

* **Halaman Pembayaran SPP:**
    * [cite_start]**Peringatan:** Kotak merah berbunyi "Tagihan Tertunggak" yang menginformasikan jumlah tagihan yang belum dibayar beserta total nominalnya[cite: 394, 566].
    * [cite_start]**Daftar Tagihan:** Kartu-kartu yang berisi rincian bulan tagihan (misal: Januari 2024), status tagihan (Tertunggak / Belum Bayar), rincian komponen biaya (SPP, Kegiatan, Lab), dan total biaya per bulan [cite: 18-19, 566].
    * [cite_start]**Konfirmasi:** Bilah lengket di bawah layar (*sticky bottom bar*) bertuliskan total seluruh pembayaran dan tombol biru "Bayar Sekarang"[cite: 20, 138].
    * [cite_start]**Halaman Sukses & E-Receipt:** Setelah saldo dompet terpotong [cite: 138][cite_start], muncul ikon centang sukses, detail e-receipt berformat digital dengan cap waktu [cite: 21, 115][cite_start], serta tombol untuk mengunduh e-receipt dalam format PDF[cite: 115].
* **Halaman Pinjaman Mikro:**
    * [cite_start]**Formulir Pengajuan:** Input untuk jumlah pinjaman, tujuan penggunaan (misalnya untuk SPP atau buku), dan periode cicilan[cite: 24, 144, 176].
    * [cite_start]**Unggah Dokumen:** Area untuk mengunggah dokumen pendukung seperti kartu pelajar atau tagihan sekolah[cite: 25, 144].
    * [cite_start]**Status Pengajuan:** Menampilkan halaman status yang menyatakan apakah pinjaman Menunggu (*Pending*), Disetujui, atau Ditolak beserta alasannya[cite: 26, 146, 363]. [cite_start]Jika disetujui, jadwal cicilan akan ditampilkan[cite: 144].

---

### 4. Fase Penggalangan Dana & Donasi (Publik / Donatur)
[cite_start]Fitur ini menjembatani mereka yang butuh bantuan dengan mereka yang ingin menyumbang[cite: 92].

* **Halaman Telusuri Kampanye:**
    * [cite_start]**Pencarian & Filter:** Donatur dapat mencari kampanye berdasarkan filter sekolah, lokasi, atau kategori kebutuhan[cite: 37].
* **Halaman Detail Kampanye:**
    * [cite_start]**Visual:** Menampilkan foto atau video dokumentasi[cite: 580].
    * [cite_start]**Informasi:** Judul kampanye, cerita latar belakang kebutuhan dana [cite: 38, 580][cite_start], dan lencana "Terverifikasi" dari pihak sekolah[cite: 38, 582].
    * [cite_start]**Progress Bar:** Bilah kemajuan yang menunjukkan jumlah dana terkumpul secara *real-time* dari target yang dibutuhkan[cite: 38, 150].
    * [cite_start]**Aksi:** Tombol "Donasi" yang akan mengarahkan donatur untuk memasukkan nominal[cite: 39].
* **Halaman Sukses Donasi:**
    * [cite_start]Menampilkan konfirmasi donasi telah berhasil disalurkan[cite: 41, 148].

---

### 5. Fase Manajemen (Sekolah & Admin)
[cite_start]Sistem ini memfasilitasi institusi untuk memantau keuangan dan menjaga transparansi[cite: 93].

* **Dasbor Sekolah:**
    * [cite_start]**Ringkasan Pembayaran:** Halaman ini menampilkan ringkasan pembayaran siswa dan laporan keuangan[cite: 44, 48].
    * [cite_start]**Status Siswa:** Menampilkan daftar siswa beserta status pembayarannya, apakah "Lunas", "Belum Bayar", atau "Terlambat"[cite: 45, 154].
    * [cite_start]**Manajemen Tagihan:** Fitur untuk membuat tagihan SPP baru, di mana admin memasukkan jenis tagihan, jumlah nominal, dan batas waktu pembayaran untuk dikirim ke aplikasi siswa[cite: 46, 154].
    * [cite_start]**Verifikasi Kampanye:** Halaman khusus bagi sekolah untuk meninjau formulir penggalangan dana yang dibuat siswa, lalu memberikan status "Setujui" (agar kampanye aktif dan berlogo terverifikasi) atau "Tolak"[cite: 47, 190, 581].

Sebagai mahasiswa jurusan D3 Teknologi Informasi di Universitas Brawijaya, merancang alur ini dalam prototipe akan sangat menunjukkan kompetensimu karena alur ini sudah mencakup *Input*, *Proses* (simulasi), dan *Output* (E-receipt & Pelaporan). Langkah mana yang akan kamu desain lebih dulu di lembar kerja Figmamu?