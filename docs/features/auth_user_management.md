# 🔐 Spesifikasi Fitur: Autentikasi & Manajemen Pengguna (Auth & User Management)

## 1. Deskripsi Fitur
Modul ini mengelola pendaftaran akun, autentikasi multi-role (Siswa/Orang Tua, Admin Sekolah, Donatur, Super Admin), pemulihan kata sandi, pengaturan sesi (JWT), dan perlindungan rute halaman berdasarkan wewenang pengguna.

---

## 2. Aktor / Role Terkait
- **Siswa / Orang Tua:** Dapat mendaftar jika data NISN telah di-import oleh Sekolah, masuk ke Mobile PWA.
- **Admin Sekolah:** Dibuatkan oleh Super Admin, dapat masuk ke dashboard desktop, dapat menambahkan admin sekolah tambahan.
- **Donatur:** Registrasi mandiri menggunakan email atau Google OAuth, dapat berdonasi dengan/tanpa login (Guest Checkout).
- **Super Admin:** Menggunakan rute/URL khusus untuk masuk dan mengelola seluruh sistem.

---

## 3. Alur UX & Rute Halaman
- `/` — **Halaman Onboarding (Splash Screen)**: Pengguna memilih role mereka atau melihat sekilas tentang EDUFIN sebelum dialihkan ke login/halaman publik.
- `/login` — **Halaman Masuk**:
  - Input: Email & Password.
  - Validasi: Validasi format email, sandi minimal 8 karakter.
  - Fitur: Checkbox "Ingat Saya" (Remember Me) untuk memperpanjang durasi sesi.
- `/register` — **Halaman Pendaftaran**:
  - Pilihan pendaftaran bagi Donatur & Siswa.
  - Untuk Siswa/Orang Tua: Harus mencocokkan NISN dan email orang tua yang di-import sekolah.
- `/forgot-password` / `/reset-password` (📋 Rencana):
  - Mengirim tautan reset kata sandi ke email pengguna.
  - Validasi kekuatan sandi baru (minimal 8 karakter, 1 huruf kapital, 1 angka).

---

## 4. Skema Database & Entitas Terkait
Modul ini memanfaatkan tabel bawaan Supabase Auth (`auth.users`) dan tabel custom berikut:

### `school_admins` (Admin Sekolah)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `auth.users`)
- `school_id` (UUID, Foreign Key → `schools`)
- `name` (String)
- `email` (String)
- `role` (String - e.g., 'Full Admin', 'Finance Only')
- `permissions` (JSONB - e.g., `{"finance": true, "students": true}`)
- `is_super_admin` (Boolean)

### `students` (Siswa - untuk pemetaan orang tua)
- `user_id` (UUID, Foreign Key → `auth.users`, nullable) - dihubungkan saat orang tua menerima email undangan dan membuat password.
- `nisn` (String, 10 digit) - sebagai identifier unik siswa.
- `parent_email` (String) - digunakan untuk mencocokkan pendaftaran/invitasi.

---

## 5. Integrasi API & Edge Functions
- **Supabase Auth API**: Untuk Sign In, Sign Up, Sign Out, dan Password Reset.
- `POST /functions/v1/send-parent-invite` (📋 Rencana): Mengirim email undangan pendaftaran ke email orang tua saat data siswa di-import admin sekolah.

---

## 6. Status Implementasi Detail
- ✅ **Halaman Onboarding (`OnboardingPage.tsx`)**: Selesai (UI/UX responsif).
- ✅ **Halaman Login (`LoginPage.tsx`)**: Selesai dengan fallback LocalStorage jika Supabase offline.
- ✅ **Halaman Register (`RegisterPage.tsx`)**: Selesai dengan form pendaftaran lengkap.
- ✅ **ProtectedRoute (`ProtectedRoute.tsx`)**: Komponen pembatas rute berbasis JWT role (`siswa`, `sekolah`, `donatur`).
- 🚧 **Integrasi Supabase Auth & JWT Claims**: Sesi sudah di-handle oleh `AuthContext.tsx` namun RLS (Row Level Security) database dan email verifikasi/undangan masih dalam tahap integrasi (Phase 1).
- 📋 **Sistem Multi-Admin Permission**: Pengaturan izin granular bagi sub-admin sekolah belum diimplementasikan di backend.

---

## E. Perancangan

### 1. Identifikasi User

