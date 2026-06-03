# EDUFIN — Backend

Backend EDUFIN menggunakan Supabase Edge Functions (Deno) sebagai API server.

## Tech Stack
- Supabase Edge Functions (Deno runtime)
- PostgreSQL (via Supabase)
- TypeScript / TSX

## Struktur Folder

```
backend/
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx      # Entry point Edge Function
│           ├── api.tsx        # Route handler & API endpoints
│           ├── kv_store.tsx   # Key-Value store helper
│           └── seedData.tsx   # Data seed untuk development
├── supabase-schema.sql        # Skema database PostgreSQL
├── database/                  # Skrip & migrasi database
├── utils/                     # Utility functions
└── docs/                      # Dokumentasi teknis
```

## API Endpoints

| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/api/students` | Daftar semua siswa |
| `POST` | `/api/bills` | Buat tagihan baru |
| `GET` | `/api/campaigns` | Daftar kampanye aktif |
| `POST` | `/api/donations` | Simpan donasi baru |
| `GET` | `/api/notifications/:userId` | Notifikasi user |

## Setup Supabase

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login:
   ```bash
   supabase login
   ```

3. Jalankan functions lokal:
   ```bash
   supabase functions serve server
   ```

4. Deploy ke Supabase:
   ```bash
   supabase functions deploy server
   ```

## Database

Import skema ke Supabase:
```bash
supabase db push
```
atau jalankan `supabase-schema.sql` langsung di SQL Editor Supabase dashboard.

## Environment Variables

Tambahkan di Supabase Dashboard → Settings → Edge Functions:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
