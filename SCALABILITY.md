# 📈 SCALABILITY PLAN
# EDUFIN — Dari Development ke Ribuan Pengguna

> **Dibuat:** 7 Juni 2026  
> **Konteks:** Analisis kondisi nyata codebase + roadmap scale ke 50+ sekolah, ribuan users  
> **⚠️ Temuan Kritis:** Ada konflik antara DATABASE_OPTIMIZATION.md (single-tenant) vs PRD v2.0 (multi-tenant)

---

## 🚨 MASALAH KRITIS YANG HARUS DISELESAIKAN SEKARANG

### Konflik Arsitektur: Single-Tenant vs Multi-Tenant

| File | Arsitektur | Status |
|------|-----------|--------|
| `DATABASE_OPTIMIZATION.md` | Single-tenant — hardcode `SDN-3-Malang`, tidak ada `school_id` | ❌ TIDAK SCALABLE |
| `src/config/school.ts` | `SCHOOL_ID = "SDN-3-MALANG"` hardcoded | ❌ TIDAK SCALABLE |
| `src/lib/supabase.ts` | Tidak ada `school_id` di schema tabel `bills`, `students` | ❌ TIDAK SCALABLE |
| `PRD v2.0` | Multi-tenant, 50+ sekolah, semua tabel punya `school_id` | ✅ BENAR |

### Konsekuensi jika TIDAK diperbaiki:
```
Sekarang:    1 sekolah → OK
50 sekolah → ❌ semua siswa dari semua sekolah campur dalam 1 tabel
             ❌ orang tua sekolah A bisa lihat data sekolah B
             ❌ harus deploy ulang per sekolah (tidak scalable)
```

**→ Perbaiki multi-tenant SEBELUM onboard sekolah ke-2.**

---

## 📊 GAMBARAN BESAR: DEV → PRODUCTION → RIBUAN USERS

```
Phase          | Users    | Supabase Plan | Vercel Plan | Estimasi Biaya/bulan
---------------|----------|---------------|-------------|--------------------
Sekarang (Dev) | ~5       | Free          | Hobby       | $0
Pilot          | ~500     | Pro           | Pro         | ~$75/bulan
50 Sekolah     | ~5.000   | Pro           | Pro         | ~$100-150/bulan
100+ Sekolah   | ~50.000  | Team          | Enterprise  | ~$500-800/bulan
```

**Kabar baik:** Supabase + Vercel sangat scalable. Biayanya predictable dan relatif murah.

---

## 1. LAYER FRONTEND (Vercel + Vite)

### Kondisi Sekarang: ✅ Sudah scalable out-of-the-box

Vercel otomatis handle:
- **CDN global** — file statis di-serve dari edge node terdekat ke user
- **Auto-scaling** — tidak ada server yang perlu di-manage
- **SSL/HTTPS** — otomatis
- **Zero downtime deploy** — build baru langsung aktif tanpa restart

### Yang perlu ditambah untuk scale:

**1a. Code Splitting (Lazy Loading)**
```typescript
// SEKARANG: semua halaman load sekaligus → lambat untuk ribuan user
import SchoolDashboard from './pages/SchoolDashboard'

// HARUS: load halaman saat dibutuhkan saja
const SchoolDashboard = lazy(() => import('./pages/SchoolDashboard'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const DonorPage = lazy(() => import('./pages/DonorPage'))

// Wrap dengan Suspense:
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/school/*" element={<SchoolDashboard />} />
  </Routes>
</Suspense>
```
**Dampak:** Bundle size turun 60-70% → halaman load lebih cepat di 3G

**1b. PWA Asset Caching**
```typescript
// vite.config.ts — sudah ada vite-plugin-pwa, tinggal configure
VitePWA({
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/.*/,
        handler: 'NetworkFirst',      // API: network dulu, fallback cache
        options: { cacheName: 'supabase-api', expiration: { maxAgeSeconds: 300 } }
      },
      {
        urlPattern: /\.(js|css|png|jpg|svg)$/,
        handler: 'CacheFirst',        // Assets: cache dulu
        options: { cacheName: 'static-assets' }
      }
    ]
  }
})
```
**Dampak:** Ribuan pengguna tidak re-download assets yang sama → server lebih ringan

---

## 2. LAYER DATABASE (Supabase PostgreSQL)

