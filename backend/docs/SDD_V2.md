# Software Design Document (SDD) - EDUFIN V2

## 1. System Architecture
V2 pindah dari penyimpanan di LocalStorage klien ke arsitektur Cloud Serverless.
- **Frontend**: Tetap React + Vite, mengkonsumsi Supabase JS SDK.
- **Backend/API**: Supabase Edge Functions (untuk endpoint Midtrans webhook & notifikasi).
- **Database**: Supabase PostgreSQL.
- **File Storage**: Supabase Storage Bucket `feed_updates` untuk menyimpan gambar/nota dari siswa.

## 2. Database Schema Updates

### 2.1 Table: `micro_loans`
Menyimpan riwayat pengajuan pinjaman dari siswa ke sekolah.
```sql
- id: uuid (PK)
- student_id: uuid (FK -> students)
- requested_amount: numeric
- purpose: text
- tenor_months: int
- status: enum ('pending', 'approved', 'rejected', 'completed')
- approved_at: timestamp
- created_at: timestamp
```

### 2.2 Table: `campaign_updates`
Feed Transparansi untuk donatur.
```sql
- id: uuid (PK)
- campaign_id: uuid (FK -> campaigns)
- title: string
- description: text
- photo_url: string (URL ke bucket Supabase)
- receipt_amount: numeric (jumlah yang terpakai di nota)
- is_verified_by_school: boolean
- created_at: timestamp
```

### 2.3 Webhook Workflow (Midtrans)
1. Pembayaran QRIS/VA melalui Snap Midtrans di Frontend.
2. Saat pembayaran sukses, Midtrans `HTTP POST` ke `https://[SUPABASE-PROJECT].supabase.co/functions/v1/payment-webhook`
3. Edge Function memverifikasi signature kunci Midtrans.
4. Edge Function meng-update tabel `bills` (jika SPP) atau `donations` (jika campaign) ke status `SUCCESS`.

## 3. Security Design (RLS)
- `micro_loans`: `SELECT` untuk siswa (hanya id mereka) dan Admin (semua).
- `campaign_updates`: `SELECT` public, `INSERT` hanya pembuat campaign, `UPDATE` hanya admin.
