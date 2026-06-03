# EDUFIN - Low Fidelity Wireframes

Dokumentasi wireframe halaman-halaman penting sistem EDUFIN untuk pendidikan dan donasi.

---

## 1. Halaman Login
**Role:** Semua

```
┌─────────────────────────┐
│      [LOGO EDUFIN]      │
│                         │
│   Sistem Keuangan       │
│   Pendidikan Terpadu    │
│                         │
│  ┌───────────────────┐  │
│  │ 📧 Input Email   │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ 🔒 Input Password│  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │     MASUK         │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │  Daftar Akun Baru │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

**Elemen:**
- Logo EDUFIN di tengah
- Tagline singkat
- Input email dan password
- Button primary (Masuk)
- Button secondary (Daftar)

---

## 2. Dashboard Siswa
**Role:** Student

```
┌─────────────────────────┐
│ 👤 Nama  [NOTIF] │ Header Biru
│ NISN: xxx        │
├─────────────────────────┤
│ ┌───────────────────┐   │
│ │ Tagihan SPP Mei   │   │
│ │ Rp 850.000        │   │
│ │ [Bayar] [Cicilan] │   │
│ └───────────────────┘   │
│                         │
│ ┌────┬────┬────┐        │
│ │Bayar│Tag.│Rata│        │
│ │Tahun│Bln │2   │        │
│ └────┴────┴────┘        │
│                         │
│ [  Grafik Pembayaran  ] │
│                         │
│ Kampanye Donasi         │
│ ┌─────────────────────┐ │
│ │ [IMG] Beasiswa      │ │
│ │ ████░░ 75%          │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ 🏠 💰 ❤️ 👤 │ Bottom Nav
└─────────────────────────┘
```

**Elemen Utama:**
- Header dengan info user & notifikasi
- Card tagihan SPP dengan quick actions
- 3 stat cards (Bayar tahun ini, Tagihan, Rata-rata)
- Bar chart riwayat pembayaran
- Horizontal scroll kampanye donasi
- Bottom navigation (4 menu)

---

## 3. Pembayaran SPP
**Role:** Student

```
┌─────────────────────────┐
│ ← Bayar SPP       │ Header
├─────────────────────────┤
│ Detail Tagihan          │
│ ┌───────────────────┐   │
│ │ SPP    Rp 500.000 │   │
│ │ Lab    Rp 125.000 │   │
│ │ Perpus Rp  75.000 │   │
│ │ Keg.   Rp 150.000 │   │
│ ├───────────────────┤   │
│ │ Total: 850.000    │   │
│ └───────────────────┘   │
│                         │
│ Metode Pembayaran       │
│ ○ 📱 QRIS              │
│ ○ 🏦 Virtual Account   │
│ ○ 💳 Bank Transfer     │
│                         │
│ [  Bayar Sekarang  ]    │
└─────────────────────────┘
```

**Elemen:**
- List breakdown tagihan
- Total bold
- Radio button pilihan payment method
- CTA button bayar

---

## 4. Ajukan Kampanye Donasi
**Role:** Student/Parent

```
┌─────────────────────────┐
│ ← Ajukan Kampanye │ Header
├─────────────────────────┤
│ ┌───────────────────┐   │
│ │ 📷 Upload Foto    │   │
│ └───────────────────┘   │
│                         │
│ [Judul Kampanye___]     │
│ [Deskripsi________]     │
│ [                 ]     │
│ [Alasan___________]     │
│ [Target Rp________]     │
│                         │
│ [Tgl Mulai] [Tgl Selesai]│
│                         │
│ Kampanye Untuk:         │
│ ○ Untuk Anak Saya       │
│ ○ Kampanye Umum         │
│                         │
│ [Ajukan Kampanye]       │
└─────────────────────────┘
```

**Elemen:**
- Upload area untuk foto
- Text input untuk judul, deskripsi, alasan
- Number input untuk target donasi
- Date picker untuk periode
- Radio button untuk jenis kampanye
- Submit button

---

## 5. Daftar Kampanye
**Role:** All

```
┌─────────────────────────┐
│ Kampanye Donasi    [🔔] │
├─────────────────────────┤
│ [🔍 Cari kampanye...]   │
│                         │
│ [Semua][Pendidik][Kesh] │
│                         │
│ ┌─────────────────────┐ │
│ │ [   IMG KAMPANYE  ] │ │
│ │ Judul Kampanye      │ │
│ │ ████████░ 75%       │ │
│ │ Rp 7.5jt/Rp 10jt    │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ [   IMG KAMPANYE  ] │ │
│ │ Judul Kampanye      │ │
│ │ █████░░░░ 50%       │ │
│ │ Rp 12.5jt/Rp 25jt   │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ 🏠 💰 ❤️ 👤 │ Bottom Nav
└─────────────────────────┘
```

**Elemen:**
- Search bar
- Filter tabs (kategori)
- Card untuk setiap kampanye:
  - Cover image
  - Judul
  - Progress bar
  - Persentase & nominal
- Bottom navigation

---

## 6. Detail Kampanye & Donasi
**Role:** Donor

```
┌─────────────────────────┐
│ [  COVER IMAGE BESAR  ] │
│                         │
│ Judul Kampanye          │
│ ████████░ 75%           │
│ Rp 11.2jt dari 15jt     │
│ 12 hari lagi            │
│                         │
│ Deskripsi               │
│ Lorem ipsum dolor...    │
│                         │
│ Jumlah Donasi           │
│ [Rp ____________]       │
│                         │
│ Metode Pembayaran       │
│ ○ 📱 QRIS              │
│ ○ 🏦 Virtual Account   │
│ ○ 💳 Bank Transfer     │
│                         │
│ [  Donasi Sekarang  ]   │
└─────────────────────────┘
```

**Elemen:**
- Cover image full-width
- Judul dan progress
- Deskripsi lengkap kampanye
- Input jumlah donasi
- Pilihan metode pembayaran
- CTA button donasi

---

## 7. Dashboard Sekolah
**Role:** School/Admin

```
┌─────────────────────────┐
│ 🏫 SDN 3 Malang   [🔔] │
├─────────────────────────┤
│ ┌────┬────┬────┐        │
│ │Total│Lunas│Tung│        │
│ │Siswa│Bln │gak │        │
│ └────┴────┴────┘        │
│                         │
│ Pembayaran Bulan Ini    │
│ ┌───────────────────┐   │
│ │  [BAR CHART]      │   │
│ │  ██ ██ ██ ██ ██   │   │
│ └───────────────────┘   │
│                         │
│ Menu Cepat              │
│ 📋 Kelola Tagihan       │
│ ❤️ Kelola Kampanye      │
│ 🎓 Review Bantuan       │
│ 📊 Laporan Keuangan     │
├─────────────────────────┤
│ 🏠 💰 ❤️ 👤 │ Bottom Nav
└─────────────────────────┘
```

**Elemen:**
- Header dengan nama sekolah
- 3 stat cards
- Bar chart pembayaran per bulan
- Quick action menu list
- Bottom navigation

---

## 8. Kelola Tagihan
**Role:** School/Admin

```
┌─────────────────────────┐
│ ← Kelola Tagihan    [+] │
├─────────────────────────┤
│ [🔍 Cari NISN/Nama...]  │
│                         │
│ [Semua][Lunas][Belum]   │
│                         │
│ ┌─────────────────────┐ │
│ │ Budi Santoso        │ │
│ │ NISN: 0012345678    │ │
│ │ X IPA 1             │ │
│ │ SPP Mei: Belum Lunas│ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Ani Wijaya          │ │
│ │ NISN: 0012345679    │ │
│ │ X IPA 1             │ │
│ │ SPP Mei: ✓ Lunas    │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Elemen:**
- Search bar (NISN/Nama)
- Filter tabs (status pembayaran)
- List card siswa dengan info:
  - Nama siswa
  - NISN
  - Kelas
  - Status pembayaran dengan badge warna
