# 🔔 Spesifikasi Fitur: Sistem Notifikasi (Notifications System)

## 1. Deskripsi Fitur
Sistem Notifikasi di EDUFIN memegang peranan krusial untuk memastikan orang tua siswa tidak melewatkan jatuh tempo pembayaran, serta menginformasikan donatur/siswa mengenai status kampanye penggalangan dana. Sistem ini bekerja melalui dua saluran utama: notifikasi di dalam aplikasi (In-App) dan pesan WhatsApp otomatis.

---

## 2. Aktor / Role Terkait
- **Siswa / Orang Tua:** Menerima pengingat tagihan SPP bulanan, update status cicilan, notifikasi dana donasi masuk, serta update dari kampanye.
- **Admin Sekolah:** Menerima pemberitahuan pengajuan cicilan baru, pengajuan kampanye baru, verifikasi transfer manual dari siswa, serta dapat mengirimkan pesan massal (WhatsApp Blast) ke kelas tertentu.
- **Donatur:** Menerima konfirmasi terima donasi serta bukti pembayaran digital melalui email/WhatsApp.

---

## 3. Alur UX & Rute Halaman
- **In-App Notification Center (Lonceng Notifikasi)**:
  - Tersedia di bar navigasi atas atau menu khusus (`SchoolNotificationsPage.tsx` untuk admin, widget popup di beranda siswa).
  - Tanda merah dengan angka penunjuk notifikasi yang belum dibaca (*Unread Count*).
  - Setiap notifikasi memiliki warna penanda sesuai kategori:
    - **Success** (Hijau): Cth, Pembayaran lunas.
    - **Info** (Biru): Cth, Kampanye disetujui.
    - **Warning** (Kuning): Cth, Pengajuan cicilan dikirim.
    - **Urgent** (Merah): Cth, Jatuh tempo SPP terlewat.
  - Klik baris notifikasi akan menandai sebagai terbaca dan mengarahkan ke halaman relevan (*Deep Linking* via `action_url`).
- `/school/notifications` — **Halaman Notifikasi Admin**:
  - Daftar pemberitahuan masuk bagi manajemen sekolah dengan opsi hapus notifikasi dan tandai semua telah dibaca.

---

## 4. Skema Database & Entitas Terkait

### `notifications` (Notifikasi Aplikasi)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `auth.users`)
- `school_id` (UUID, Foreign Key → `schools`, nullable)
- `title` (String), `message` (Text)
- `type` (Enum: 'info', 'success', 'warning', 'urgent')
- `category` (Enum: 'payment', 'campaign', 'installment', 'system')
- `read` (Boolean - default false)
- `action_url` (String, nullable - deep link ke rute terkait)
- `created_at` (Timestamp)

### `whatsapp_logs` (Log WhatsApp)
Digunakan untuk merekam dan memantau status pengiriman pesan WhatsApp.
- `id` (UUID, Primary Key)
- `recipient_phone` (String)
- `message` (Text)
- `event_type` (String - contoh: 'payment_reminder', 'payment_success')
- `status` (Enum: 'queued', 'sent', 'failed')
- `error_message` (Text, nullable)
- `sent_at` (Timestamp, nullable)

---

## 5. Integrasi API & Edge Functions
- `POST /functions/v1/whatsapp-send`: Deno Edge Function untuk mengirim pesan WhatsApp ke satu tujuan via pihak ketiga (Fonnte/Wablas).
- `POST /functions/v1/whatsapp-blast`: Mengirim pesan ke banyak penerima secara paralel.
- **Supabase Webhooks**: Men-trigger pengiriman WhatsApp otomatis saat ada perubahan baris data (cth, status `bills` berubah jadi `lunas`).

---

## 6. Status Implementasi Detail
- ✅ **In-App Notification UI**: Selesai untuk admin sekolah di `/school/notifications` dan widget lonceng di dashboard siswa/donatur.
- ✅ **Kategori & Pewarnaan Badges**: Selesai di front-end.
- 🚧 **Integrasi WhatsApp Webhook**: Kode Edge Function telah didesain secara arsitektur namun kredensial API Fonnte/Wablas riil masih menunggu Phase 2.
- 📋 **PWA Push Notifications**: Rencana integrasi browser push API menggunakan Service Worker untuk notifikasi instan saat aplikasi ditutup belum dimulai.

---

## E. Perancangan

### 1. Identifikasi User

