# Product Requirements Document (PRD) - EDUFIN V2

**Version:** 2.0  
**Target:** Integrasi Supabase, Payment Gateway Asli, Pinjaman Mikro Sekolah & Transparansi Donasi.

## 1. Executive Summary
V2 membawa EDUFIN dari prototype (localStorage) menjadi sistem real-world dengan database terpusat, payment gateway otomatis, serta ekosistem sosial-finansial berupa donasi subsidi silang dan pinjaman mikro dari dana kas sekolah.

## 2. Fitur Utama Baru (V2)

### A. Integrasi Gateway Asli (Midtrans/Xendit)
- Pembayaran otomatis menggunakan Virtual Account (VA), QRIS, E-Wallet.
- Webhook listener untuk auto-update status pembayaran dari "Belum Bayar" ke "Lunas".

### B. Migrasi ke Real Database (Supabase)
- Transisi dari localStorage ke PostgreSQL via Supabase.
- Otentikasi aman menggunakan Supabase Auth (Email/Password & OAuth).

### C. Pinjaman Mikro (Kas Sekolah)
- Sekolah menyediakan pinjaman jangka pendek untuk keperluan mendesak siswa (seragam, buku).
- Sumber dana: **Kas Mandiri Sekolah** (risiko ditanggung sekolah).
- Admin sekolah memiliki akses CRUD penuh untuk mengatur limit, tenor, dan bunga (jika ada).

### D. Donasi & Subsidi Silang + Transparansi ("Feed Update")
- Orang tua siswa lain dan publik bisa menjadi donatur bagi siswa kurang mampu.
- Fitur "Feed Update" pada Campaign:
  - Siswa/sekolah **wajib** mengunggah foto nota pembelian/barang sebagai bukti penggunaan dana.
  - Saat ada update, sistem mengirimkan **notifikasi/email** ke donatur terkait, mengarahkan mereka ke halaman spesifik Campaign.
  - Memastikan 100% transparansi aliran dana donasi.

## 3. Metriks Kesuksesan V2
1. **Kepercayaan Donatur**: Peningkatan donasi berulang sebesar 40% akibat fitur Feed Update.
2. **Kolektibilitas Tagihan**: Penurunan angka tunggakan sebesar 30% via fitur Pinjaman Mikro & subsidi silang.
3. **Automasi**: 99% rekonsiliasi SPP tidak lagi manual berkat integrasi Payment Gateway.
