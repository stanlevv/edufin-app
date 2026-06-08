# 🛡️ Spesifikasi Fitur: Dashboard Super Admin (EDUFIN Super Admin Panel)

## 1. Deskripsi Fitur
Modul Dashboard Super Admin digunakan secara internal oleh tim teknis/operasional EDUFIN. Modul ini menyediakan visibilitas tingkat tinggi ke seluruh sekolah (multi-tenant) di platform, pendaftaran sekolah baru, pengawasan volume transaksi (GMV), serta moderasi konten kampanye donasi global demi menjaga keamanan ekosistem platform.

---

## 2. Aktor / Role Terkait
- **EDUFIN Super Admin:** Administrator utama dengan akses tidak terbatas (bypass RLS) ke seluruh data sekolah, siswa, dan transaksi.

---

## 3. Alur UX & Rute Halaman
- `/superadmin` — **Platform Overview (Dashboard)** (📋 Rencana):
  - Informasi Agregat: Jumlah sekolah mitra aktif/nonaktif, total siswa terdaftar secara nasional, volume transaksi bulanan (GMV), total kampanye donasi yang aktif.
  - Grafik pertumbuhan transaksi bulanan SPP & Donasi secara akumulatif.
- `/superadmin/schools` — **Manajemen Sekolah** (📋 Rencana):
  - Tabel berisi daftar seluruh sekolah di sistem.
  - Aksi: Onboard sekolah baru, edit profil sekolah, ubah status ke **Suspended** (membekukan akses seluruh admin & siswa sekolah tersebut) atau **Active** kembali.
  - Fitur **Impersonasi** (Masuk sebagai Admin Sekolah) untuk tujuan bantuan teknis (customer support).
- `/superadmin/moderation` — **Moderasi Kampanye** (📋 Rencana):
  - Daftar kampanye dari seluruh sekolah.
  - Fitur pembekuan (*Suspension*) jika terdeteksi kampanye palsu/penyalahgunaan dana, disertai pengisian alasan pembekuan.
  - Log audit aktivitas untuk mencatat siapa yang melakukan moderasi.

---

## 4. Skema Database & Entitas Terkait

### `schools`
Super admin berwenang mengubah status sekolah di tabel master.
- `status` (Enum: 'active', 'suspended')

### `campaigns`
Super admin berwenang memoderasi status kampanye.
- `status` (Enum: ..., 'suspended')
- `suspension_reason` (Text, nullable)

---

## 5. Integrasi API & Edge Functions
- **Bypass RLS (Row Level Security)**: Super admin menggunakan API token `service_role` dari Supabase untuk membaca/mengubah data lintas sekolah.
- `POST /api/superadmin/impersonate` (📋 Rencana): Endpoint untuk generate token JWT kustom atas nama admin sekolah tertentu agar bisa masuk ke dashboard sekolah bersangkutan tanpa memasukkan kata sandi.

---

## 6. Status Implementasi Detail
- 📋 **Seluruh Fitur Panel Super Admin**: Direncanakan (Phase 2). Saat ini antarmuka khusus di bawah `/superadmin` belum dibuat di dalam kode (`routes.tsx` belum mengarahkan ke halaman superadmin riil). Seluruh proses pendaftaran sekolah saat ini masih disimulasikan via script seed database (`seed_supabase.mjs`).

---

## E. Perancangan

### 1. Identifikasi User

| No | Aktor | Deskripsi |
|----|-------|-----------|
| 1 | Super Admin (EDUFIN) | Super Admin adalah administrator platform internal EDUFIN dengan akses tidak terbatas ke seluruh data multi-tenant. Super Admin bertugas mendaftarkan sekolah baru, mengawasi performa platform, memoderasi kampanye donasi, dan menangani dukungan teknis (customer support) melalui fitur impersonasi. |

---

### a. Daftar Kebutuhan / Use Case

