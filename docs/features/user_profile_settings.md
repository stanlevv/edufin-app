# ⚙️ Spesifikasi Fitur: Manajemen Profil & Pengaturan (User Profile & Settings)

## 1. Deskripsi Fitur
Modul ini mengelola data pribadi pengguna lintas role, riwayat aktivitas terkait akun (misal histori donasi untuk donatur, riwayat SPP untuk siswa), perubahan kredensial keamanan (sandi), serta preferensi aplikasi (seperti mematikan/menyalakan notifikasi WhatsApp).

---

## 2. Aktor / Role Terkait
Setiap aktor memiliki halaman profil khusus yang disesuaikan dengan peran mereka:
- **Siswa / Orang Tua:** Melihat data siswa (NISN bersifat permanen/tidak bisa diedit), nama wali, kelas, dan memperbarui nomor kontak HP/email.
- **Admin Sekolah:** Mengatur informasi admin pribadi, detail profil sekolah (untuk administrator utama), dan preferensi notifikasi sekolah.
- **Donatur:** Mengedit nama profil, email, nomor HP, serta melihat daftar kampanye yang pernah didukung secara ringkas.

---

## 3. Alur UX & Rute Halaman
- `/student/profile` — **Profil Siswa**:
  - Berisi kartu identitas siswa (Nama, Kelas, NISN).
  - Tab "Riwayat SPP" & "Riwayat Kampanye".
  - Tombol "Edit Profil" & "Ganti Password".
- `/school/profile` — **Profil Admin & Sekolah**:
  - Pengaturan informasi instansi sekolah (Logo, Rekening, dll).
  - Pengaturan Akun Admin Pribadi dan Kelola Notifikasi (opsi untuk mengaktifkan/menonaktifkan alarm WhatsApp/Email).
- `/donor/profile` — **Profil Donatur**:
  - Form pengubahan nama publik donatur, email, dan telepon.
  - Ringkasan total donasi yang terkumpul dari akun bersangkutan.
- **Ubah Kata Sandi (Semua Role)**:
  - Form meminta input: Sandi Lama, Sandi Baru (dengan detektor kekuatan sandi), Konfirmasi Sandi Baru.

---

## 4. Skema Database & Entitas Terkait
Informasi dasar profil disimpan di dalam tabel `auth.users`, serta diperluas oleh tabel relasional berikut:
- **Siswa:** Detail kelas & orang tua berada di tabel `students`.
- **Admin Sekolah:** Hak akses & detail peran berada di tabel `school_admins`.
- **Donatur:** Pengaturan nama/kontak donatur tersimpan di baris data profil donatur (atau langsung menggunakan metadata user `auth.users`).

---

## 5. Integrasi API & Edge Functions
- **Supabase Auth User Update**: Pembaruan email dan kata sandi menggunakan API bawaan Supabase (`auth.updateUser`). Perubahan email secara otomatis memicu pengiriman kode konfirmasi ke alamat email baru sebelum diverifikasi.

---

## 6. Status Implementasi Detail
- ✅ **Halaman Profil Siswa (`StudentProfile.tsx`)**: Selesai (UI profil, kekuatan sandi, riwayat aktivitas).
- ✅ **Halaman Profil Admin (`SchoolProfilePage.tsx`)**: Selesai beserta modal pengaturan opsional (`NotificationSettings.tsx`).
- ✅ **Halaman Profil Donatur (`DonorProfilePage.tsx`)**: Selesai dengan rangkuman aktivitas donasi.
- 🚧 **Verifikasi Ulang Perubahan Email**: Alur verifikasi ganda saat mengganti alamat email masih menggunakan logika standar Supabase Auth yang belum sepenuhnya disesuaikan dengan template email kustom EDUFIN.

---

## E. Perancangan

### 1. Identifikasi User

| No | Aktor | Deskripsi |
|----|-------|-----------|
| 1 | Siswa / Orang Tua | Siswa/Orang Tua adalah pengguna yang melihat dan memperbarui data profil siswa (kecuali NISN yang permanen), mengganti kata sandi, dan melihat riwayat SPP dan kampanye. |
| 2 | Admin Sekolah | Admin Sekolah adalah pengguna yang mengatur profil pribadi dan profil sekolah (logo, rekening bank, SPP default), mengelola preferensi notifikasi, dan menambah sub-admin. |
| 3 | Donatur | Donatur adalah pengguna yang memperbarui nama publik, email, dan nomor telepon akun mereka, serta melihat ringkasan riwayat donasi. |

