# EDUFIN — Frontend

Platform manajemen keuangan sekolah berbasis React + Vite + Tailwind CSS v4.

## Tech Stack
- React 18
- Vite
- Tailwind CSS v4
- React Router v7
- Recharts
- Lucide React
- Supabase JS Client

## Cara Jalankan
VITE_MIDTRANS_CLIENT_KEY=Mid-client-el0zIHb1ZkIPvrjI
VITE_SUPABASE_URL=https://pxqamlbdamrkwrdnbhmf.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_kR-qLNL8nf-G4ReZTML1pg_MvXqiDLi

```bash
# Install dependencies
pnpm install

# Jalankan dev server
pnpm run dev

# Build production
pnpm run build
```

## Struktur Folder

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/        # Login, Register, ProtectedRoute
│   │   │   ├── school/      # Dashboard & halaman admin sekolah
│   │   │   ├── student/     # Dashboard & halaman siswa
│   │   │   ├── donor/       # Dashboard & halaman donatur
│   │   │   └── shared/      # Komponen bersama (BottomNav, AppLayout, dll)
│   │   ├── context/         # AuthContext
│   │   ├── data/            # Database class (localStorage)
│   │   └── routes.tsx       # Routing utama
│   ├── styles/              # CSS global
│   └── main.tsx             # Entry point
├── index.html
├── vite.config.ts
└── package.json
```

## Aktor & Role

| Role | Path | Keterangan |
|---|---|---|
| `sekolah` | `/school` | Admin manajemen tagihan, kampanye, siswa |
| `siswa` | `/student` | Bayar SPP, pinjaman, donasi |
| `donatur` | `/donor` | Donasi kampanye, riwayat donasi |

## Environment Variables

Salin `.env.example` menjadi `.env.local` dan isi:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
