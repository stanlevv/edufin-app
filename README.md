# 🎓 EDUFIN — Platform Manajemen Keuangan Pendidikan

> **Menghubungkan Siswa, Sekolah, dan Donatur dalam Satu Ekosistem Pembayaran & Fundraising.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![MIT Project](https://img.shields.io/badge/Academic-MIT_Project_2026-red?style=flat-square)](.)

---

## 📖 Tentang EDUFIN

**EDUFIN** adalah platform manajemen keuangan pendidikan yang dirancang untuk menyelesaikan masalah pengelolaan SPP yang masih manual di sekolah-sekolah Indonesia.

Platform ini menghubungkan **4 stakeholder utama** dalam satu ekosistem terintegrasi:

| Peran                     | Akses         | Fungsi Utama                                      |
| ------------------------- | ------------- | ------------------------------------------------- |
| 🏫 **Admin Sekolah**      | Desktop-first | Kelola tagihan, siswa, kampanye, laporan keuangan |
| 👨‍🎓 **Siswa / Orang Tua**  | Mobile PWA    | Bayar SPP, cek tagihan, ajukan cicilan            |
| 💚 **Donatur**            | Mobile / Web  | Donasi ke kampanye fundraising siswa              |
| 🛡️ **EDUFIN Super Admin** | Desktop       | Onboarding sekolah, moderasi platform             |

**Pilot School:** SMK NASIONAL Malang · **Target:** 50+ sekolah di Jawa Timur dalam 12 bulan

## ✨ Fitur Utama

- 💳 **Pembayaran SPP Digital** — QRIS, Virtual Account (BCA/Mandiri/BNI/BRI), GoPay, OVO, DANA via **Xendit**
- 📊 **Dashboard Admin Sekolah** — Laporan keuangan real-time, tracking siswa belum bayar, bulk operations
- 🤝 **Fundraising / Kampanye** — Siswa buat kampanye, donatur browse & donate, pencairan otomatis
- 🔄 **Cicilan (Installment)** — Request & kelola cicilan SPP dengan approval flow
- 📱 **PWA (Progressive Web App)** — Bisa diinstall di HP, offline-capable
- 🔔 **Notifikasi WhatsApp** — Reminder otomatis, konfirmasi bayar, update kampanye via Fonnte/Wablas
- 🏢 **Multi-Tenant** — Satu platform untuk banyak sekolah, data terisolasi via Supabase RLS

---

## 🧱 Tech Stack

### Frontend

| Technology            | Version | Purpose                      |
| --------------------- | ------- | ---------------------------- |
| React                 | 18      | UI framework                 |
| TypeScript            | 5       | Type safety                  |
| Vite                  | 6       | Build tool & dev server      |
| Tailwind CSS          | v4      | Styling                      |
| React Router          | v7      | Client-side routing          |
| React Hook Form + Zod | latest  | Form management & validation |
| Recharts              | latest  | Data visualization / charts  |
| Lucide React          | latest  | Icon library                 |

### Backend & Infrastructure

| Technology              | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| Supabase (PostgreSQL)   | Database, Auth, Storage, Edge Functions                |
| Supabase Auth + JWT     | Multi-role authentication dengan custom claims         |
| Supabase Edge Functions | Webhook Xendit, WhatsApp notifications, business logic |
| Xendit                  | Payment gateway (QRIS, VA, e-wallet, disbursement)     |
| Vercel                  | Frontend hosting & deployment                          |

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- pnpm (`npm install -g pnpm`)
- Supabase account & project
- (Optional) Xendit account for payments

### 1. Clone & Install

```bash
git clone <repo-url>
cd edufin
pnpm install
```

### 2. Setup Environment Variables

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan credentials kamu:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

> Lihat [.env.example](.env.example) untuk semua variabel yang tersedia.

### 3. Run Development Server

```bash
pnpm run dev
```

Buka `http://localhost:5173` di browser.

### 4. (Optional) Generate Supabase Types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase.types.ts
```

---

## 🗂️ Struktur Project

```
src/
├── features/                # Feature-based modules
│   ├── auth/                # Login, register, session management
│   ├── payment/             # SPP billing, payment flow (Xendit)
│   ├── campaign/            # Fundraising kampanye
│   ├── installment/         # Cicilan management
│   ├── student/             # Student dashboard & profile
│   └── school-admin/        # Admin sekolah dashboard
├── shared/                  # Cross-feature components
│   ├── components/          # Button, Modal, Badge, Table, etc.
│   ├── hooks/               # useDebounce, useLocalStorage, etc.
│   └── utils/               # formatCurrency, formatDate, etc.
├── lib/
│   ├── supabase.ts          # Supabase client (single instance)
│   └── supabase.types.ts    # Auto-generated DB types
└── app/
    ├── App.tsx
    └── routes.tsx
```

---

## 👥 User Roles & Routes

| Role          | Route           | Layout          | Keterangan                                |
| ------------- | --------------- | --------------- | ----------------------------------------- |
| `sekolah`     | `/school/*`     | Desktop Sidebar | Admin manajemen tagihan, siswa, kampanye  |
| `siswa`       | `/student/*`    | Mobile PWA      | Bayar SPP, cek tagihan, cicilan, kampanye |
| `donatur`     | `/donor/*`      | Mobile / Web    | Browse & donasi ke kampanye siswa         |
| `super_admin` | `/superadmin/*` | Desktop         | Platform management, onboarding sekolah   |

---

## 📚 Dokumentasi

| Dokumen                                        | Deskripsi                                                 |
| ---------------------------------------------- | --------------------------------------------------------- |
| [PRD.md](PRD.md)                               | Product Requirements Document — fitur lengkap & prioritas |
| [ARCHITECTURE.md](ARCHITECTURE.md)             | Prinsip arsitektur & coding standards                     |
| [TECH_DECISION_2026.md](TECH_DECISION_2026.md) | Keputusan teknologi & rekomendasi 2026                    |
| [TECH_STACK.md](TECH_STACK.md)                 | Detail tech stack & dependency list                       |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)           | Design system, warna, tipografi, komponen                 |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md)         | Panduan setup Supabase, RLS, migrations                   |
| [SCALABILITY.md](SCALABILITY.md)               | Strategi skalabilitas & multi-tenant                      |

---

## 🗺️ Roadmap

- [x] **Phase 0** — UI/UX Prototype (localStorage, no real backend)
- [ ] **Phase 1** — Real Supabase integration, Auth, SPP Payment via Xendit _(in progress)_
- [ ] **Phase 2** — Fundraising/Campaign live, WhatsApp notifications
- [ ] **Phase 3** — Multi-tenant expansion, 50+ sekolah Jawa Timur
- [ ] **Phase 4** — Mobile app (React Native wrapper / PWA mature)

---

## 🎓 Academic Context

Proyek ini dikembangkan sebagai **MIT Academic Project 2026**, dengan tujuan menyelesaikan masalah nyata di dunia pendidikan Indonesia sekaligus menjadi fondasi untuk startup yang sesungguhnya.

---

## 📄 License

[MIT](LICENSE) — Open source, bebas digunakan dan dimodifikasi.

---

<p align="center">
  Dibuat dengan ❤️ untuk pendidikan Indonesia
</p>