- Button tambah tagihan baru (+)

---

## 9. Kelola Kampanye
**Role:** School/Admin

```
┌─────────────────────────┐
│ ← Kelola Kampanye   [+] │
├─────────────────────────┤
│ [Aktif][Pending][Selesai]│
│                         │
│ ┌─────────────────────┐ │
│ │ [  IMG KAMPANYE  ]  │ │
│ │ Judul Kampanye      │ │
│ │ ████████░ 75%       │ │
│ │ Rp 7.5jt/Rp 10jt    │ │
│ │ [Edit] [Tutup]      │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ [  IMG KAMPANYE  ]  │ │
│ │ Pending Review      │ │
│ │ Target: Rp 15jt     │ │
│ │ [Tolak] [Setujui]   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Elemen:**
- Filter tabs (status kampanye)
- Card untuk kampanye aktif:
  - Cover image
  - Progress
  - Action buttons (Edit/Tutup)
- Card untuk pending:
  - Info kampanye
  - Action buttons (Tolak/Setujui)

---

## 10. Profil Donatur
**Role:** Donor

```
┌─────────────────────────┐
│ Profil            [⚙️]  │
├─────────────────────────┤
│       ┌─────┐           │
│       │ AVA │           │
│       └─────┘           │
│    Nama Donatur         │
│  donatur@email.com      │
│                         │
│ ┌──────────┬──────────┐ │
│ │ Total    │ Kampanye │ │
│ │ Donasi   │ Didonasi │ │
│ │ Rp 2.5jt │    8     │ │
│ └──────────┴──────────┘ │
│                         │
│ Menu                    │
│ 👤 Data Pribadi         │
│ 📊 Statistik Donasi     │
│ 🔔 Notifikasi           │
│ 🆘 Bantuan IT           │
│ 🚪 Keluar               │
├─────────────────────────┤
│ 🏠 ❤️ 📜 👤 │ Bottom Nav
└─────────────────────────┘
```

**Elemen:**
- Avatar & nama centered
- 2 stat cards (Total donasi, Kampanye)
- Menu list items
- Bottom navigation

---

## 11. Review Bantuan SPP
**Role:** School/Admin

```
┌─────────────────────────┐
│ ← Review Bantuan        │
├─────────────────────────┤
│ [Pending][Disetujui][Ditolak]│
│                         │
│ ┌─────────────────────┐ │
│ │ Budi Santoso        │ │
│ │ NISN: 0012345678    │ │
│ │ X IPA 1             │ │
│ │ Jumlah: Rp 850.000  │ │
│ │ ┌─────────────────┐ │ │
│ │ │ Alasan: kondisi │ │ │
│ │ │ ekonomi keluarga│ │ │
│ │ └─────────────────┘ │ │
│ │ [Tolak] [Setujui]   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Elemen:**
- Filter tabs (status pengajuan)
- Card pengajuan bantuan:
  - Info siswa
  - Jumlah bantuan
  - Alasan pengajuan
  - Action buttons (Tolak/Setujui)

