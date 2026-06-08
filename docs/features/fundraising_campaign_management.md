# 🤝 Spesifikasi Fitur: Manajemen Kampanye Penggalangan Dana (Fundraising)

## 1. Deskripsi Fitur
Modul ini menghubungkan siswa yang membutuhkan dukungan finansial dengan para donatur. Siswa dapat mengajukan kampanye penggalangan dana khusus (misal untuk buku sekolah, study tour, seragam, dll). Kampanye yang disetujui sekolah akan muncul secara publik untuk menerima donasi digital. Modul ini dilengkapi dengan pelaporan pengeluaran transparan (Transparansi Feed) pada versi V2.

---

## 2. Aktor / Role Terkait
- **Siswa / Orang Tua:** Membuat pengajuan kampanye penggalangan dana baru, melihat kemajuan dana terkumpul, mengunggah bukti penggunaan dana (transparansi pengeluaran).
- **Admin Sekolah:** Bertindak sebagai kurator utama (gatekeeper), meninjau pengajuan kampanye siswa, memberikan persetujuan (approval) agar tayang ke publik, menolak pengajuan, serta meminta pencairan dana yang terkumpul ke rekening bank sekolah.
- **Donatur:** Menjelajahi (browse) semua kampanye aktif, menyaring berdasarkan sekolah/kategori, melakukan donasi (bisa anonim), dan memantau transparansi penggunaan dana.
- **Super Admin:** Mengawasi jalannya kampanye secara global dan dapat membekukan (suspend) kampanye yang terindikasi kecurangan (fraud).

---

## 3. Alur UX & Rute Halaman
- `/student/fundraising` — **Pengajuan Kampanye Siswa**:
  - Halaman berisi daftar kampanye milik siswa dan tombol "Buat Kampanye Baru".
  - Formulir pengisian judul, deskripsi urgensi, target nominal (min Rp 100.000), durasi kampanye (7-90 hari), kategori kebutuhan, serta unggah dokumen bukti pendukung.
- `/donor/campaigns` — **Eksplorasi Kampanye (Donatur)**:
  - Halaman publik dengan grid kampanye aktif, progress bar pencapaian dana, pencarian teks, dan filter/pengurutan.
- `/donor/campaign/:id` atau `/student/campaign/:id` — **Detail Kampanye**:
  - Halaman lengkap yang menampilkan deskripsi kampanye, sisa waktu, nominal terkumpul, daftar donatur, dan tombol "Donasi Sekarang".
  - **(V2) Tab Transparansi Feed**: Menampilkan riwayat pemakaian dana yang ditulis siswa.
    - Menampilkan tanggal update, judul laporan, penjelasan, jumlah pengeluaran, dan lampiran foto nota belanja (dapat diklik untuk memperbesar).
    - Memiliki *smooth hover elevation* dan shadow yang estetis.
    - Jika kosong, menampilkan status kosong (*Empty State*): *"Belum ada laporan dari kampanye ini."* dengan ikon kasir/nota yang menarik.
- **Formulir Donasi**:
  - Donatur memasukkan nama, email, nomor HP (atau centang "Kirim sebagai Donatur Anonim") dan nominal donasi (min Rp 10.000).
  - Memilih metode pembayaran digital via Xendit.
- `/school/campaigns` — **Verifikasi Sekolah**:
  - Admin sekolah meninjau kampanye masuk berstatus *Pending*.
  - Menyetujui atau menolak dengan catatan. Saat kampanye selesai (target tercapai atau waktu habis), admin menekan tombol "Request Pencairan" untuk mencairkan dana.

---

## 4. Skema Database & Entitas Terkait

### `campaigns` (Penggalangan Dana)
- `id` (UUID, Primary Key)
- `school_id` (UUID, Foreign Key → `schools`)
- `student_id` (UUID, Foreign Key → `students`)
- `title` (String), `description` (Text)
- `target_amount` (Integer), `current_amount` (Integer - default 0)
- `category` (String - contoh: 'Buku', 'Seragam')
- `status` (Enum: 'pending', 'approved', 'rejected', 'completed', 'expired', 'suspended')
- `rejection_reason` (Text, nullable)
- `suspension_reason` (Text, nullable)
- `start_date` (Date), `end_date` (Date)
- `documents` (JSONB - daftar tautan file/gambar pendukung)
- `created_at` (Timestamp)

