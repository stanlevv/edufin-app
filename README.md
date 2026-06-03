# EDUFIN — Platform Manajemen Keuangan Sekolah

Aplikasi fintech pendidikan untuk mengelola pembayaran SPP, pinjaman mikro, dan donasi kampanye sekolah.

## Struktur Proyek

```
edufin-app/
├── frontend/       ← React + Vite + Tailwind CSS v4
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/        ← Supabase Edge Functions + PostgreSQL
│   ├── supabase/
│   ├── supabase-schema.sql
│   └── database/
│
├── README.md
└── .gitignore
```

## Aktor Sistem

| Aktor | Role | Fitur Utama |
|---|---|---|
| 🏫 **Sekolah** | Admin | Kelola siswa, tagihan SPP, kampanye donasi, laporan keuangan |
| 🎓 **Siswa** | Pelajar | Bayar SPP, pinjaman mikro, lihat kampanye |
| ❤️ **Donatur** | Donatur | Donasi kampanye, riwayat donasi |

## Quick Start

### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

### Backend
```bash
cd backend
supabase functions serve server
```

## Dokumentasi
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Database Schema](./backend/supabase-schema.sql)

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS v4, React Router v7
- **Backend**: Supabase Edge Functions (Deno), PostgreSQL
- **Auth**: Supabase Auth (+ localStorage fallback untuk demo)