| No | Aktor | Deskripsi |
|----|-------|-----------|
| 1 | Siswa / Orang Tua | Siswa/Orang Tua adalah penerima notifikasi pengingat tagihan SPP, konfirmasi pembayaran, update status cicilan, dan perkembangan kampanye donasi. |
| 2 | Admin Sekolah | Admin Sekolah adalah pengguna yang menerima notifikasi pengajuan cicilan/kampanye baru, verifikasi transfer, dan dapat mengirim WhatsApp Blast ke siswa/orang tua. |
| 3 | Donatur | Donatur adalah pengguna yang menerima konfirmasi penerimaan donasi dan perkembangan kampanye yang didukung melalui WhatsApp/email. |
| 4 | Sistem | Sistem adalah aktor otomatis yang mengirimkan notifikasi berdasarkan pemicu (trigger) perubahan data di database (e.g., tagihan jatuh tempo, pembayaran berhasil). |

---

### a. Daftar Kebutuhan / Use Case

| No | Kebutuhan | Aktor |
|----|-----------|-------|
| 1 | Sistem harus menampilkan ikon lonceng dengan penghitung notifikasi yang belum dibaca. | Semua Role |
| 2 | Pengguna dapat melihat daftar semua notifikasi (terbaca dan belum terbaca) di pusat notifikasi. | Semua Role |
| 3 | Pengguna dapat menandai satu atau semua notifikasi sebagai sudah dibaca. | Semua Role |
| 4 | Pengguna dapat menghapus notifikasi yang tidak diperlukan. | Semua Role |
| 5 | Klik notifikasi harus mengarahkan pengguna ke halaman yang relevan (deep link). | Semua Role |
| 6 | Sistem harus mengirimkan WhatsApp otomatis ke orang tua saat tagihan SPP baru dibuat. | Sistem |
| 7 | Sistem harus mengirimkan WhatsApp pengingat 7 hari dan 1 hari sebelum jatuh tempo tagihan. | Sistem |
| 8 | Sistem harus mengirimkan WhatsApp konfirmasi ke orang tua saat pembayaran SPP berhasil. | Sistem |
| 9 | Admin Sekolah dapat mengirimkan pesan WhatsApp Blast ke seluruh siswa atau kelas tertentu. | Admin Sekolah |
| 10 | Sistem harus mencatat setiap pengiriman WhatsApp ke tabel log (status: queued/sent/failed). | Sistem |

---

### b. Use Case Diagram

> 📌 **[Diagram Use Case Terlampir]**
> *Diagram Use Case modul Notifikasi menggambarkan: Semua Role (lihat notifikasi, tandai dibaca, hapus, klik deep link), Admin Sekolah (kirim WhatsApp Blast), dan Sistem sebagai aktor otomatis (kirim WhatsApp reminder, kirim konfirmasi pembayaran, log pengiriman).*

---

### c. Flowchart Sistem

> 📌 **[Flowchart Sistem Terlampir]**
> *Flowchart menggambarkan alur: [Trigger] Perubahan status di database (e.g., status bills = 'lunas') → Supabase Database Webhook aktif → Panggil Edge Function whatsapp-send → Kirim pesan ke nomor HP orang tua via Fonnte API → Simpan hasil pengiriman ke tabel whatsapp_logs → Jika gagal: retry 1x → Tandai status 'failed'.*

---

### d. Perancangan Database

#### Normalisasi Tabel

**Tabel: `notifications`** *(Notifikasi In-App)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key → `auth.users.id` (penerima notifikasi) |
| school_id | UUID | Foreign Key → `schools.id` (nullable, untuk konteks sekolah) |
| title | VARCHAR | Judul singkat notifikasi |
| message | TEXT | Isi pesan notifikasi |
| type | ENUM | Jenis: 'info', 'success', 'warning', 'urgent' |
| category | ENUM | Kategori: 'payment', 'campaign', 'installment', 'system' |
| read | BOOLEAN | Status baca (default: false) |
| action_url | VARCHAR | Deep link ke halaman terkait (nullable) |
| created_at | TIMESTAMP | Waktu notifikasi dibuat |

**Tabel: `whatsapp_logs`** *(Log Pengiriman WhatsApp)*

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | UUID | Primary Key |
| recipient_phone | VARCHAR | Nomor HP tujuan (format internasional) |
| message | TEXT | Isi pesan yang dikirim |
| event_type | VARCHAR | Jenis kejadian: 'payment_reminder', 'payment_success', dll |
| status | ENUM | Status pengiriman: 'queued', 'sent', 'failed' |
| error_message | TEXT | Pesan kesalahan jika gagal kirim (nullable) |
| sent_at | TIMESTAMP | Waktu pesan terkirim (nullable) |
| created_at | TIMESTAMP | Waktu log dibuat |

#### Relasi Antar Tabel

| Tabel Asal | Atribut FK | Tabel Tujuan | Atribut PK | Jenis Relasi |
|------------|------------|--------------|------------|--------------|
| `notifications` | `user_id` | `auth.users` | `id` | Many-to-One |
| `notifications` | `school_id` | `schools` | `id` | Many-to-One (nullable) |