---

### a. Daftar Kebutuhan / Use Case

| No | Kebutuhan | Aktor |
|----|-----------|-------|
| 1 | Siswa/Orang Tua dapat melihat kartu identitas siswa (NISN, Nama, Kelas). | Siswa / Orang Tua |
| 2 | Siswa/Orang Tua dapat memperbarui nomor HP dan email kontak orang tua. | Siswa / Orang Tua |
| 3 | Sistem harus mencegah pengeditan atribut NISN (permanen/tidak dapat diubah). | Sistem |
| 4 | Admin Sekolah dapat memperbarui data profil sekolah (nama, alamat, logo). | Admin Sekolah |
| 5 | Admin Sekolah dapat mengatur rekening bank tujuan pencairan donasi. | Admin Sekolah |
| 6 | Admin Sekolah dapat mengaktifkan atau menonaktifkan pengiriman notifikasi WhatsApp/Email. | Admin Sekolah |
| 7 | Donatur dapat memperbarui nama publik yang ditampilkan di halaman kampanye. | Donatur |
| 8 | Donatur dapat melihat total donasi dan daftar kampanye yang pernah didukung. | Donatur |
| 9 | Semua pengguna dapat mengganti kata sandi dengan memasukkan sandi lama terlebih dahulu. | Semua Role |
| 10 | Sistem harus memvalidasi kekuatan sandi baru (min 8 karakter, 1 huruf kapital, 1 angka). | Sistem |

---

### b. Use Case Diagram

> 📌 **[Diagram Use Case Terlampir]**
> *Diagram Use Case modul Profil menggambarkan: Siswa/Orang Tua (lihat profil, edit kontak, riwayat SPP & kampanye), Admin Sekolah (edit profil sekolah, atur rekening, preferensi notif), Donatur (edit profil, lihat riwayat donasi), dan Semua Role (ganti password).*

---

### c. Flowchart Sistem

> 📌 **[Flowchart Sistem Terlampir]**
> *Flowchart menggambarkan alur: Pengguna buka halaman Profil → Klik "Edit Profil" → Ubah data yang diinginkan → Simpan → Sistem panggil `auth.updateUser` (Supabase) → [Jika email berubah]: Sistem kirim email konfirmasi ke email baru → Pengguna konfirmasi → Data diperbarui. Untuk ganti password: Input sandi lama → Validasi → Input sandi baru + konfirmasi → Validasi kekuatan → Simpan.*

---

### d. Perancangan Database

#### Normalisasi Tabel

*Modul profil tidak memiliki tabel mandiri — data disimpan tersebar di tabel-tabel yang sudah ada sesuai peran pengguna.*

**Tabel: `auth.users`** *(Data akun & autentikasi — semua role)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| email | VARCHAR | Email login (bisa diperbarui dengan verifikasi ulang) |
| encrypted_password | TEXT | Sandi terenkripsi (diperbarui via `auth.updateUser`) |
| user_metadata | JSONB | Metadata tambahan (e.g., nama, role) |
| updated_at | TIMESTAMP | Waktu terakhir data akun diperbarui |

**Tabel: `students`** *(Profil Siswa/Orang Tua)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| user_id | UUID | FK → `auth.users.id` (dihubungkan saat akun aktif) |
| nisn | CHAR(10) | Tidak dapat diubah setelah import |
| name | VARCHAR | Nama lengkap siswa |
| parent_name | VARCHAR | Nama orang tua/wali |
| parent_email | VARCHAR | Email orang tua (dapat diperbarui) |
| parent_phone | VARCHAR | Nomor HP orang tua (dapat diperbarui) |

**Tabel: `school_admins`** *(Profil Admin Sekolah)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| user_id | UUID | FK → `auth.users.id` |
| name | VARCHAR | Nama admin |
| email | VARCHAR | Email login admin |
| role | VARCHAR | Peran admin di sekolah |
| permissions | JSONB | Hak akses fitur secara granular |

#### Relasi Antar Tabel

| Tabel Asal | Atribut FK | Tabel Tujuan | Atribut PK | Jenis Relasi |
|------------|------------|--------------|------------|--------------|
| `students` | `user_id` | `auth.users` | `id` | One-to-One (nullable) |
| `school_admins` | `user_id` | `auth.users` | `id` | One-to-One |
| `school_admins` | `school_id` | `schools` | `id` | Many-to-One |
