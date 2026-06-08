# 💳 Spesifikasi Fitur: Manajemen Pembayaran SPP (SPP Payment Management)

## 1. Deskripsi Fitur
Modul ini adalah fitur inti EDUFIN untuk mendigitalisasi proses tagihan SPP sekolah. Sekolah dapat membuat tagihan, mengirim notifikasi, menerima pembayaran melalui Payment Gateway (Xendit) atau transfer manual, memverifikasi bukti transfer, dan mencetak bukti pembayaran digital.

---

## 2. Aktor / Role Terkait
- **Admin Sekolah:** Membuat tagihan SPP (individual atau bulk per kelas), melihat status pembayaran siswa, menyetujui transfer manual, menginput pembayaran tunai (cash), serta mencabut atau memperbarui denda keterlambatan.
- **Siswa / Orang Tua:** Melihat tagihan aktif, memilih metode pembayaran (QRIS, VA, E-Wallet), melakukan pembayaran, mengunggah bukti jika transfer manual, dan mengunduh tanda terima PDF.

---

## 3. Alur UX & Rute Halaman
- `/student/spp` — **Halaman Bayar SPP (Siswa)**:
  - List tagihan yang Belum Bayar, Terlambat, Lunas, atau Cicilan.
  - Klik tagihan membuka modal detail tagihan, rincian biaya, denda, dan tombol "Pilih Metode Pembayaran".
  - Redirect ke halaman pembayaran Xendit.
- `/student/history` — **Riwayat Pembayaran (Siswa)**:
  - Riwayat pembayaran sukses dan tautan unduh resi PDF.
- `/school/bills` — **Manajemen Tagihan (Admin)**:
  - Tabel tagihan siswa dengan pencarian nama/NISN dan status.
  - Tombol "Buat Tagihan" (memilih siswa/kelas, nominal, jatuh tempo, bulan tagihan).
  - Tombol "Konfirmasi Pembayaran Manual" untuk memverifikasi bukti transfer yang diunggah siswa.
- `/school/history` — **Log Transaksi Sekolah (Admin)**:
  - Log audit lengkap pembayaran masuk untuk pelaporan keuangan sekolah.

---

## 4. Skema Database & Entitas Terkait

### `bills` (Tagihan)
- `id` (UUID, Primary Key)
- `school_id` (UUID, Foreign Key → `schools`)
- `student_id` (UUID, Foreign Key → `students`)
- `amount` (Integer)
- `late_fee` (Integer - denda keterlambatan)
- `month` (String - contoh: "Juni 2026")
- `due_date` (Date)
- `status` (Enum: 'lunas', 'belum_bayar', 'terlambat', 'cicilan')
- `paid_date` (Timestamp, nullable)
- `payment_method` (Enum: 'qris', 'va_bca', 'va_mandiri', 'va_bni', 'va_bri', 'gopay', 'ovo', 'dana', 'transfer', 'tunai')
- `xendit_invoice_id` (String, nullable)
- `xendit_payment_url` (String, nullable)
- `transfer_proof_url` (String, nullable - untuk bukti transfer manual)
- `notes` (Text, nullable - alasan penolakan bukti transfer, dll)

---

## 5. Integrasi API & Edge Functions
- `POST /functions/v1/xendit-create-invoice`: Membuat invoice Xendit baru saat siswa memilih pembayaran digital.
- `POST /functions/v1/xendit-webhook`: Webhook callback yang dipanggil Xendit saat pembayaran lunas untuk mengubah status tagihan di DB secara otomatis.
- `POST /functions/v1/payment-reminder-cron` (📋 Rencana): Skrip terjadwal harian untuk memeriksa tagihan mendekati jatuh tempo dan mengirim notifikasi WhatsApp otomatis.

---

## 6. Status Implementasi Detail
- ✅ **Dashboard Keuangan Admin (`SchoolBillsPage.tsx`)**: Selesai (UI tabel, pembuatan tagihan massal, modal verifikasi transfer manual).
- ✅ **Halaman Pembayaran Siswa (`PaySPP.tsx`)**: Selesai dengan alur pemilihan metode pembayaran dan form transfer manual.
- ✅ **Riwayat Transaksi Siswa & Sekolah (`HistoryPage.tsx`, `SchoolHistoryPage.tsx`)**: Selesai dengan filter dan pencarian.
- 🚧 **Integrasi Webhook Xendit**: Menunggu penyelesaian Phase 1 untuk integrasi gateway API real.
- 📋 **Penghitungan Otomatis Denda (Late Fee)**: Logika penambahan biaya denda secara otomatis setelah melewati tanggal jatuh tempo masih direncanakan di backend.

---

## E. Perancangan

### 1. Identifikasi User