| No | Kebutuhan | Aktor |
|----|-----------|-------|
| 1 | Super Admin dapat melihat ringkasan platform: total sekolah, total siswa nasional, GMV transaksi, dan kampanye aktif. | Super Admin |
| 2 | Super Admin dapat melihat grafik pertumbuhan transaksi SPP dan Donasi secara akumulatif per bulan. | Super Admin |
| 3 | Super Admin dapat mendaftarkan sekolah baru ke platform (onboarding multi-tenant). | Super Admin |
| 4 | Super Admin dapat mengedit profil sekolah yang sudah terdaftar. | Super Admin |
| 5 | Super Admin dapat mengubah status sekolah menjadi **Suspended** (membekukan akses seluruh pengguna sekolah). | Super Admin |
| 6 | Super Admin dapat mengaktifkan kembali sekolah yang sebelumnya di-suspend. | Super Admin |
| 7 | Super Admin dapat menggunakan fitur **Impersonasi** untuk masuk ke dashboard sebagai Admin Sekolah tertentu (untuk tujuan support teknis). | Super Admin |
| 8 | Super Admin dapat melihat daftar seluruh kampanye donasi dari seluruh sekolah. | Super Admin |
| 9 | Super Admin dapat membekukan (suspend) kampanye yang terindikasi fraud disertai alasan pembekuan. | Super Admin |
| 10 | Sistem harus mencatat log audit setiap aksi moderasi yang dilakukan Super Admin (siapa, kapan, aksi apa). | Sistem |

---

### b. Use Case Diagram

> 📌 **[Diagram Use Case Terlampir]**
> *Diagram Use Case modul Super Admin Panel menggambarkan Super Admin berinteraksi dengan: Lihat Platform Overview, Onboard Sekolah, Kelola Status Sekolah (Suspend/Active), Impersonasi Admin Sekolah, Moderasi Kampanye Global (Suspend/Unsuspend), dan Lihat Log Audit.*

---

### c. Flowchart Sistem

> 📌 **[Flowchart Sistem Terlampir]**
> *Flowchart menggambarkan alur: Super Admin login via URL khusus → Tampilkan dashboard overview → [Onboard Sekolah]: Isi form data sekolah → Buat tenant ID → Kirim email undangan ke Admin Sekolah. [Moderasi Kampanye]: Cek daftar kampanye → Pilih kampanye → Klik "Suspend" → Isi alasan → Sistem update status kampanye ke 'suspended' → Catat ke log audit → Siswa/Donatur mendapat notifikasi.*

---

### d. Perancangan Database

#### Normalisasi Tabel

*Super Admin memanfaatkan tabel yang sudah ada — tidak ada tabel eksklusif untuk panel ini. Akses dilakukan menggunakan API token `service_role` Supabase (bypass RLS).*

**Tabel: `schools`** *(Dikelola Super Admin)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key (Tenant ID) |
| name | VARCHAR | Nama sekolah |
| npsn | CHAR(8) | Nomor Pokok Sekolah Nasional |
| status | ENUM | Status tenant: **'active'**, **'suspended'** |
| created_at | TIMESTAMP | Waktu tenant dibuat |

**Tabel: `campaigns`** *(Atribut yang dikelola Super Admin)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| status | ENUM | Termasuk nilai: **'suspended'** |
| suspension_reason | TEXT | Alasan pembekuan kampanye oleh Super Admin (nullable) |

**Tabel: `audit_logs`** *(Rencana — Log Audit Super Admin)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| actor_user_id | UUID | FK → `auth.users.id` (Super Admin yang melakukan aksi) |
| action | VARCHAR | Jenis aksi (e.g., 'suspend_school', 'suspend_campaign', 'impersonate') |
| target_type | VARCHAR | Jenis entitas yang dikenai aksi (e.g., 'schools', 'campaigns') |
| target_id | UUID | ID entitas yang dikenai aksi |
| reason | TEXT | Alasan tindakan (nullable) |
| created_at | TIMESTAMP | Waktu aksi dilakukan |

#### Relasi Antar Tabel

| Tabel Asal | Atribut FK | Tabel Tujuan | Atribut PK | Jenis Relasi |
|------------|------------|--------------|------------|--------------|
| `audit_logs` | `actor_user_id` | `auth.users` | `id` | Many-to-One |
| `school_admins` | `school_id` | `schools` | `id` | Many-to-One |
| `campaigns` | `school_id` | `schools` | `id` | Many-to-One |
