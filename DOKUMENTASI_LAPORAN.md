# DOKUMENTASI SISTEM EDUFIN (LAPORAN PROYEK)

Dokumen ini disusun untuk merangkum seluruh aspek teknis dan perancangan sistem aplikasi EDUFIN. Sangat cocok digunakan sebagai lampiran atau isi dari Bab Laporan / Skripsi.

---

## 1. FITUR / MODUL WEBSITE

Aplikasi EDUFIN dibagi menjadi 4 modul utama berdasarkan *Role* pengguna:

### A. Modul Publik (Tanpa Login)
- **Landing Page**: Halaman utama pengenalan platform.
- **Daftar Kampanye (Fundraising)**: Menampilkan daftar kampanye galang dana siswa yang aktif.
- **Checkout Donasi**: Halaman pembayaran untuk donatur anonim menggunakan Xendit Gateway (QRIS, VA, E-Wallet).

### B. Modul Siswa & Orang Tua (Mobile First)
- **Dashboard Siswa**: Ringkasan tagihan SPP bulan ini dan status pembayaran.
- **Pembayaran SPP**: Fitur untuk membayar SPP langsung melalui Xendit.
- **Riwayat Transaksi**: Daftar riwayat pembayaran SPP yang telah lunas.
- **Pengajuan Kampanye**: Form pengajuan galang dana untuk siswa kurang mampu.

### C. Modul Admin Sekolah (Desktop First)
- **Dashboard Admin**: Statistik total penerimaan SPP, outstanding payment, dan jumlah siswa.
- **Manajemen Siswa**: CRUD data siswa dan integrasi NISN.
- **Manajemen Tagihan**: Pembuatan tagihan masal dan verifikasi pembayaran tunai/manual.
- **Verifikasi Kampanye**: Fitur *approval* untuk kampanye galang dana yang diajukan siswa.

### D. Modul Super Admin
- **Manajemen Tenant (Sekolah)**: Pendaftaran sekolah baru (Multi-tenant).
- **Monitoring Platform**: Melihat total GMV dan aktivitas lintas sekolah.

---

## 2. AUTENTIKASI & MANAJEMEN PENGGUNA

### Identifikasi User
Sistem menggunakan **Supabase Auth** untuk mengelola identitas pengguna. 
Terdapat 4 jenis `role` yang membedakan akses setiap user:
1. `siswa` / `orang_tua`: Akses modul SPP.
2. `donatur`: Akses riwayat donasi.
3. `sekolah` (Admin Sekolah): Akses dashboard sekolah.
4. `superadmin`: Akses tertinggi platform.

### Routing & Keamanan Frontend (React Router)
- **Public Routes**: `/` (Home), `/register`, `/forgot-password`.
- **Protected Routes**: `/student/*`, `/donor/*`, `/school/*`. Akses dibatasi menggunakan komponen `ProtectedRoute.tsx` yang mengecek `user.role`.
- **Obscure Routes (Security through Obscurity)**:
  Untuk mencegah serangan *brute force*, jalur masuk admin disembunyikan:
  - Admin Sekolah: `/sekolah-portal-auth`
  - Super Admin: `/super-console-auth`
  Mencoba login admin melalui `/login` biasa akan diblokir seketika.

### Keamanan Backend (Row Level Security / RLS)
Seluruh tabel di PostgreSQL Supabase dilindungi oleh **Row Level Security (RLS)**:
- Siswa hanya dapat melakukan `SELECT` pada baris data `payments` dan `students` miliknya sendiri.
- Admin Sekolah hanya dapat melihat data yang memiliki `school_id` sesuai dengan tenant-nya.
- RLS memastikan bahwa kebocoran API Key (Anon Key) tidak akan mengakibatkan pencurian data.

---

## 3. STRUKTUR PROJECT (TEKNOLOGI)

Proyek ini dibangun menggunakan arsitektur **Vite + React + TypeScript + Supabase**:

```text
edufin-app/
├── src/
│   ├── app/
│   │   ├── components/      # UI Components (React)
│   │   │   ├── admin/       # Komponen Super Admin & Login rahasia
│   │   │   ├── auth/        # Login & Register Siswa/Donatur
│   │   │   ├── donor/       # Dashboard Donatur
│   │   │   ├── school/      # Dashboard Admin Sekolah
│   │   │   ├── shared/      # AppLayout, Navbar, Guard Routes
│   │   │   └── student/     # Dashboard Siswa
│   │   ├── context/         # AuthContext.tsx (Global State Manajemen Role)
│   │   └── routes.tsx       # Definisi React Router & Lazy Loading
│   ├── lib/
│   │   └── supabase.ts      # Koneksi ke Backend Database
│   └── styles/              # Tailwind CSS
├── supabase/
│   └── migrations/          # File SQL untuk skema DB dan kebijakan RLS
└── package.json             # Dependensi (Lucide, Tailwind, React Router)
```

