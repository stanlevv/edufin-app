# UI/UX Guide - EDUFIN V2

## 1. Halaman Campaign (Donor & Student View)
**Perubahan (V2):**
- Tab baru "Feed Transparansi" di dalam halaman detil Campaign.
- Jika campaign kosong dari Feed, tampilkan Empty State: *"Belum ada laporan dari kampanye ini."* dengan ikon ilustrasi kasir/nota.
- **Card Feed**: Harus menampilkan Tanggal, Judul Update, Teks Deskripsi, Thumbnail Gambar Nota (bisa diklik untuk full screen modal), dan Nominal pengeluaran.
- Layout harus mobile-first (max-width 430px) karena target audiens utama (donatur dan siswa) menggunakan mobile smartphone.

## 2. Halaman Pinjaman Mikro (Siswa)
- Tombol CTA "Ajukan Pinjaman Mendesak" (warna Orange Warning `#FD9A16` agar membedakan dari fitur utama).
- Modal pengajuan memuat input range untuk tenor cicilan (1-12 bulan) yang secara dinamis mengubah simulasi jumlah cicilan per bulan di UI.

## 3. Dashboard Admin Sekolah (Desktop View)
- Sidebar Menu Baru: "Pinjaman" dan "Verifikasi Update".
- Tabel Pinjaman Mikro dilengkapi Badge Status (Pending - Kuning, Approved - Hijau, Rejected - Merah).
- Laporan Bulanan (Report) memiliki view PDF generatif yang elegan.

## 4. Micro-Interactions (Aesthetic)
- Saat pembayaran Midtrans sukses, muncul efek konfeti di layar dan animasi centang Lunas.
- Card "Feed Transparansi" diberi *smooth hover elevation* dan shadow.
