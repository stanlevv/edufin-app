# 📊 Spesifikasi Fitur: Dashboard Admin Sekolah & Pelaporan (Admin Dashboard & Reporting)

## 1. Deskripsi Fitur
Modul ini merupakan panel kendali utama (desktop-first) bagi pihak manajemen sekolah. Terdiri dari ringkasan dashboard statistik, manajemen data siswa (CRUD), program beasiswa internal, pemantauan donatur terafiliasi, serta rekapitulasi pelaporan keuangan SPP & Donasi secara berkala.

---

## 2. Aktor / Role Terkait
- **Admin Sekolah:** Aktor utama yang mengelola data siswa, membuat beasiswa, menetapkan penerima beasiswa, serta memantau kesehatan finansial sekolah melalui grafik dan mengunduh laporan bulanan.

---

## 3. Alur UX & Rute Halaman
- `/school` — **Dashboard Utama**:
  - Summary Cards: Total Siswa Aktif, Total Penerimaan SPP Bulan Ini, Nominal Tunggakan (Outstanding), Kampanye Menunggu Verifikasi.
  - Bar Chart bulanan menampilkan perbandingan SPP Lunas vs Belum Lunas.
  - Tabel berisi 10 transaksi pembayaran terakhir.
- `/school/students` — **Manajemen Data Siswa**:
  - Tabel daftar siswa lengkap dengan NISN, nama, kelas, status aktif/lulus/nonaktif.
  - Pilihan untuk edit data, hapus/deaktivasi, tambah manual, atau unggah CSV massal.
- `/school/scholarships` — **Manajemen Program Beasiswa**:
  - Daftar program beasiswa (cth: Beasiswa BOS, Beasiswa Prestasi) beserta nominal subsidi per bulan, sumber dana, dan kapasitas penerima.
  - Tambah/edit program beasiswa via modal (`ScholarshipModal`).
  - Tambah/hapus penerima program beasiswa dari daftar siswa aktif via modal (`RecipientModal`).
- `/school/donors` — **Tabel Donatur Sekolah**:
  - Riwayat para donatur eksternal yang menyumbang ke kampanye siswa sekolah tersebut.
- `/school/report` — **Laporan Keuangan**:
  - Grafik detail penerimaan bulanan SPP vs Donasi.
  - Informasi sisa tunggakan detail per kelas (cth: Kelas 7A memiliki sisa tunggakan Rp 2.500.000).
  - Pilihan ekspor laporan. **(V2) Pratinjau & Cetak PDF Generatif** yang bersih dan profesional untuk kepala sekolah.

---

## 4. Skema Database & Entitas Terkait

### `scholarships` (Master Program Beasiswa)
- `id` (UUID, Primary Key)
- `school_id` (UUID, Foreign Key → `schools`)
- `name` (String), `description` (Text)
- `amount_per_month` (Integer - nominal potongan SPP bulanan)
- `total_months` (Integer - durasi beasiswa, misal 12 bulan)
- `start_date` (Date), `end_date` (Date)
- `source` (String - contoh: 'Dana BOS', 'Yayasan')
- `campaign_id` (UUID, Foreign Key → `campaigns`, nullable)
- `status` (Enum: 'active', 'completed', 'cancelled')
- `max_recipients` (Integer)

### `scholarship_recipients` (Penerima Beasiswa)
Menghubungkan siswa dengan program beasiswa aktif.
- `id` (UUID, Primary Key)
- `scholarship_id` (UUID, Foreign Key → `scholarships`)
- `student_id` (UUID, Foreign Key → `students`)
- `start_date` (Date), `end_date` (Date)
- `amount_per_month` (Integer - nominal subsidi)
- `status` (Enum: 'active', 'graduated', 'terminated')
- `notes` (Text, nullable)
- `assigned_at` (Timestamp)

---

## 5. Integrasi API & Edge Functions
- `GET /api/reports/financial` (📋 Rencana): Mendapatkan statistik agregasi data keuangan dari tabel `bills` dan `donations` untuk visualisasi grafik.
- `POST /api/reports/pdf-export` (📋 Rencana): Mengenerate file PDF dinamis di sisi server dengan template kop surat sekolah resmi.

---

## 6. Status Implementasi Detail
- ✅ **Dashboard Overview (`SchoolDashboard.tsx`)**: Selesai menggunakan chart Recharts dan data statis pendukung.
- ✅ **CRUD Siswa & Bulk CSV (`SchoolStudentsPage.tsx`)**: Selesai dengan pratinjau tabel impor.
- ✅ **CRUD Beasiswa & Penerima (`SchoolScholarshipPage.tsx`)**: Selesai dengan fitur alokasi beasiswa ke siswa serta bagan sisa kuota penerima.
- ✅ **Halaman Laporan & Donatur (`SchoolReportPage.tsx`, `SchoolDonorsPage.tsx`)**: Selesai secara antarmuka.
- 🚧 **Generative PDF Report (V2)**: Fitur ekspor/cetak laporan berformat PDF formal sedang diintegrasikan di front-end agar mencetak langsung dari browser layout.
- 📋 **Server-side Aggregation API**: Logika penghitungan agregat piutang SPP per kelas secara real-time di Supabase belum dibuat (saat ini kalkulasi dilakukan di memori front-end).