---

## 4. DAFTAR KEBUTUHAN / USE CASE

1. **UC-01 (Login)**: Pengguna memasukkan email dan password untuk masuk ke sistem sesuai role.
2. **UC-02 (Bayar SPP)**: Siswa memilih tagihan, memilih metode (QRIS/VA), dan sistem Xendit memproses pembayaran.
3. **UC-03 (Manajemen Tagihan)**: Admin membuat tagihan SPP bulanan untuk seluruh kelas.
4. **UC-04 (Donasi Publik)**: Donatur memilih kampanye aktif dan memberikan dana melalui Xendit.
5. **UC-05 (Setup Sekolah)**: Super admin mendaftarkan sekolah baru ke dalam database.

---

## 5. PERANCANGAN DATABASE (TAHAPAN NORMALISASI)

Berikut adalah simulasi bagaimana desain database EDUFIN dibentuk melalui tahapan normalisasi:

### 1. Unnormalized Form (UNF)
Pada tahap awal, data diasumsikan berbentuk dokumen mentah (kuitansi/excel) di mana satu baris berisi semuanya:
*NPSN_Sekolah, Nama_Sekolah, NISN_Siswa, Nama_Siswa, Tagihan_Bulan, Nominal_Tagihan, Status_Bayar, Metode_Bayar, Tgl_Bayar.*
**Masalah**: Redundansi sangat tinggi. Nama sekolah akan diulang ribuan kali di setiap tagihan siswa.

### 2. First Normal Form (1NF)
Menghilangkan atribut *multivalued* (nilai ganda). Setiap perpotongan baris dan kolom hanya memiliki 1 nilai atomic.
- Data dipisahkan menjadi tabel *flat* tunggal.
- Tidak ada kumpulan list di dalam satu kolom (misalnya: kolom tagihan dipecah menjadi baris-baris tagihan yang berbeda).

### 3. Second Normal Form (2NF)
Menghilangkan ketergantungan parsial (Partial Dependency). Jika tabel memiliki *Composite Primary Key*, maka atribut non-key harus bergantung pada seluruh *primary key*.
- **Pemisahan**: Data Siswa dan Data Pembayaran dipisah.
- Terbentuk **Tabel Siswa** (PK: `nisn`) dan **Tabel Pembayaran** (PK: `id_pembayaran`, FK: `nisn`).
**Masalah tersisa**: Data sekolah (Nama Sekolah, Alamat) masih menempel di Tabel Siswa, padahal data sekolah tidak bergantung sepenuhnya pada NISN Siswa (Transitif).

### 4. Third Normal Form (3NF)
Menghilangkan ketergantungan transitif (Transitive Dependency). Kolom non-key tidak boleh bergantung pada kolom non-key lainnya.
- **Pemisahan**: Tabel Sekolah dibuat berdiri sendiri.
- Terbentuk **Tabel Sekolah** (PK: `id_sekolah`), yang kemudian direlasikan ke Tabel Siswa (FK: `school_id`).
- Struktur ini adalah struktur akhir yang diterapkan di Supabase EDUFIN.

---

## 6. TABEL & RELASI TABEL (ERD)

Desain Database menggunakan pendekatan **Multi-Tenant** di mana `school_id` menjadi jembatan antar relasi.

### Tabel Utama:
1. **users** (Auth)
   - Kolom: `id` (PK), `email`, `role`, `name`.
2. **schools** (Tenant)
   - Kolom: `id` (PK), `npsn`, `name`, `city`.
3. **students**
   - Kolom: `id` (PK), `school_id` (FK), `user_id` (FK), `nisn`, `name`, `class`.
   - Relasi: Belongs to `schools`, Belongs to `users`.
4. **payments** (Tagihan & Transaksi)
   - Kolom: `id` (PK), `school_id` (FK), `student_id` (FK), `amount`, `status`, `month`.
   - Relasi: Belongs to `students`.
5. **campaigns** (Galang Dana)
   - Kolom: `id` (PK), `school_id` (FK), `title`, `target_amount`, `status`.
   - Relasi: Belongs to `schools`.

### Kardinalitas Relasi:
- **1 Sekolah** memiliki **Banyak (N)** Siswa (1:N).
- **1 Siswa** memiliki **1** Akun User (1:1).
- **1 Siswa** memiliki **Banyak (N)** Tagihan Pembayaran (1:N).
- **1 Sekolah** memiliki **Banyak (N)** Kampanye Galang Dana (1:N).
