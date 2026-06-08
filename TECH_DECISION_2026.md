# 🏆 TECH DECISION 2026
# EDUFIN — Pilihan Terbaik Berdasarkan Standar Komunitas

> **Dibuat:** 7 Juni 2026  
> **Metode:** Analisis codebase EDUFIN + survey komunitas React 2026  
> **Status:** Rekomendasi aktif — gunakan sebagai referensi keputusan teknis

---

## 📊 TL;DR — Verdict Per Kategori

| Kategori | Kondisi EDUFIN Sekarang | Rekomendasi 2026 | Action |
|----------|------------------------|------------------|--------|
| **Build Tool** | Vite ✅ | **Tetap Vite** | Tidak perlu ganti |
| **Framework** | React 18 SPA ✅ | **Tetap React + Vite** (dashboard = no SEO needed) | Tidak perlu ganti |
| **Component Library** | Radix + MUI ⚠️ | **Shadcn/ui** (hapus MUI) | Perlu migrasi |
| **Styling** | Tailwind v4 ✅ | **Tetap Tailwind v4** | Tidak perlu ganti |
| **State: Server Data** | useState + useEffect ❌ | **TanStack Query** | Wajib tambah |
| **State: Global UI** | React Context ✅ | **Zustand** (jangka panjang) | Opsional |
| **State: Form** | React Hook Form ✅ | **Tetap React Hook Form** | Tidak perlu ganti |
| **Data Fetching** | Supabase JS langsung ⚠️ | **Supabase + TanStack Query** | Wajib tambah |
| **Testing** | Vitest setup ✅ | **Tetap Vitest** | Mulai tulis test |
| **Routing** | React Router v7 ✅ | **Tetap React Router v7** | Tidak perlu ganti |

---

## 1. BUILD TOOL — ✅ VITE SUDAH BENAR

**Verdict komunitas 2026:** Vite adalah standar untuk SPA/dashboard.

**Mengapa EDUFIN tetap pakai Vite (bukan Next.js):**
- Dashboard admin sekolah → **tidak butuh SEO** → CSR cukup
- Dashboard siswa → **behind auth** → CSR cukup
- Vite lebih cepat development-nya untuk SPA

**Satu-satunya pengecualian (evaluasi di Phase 2):**
> Public Campaign Page butuh SEO agar donatur temukan via Google.  
> Opsi: pindah public pages ke Next.js, atau pakai static generation terpisah.

---

## 2. COMPONENT LIBRARY — ⚠️ HAPUS MUI, PAKAI SHADCN/UI

### Kondisi Sekarang: Radix UI + MUI (berat!)
```json
"@mui/material": "7.3.5",         // ← Berat, 300KB+ bundle
"@emotion/react": "11.14.0",      // ← Dependency MUI
"@emotion/styled": "11.14.1",     // ← Dependency MUI
+ 20 paket @radix-ui/react-*      // ← Sudah hampir shadcn
```

### Masalah:
- **MUI + Radix** = dua design system berbeda yang bentrok
- MUI sangat opinionated → susah custom sesuai desain EDUFIN
- Bundle size besar → PWA jadi berat

### Rekomendasi: **Shadcn/ui** (komunitas #1 di 2026)

Shadcn/ui = **Radix UI + Tailwind CSS + kode kamu sendiri**  
Kamu sudah punya semua komponennya (Radix + Tailwind) — tinggal adopt pola shadcn.

```bash
# Install shadcn/ui
npx shadcn@latest init

# Add komponen yang butuh
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add form
```

**Kenapa shadcn lebih baik dari MUI:**
| | MUI | Shadcn/ui |
|-|-----|-----------|
| Bundle size | ~300KB | 0KB (code ada di repo kamu) |
| Customization | "Fight the library" | Code adalah milik kamu |
| Tailwind compat | Konflik | Built on Tailwind |
| Community 2026 | Menurun | Naik drastis |
| EDUFIN design | Susah override | Mudah sesuaikan |

**Action:** Hapus MUI secara bertahap, replace dengan shadcn components.

---

## 3. STATE MANAGEMENT — ❌ PERLU UPGRADE

### Kondisi Sekarang: useState + useEffect + React Context
```typescript
// Pattern yang ada sekarang (dari AuthContext.tsx)
const [bills, setBills] = useState([])
useEffect(() => {
  supabase.from('bills').select('*').then(({ data }) => setBills(data))
}, [])
```

**Masalah:**
- No caching → fetch ulang setiap kali komponen mount
- No background refetch → data stale
- No loading/error state standar
- Memory leak kalau komponen unmount sebelum fetch selesai

---

### 3a. SERVER STATE → **TanStack Query** ⭐ WAJIB

**Komunitas 2026:** TanStack Query menggantikan 80% kebutuhan global state.

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

**Setup:**
```typescript
// src/app/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,  // 2 menit
      retry: 1,
    }
  }
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**Contoh penerapan di EDUFIN:**
```typescript
// ❌ SEBELUM (manual fetch)
const [bills, setBills] = useState([])
useEffect(() => {
  supabase.from('bills').select('*').then(({ data }) => setBills(data ?? []))
}, [])

