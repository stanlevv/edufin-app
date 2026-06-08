# 🔄 Spesifikasi Fitur: Manajemen Cicilan (Installment Management)

## 1. Deskripsi Fitur
Fitur cicilan dirancang untuk meringankan beban orang tua/wali murid yang kesulitan membayar SPP secara langsung. Siswa/orang tua dapat mengajukan cicilan untuk tagihan tertentu. Admin sekolah akan meninjau alasan pengajuan tersebut, menyetujui (yang akan memecah tagihan menjadi beberapa jangka waktu/periode pembayaran), atau menolaknya.

---

## 2. Aktor / Role Terkait
- **Siswa / Orang Tua:** Mengirim pengajuan cicilan untuk tagihan SPP, memilih tenor (2x hingga 6x), menulis alasan permohonan, memantau kemajuan cicilan, dan membayar cicilan berkala.
- **Admin Sekolah:** Menerima pengajuan cicilan, membaca berkas pengajuan dan alasan, menyetujui (approve) atau menolak (reject) permohonan cicilan.

---

## 3. Alur UX & Rute Halaman
- **Pengajuan Cicilan oleh Siswa** (di dalam `/student/spp` atau dashboard):
  - Memilih tagihan SPP yang belum lunas.
  - Klik "Ajukan Cicilan" membuka modal pengajuan.
  - Memasukkan jumlah periode cicilan (dropdown 2x, 3x, 4x, 5x, 6x) dan alasan pendukung.
- `/school/bills` (Tab "Pengajuan Cicilan") — **Persetujuan Admin**:
  - Admin melihat daftar pengajuan cicilan yang masih menggantung (*Pending*).
  - Klik baris data memunculkan alasan pengajuan.
  - Tombol **Setujui** (memecah tagihan awal menjadi X periode) dan **Tolak** (membuka modal pengisian alasan penolakan).
- **Pembayaran Cicilan oleh Siswa**:
  - Tagihan awal di halaman siswa berubah status menjadi "Cicilan".
  - Pengguna melihat sub-daftar periode cicilan yang harus dibayar beserta tanggal jatuh tempo masing-masing.
  - Pembayaran setiap periode menggunakan alur gateway pembayaran biasa.

---

## 4. Skema Database & Entitas Terkait

### `installments` (Induk Pengajuan Cicilan)
- `id` (UUID, Primary Key)
- `school_id` (UUID, Foreign Key → `schools`)
- `bill_id` (UUID, Foreign Key → `bills` - tagihan asli)
- `student_id` (UUID, Foreign Key → `students`)
- `total_periods` (Integer - e.g., 4)
- `current_period` (Integer - periode yang sedang aktif/berjalan)
- `amount_per_period` (Integer - nominal per periode cicilan)
- `reason` (Text - alasan pengajuan dari siswa)
- `status` (Enum: 'pending_approval', 'active', 'completed', 'defaulted', 'rejected')
- `rejection_reason` (Text, nullable)

### `installment_periods` (Rincian Periode Cicilan)
Tabel ini menampung baris pecahan dari cicilan induk.
- `id` (UUID, Primary Key)
- `installment_id` (UUID, Foreign Key → `installments`)
- `period_number` (Integer - contoh: 1, 2, 3)
- `amount` (Integer)
- `due_date` (Date)
- `paid_date` (Timestamp, nullable)
- `status` (Enum: 'belum_bayar', 'lunas', 'terlambat')
- `xendit_invoice_id` (String, nullable)

---

## 5. Integrasi API & Edge Functions
- **Database Trigger**: Ketika semua baris di `installment_periods` berstatus `lunas`, status tagihan asli di `bills` dan status di `installments` otomatis berubah menjadi `lunas` / `completed`.

---

## 6. Status Implementasi Detail
- ✅ **Form Pengajuan Cicilan Siswa**: Selesai (UI modal terintegrasi di dashboard siswa).
- ✅ **Panel Manajemen Persetujuan Admin**: Selesai (tabel peninjauan request di halaman `/school/bills` beserta opsi aksi setujui/tolak).
- ✅ **UI Tampilan Periode Cicilan**: Selesai (pemisahan status cicilan dan sub-tagihan di halaman `/student/spp` dan `/student/dashboard`).
- 🚧 **Penjadwalan Jatuh Tempo Otomatis**: Logika pemisahan tanggal jatuh tempo setiap periode cicilan (misalnya jatuh tempo setiap tanggal 10 di bulan berikutnya) masih dikelola secara statis di front-end mock data, memerlukan pengerjaan server-side (Phase 1).
- 📋 **Sistem Gagal Bayar (Defaulted)**: Proses otomatis pengubahan status menjadi 'defaulted' jika cicilan menunggak lebih dari 30 hari belum dibuat.

---

## E. Perancangan

### 1. Identifikasi User