### `donations` (Riwayat Donasi)
- `id` (UUID, Primary Key)
- `campaign_id` (UUID, Foreign Key → `campaigns`)
- `donor_user_id` (UUID, Foreign Key → `auth.users`, nullable jika guest)
- `donor_name` (String), `donor_email` (String), `donor_phone` (String, nullable)
- `amount` (Integer)
- `message` (Text, nullable)
- `is_anonymous` (Boolean - default false)
- `payment_status` (Enum: 'pending', 'success', 'failed', 'expired')
- `xendit_invoice_id` (String, nullable)
- `xendit_payment_url` (String, nullable)

### `campaign_updates` (Feed Transparansi V2)
- `id` (UUID, Primary Key)
- `campaign_id` (UUID, Foreign Key → `campaigns`)
- `title` (String), `description` (Text)
- `expense_amount` (Integer - jumlah pengeluaran)
- `receipt_image_url` (String, nullable - foto nota)
- `created_at` (Timestamp)

---

## 5. Integrasi API & Edge Functions
- `POST /functions/v1/xendit-create-invoice` (Donatur): Membuat invoice pembayaran donasi.
- `POST /functions/v1/xendit-disbursement` (Admin Sekolah): Mentransfer akumulasi dana donasi bersih ke rekening bank sekolah terdaftar.
- `POST /functions/v1/campaign-expiry-cron`: Cron harian untuk menutup kampanye yang durasinya telah melewati `end_date`.

---

## 6. Status Implementasi Detail
- ✅ **Halaman Pembuatan & Daftar Kampanye Siswa**: Selesai (UI responsif di `/student/fundraising`).
- ✅ **Halaman Publik Donatur (`DonorCampaignsPage.tsx`, `CampaignDetail.tsx`)**: Selesai.
- ✅ **Detail Kampanye & Modul Donasi**: Selesai dengan pilihan pembayaran simulasi.
- ✅ **Panel Persetujuan Kampanye Admin (`SchoolCampaignsPage.tsx`)**: Selesai.
- 🚧 **(V2) Tab Transparansi Feed**: UI Tab telah selesai diimplementasikan di halaman detail kampanye dengan dukungan *Empty State* dan *zoomable receipt modal*. Koneksi data dinamis ke tabel `campaign_updates` masih dalam pengembangan.
- 📋 **Pencairan Otomatis (Disbursement Gateway)**: Integrasi Xendit Disbursement API untuk mentransfer dana dari escrow Xendit ke rekening bank sekolah asli masih direncanakan.

---

## E. Perancangan

### 1. Identifikasi User

| No | Aktor | Deskripsi |
|----|-------|-----------|
| 1 | Siswa / Orang Tua | Siswa/Orang Tua adalah pengguna yang membuat kampanye penggalangan dana, mengunggah dokumen pendukung, memantau kemajuan donasi, dan melaporkan penggunaan dana (Transparansi Feed). |
| 2 | Admin Sekolah | Admin Sekolah adalah penjaga gerbang (gatekeeper) yang meninjau, menyetujui, atau menolak pengajuan kampanye siswa serta meminta pencairan dana kampanye yang telah selesai. |
| 3 | Donatur | Donatur adalah pengguna publik yang menjelajahi kampanye aktif dan melakukan donasi secara digital (dengan pilihan anonim). |
| 4 | Super Admin (EDUFIN) | Super Admin memiliki wewenang untuk membekukan kampanye yang terindikasi kecurangan dari seluruh sekolah di platform. |

---

### a. Daftar Kebutuhan / Use Case

| No | Kebutuhan | Aktor |
|----|-----------|-------|
| 1 | Siswa/Orang Tua dapat membuat kampanye dengan mengisi judul, deskripsi, target nominal, durasi, dan kategori. | Siswa / Orang Tua |
| 2 | Siswa/Orang Tua dapat mengunggah dokumen pendukung (foto, surat keterangan tidak mampu). | Siswa / Orang Tua |
| 3 | Siswa/Orang Tua dapat memantau progres dana terkumpul secara real-time. | Siswa / Orang Tua |
| 4 | Siswa/Orang Tua dapat mengunggah laporan penggunaan dana (Feed Transparansi V2). | Siswa / Orang Tua |
| 5 | Admin Sekolah dapat melihat daftar kampanye Pending dari siswa sekolahnya. | Admin Sekolah |
| 6 | Admin Sekolah dapat menyetujui kampanye agar tayang secara publik. | Admin Sekolah |
| 7 | Admin Sekolah dapat menolak kampanye dengan memberikan alasan penolakan. | Admin Sekolah |
| 8 | Admin Sekolah dapat meminta pencairan dana saat kampanye selesai/mencapai target. | Admin Sekolah |
| 9 | Donatur dapat menjelajahi dan mencari kampanye aktif dari seluruh sekolah. | Donatur |
| 10 | Donatur dapat melakukan donasi minimal Rp 10.000 dengan pilihan anonim. | Donatur |
| 11 | Sistem harus menutup kampanye secara otomatis saat batas waktu berakhir atau target tercapai. | Sistem |
| 12 | Super Admin dapat membekukan (suspend) kampanye yang terindikasi fraud. | Super Admin |