---

## E. Perancangan

### 1. Identifikasi User

| No | Aktor | Deskripsi |
|----|-------|-----------|
| 1 | Admin Sekolah | Admin Sekolah adalah pengguna utama yang mengelola data siswa (CRUD), merancang program beasiswa, mengalokasikan penerima beasiswa, dan memantau laporan keuangan sekolah melalui dasbor grafik. |

---

### a. Daftar Kebutuhan / Use Case

| No | Kebutuhan | Aktor |
|----|-----------|-------|
| 1 | Admin Sekolah dapat melihat ringkasan statistik (total siswa, penerimaan SPP, tunggakan, kampanye pending) di halaman utama. | Admin Sekolah |
| 2 | Admin Sekolah dapat melihat grafik bar penerimaan SPP bulanan. | Admin Sekolah |
| 3 | Admin Sekolah dapat melihat 10 transaksi pembayaran terbaru. | Admin Sekolah |
| 4 | Admin Sekolah dapat menambah, mengedit, menonaktifkan, dan mengimpor data siswa dari CSV. | Admin Sekolah |
| 5 | Admin Sekolah dapat membuat program beasiswa baru beserta nominal subsidi dan sumber dana. | Admin Sekolah |
| 6 | Admin Sekolah dapat menambahkan siswa aktif sebagai penerima program beasiswa. | Admin Sekolah |
| 7 | Admin Sekolah dapat menghentikan atau mengaktifkan kembali status penerima beasiswa. | Admin Sekolah |
| 8 | Admin Sekolah dapat melihat daftar donatur yang pernah berdonasi ke kampanye sekolah. | Admin Sekolah |
| 9 | Admin Sekolah dapat melihat laporan keuangan detail (SPP vs Donasi) dalam bentuk grafik bulanan. | Admin Sekolah |
| 10 | Admin Sekolah dapat mengekspor laporan keuangan dalam format PDF (V2). | Admin Sekolah |

---

### b. Use Case Diagram

> 📌 **[Diagram Use Case Terlampir]**
> *Diagram Use Case modul Dashboard Admin Sekolah menggambarkan Admin Sekolah berinteraksi dengan: Lihat Statistik, Kelola Siswa (CRUD & Import CSV), Kelola Beasiswa (CRUD + Alokasi Penerima), Lihat Donatur, Lihat Laporan Keuangan, dan Ekspor PDF.*

---

### c. Flowchart Sistem

> 📌 **[Flowchart Sistem Terlampir]**
> *Flowchart menggambarkan alur Admin: Login → Dashboard (lihat statistik & grafik) → [Siswa]: CRUD data / import CSV → [Beasiswa]: Buat program → Tambah penerima dari daftar siswa → [Laporan]: Pilih rentang tanggal → Tampilkan grafik agregasi → Ekspor PDF.*

---

### d. Perancangan Database

#### Normalisasi Tabel

**Tabel: `scholarships`** *(Program Beasiswa)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| school_id | UUID | Foreign Key → `schools.id` |
| name | VARCHAR | Nama program beasiswa |
| description | TEXT | Deskripsi dan syarat beasiswa |
| amount_per_month | INTEGER | Subsidi per bulan (potongan SPP) |
| total_months | INTEGER | Durasi beasiswa (dalam bulan) |
| start_date | DATE | Tanggal mulai berlaku |
| end_date | DATE | Tanggal berakhir |
| source | VARCHAR | Sumber dana (e.g., 'Dana BOS', 'Yayasan') |
| campaign_id | UUID | Foreign Key → `campaigns.id` (nullable, jika berasal dari donasi) |
| status | ENUM | Status: 'active', 'completed', 'cancelled' |
| max_recipients | INTEGER | Batas maksimum jumlah penerima |
| created_at | TIMESTAMP | Waktu program dibuat |

**Tabel: `scholarship_recipients`** *(Penerima Beasiswa)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| scholarship_id | UUID | Foreign Key → `scholarships.id` |
| student_id | UUID | Foreign Key → `students.id` |
| start_date | DATE | Tanggal mulai menerima beasiswa |
| end_date | DATE | Tanggal berakhir menerima beasiswa |
| amount_per_month | INTEGER | Nominal subsidi bulanan |
| status | ENUM | Status: 'active', 'graduated', 'terminated' |
| notes | TEXT | Alasan/catatan penerima (nullable) |
| assigned_at | TIMESTAMP | Waktu siswa ditetapkan sebagai penerima |

#### Relasi Antar Tabel

| Tabel Asal | Atribut FK | Tabel Tujuan | Atribut PK | Jenis Relasi |
|------------|------------|--------------|------------|--------------|
| `scholarships` | `school_id` | `schools` | `id` | Many-to-One |
| `scholarships` | `campaign_id` | `campaigns` | `id` | Many-to-One (nullable) |
| `scholarship_recipients` | `scholarship_id` | `scholarships` | `id` | Many-to-One |
| `scholarship_recipients` | `student_id` | `students` | `id` | Many-to-One |