| No | Aktor | Deskripsi |
|----|-------|-----------|
| 1 | Siswa / Orang Tua | Siswa/Orang Tua adalah pengguna yang mengajukan permohonan cicilan SPP, memilih tenor, menyertakan alasan pengajuan, dan membayar cicilan per periode. |
| 2 | Admin Sekolah | Admin Sekolah adalah pengguna yang meninjau pengajuan cicilan dari siswa, memberikan persetujuan atau penolakan, serta memantau kemajuan pembayaran cicilan aktif. |

---

### a. Daftar Kebutuhan / Use Case

| No | Kebutuhan | Aktor |
|----|-----------|-------|
| 1 | Siswa/Orang Tua dapat mengajukan cicilan untuk tagihan SPP yang belum lunas. | Siswa / Orang Tua |
| 2 | Siswa/Orang Tua dapat memilih jumlah periode cicilan (2x, 3x, 4x, 5x, atau 6x). | Siswa / Orang Tua |
| 3 | Siswa/Orang Tua dapat menyertakan alasan permohonan cicilan secara tertulis. | Siswa / Orang Tua |
| 4 | Siswa/Orang Tua dapat memantau status pengajuan cicilan (Menunggu, Disetujui, Ditolak). | Siswa / Orang Tua |
| 5 | Siswa/Orang Tua dapat melihat rincian sub-tagihan per periode beserta tanggal jatuh tempo. | Siswa / Orang Tua |
| 6 | Siswa/Orang Tua dapat membayar satu periode cicilan menggunakan metode pembayaran digital. | Siswa / Orang Tua |
| 7 | Admin Sekolah dapat melihat seluruh pengajuan cicilan yang masih berstatus menunggu (Pending). | Admin Sekolah |
| 8 | Admin Sekolah dapat menyetujui cicilan sehingga tagihan dipecah otomatis ke X periode. | Admin Sekolah |
| 9 | Admin Sekolah dapat menolak cicilan dengan mencantumkan alasan penolakan. | Admin Sekolah |
| 10 | Sistem harus mengubah status cicilan menjadi "Selesai" (Completed) saat semua periode telah lunas. | Sistem |

---

### b. Use Case Diagram

> 📌 **[Diagram Use Case Terlampir]**
> *Diagram Use Case modul Cicilan menggambarkan interaksi Siswa/Orang Tua (ajukan cicilan, pilih tenor, bayar per periode) dan Admin Sekolah (tinjau, setujui, tolak) serta peran Sistem dalam memecah tagihan secara otomatis dan mengelola status.*

---

### c. Flowchart Sistem

> 📌 **[Flowchart Sistem Terlampir]**
> *Flowchart menggambarkan alur: Siswa pilih tagihan → Klik "Ajukan Cicilan" → Isi form (jumlah periode, alasan) → Submit → Status: Menunggu (Pending) → Admin terima notifikasi → Admin tinjau alasan → [Setujui]: Sistem pecah tagihan ke X periode dengan due date masing-masing → Siswa bayar per periode → [Semua periode lunas]: Status cicilan "Completed" → [Tolak]: Notifikasi alasan penolakan ke siswa.*

---

### d. Perancangan Database

#### Normalisasi Tabel

**Tabel: `installments`** *(Induk Pengajuan Cicilan)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| school_id | UUID | Foreign Key → `schools.id` |
| bill_id | UUID | Foreign Key → `bills.id` (tagihan asli) |
| student_id | UUID | Foreign Key → `students.id` |
| total_periods | INTEGER | Total periode cicilan (2–6) |
| current_period | INTEGER | Periode yang sedang berjalan |
| amount_per_period | INTEGER | Nominal per periode |
| reason | TEXT | Alasan pengajuan cicilan |
| status | ENUM | Status: 'pending_approval', 'active', 'completed', 'defaulted', 'rejected' |
| rejection_reason | TEXT | Alasan penolakan (nullable) |
| created_at | TIMESTAMP | Waktu pengajuan dibuat |

**Tabel: `installment_periods`** *(Rincian Periode Cicilan)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| installment_id | UUID | Foreign Key → `installments.id` |
| period_number | INTEGER | Urutan periode (1, 2, 3, …) |
| amount | INTEGER | Nominal cicilan periode ini |
| due_date | DATE | Tanggal jatuh tempo periode |
| paid_date | TIMESTAMP | Tanggal pembayaran (nullable) |
| status | ENUM | Status: 'belum_bayar', 'lunas', 'terlambat' |
| xendit_invoice_id | VARCHAR | ID invoice Xendit (nullable) |

#### Relasi Antar Tabel

| Tabel Asal | Atribut FK | Tabel Tujuan | Atribut PK | Jenis Relasi |
|------------|------------|--------------|------------|--------------|
| `installments` | `school_id` | `schools` | `id` | Many-to-One |
| `installments` | `bill_id` | `bills` | `id` | One-to-One |
| `installments` | `student_id` | `students` | `id` | Many-to-One |
| `installment_periods` | `installment_id` | `installments` | `id` | Many-to-One |