---

### b. Use Case Diagram

> 📌 **[Diagram Use Case Terlampir]**
> *Diagram Use Case modul Fundraising menggambarkan interaksi 4 aktor: Siswa/Orang Tua (buat kampanye, laporan transparansi), Admin Sekolah (verifikasi, pencairan), Donatur (browse, donasi, lihat transparansi), dan Super Admin (suspend kampanye).*

---

### c. Flowchart Sistem

> 📌 **[Flowchart Sistem Terlampir]**
> *Flowchart menggambarkan alur: Siswa buat kampanye → Sistem simpan status "Pending" → Admin terima notifikasi → Admin tinjau → [Setujui]: Kampanye tayang publik → Donatur browse & donasi → Xendit proses pembayaran → Dana terakumulasi → [Target/Waktu habis]: Admin klik "Request Pencairan" → Xendit disbursement ke rekening sekolah → Siswa unggah laporan pengeluaran (Feed Transparansi) → Donatur dapat melihat transparansi.*

---

### d. Perancangan Database

#### Normalisasi Tabel

**Tabel: `campaigns`**

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| school_id | UUID | Foreign Key → `schools.id` |
| student_id | UUID | Foreign Key → `students.id` |
| title | VARCHAR | Judul kampanye |
| description | TEXT | Penjelasan urgensi/tujuan kampanye |
| target_amount | INTEGER | Target dana yang ingin dikumpulkan |
| current_amount | INTEGER | Total donasi yang sudah terkumpul (default: 0) |
| category | VARCHAR | Kategori (e.g., 'Buku', 'Seragam', 'Study Tour') |
| status | ENUM | Status: 'pending', 'approved', 'rejected', 'completed', 'expired', 'suspended' |
| rejection_reason | TEXT | Alasan penolakan admin (nullable) |
| suspension_reason | TEXT | Alasan pembekuan super admin (nullable) |
| start_date | DATE | Tanggal kampanye mulai tayang |
| end_date | DATE | Tanggal kampanye berakhir |
| documents | JSONB | Array URL dokumen/foto pendukung |
| created_at | TIMESTAMP | Waktu kampanye dibuat |

**Tabel: `donations`**

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| campaign_id | UUID | Foreign Key → `campaigns.id` |
| donor_user_id | UUID | Foreign Key → `auth.users.id` (nullable untuk guest) |
| donor_name | VARCHAR | Nama donatur |
| donor_email | VARCHAR | Email donatur |
| donor_phone | VARCHAR | Nomor HP donatur (nullable) |
| amount | INTEGER | Jumlah donasi |
| message | TEXT | Pesan dari donatur (nullable) |
| is_anonymous | BOOLEAN | TRUE jika donatur memilih anonim |
| payment_status | ENUM | Status: 'pending', 'success', 'failed', 'expired' |
| xendit_invoice_id | VARCHAR | ID invoice Xendit (nullable) |
| created_at | TIMESTAMP | Waktu donasi dibuat |

**Tabel: `campaign_updates`** *(Feed Transparansi V2)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| campaign_id | UUID | Foreign Key → `campaigns.id` |
| title | VARCHAR | Judul laporan pengeluaran |
| description | TEXT | Penjelasan detail pengeluaran |
| expense_amount | INTEGER | Jumlah pengeluaran yang dilaporkan |
| receipt_image_url | VARCHAR | URL foto nota belanja (nullable) |
| created_at | TIMESTAMP | Waktu laporan diunggah |

#### Relasi Antar Tabel

| Tabel Asal | Atribut FK | Tabel Tujuan | Atribut PK | Jenis Relasi |
|------------|------------|--------------|------------|--------------|
| `campaigns` | `school_id` | `schools` | `id` | Many-to-One |
| `campaigns` | `student_id` | `students` | `id` | Many-to-One |
| `donations` | `campaign_id` | `campaigns` | `id` | Many-to-One |
| `donations` | `donor_user_id` | `auth.users` | `id` | Many-to-One (nullable) |
| `campaign_updates` | `campaign_id` | `campaigns` | `id` | Many-to-One |