### Kondisi Sekarang: ⚠️ Belum siap untuk ribuan users

**Yang paling kritis:** Tidak ada index di tabel-tabel utama.

### 2a. Database Indexes — WAJIB

Tanpa index, query `WHERE student_id = ?` scan seluruh tabel.  
Dengan ribuan rows → query lambat, koneksi menumpuk.

```sql
-- Jalankan ini di Supabase SQL Editor SEKARANG:

-- Index untuk query yang paling sering
CREATE INDEX CONCURRENTLY idx_bills_student_id ON bills(student_id);
CREATE INDEX CONCURRENTLY idx_bills_status ON bills(status);
CREATE INDEX CONCURRENTLY idx_bills_school_id ON bills(school_id);  -- setelah multi-tenant
CREATE INDEX CONCURRENTLY idx_payments_bill_id ON payments(bill_id);
CREATE INDEX CONCURRENTLY idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX CONCURRENTLY idx_notifications_user_id_read ON notifications(user_id, read);

-- Composite index untuk filter kombinasi yang umum
CREATE INDEX CONCURRENTLY idx_bills_school_status ON bills(school_id, status);
CREATE INDEX CONCURRENTLY idx_bills_student_month ON bills(student_id, month, year);
```

**Dampak:** Query dari ~200ms → ~5ms. Beda antara smooth dan laggy untuk ribuan user.

### 2b. Connection Pooling — Supabase sudah ada, tapi perlu diaktifkan

Supabase menyediakan **PgBouncer** (connection pooler). Pakai **Transaction mode** untuk Edge Functions:

```typescript
// src/lib/supabase.ts
// Untuk server-side / Edge Functions — pakai pooler URL
const supabaseUrl = process.env.SUPABASE_DB_URL // ← Ganti dengan pooler URL dari Supabase dashboard

// Untuk client-side — tetap pakai anon key biasa (sudah benar)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Kenapa penting:** PostgreSQL default hanya 100 koneksi. 1.000 user simultan = crash tanpa pooler.  
PgBouncer memungkinkan 10.000 user dengan hanya 20 koneksi DB aktif.

### 2c. Row Level Security (RLS) — Perlu review

```sql
-- SEKARANG (dari DATABASE_OPTIMIZATION.md):
CREATE POLICY parent_own_students ON students
  FOR SELECT USING (parent_id = auth.uid());

-- MASALAH: Tidak ada isolasi antar sekolah!
-- Jika user dari sekolah A tahu ID siswa sekolah B → bisa akses data mereka

-- HARUS DITAMBAH setelah multi-tenant:
CREATE POLICY school_isolation ON students
  FOR ALL USING (
    school_id = (
      SELECT school_id FROM school_admins WHERE user_id = auth.uid()
      UNION
      SELECT school_id FROM students WHERE parent_id = auth.uid()
    )
  );
```

### 2d. Supabase Plan untuk Scale

| Skenario | Plan | Limit | Harga |
|----------|------|-------|-------|
| Pilot (SDN 3 Malang) | **Free** | 500MB DB, 50.000 MAU | $0/bulan |
| 5-10 sekolah | **Pro** | 8GB DB, unlimited MAU | $25/bulan |
| 50+ sekolah | **Pro + Add-ons** | Storage, compute boosts | ~$75-100/bulan |
| 100+ sekolah | **Team** | Higher limits, SLA | ~$599/bulan |

---

## 3. LAYER EDGE FUNCTIONS (Supabase)

### Kondisi Sekarang: ⚠️ Midtrans webhook (perlu ganti ke Xendit)

Edge Functions otomatis scale — tidak ada yang perlu di-configure.  
Tapi ada beberapa hal yang perlu diperhatikan:

### 3a. Rate Limiting di Edge Functions

```typescript
// supabase/functions/xendit-webhook/index.ts
// TAMBAHKAN: simple rate limiting untuk prevent abuse

const RATE_LIMIT = new Map<string, number>()

serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const now = Date.now()
  const lastRequest = RATE_LIMIT.get(ip) ?? 0
  
  // Webhook dari Xendit tidak perlu rate limit, tapi endpoint publik butuh
  if (now - lastRequest < 1000) { // max 1 request/detik per IP
    return new Response('Too Many Requests', { status: 429 })
  }
  
  RATE_LIMIT.set(ip, now)
  // ... rest of handler
})
```

### 3b. Idempotency untuk Webhook

```typescript
// Xendit bisa kirim webhook duplikat → harus handle idempotency
async function handleXenditWebhook(payload: XenditPayload) {
  const { external_id, status } = payload
  
  // Check apakah sudah pernah diproses
  const { data: existing } = await supabase
    .from('webhook_logs')
    .select('id')
    .eq('external_id', external_id)
    .single()
  
  if (existing) {
    console.log(`Webhook ${external_id} already processed, skipping`)
    return // Idempotent — abaikan duplikat
  }
  
  // Process dan log
  await supabase.from('webhook_logs').insert({ external_id, processed_at: new Date() })
  // ... update bill status
}
```

---

## 4. LAYER PAYMENT (Xendit)

### Xendit sudah scalable secara infrastruktur. Yang perlu diperhatikan:

**4a. Xendit Rate Limits**
- Invoice creation: 1.000 request/menit
- Untuk 50 sekolah × 500 siswa = 25.000 tagihan/bulan → aman
- Peak awal bulan (semua bayar bersamaan): gunakan queue/batch creation

**4b. Monitoring Xendit**
```typescript
// Log semua transaksi ke tabel kita sendiri untuk audit trail
await supabase.from('payment_logs').insert({
  xendit_invoice_id: invoice.id,
  school_id: schoolId,
  student_id: studentId,
  amount: invoice.amount,
  created_at: new Date()
})
```

---

## 5. LAYER WHATSAPP (Fonnte/Wablas)

### ⚠️ Ini bottleneck terbesar saat scale!

**Skenario buruk:** 50 sekolah × 500 siswa = 25.000 WA reminder setiap awal bulan  
Fonnte/Wablas biasanya rate limit 1 pesan/detik → 25.000 pesan = 7 jam pengiriman!

### Solusi: Queue System dengan Cron

```typescript
// supabase/functions/whatsapp-blast-cron/index.ts

// JANGAN: kirim 25.000 pesan sekaligus
// LAKUKAN: queue dengan batch processing

serve(async () => {
  // Ambil 100 pesan pending dari queue
  const { data: queue } = await supabase
    .from('whatsapp_queue')
    .select('*')
    .eq('status', 'pending')
    .limit(100)  // ← Batch 100 per run
    .order('priority', { ascending: false })
  
  for (const msg of queue ?? []) {
    await sendWhatsApp(msg.phone, msg.message)
    await supabase.from('whatsapp_queue')
      .update({ status: 'sent', sent_at: new Date() })
      .eq('id', msg.id)
    
    await sleep(1100) // ← 1.1 detik antar pesan (respek rate limit)
  }
})

// Jalankan setiap 2 menit via Supabase cron
```

**Tambah tabel baru:**
```sql
CREATE TABLE whatsapp_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  priority INTEGER DEFAULT 0,  -- 0=normal, 10=urgent
  status TEXT DEFAULT 'pending', -- pending, sent, failed
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ
);
CREATE INDEX idx_whatsapp_queue_status ON whatsapp_queue(status, priority DESC);
```

---

## 6. MONITORING & OBSERVABILITY

### Kondisi Sekarang: ❌ Tidak ada monitoring

Kalau tidak ada monitoring, kamu tidak tahu kalau sistem down sampai user komplain.

### Minimal yang harus ada:

**6a. Uptime Monitoring (Gratis)**
```
→ BetterStack (betterstack.com) — gratis untuk 1 monitor
  Monitor: https://edufin.sch.id
  Alert via: WhatsApp / Email
  Check interval: setiap 1 menit
```

**6b. Error Tracking (Gratis)**
```bash
pnpm add @sentry/react @sentry/vite-plugin
```
```typescript
// src/main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1, // 10% request di-trace (hemat quota)
})
```
**Sentry gratis untuk:** 5.000 errors/bulan — cukup untuk awal.

**6c. Database Monitoring**
Supabase Pro sudah include:
- Query performance insights (tabel mana yang lambat)
- Connection count real-time
- Storage usage trends

---

## 7. SECURITY UNTUK SCALE

### 7a. Secret Key Management — DARURAT 🚨

```typescript
// DITEMUKAN di src/lib/supabase.ts:
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY 
  || 'sb_publishable_kR-qLNL8nf-G4ReZTML1pg_MvXqiDLi' // ← EXPOSED di source code!
