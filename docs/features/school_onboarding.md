# 🏫 Spesifikasi Fitur: Onboarding Sekolah (Multi-Tenant)

## 1. Deskripsi Fitur
Modul ini menangani proses registrasi sekolah baru ke dalam platform (multi-tenant), pengaturan profil sekolah, rekening pencairan, penetapan SPP default, serta pengimporan data siswa secara massal menggunakan berkas CSV/Excel.

---

## 2. Aktor / Role Terkait
- **EDUFIN Super Admin:** Pihak yang mendaftarkan sekolah pertama kali, membuat tenant ID (`school_id`), serta akun admin sekolah utama.
- **Admin Sekolah:** Melakukan konfigurasi lanjutan (logo, bank, tahun ajaran) dan melakukan impor data siswa.

---

## 3. Alur UX & Rute Halaman
- **Super Admin Panel** (📋 Rencana): Form pengisian profil dasar sekolah (Nama, NPSN, Kota, Tingkat Sekolah).
- `/school/profile` — **Halaman Profil Sekolah**:
  - Formulir informasi sekolah (`SchoolDataForm.tsx`).
  - Unggah logo sekolah.
  - Formulir Rekening Bank (`BankAccountForm.tsx`) untuk tujuan pencairan dana kampanye donasi.
  - Formulir Tahun Ajaran & SPP Default (`AcademicYearForm.tsx`).
- `/school/students` — **Impor Siswa Massal**:
  - Tombol "Impor CSV" yang menampilkan modal pengunggahan berkas.
  - Tinjauan data (Preview Table) sebelum disimpan secara permanen.
  - Validasi format NISN (10 digit angka) dan email valid.

---

## 4. Skema Database & Entitas Terkait

### `schools` (Master Tenant)
- `id` (UUID, Primary Key)
- `npsn` (String, 8 digit unik)
- `name` (String)
- `address` (Text)
- `city` (String)
- `province` (String)
- `level` (Enum: 'sd', 'smp', 'sma', 'smk')
- `logo_url` (String, nullable)
- `bank_name` (String), `bank_account_number` (String), `bank_account_name` (String)
- `status` (Enum: 'active', 'suspended')

### `students` (Siswa)
Setiap siswa terikat pada `school_id` untuk isolasi data multi-tenant.
- `id` (UUID, Primary Key)
- `school_id` (UUID, Foreign Key → `schools`)
- `nisn` (String, 10 digit)
- `name` (String)
- `class` (String - e.g., '7A')
- `grade` (Integer - e.g., 7)
- `parent_name` (String), `parent_email` (String), `parent_phone` (String)
- `spp_amount` (Integer - nominal SPP bulanan default)
- `status` (Enum: 'aktif', 'nonaktif', 'lulus')

---

## 5. Integrasi API & Edge Functions
- `POST /functions/v1/import-students-csv` (📋 Rencana): Memproses berkas CSV yang diunggah, memvalidasi isinya, menyisipkan data siswa ke database, dan men-trigger email undangan ke wali murid.

---

## 6. Status Implementasi Detail
- ✅ **Setup Data Sekolah & Rekening Bank**: Fitur UI selesai di `/school/profile` dengan modal input (`BankAccountForm.tsx`, `SchoolDataForm.tsx`).
- ✅ **Bulk Import UI**: Modal drag-and-drop CSV dan pratinjau tabel sebelum impor telah diimplementasikan di halaman `/school/students`.
- 🚧 **Isolasi Data RLS (Row Level Security)**: Struktur database telah didesain dengan kolom `school_id` di setiap tabel utama, namun kebijakan RLS di Supabase masih perlu dikonfigurasi sepenuhnya (Phase 1).
- 📋 **Automated Welcome Email**: Pengiriman email kredensial sementara saat sekolah dibuat belum aktif.

---

## E. Perancangan

### 1. Identifikasi User

| No | Aktor | Deskripsi |
|----|-------|-----------|
| 1 | Super Admin (EDUFIN) | Super Admin adalah pihak yang mendaftarkan sekolah baru ke platform, membuat tenant ID dan akun admin sekolah pertama. |
| 2 | Admin Sekolah | Admin Sekolah adalah pengelola yang melengkapi profil sekolah, mengunggah logo, mengatur rekening bank, dan mengimpor data siswa. |

---

### a. Daftar Kebutuhan / Use Case