---

## 12. Riwayat Transaksi
**Role:** All

```
┌─────────────────────────┐
│ Riwayat Transaksi  [⚙️] │
├─────────────────────────┤
│ [Semua][SPP][Donasi]    │
│                         │
│ Mei 2025                │
│ ┌─────────────────────┐ │
│ │ Pembayaran SPP   ✓  │ │
│ │ 15 Mei • Rp 850.000 │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Donasi: Beasiswa ✓  │ │
│ │ 12 Mei • Rp 100.000 │ │
│ └─────────────────────┘ │
│                         │
│ April 2025              │
│ ┌─────────────────────┐ │
│ │ Pembayaran SPP   ✓  │ │
│ │ 10 Apr • Rp 850.000 │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ 🏠 💰 ❤️ 👤 │ Bottom Nav
└─────────────────────────┘
```

**Elemen:**
- Filter tabs (tipe transaksi)
- Grouped by month
- List transaksi dengan:
  - Jenis transaksi
  - Status checkmark
  - Tanggal & nominal
- Bottom navigation

---

## Design System

### Warna
- **Primary:** #1677FF (Biru)
- **Secondary:** #FDD504 (Kuning)
- **Danger:** #EA4E0D (Merah)
- **Success:** #52C41A (Hijau)
- **Background:** #F3F6FB
- **Text Primary:** #262626
- **Text Secondary:** #8C8C8C