| No | Aktor | Deskripsi |
|----|-------|-----------|
| 1 | Admin Sekolah | Admin Sekolah adalah pengguna yang membuat dan mengelola tagihan SPP, memverifikasi bukti transfer manual, dan mencatat pembayaran tunai. |
| 2 | Siswa / Orang Tua | Siswa/Orang Tua adalah pengguna yang melihat tagihan SPP aktif, memilih metode pembayaran, melakukan pembayaran, dan mengunduh bukti pembayaran. |

---

### a. Daftar Kebutuhan / Use Case

| No | Kebutuhan | Aktor |
|----|-----------|-------|
| 1 | Admin Sekolah dapat membuat tagihan SPP untuk satu siswa atau seluruh kelas secara massal. | Admin Sekolah |
| 2 | Admin Sekolah dapat menetapkan nominal dan tanggal jatuh tempo pada setiap tagihan. | Admin Sekolah |
| 3 | Admin Sekolah dapat mengedit tagihan yang belum dibayar. | Admin Sekolah |
| 4 | Admin Sekolah dapat membatalkan tagihan yang salah input. | Admin Sekolah |
| 5 | Admin Sekolah dapat menyetujui atau menolak bukti transfer manual yang diunggah siswa. | Admin Sekolah |
| 6 | Admin Sekolah dapat menginput pembayaran tunai (cash) secara manual. | Admin Sekolah |
| 7 | Siswa/Orang Tua dapat melihat daftar tagihan SPP beserta statusnya (Lunas, Belum Bayar, Terlambat, Cicilan). | Siswa / Orang Tua |
| 8 | Siswa/Orang Tua dapat memilih tagihan dan melakukan pembayaran via QRIS, Virtual Account, atau E-Wallet. | Siswa / Orang Tua |
| 9 | Siswa/Orang Tua dapat mengunggah foto bukti transfer untuk pembayaran manual. | Siswa / Orang Tua |
| 10 | Siswa/Orang Tua dapat mengunduh tanda terima (receipt) pembayaran dalam format PDF. | Siswa / Orang Tua |
| 11 | Sistem harus memperbarui status tagihan secara otomatis setelah pembayaran berhasil diterima via Xendit. | Sistem |

---

### b. Use Case Diagram

> 📌 **[Diagram Use Case Terlampir]**
> *Diagram Use Case modul Pembayaran SPP menggambarkan interaksi Admin Sekolah (kelola tagihan, verifikasi transfer) dan Siswa/Orang Tua (lihat tagihan, bayar digital, upload bukti, unduh receipt) dengan Sistem (integrasi Xendit, update status otomatis).*

---

### c. Flowchart Sistem

> 📌 **[Flowchart Sistem Terlampir]**
> *Flowchart menggambarkan alur: Admin buat tagihan SPP → Siswa buka aplikasi → Pilih tagihan belum bayar → Pilih metode pembayaran → Sistem buat invoice Xendit → Pengguna bayar di halaman Xendit → Xendit kirim webhook → Sistem update status tagihan ke "Lunas" → Notifikasi WhatsApp terkirim ke orang tua → Siswa dapat unduh receipt PDF.*

---

### d. Perancangan Database

#### Normalisasi Tabel

**Tabel: `bills`**

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| school_id | UUID | Foreign Key → `schools.id` |
| student_id | UUID | Foreign Key → `students.id` |
| amount | INTEGER | Nominal tagihan SPP |
| late_fee | INTEGER | Nominal denda keterlambatan (default: 0) |
| month | VARCHAR | Periode tagihan (e.g., "Juni 2026") |
| due_date | DATE | Tanggal jatuh tempo |
| status | ENUM | Status: 'lunas', 'belum_bayar', 'terlambat', 'cicilan' |
| paid_date | TIMESTAMP | Tanggal bayar (nullable) |
| payment_method | ENUM | Metode: 'qris', 'va_bca', 'gopay', 'transfer', 'tunai', dll |
| xendit_invoice_id | VARCHAR | ID invoice dari Xendit (nullable) |
| xendit_payment_url | VARCHAR | URL halaman pembayaran Xendit (nullable) |
| transfer_proof_url | VARCHAR | URL foto bukti transfer (nullable) |
| notes | TEXT | Catatan (alasan tolak transfer, dll) (nullable) |
| created_at | TIMESTAMP | Waktu tagihan dibuat |

#### Relasi Antar Tabel

| Tabel Asal | Atribut FK | Tabel Tujuan | Atribut PK | Jenis Relasi |
|------------|------------|--------------|------------|--------------|
| `bills` | `school_id` | `schools` | `id` | Many-to-One |
| `bills` | `student_id` | `students` | `id` | Many-to-One |
| `installments` | `bill_id` | `bills` | `id` | One-to-One |
