# 🏗️ ARCHITECTURE.md
# EDUFIN — Prinsip Arsitektur Modern 2026

> **Referensi:** Diadaptasi dari presentasi "Arsitektur React-Laravel Modern 2026"  
> **Stack EDUFIN:** React 18 + TypeScript + Vite + Supabase (bukan Laravel)  
> **Last Updated:** 7 Juni 2026

---

## 📋 DAFTAR ISI

1. [Prinsip Utama](#1-prinsip-utama)
2. [Struktur Folder (Package by Feature)](#2-struktur-folder-package-by-feature)
3. [Type Safety: Frontend ↔ Supabase](#3-type-safety-frontend--supabase)
4. [Supabase Client & Query Patterns](#4-supabase-client--query-patterns)
5. [State Management](#5-state-management)
6. [Business Logic — Jangan di Komponen](#6-business-logic--jangan-di-komponen)
7. [Error Handling Global](#7-error-handling-global)
8. [CSR vs SSR di EDUFIN](#8-csr-vs-ssr-di-edufin)
9. [Pagination Skala Besar](#9-pagination-skala-besar)
10. [Supabase Edge Functions (Backend Logic)](#10-supabase-edge-functions-backend-logic)
11. [Anti-Patterns yang Wajib Dihindari](#11-anti-patterns-yang-wajib-dihindari)

---

## 1. PRINSIP UTAMA

### ✅ YAGNI — You Aren't Gonna Need It
> Jangan over-engineer sejak awal. Bangun sesuai kebutuhan sekarang.

```
❌ SALAH: Bikin abstraction layer 3 tingkat sebelum butuh
✅ BENAR: Mulai sederhana, refactor saat sudah nyata kompleksitasnya
```

### ✅ Separation of Concerns
| Layer | Tanggung Jawab |
|-------|----------------|
| **UI Component** | Tampilkan data, handle events |
| **Custom Hook** | Business logic, state, API calls |
| **Supabase Query** | Akses data dari database |
| **Edge Function** | Server-side logic (webhook, external API) |

### ✅ Single Responsibility
Setiap file/fungsi hanya punya 1 tujuan utama.

---

## 2. STRUKTUR FOLDER (Package by Feature)

### ❌ JANGAN — Organized by Type
```
src/
├── components/
│   ├── Button.tsx
│   ├── PaymentCard.tsx
│   ├── CampaignCard.tsx
├── hooks/
│   ├── usePayment.ts
│   ├── useCampaign.ts
├── pages/
│   ├── PaymentPage.tsx
│   ├── CampaignPage.tsx
```
**Masalah:** Kalau edit fitur "Campaign", harus lompat-lompat 3 folder.

---

### ✅ LAKUKAN — Organized by Feature (Package by Feature)
```
src/
├── features/
│   ├── auth/
│   │   ├── components/      # LoginForm, RegisterForm
│   │   ├── hooks/           # useAuth.ts
│   │   ├── types.ts         # User, Session types
│   │   └── index.ts         # Public exports
│   ├── payment/
│   │   ├── components/      # PaymentCard, PaymentModal
│   │   ├── hooks/           # usePayment.ts, useBill.ts
│   │   ├── services/        # xendit.ts (API calls ke Xendit)
│   │   ├── types.ts
│   │   └── index.ts
│   ├── campaign/
│   │   ├── components/      # CampaignCard, DonateModal
│   │   ├── hooks/           # useCampaign.ts, useDonation.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── installment/
│   ├── student/
│   └── school-admin/
├── shared/                  # Komponen lintas fitur
│   ├── components/          # Button, Modal, Badge, etc.
│   ├── hooks/               # useDebounce, useLocalStorage
│   └── utils/               # formatCurrency, formatDate
├── lib/
│   ├── supabase.ts          # Supabase client (SATU instance)
│   └── supabase.types.ts    # Auto-generated types
└── app/
    ├── App.tsx
    └── routes.tsx
```

**Manfaat:**
- ✅ Semua kode fitur "Campaign" ada di 1 tempat
- ✅ Mudah delete fitur (hapus 1 folder)
- ✅ Onboarding developer baru lebih cepat

---

## 3. TYPE SAFETY: Frontend ↔ Supabase

### Masalah
TypeScript frontend sering tidak sinkron dengan schema database Supabase.

### Solusi: Auto-generate Types dari Supabase

```bash
# Generate TypeScript types dari schema Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase.types.ts
```

Hasil file `supabase.types.ts`:
```typescript
export type Database = {
  public: {
    Tables: {
      bills: {
        Row: {           // ← type untuk SELECT
          id: string
          student_id: string
          amount: number
          status: 'lunas' | 'belum_bayar' | 'terlambat' | 'cicilan'
          due_date: string
          created_at: string
        }
        Insert: {        // ← type untuk INSERT
          id?: string
          student_id: string
          amount: number
          // ...
        }
        Update: {        // ← type untuk UPDATE
          amount?: number
          status?: 'lunas' | 'belum_bayar' | 'terlambat' | 'cicilan'
          // ...
        }
      }
      // ... tabel lainnya
    }
  }
}
```

### Gunakan di Kode
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase.types'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

```typescript
// ✅ Sekarang otomatis type-safe!
const { data } = await supabase.from('bills').select('*')
// data: Database['public']['Tables']['bills']['Row'][] | null
```

> **Rule:** Selalu jalankan `supabase gen types` setiap kali ada migration baru!

---

## 4. SUPABASE CLIENT & QUERY PATTERNS

### ❌ JANGAN — Query langsung di komponen
```tsx
// PaymentCard.tsx — SALAH
function PaymentCard({ billId }: { billId: string }) {
  const [bill, setBill] = useState(null)
  
  useEffect(() => {
    // Jangan query database langsung di component!
    supabase.from('bills').select('*').eq('id', billId).then(({ data }) => {
      setBill(data)
    })
  }, [billId])
  
  return <div>{bill?.amount}</div>
}
```

### ✅ LAKUKAN — Pisahkan ke Custom Hook
```typescript
// features/payment/hooks/useBill.ts
export function useBill(billId: string) {
  const [bill, setBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchBill() {
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          student:students(name, nisn, class)
        `)
        .eq('id', billId)
        .single()

      if (error) setError(error)
      else setBill(data)
      setLoading(false)
    }

    fetchBill()
  }, [billId])

  return { bill, loading, error }
}
```

```tsx
// PaymentCard.tsx — BENAR
function PaymentCard({ billId }: { billId: string }) {
  const { bill, loading, error } = useBill(billId)
  
  if (loading) return <Skeleton />
  if (error) return <ErrorState error={error} />
  
  return <div>{bill?.amount}</div>
}
```

### Lebih Baik: Gunakan TanStack Query
```bash
pnpm add @tanstack/react-query
```

```typescript
// features/payment/hooks/useBill.ts
import { useQuery } from '@tanstack/react-query'

export function useBill(billId: string) {
  return useQuery({
    queryKey: ['bill', billId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bills')
        .select('*, student:students(name, nisn)')
        .eq('id', billId)
        .single()
      
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
```

**Manfaat TanStack Query:**
- ✅ Caching otomatis
- ✅ Background refetch
- ✅ Loading/error state out of the box
- ✅ Optimistic updates
- ✅ Server-side pagination built-in

---

## 5. STATE MANAGEMENT

### Kapan Pakai Apa

| State Type | Tool | Contoh |
|------------|------|--------|
| **Server state** (data dari DB) | TanStack Query | `useBill()`, `useCampaign()` |
| **Global UI state** | React Context | Auth state, theme, notifications |
| **Local UI state** | `useState` | Modal open/close, form input |
| **URL state** | React Router | Filter, pagination, search |

### ❌ JANGAN — Semua ke Context
```typescript
// Jangan simpan server data di Context!
const AppContext = createContext({
  bills: [],         // ← ini harusnya pakai TanStack Query
  campaigns: [],     // ← ini juga
  user: null,        // ← ini OK di Context
})
```

### ✅ LAKUKAN — Context Hanya untuk Global UI State
```typescript
// src/app/context/AuthContext.tsx
const AuthContext = createContext<{
  user: User | null
  role: 'siswa' | 'sekolah' | 'donatur' | 'super_admin' | null
  signOut: () => Promise<void>
}>()

// src/app/context/NotifContext.tsx  
const NotifContext = createContext<{
  unreadCount: number
  markAllRead: () => void
}>()
```

---

## 6. BUSINESS LOGIC — JANGAN DI KOMPONEN

### Konsep: Presentasi (PPT) = "Jangan Fat Controller"
Di EDUFIN (tanpa Laravel), equivalent-nya adalah:
> **Jangan Fat Component** — jangan tulis logika bisnis di dalam JSX component

### ❌ SALAH — Fat Component
```tsx
function PaymentPage() {
  const handlePay = async () => {
    // Semua logika bisnis ada di komponen — SALAH
    const bill = await supabase.from('bills').select('*').eq('id', billId).single()
    const invoice = await fetch('/functions/v1/xendit-create-invoice', {
      method: 'POST',
      body: JSON.stringify({ billId, amount: bill.data.amount })
    })
    const { payment_url } = await invoice.json()
    window.location.href = payment_url
    await supabase.from('bills').update({ status: 'pending' }).eq('id', billId)
    toast.success('Redirecting ke halaman pembayaran...')
  }
  
  return <button onClick={handlePay}>Bayar</button>
}
```

### ✅ BENAR — Logika di Custom Hook / Service
```typescript
// features/payment/hooks/usePayment.ts
export function usePayment() {
  const { mutateAsync: initiatePayment, isPending } = useMutation({
    mutationFn: async ({ billId, paymentMethod }: InitiatePaymentInput) => {
      const response = await fetch('/functions/v1/xendit-create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billId, paymentMethod })
      })
      if (!response.ok) throw new Error('Gagal membuat invoice')
      return response.json() as Promise<{ payment_url: string }>
    },
    onSuccess: ({ payment_url }) => {
      toast.success('Redirecting ke halaman pembayaran...')
      window.location.href = payment_url
    },
    onError: (error) => {
      toast.error(`Pembayaran gagal: ${error.message}`)
    }
  })

  return { initiatePayment, isPending }
}
```

```tsx
// PaymentPage.tsx — Komponen menjadi tipis dan bersih
function PaymentPage() {
  const { initiatePayment, isPending } = usePayment()
  
  return (
    <button 
      onClick={() => initiatePayment({ billId, paymentMethod: 'QRIS' })}
      disabled={isPending}
    >
      {isPending ? 'Memproses...' : 'Bayar'}
    </button>
  )
}
```

---

## 7. ERROR HANDLING GLOBAL

### Setup Global Error Handler untuk Supabase

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase.types'
import { toast } from 'sonner'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      onAuthStateChange: (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Auto redirect ke login
          window.location.href = '/login'
        }
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
        }
      }
    }
  }
)
```

### Global Error Handler dengan TanStack Query
```typescript
// src/app/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2, // 2 menit default
    },
    mutations: {
      onError: (error) => {
        // Global mutation error handler
        toast.error(error.message || 'Terjadi kesalahan, coba lagi')
      }
    }
  }
})
```

### HTTP Error Codes yang Wajib Dihandle
| Error | Supabase Code | Handling |
|-------|---------------|----------|
| **Unauthorized** | 401 | Auto redirect ke `/login`, clear session |
| **Forbidden** | 403 | Tampilkan "Akses ditolak" |
| **Not Found** | 404 | Tampilkan empty state |
| **Validation** | 422 | Tampilkan error per field di form |
| **Server Error** | 500 | Toast error + report ke monitoring |

---

## 8. CSR vs SSR DI EDUFIN

EDUFIN saat ini adalah **pure CSR (Client Side Rendering)** via Vite.

### Kapan Tetap CSR ✅
| Halaman | Alasan |
|---------|--------|
| Dashboard Admin Sekolah | Login-gated, tidak perlu SEO |
| Dashboard Siswa | Login-gated, tidak perlu SEO |
| Halaman Tagihan SPP | Private, behind auth |
| Semua halaman admin | Tidak perlu SEO |

### Kapan Perlu SSR / SSG ⚡ (Future Consideration)
| Halaman | Alasan |
|---------|--------|
| **Public Campaign Page** | Perlu SEO agar donatur bisa temukan via Google |
| **Landing Page EDUFIN** | SEO critical untuk user acquisition |
| **Share Campaign** | Open Graph meta tags untuk WhatsApp preview |

### Solusi untuk Share Campaign (Tanpa Full SSR)
Untuk sekarang, bisa gunakan **Dynamic Meta Tags** di CSR:
```typescript
// Saat campaign di-share via WhatsApp, update meta tags
useEffect(() => {
  document.title = `${campaign.title} — EDUFIN`
  document.querySelector('meta[property="og:title"]')
    ?.setAttribute('content', campaign.title)
  document.querySelector('meta[property="og:description"]')
    ?.setAttribute('content', campaign.description)
}, [campaign])
```

> **Decision untuk Phase 2:** Evaluasi apakah public campaign page perlu pindah ke Next.js untuk SSR/SSG demi SEO.

---

## 9. PAGINATION SKALA BESAR

### ❌ JANGAN — Ambil Semua Data Sekaligus
```typescript
// SALAH — crash kalau data ribuan
const { data } = await supabase.from('bills').select('*') // ambil semua
const pageData = data.slice(page * 10, (page + 1) * 10)  // filter di frontend
```

### ✅ LAKUKAN — Server-Side Pagination
```typescript
// features/payment/hooks/useBillsList.ts
export function useBillsList({ page = 1, pageSize = 20, classFilter = '' }) {
  return useQuery({
    queryKey: ['bills', page, pageSize, classFilter],
    queryFn: async () => {
      let query = supabase
        .from('bills')
        .select('*, students(name, nisn, class)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1) // ← Server-side slice
      
      if (classFilter) {
        query = query.eq('students.class', classFilter)
      }
      
      const { data, error, count } = await query
      if (error) throw error
      return { data, total: count ?? 0, page, pageSize }
    },
    placeholderData: (prev) => prev, // ← Smooth transition antar page
  })
}
```

### Tampilkan dengan Pagination UI
```tsx
function BillsTable() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useBillsList({ page, pageSize: 20 })
  
  return (
    <>
      <Table data={data?.data ?? []} />
      <Pagination 
        total={data?.total ?? 0}
        page={page}
        pageSize={20}
        onChange={setPage}
      />
    </>
  )
}
```

---

## 10. SUPABASE EDGE FUNCTIONS (Backend Logic)

Edge Functions adalah "Service Class" EDUFIN — tempat logika bisnis yang tidak boleh di frontend.

### Kapan Harus Pakai Edge Function?
| Kasus | Alasan |
|-------|--------|
| **Webhook Xendit** | Secret key tidak boleh di frontend |
| **Kirim WhatsApp** | API key tidak boleh di frontend |
| **Disbursement ke sekolah** | Transaksi keuangan butuh server validation |
| **Bulk import siswa** | Processing berat |
| **Generate PDF receipt** | Server-side rendering |
| **Cron jobs** (reminder) | Scheduled tasks |

### Struktur Edge Function yang Bersih
```typescript
// supabase/functions/xendit-create-invoice/index.ts

// ✅ Selalu validate input
// ✅ Selalu verify auth (kecuali public endpoints)
// ✅ Return consistent error format
// ✅ Log semua transaksi penting

serve(async (req) => {
  try {
    // 1. Verify auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return unauthorized()
    
    const { data: { user } } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (!user) return unauthorized()
    
    // 2. Validate input
    const body = await req.json()
    const { billId, paymentMethod } = body
    if (!billId || !paymentMethod) return badRequest('billId and paymentMethod required')
    
    // 3. Business logic
    const invoice = await createXenditInvoice({ billId, paymentMethod, userId: user.id })
    
    // 4. Return consistent response
    return ok({ payment_url: invoice.invoice_url, invoice_id: invoice.id })
    
  } catch (error) {
    console.error('[xendit-create-invoice] Error:', error)
    return serverError('Terjadi kesalahan internal')
  }
})
```

---

## 11. ANTI-PATTERNS YANG WAJIB DIHINDARI

### ❌ Fat Component
```tsx
// Jangan: 300+ baris logika di dalam 1 file component
function PaymentPage() {
  // 50 baris state
  // 100 baris useEffect
  // 80 baris handler functions
  // ... return JSX
}
```
**Solusi:** Pecah ke custom hooks + sub-components

---

### ❌ Hardcode Supabase Query di JSX
```tsx
// Jangan langsung query di render/effect dalam komponen
useEffect(() => {
  supabase.from('bills').select('*').then(...)
}, [])
```
**Solusi:** Selalu pakai custom hook atau TanStack Query

---

### ❌ Simpan Secret di Frontend
```typescript
// FATAL — API key tidak boleh di .env VITE_ prefix!
const XENDIT_SECRET = import.meta.env.VITE_XENDIT_SECRET_KEY // ← EXPOSED ke browser!
```
**Solusi:** Semua secret key hanya di Supabase Edge Functions (server-side)

---

### ❌ Fetch Semua Data Tanpa Limit
```typescript
const { data } = await supabase.from('bills').select('*') // ← Bisa ribuan rows!
```
**Solusi:** Selalu pakai `.range()` atau `.limit()` + server-side pagination

---

### ❌ Duplicate Supabase Client
```typescript
// File A
const supabase = createClient(url, key)

// File B  
const supabase = createClient(url, key) // ← Jangan buat ulang!
```
**Solusi:** Satu file `src/lib/supabase.ts`, import dari situ semua

---

### ❌ String Literal untuk Status
```typescript
// Rawan typo
if (bill.status === 'belum bayar') // ← typo! harusnya 'belum_bayar'
```
**Solusi:** Gunakan TypeScript enum atau const object
```typescript
export const BillStatus = {
  LUNAS: 'lunas',
  BELUM_BAYAR: 'belum_bayar',
  TERLAMBAT: 'terlambat',
  CICILAN: 'cicilan',
} as const

if (bill.status === BillStatus.BELUM_BAYAR) // ← Type-safe!
```

---

## 📚 REFERENSI

- **Supabase Docs:** https://supabase.com/docs
- **TanStack Query:** https://tanstack.com/query
- **React Patterns:** https://www.patterns.dev
- **EDUFIN PRD:** `PRD.md`
- **EDUFIN Tech Stack:** `TECH_STACK.md`
- **EDUFIN Context:** `CONTEXT.md`
- **Sumber Inspirasi:** Presentasi "Arsitektur React-Laravel Modern 2026" (diadaptasi ke React + Supabase)

---

*Dokumen ini adalah living document — update setiap ada keputusan arsitektur baru.*