### Typography
- **Font:** Plus Jakarta Sans
- **Heading:** Bold 16-18px
- **Body:** Regular 13-14px
- **Caption:** Regular 11-12px

### Components
- **Card:** White bg, rounded 12px, shadow
- **Button Primary:** Blue bg, white text, rounded 8px
- **Button Secondary:** White bg, blue border & text
- **Input:** Gray bg #FAFAFA, rounded 8px, border
- **Badge:** Rounded full, colored bg
- **Bottom Nav:** 4 items, icon + label

### Spacing
- **Container:** 20px padding
- **Card Gap:** 12px
- **Section Gap:** 24px
- **Element Gap:** 8px

---

## User Flow Utama

### Student Flow
```
Login → Dashboard → [Pilih Aksi]
  ├─ Bayar SPP → Pilih Metode → Konfirmasi → Success
  ├─ Ajukan Kampanye → Isi Form → Submit → Pending Review
  ├─ Browse Donasi → Detail → Donate
  └─ Profil → Edit Data
```

### School Flow
```
Login → Dashboard → [Pilih Menu]
  ├─ Kelola Tagihan → Cari Siswa → Lihat Detail → Update
  ├─ Kelola Kampanye → Review Pending → Approve/Reject
  ├─ Review Bantuan → Lihat Pengajuan → Approve/Reject
  └─ Laporan → Generate Report
```

### Donor Flow
```
Login → Browse Kampanye → Filter → Detail Kampanye
  → Input Jumlah → Pilih Metode → Donate → Success
```

---

## Interaction Notes

### Gestures
- **Tap:** Primary interaction untuk buttons dan cards
- **Swipe:** Horizontal scroll untuk campaign carousel
- **Pull to Refresh:** Update data di list pages
- **Long Press:** (future) Quick actions pada list items

### Animations
- **Page Transitions:** Slide left/right (200ms)
- **Modal:** Slide up from bottom (300ms)
- **Button Press:** Scale down (100ms)
- **Loading:** Spinner atau skeleton screens

### Feedback
- **Success:** Green checkmark + message
- **Error:** Red alert + message
- **Loading:** Spinner atau progress bar
- **Empty State:** Icon + message + CTA

---

## Responsive Breakpoints

- **Mobile:** 320px - 430px (PRIMARY)
- **Tablet:** 768px+ (stack 2 columns)
- **Desktop:** 1024px+ (max-width constraint)

---

## Accessibility

- **Touch Targets:** Minimum 44x44px
- **Contrast Ratio:** WCAG AA (4.5:1)
- **Font Size:** Minimum 11px
- **Focus States:** Visible outline
- **Alt Text:** All images
- **Semantic HTML:** Proper heading hierarchy

---

## Next Steps

1. ✅ Low-fidelity wireframes (DONE)
2. ⏳ High-fidelity mockups di Figma
3. ⏳ Prototype interactive
4. ⏳ Usability testing
5. ⏳ Development handoff
6. ⏳ QA & UAT

---

**Dibuat:** 9 April 2026
**Platform:** EDUFIN - Sistem Keuangan Pendidikan
**Target:** SDN 3 Malang
**Designer:** Claude AI Assistant