| No | Aktor | Deskripsi |
|----|-------|-----------|
| 1 | Super Admin (EDUFIN) | Super Admin adalah pihak internal EDUFIN yang mendaftarkan sekolah baru dan membuat akun admin sekolah pertama ke dalam sistem. |
| 2 | Admin Sekolah | Admin Sekolah adalah pengguna yang mendapatkan akun dari Super Admin. Admin dapat mengelola data siswa dan mengundang orang tua untuk bergabung. |
| 3 | Siswa / Orang Tua | Siswa/Orang Tua adalah pengguna yang menggunakan aplikasi mobile PWA untuk membayar SPP, melihat tagihan, dan mengelola kampanye. Akun dibuat melalui tautan undangan dari sekolah. |
| 4 | Donatur | Donatur adalah pengguna publik yang dapat mendaftar secara mandiri menggunakan email atau Google OAuth, kemudian melakukan donasi ke kampanye siswa. |

---

### a. Daftar Kebutuhan / Use Case

| No | Kebutuhan | Aktor |
|----|-----------|-------|
| 1 | Pengguna harus dapat masuk (login) menggunakan email dan kata sandi. | Super Admin, Admin Sekolah, Siswa/Orang Tua, Donatur |
| 2 | Pengguna harus dapat keluar (logout) dari sesi aktif. | Super Admin, Admin Sekolah, Siswa/Orang Tua, Donatur |
| 3 | Sistem harus membedakan akses halaman berdasarkan role pengguna (Protected Route). | Semua Role |
| 4 | Admin Sekolah dapat mendaftarkan dirinya setelah menerima undangan dari Super Admin. | Admin Sekolah |
| 5 | Siswa/Orang Tua dapat mendaftar setelah menerima tautan undangan yang dikirim sekolah ke email orang tua. | Siswa / Orang Tua |
| 6 | Donatur dapat mendaftar secara mandiri menggunakan email atau Google OAuth. | Donatur |
| 7 | Pengguna dapat meminta tautan reset kata sandi melalui email (Lupa Password). | Semua Role |
| 8 | Pengguna dapat mengganti kata sandi dari halaman pengaturan profil. | Semua Role |
| 9 | Sistem harus memverifikasi kekuatan kata sandi baru (min. 8 karakter, 1 huruf kapital, 1 angka). | Semua Role |
| 10 | Admin Sekolah dapat menambahkan sub-admin sekolah lain dengan izin granular (Full Admin, Finance Only, View Only). | Admin Sekolah |

---

### b. Use Case Diagram

> 📌 **[Diagram Use Case Terlampir]**
> *Diagram Use Case modul Autentikasi & Manajemen Pengguna menggambarkan interaksi antara 4 aktor (Super Admin, Admin Sekolah, Siswa/Orang Tua, Donatur) dengan use case: Login, Logout, Register, Forgot Password, Reset Password, Invite User, dan Manage Permission.*

---

### c. Flowchart Sistem

> 📌 **[Flowchart Sistem Terlampir]**
> *Flowchart menggambarkan alur: Pengguna membuka aplikasi → Cek status sesi (JWT) → Jika belum login: tampil halaman Onboarding/Login → Input email & password → Validasi role di database → Redirect ke dashboard sesuai role. Jika sesi aktif: langsung redirect ke halaman utama role.*

---

### d. Perancangan Database

#### Normalisasi Tabel

**Tabel: `auth.users`** *(Bawaan Supabase Auth)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| email | VARCHAR | Email unik pengguna |
| encrypted_password | TEXT | Sandi terenkripsi (bcrypt) |
| created_at | TIMESTAMP | Waktu akun dibuat |
| confirmed_at | TIMESTAMP | Waktu email dikonfirmasi |

**Tabel: `school_admins`**

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key → `auth.users.id` |
| school_id | UUID | Foreign Key → `schools.id` |
| name | VARCHAR | Nama lengkap admin |
| email | VARCHAR | Email admin |
| role | VARCHAR | Peran: 'Full Admin', 'Finance Only', 'View Only' |
| permissions | JSONB | Hak akses granular (e.g., `{"finance": true}`) |
| is_super_admin | BOOLEAN | TRUE jika Super Admin EDUFIN |
| created_at | TIMESTAMP | Waktu data dibuat |

**Tabel: `students`** *(Sebagian atribut terkait autentikasi)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key → `auth.users.id` (nullable, diisi saat undangan diterima) |
| nisn | CHAR(10) | Nomor Induk Siswa Nasional (10 digit) |
| parent_email | VARCHAR | Email orang tua untuk pengiriman undangan |
| invite_sent_at | TIMESTAMP | Waktu undangan dikirim |
| invite_accepted_at | TIMESTAMP | Waktu undangan diterima (nullable) |

#### Relasi Antar Tabel

| Tabel Asal | Atribut FK | Tabel Tujuan | Atribut PK | Jenis Relasi |
|------------|------------|--------------|------------|--------------|
| `school_admins` | `user_id` | `auth.users` | `id` | Many-to-One |
| `school_admins` | `school_id` | `schools` | `id` | Many-to-One |
| `students` | `user_id` | `auth.users` | `id` | One-to-One (nullable) |
| `students` | `school_id` | `schools` | `id` | Many-to-One |