| No | Kebutuhan | Aktor |
|----|-----------|-------|
| 1 | Super Admin dapat mendaftarkan sekolah baru dengan mengisi data NPSN, nama, kota, dan tingkat sekolah. | Super Admin |
| 2 | Sistem harus membuat tenant ID (`school_id`) unik untuk setiap sekolah yang terdaftar. | Super Admin |
| 3 | Super Admin dapat membuat akun admin sekolah pertama (email + kata sandi sementara). | Super Admin |
| 4 | Sistem harus mengirimkan email berisi kredensial awal ke kepala sekolah/admin utama. | Super Admin |
| 5 | Admin Sekolah dapat mengunggah logo sekolah dari halaman pengaturan profil. | Admin Sekolah |
| 6 | Admin Sekolah dapat mengisi data rekening bank untuk tujuan pencairan dana donasi. | Admin Sekolah |
| 7 | Admin Sekolah dapat menetapkan nominal SPP default per kelas/angkatan. | Admin Sekolah |
| 8 | Admin Sekolah dapat mengimpor data siswa secara massal melalui file CSV/Excel. | Admin Sekolah |
| 9 | Sistem harus menampilkan pratinjau data sebelum impor dikonfirmasi. | Admin Sekolah |
| 10 | Sistem harus memvalidasi format NISN (10 digit) dan email orang tua sebelum impor tersimpan. | Admin Sekolah |

---

### b. Use Case Diagram

> 📌 **[Diagram Use Case Terlampir]**
> *Diagram Use Case modul Onboarding Sekolah menggambarkan interaksi Super Admin dalam mendaftarkan sekolah baru, dan Admin Sekolah dalam melengkapi profil, rekening bank, tahun ajaran SPP, serta melakukan impor siswa massal dari CSV.*

---

### c. Flowchart Sistem

> 📌 **[Flowchart Sistem Terlampir]**
> *Flowchart menggambarkan alur: Super Admin login → Buka panel Manajemen Sekolah → Isi form data sekolah (NPSN, nama, kota) → Sistem buat `school_id` baru → Kirim email undangan ke Admin Sekolah → Admin Sekolah login → Lengkapi profil sekolah (logo, rekening, SPP) → Impor siswa via CSV → Validasi data → Simpan ke database → Kirim email undangan massal ke orang tua.*

---

### d. Perancangan Database

#### Normalisasi Tabel

**Tabel: `schools`**

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key (Tenant ID) |
| npsn | CHAR(8) | Nomor Pokok Sekolah Nasional (unik) |
| name | VARCHAR | Nama sekolah |
| address | TEXT | Alamat lengkap sekolah |
| city | VARCHAR | Kota |
| province | VARCHAR | Provinsi |
| level | ENUM | Jenjang: 'sd', 'smp', 'sma', 'smk' |
| logo_url | VARCHAR | URL logo sekolah (nullable) |
| bank_name | VARCHAR | Nama bank pencairan donasi |
| bank_account_number | VARCHAR | Nomor rekening bank |
| bank_account_name | VARCHAR | Nama pemilik rekening |
| status | ENUM | Status tenant: 'active', 'suspended' |
| created_at | TIMESTAMP | Waktu tenant dibuat |

**Tabel: `students`**

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| school_id | UUID | Foreign Key → `schools.id` |
| nisn | CHAR(10) | Nomor Induk Siswa Nasional |
| name | VARCHAR | Nama lengkap siswa |
| class | VARCHAR | Kelas (e.g., '7A', '10 IPA 1') |
| grade | INTEGER | Tingkat kelas (e.g., 7, 10) |
| parent_name | VARCHAR | Nama orang tua/wali |
| parent_email | VARCHAR | Email orang tua untuk undangan |
| parent_phone | VARCHAR | Nomor HP orang tua |
| spp_amount | INTEGER | Nominal SPP per bulan (default) |
| status | ENUM | Status: 'aktif', 'nonaktif', 'lulus' |
| invite_sent_at | TIMESTAMP | Waktu undangan dikirim |
| invite_accepted_at | TIMESTAMP | Waktu undangan diterima (nullable) |
| created_at | TIMESTAMP | Waktu data dibuat |

#### Relasi Antar Tabel

| Tabel Asal | Atribut FK | Tabel Tujuan | Atribut PK | Jenis Relasi |
|------------|------------|--------------|------------|--------------|
| `students` | `school_id` | `schools` | `id` | Many-to-One |
| `school_admins` | `school_id` | `schools` | `id` | Many-to-One |
| `bills` | `school_id` | `schools` | `id` | Many-to-One |
| `campaigns` | `school_id` | `schools` | `id` | Many-to-One |