```

**Ini harus diperbaiki SEKARANG:**
1. Hapus fallback key dari source code
2. Rotate key di Supabase dashboard (Settings → API)
3. Set key hanya via environment variables

```typescript
// BENAR:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
```

### 7b. Input Validation di Edge Functions
```typescript
// Setiap Edge Function harus validasi input
import { z } from 'zod'

const CreateInvoiceSchema = z.object({
  billId: z.string().uuid(),
  paymentMethod: z.enum(['QRIS', 'BCA', 'MANDIRI', 'BNI', 'BRI', 'GOPAY', 'OVO', 'DANA'])
})

serve(async (req) => {
  const body = await req.json()
  const result = CreateInvoiceSchema.safeParse(body)
  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error }), { status: 400 })
  }
  // ... proceed with validated data
})
```

---

## 8. ROADMAP SCALABILITY — BERTAHAP

### 🔴 SEKARANG (sebelum onboard sekolah ke-2)
- [ ] **Perbaiki secret key** yang ter-expose di source code
- [ ] **Tambah `school_id`** ke semua tabel (multi-tenant)
- [ ] **Tambah database indexes** (bills, students, donations)
- [ ] **Review RLS policies** untuk isolasi antar sekolah

### 🟡 SEBELUM 10 SEKOLAH
- [ ] **Setup monitoring** (BetterStack + Sentry)
- [ ] **WhatsApp queue system** (tabel `whatsapp_queue` + cron)
- [ ] **Upgrade ke Supabase Pro** (kapasitas lebih besar)
- [ ] **Code splitting** (lazy loading halaman)
- [ ] **TanStack Query** (caching, kurangi redundant fetches)

### 🟢 SEBELUM 50 SEKOLAH
- [ ] **Load testing** (simulasi 5.000 user concurrent)
- [ ] **Query optimization** (analyze slow queries dari Supabase dashboard)
- [ ] **CDN untuk file upload** (logo sekolah, foto kampanye → Supabase Storage + CDN)
- [ ] **Backup strategy** (test restore dari backup)
- [ ] **Incident response plan** (siapa dihubungi jika down tengah malam?)

---

## 9. ESTIMASI KAPASITAS SUPABASE FREE TIER

Supabase Free tier bisa handle:
```
Database:    500 MB   → cukup untuk ~100.000 rows
Auth:        50.000 MAU → cukup untuk ribuan user
Storage:     1 GB     → cukup untuk foto + dokumen awal
Edge Func:   500.000 invocations/bulan → cukup untuk semua webhook + cron
Bandwidth:   5 GB/bulan → monitor saat upload banyak
```

**Kesimpulan:** Free tier cukup untuk pilot sampai ~5 sekolah.  
Upgrade ke Pro ($25/bulan) saat sudah konfirmasi 10+ sekolah aktif.

---

## 10. SUMMARY — PRIORITAS AKSI

| # | Aksi | Effort | Dampak | Kapan |
|---|------|--------|--------|-------|
| 1 | 🚨 Hapus secret key dari source code | 5 menit | Kritis | SEKARANG |
| 2 | Tambah `school_id` ke semua tabel | 2 jam | Sangat tinggi | Sebelum sekolah ke-2 |
| 3 | Tambah database indexes | 30 menit | Tinggi | Sebelum sekolah ke-2 |
| 4 | Setup BetterStack uptime monitoring | 15 menit | Tinggi | Sebelum launch |
| 5 | Install TanStack Query | 1-2 jam | Tinggi | Segera |
| 6 | Code splitting (lazy loading) | 2-3 jam | Medium | Sebelum 10 sekolah |
| 7 | WhatsApp queue system | 3-4 jam | Tinggi | Sebelum 10 sekolah |
| 8 | Setup Sentry error tracking | 30 menit | Medium | Sebelum 10 sekolah |
| 9 | Load testing | 1 hari | Tinggi | Sebelum 50 sekolah |

---

*"Scale bukan soal memilih teknologi terbaru — tapi soal memastikan pondasi yang sudah ada tidak retak saat beban naik."*