// ✅ SESUDAH (TanStack Query)
function useBills(schoolId: string) {
  return useQuery({
    queryKey: ['bills', schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bills')
        .select('*, students(name, nisn, class)')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 2,
  })
}

// Di komponen:
const { data: bills, isLoading, error } = useBills(schoolId)
```

---

### 3b. GLOBAL CLIENT STATE → Context (sekarang OK, Zustand nanti)

**Context sudah cukup** untuk EDUFIN saat ini karena:
- Hanya 1 AuthContext yang benar-benar global
- Tidak ada shared client state yang kompleks

**Kapan upgrade ke Zustand:**
- Kalau Context menyebabkan re-render performance issue
- Kalau ada 5+ Context provider berbeda

```bash
# Nanti jika butuh:
pnpm add zustand
```

---

### 3c. FORM STATE → ✅ React Hook Form SUDAH BENAR

Tidak perlu ganti. React Hook Form tetap standar komunitas 2026.

---

## 4. DATA FETCHING PATTERN — ⚠️ PERLU STANDARISASI

### The Golden Rule 2026:
> **Jangan simpan server data di useState/Context.**  
> Biarkan TanStack Query yang manage semua data dari Supabase.

### Pola Standar EDUFIN:

```typescript
// src/features/payment/hooks/useBills.ts

// QUERY (baca data)
export const billsQuery = (schoolId: string) => ({
  queryKey: ['bills', schoolId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('bills')
      .select('*, students(name, nisn, class)')
      .eq('school_id', schoolId)
    if (error) throw error
    return data
  }
})

export const useBills = (schoolId: string) => useQuery(billsQuery(schoolId))

// MUTATION (tulis data)  
export const useCreateBill = () => useMutation({
  mutationFn: async (input: CreateBillInput) => {
    const { data, error } = await supabase.from('bills').insert(input).select().single()
    if (error) throw error
    return data
  },
  onSuccess: () => {
    // Invalidate cache → otomatis refetch
    queryClient.invalidateQueries({ queryKey: ['bills'] })
    toast.success('Tagihan berhasil dibuat')
  }
})
```

---

## 5. ROUTING — ✅ REACT ROUTER V7 SUDAH BENAR

React Router v7 sudah sangat baik untuk SPA. Tidak perlu ganti.

**Catatan:** Komunitas 2026 mulai beralih ke **TanStack Router** untuk proyek baru karena type-safety lebih baik. Tapi untuk EDUFIN yang sudah pakai RR v7, tidak worth migrasi sekarang.

---

## 6. TESTING — ⚠️ BELUM DIMANFAATKAN

Setup `vitest` sudah ada di package.json, tapi belum ada test yang ditulis.

**Minimal yang perlu ada di EDUFIN:**

```typescript
// Prioritas testing:
// 1. Business logic functions (formatCurrency, calculateLateFee)
// 2. Custom hooks (useBills, usePayment)
// 3. Form validation (Zod schemas)
// 4. TIDAK perlu: snapshot test, pixel-perfect test
```

**Tooling yang sudah ada (tidak perlu tambah):**
- ✅ `vitest` — test runner
- ✅ `@testing-library/react` — component testing
- ✅ `@testing-library/user-event` — simulate user interaction
- ✅ `jsdom` — virtual browser environment

---

## 7. KESIMPULAN — APA YANG HARUS DILAKUKAN

### 🔴 PRIORITAS TINGGI (lakukan sekarang)
1. **Install TanStack Query** → ganti semua `useState + useEffect` untuk server data
2. **Generate Supabase types** → `npx supabase gen types typescript`

### 🟡 PRIORITAS MEDIUM (lakukan saat refactor fitur)
3. **Hapus MUI secara bertahap** → replace dengan shadcn/ui components
4. **Refactor ke Package by Feature** → struktur `src/features/`
5. **Tulis test untuk business logic**

### 🟢 PRIORITAS RENDAH (evaluasi nanti)
6. **Zustand** → hanya jika Context mulai bermasalah
7. **Next.js untuk public pages** → hanya jika SEO jadi kebutuhan nyata
8. **TanStack Router** → hanya jika mulai proyek baru

---

## 8. JANGAN LAKUKAN INI (Anti-hype 2026)

| Jangan | Kenapa |
|--------|--------|
| Migrasi ke Next.js sekarang | Dashboard app tidak butuh SSR; over-engineering |
| Install Redux Toolkit | Overkill untuk scale EDUFIN; Zustand + TanStack Query cukup |
| Ganti ke Bun/Deno runtime | Supabase Edge Function sudah Deno; frontend tidak perlu |
| React Native sekarang | PWA dulu, native app kalau ada kebutuhan nyata |
| Prisma ORM | EDUFIN pakai Supabase; tidak ada backend server sendiri |

---

*"Bangun sesuai kebutuhan bisnis, bukan karena hype teknologi."*  
*— YAGNI principle, ARCHITECTURE.md*
