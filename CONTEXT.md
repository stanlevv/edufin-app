# EDUFIN - Domain Context & Vocabulary

## Project Overview
EDUFIN adalah platform manajemen keuangan pendidikan untuk sekolah di Indonesia yang menghubungkan siswa, sekolah, dan donatur dalam ekosistem pembayaran SPP dan fundraising.

## Domain Language

### Core Entities

**Siswa (Student)**
- User yang terdaftar melalui NISN (Nomor Induk Siswa Nasional)
- Dapat membayar SPP, mengajukan cicilan, dan membuat kampanye fundraising
- Terhubung dengan data orang tua/wali

**Sekolah (School)**
- Admin yang mengelola tagihan, siswa, dan verifikasi kampanye
- Memiliki akses desktop-first dengan CRUD lengkap
- Satu instance per sekolah (e.g., "SDN 3 Malang")

**Donatur (Donor)**
- User publik yang dapat berdonasi ke kampanye siswa
- Tidak memerlukan NISN, registrasi melalui email atau OAuth

### Key Workflows

**SPP Payment Flow**
1. Sekolah membuat tagihan SPP untuk periode tertentu
2. Siswa melihat tagihan di dashboard
3. Siswa memilih metode pembayaran (QRIS, VA, Transfer)
4. Sistem memproses pembayaran dan update status
5. Notifikasi dikirim ke siswa dan sekolah

**Fundraising Campaign Flow**
1. Siswa membuat kampanye dengan target dana dan alasan
2. Sekolah memverifikasi kampanye (approve/reject)
3. Kampanye approved muncul di halaman publik donatur
4. Donatur berdonasi ke kampanye
5. Dana terkumpul dicairkan ke sekolah untuk siswa

**Cicilan (Installment) Flow**
1. Siswa request cicilan untuk tagihan SPP
2. Sistem membagi tagihan menjadi beberapa periode
3. Siswa membayar per periode yang ditentukan
4. Status berubah dari "cicilan" ke "lunas" saat selesai

### Technical Vocabulary

**State Management**
- `AuthContext`: Global state untuk user authentication
- Local state: React useState untuk UI state per component
- Server state: Data dari Supabase (future enhancement)

**Layout Patterns**
- `SchoolDesktopLayout`: Full-width sidebar layout untuk admin sekolah
- `AppLayout`: Mobile-first container (max-width 430px) untuk siswa/donatur
- `BottomNav`: Mobile navigation untuk siswa/donatur

**Data Flow**
- `CRUD Operations`: Create, Read, Update, Delete untuk entities
- `Optimistic Updates`: Local state updates before server confirmation
- `Fallback Auth`: LocalStorage auth jika Supabase tidak tersedia

### Status Enums

**Payment Status**
```typescript
type PaymentStatus = "lunas" | "belum_bayar" | "terlambat" | "cicilan"
```

**Campaign Status**
```typescript
type CampaignStatus = "pending" | "approved" | "rejected" | "completed"
```

**Student Status**
```typescript
type StudentStatus = "aktif" | "nonaktif"
```

**Notification Type**
```typescript
type NotificationType = "info" | "warning" | "success" | "urgent"
```

### UI Patterns

**Mobile-First Approach**
- Base font: 14px on mobile (< 768px), 16px on desktop
- Touch-friendly targets: min 44px height for buttons
- Swipeable modals from bottom

**Desktop Admin**
- Sidebar navigation dengan icon dan label
- Table views untuk data management
- Multi-column layouts (grid-cols-2, grid-cols-3, grid-cols-4)

**Color System**
- Primary Blue: #1677FF (CTA, active states)
- Success Green: #52C41A (lunas, approved)
- Warning Orange: #FD9A16 (pending, belum bayar)
- Danger Red: #F95654 (terlambat, rejected)
- Purple: #722ED1 (stats, growth)

## Architecture Decisions

### Why React + Tailwind?
- **React**: Component reusability, strong ecosystem
- **Tailwind v4**: Utility-first, responsive design, no config needed
- **TypeScript**: Type safety, better DX, catch errors early

### Why LocalStorage Fallback?
- **Resilience**: App tetap berfungsi tanpa backend
- **Development**: Faster iteration tanpa setup database
- **Demo Mode**: Users dapat test tanpa account creation overhead

### Why Desktop for School Admin?
- **Data Density**: Sekolah perlu melihat banyak data sekaligus (tables)
- **CRUD Operations**: Forms dan multi-field inputs lebih baik di desktop
- **Professional UX**: Desktop conveys seriousness untuk admin tools

### Why Mobile for Students/Donors?
- **Target Demographic**: Siswa dan orang tua primarily use mobile
- **Use Case**: Quick checks, payments, donations are mobile-first actions
- **Accessibility**: Lebih banyak users punya smartphone vs laptop

## Common Patterns

### Modal Pattern
```typescript
const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState<Partial<Entity>>({});

const handleAdd = () => {
  setFormData({});
  setShowModal(true);
};

const handleEdit = (entity: Entity) => {
  setFormData(entity);
  setShowModal(true);
};
```

### CRUD State Pattern
```typescript
const [items, setItems] = useState<Item[]>(INITIAL_DATA);

// Create
const handleCreate = (newItem: Item) => {
  setItems([...items, { ...newItem, id: generateId() }]);
};

// Update
const handleUpdate = (id: number, updates: Partial<Item>) => {
  setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
};

// Delete
const handleDelete = (id: number) => {
  if (confirm("Yakin?")) {
    setItems(items.filter(item => item.id !== id));
  }
};
```

### Indonesian Text Pattern
Semua user-facing text menggunakan Bahasa Indonesia formal dengan tone yang ramah dan helpful. Hindari jargon teknis kecuali untuk technical documentation.

## Anti-Patterns to Avoid

❌ **Don't**: Mix English and Indonesian in UI text  
✅ **Do**: Use consistent Bahasa Indonesia throughout

❌ **Don't**: Create mock data that looks unrealistic  
✅ **Do**: Use realistic Indonesian names, addresses, and scenarios

❌ **Don't**: Over-engineer with unnecessary abstractions  
✅ **Do**: Keep it simple until complexity is needed

❌ **Don't**: Ignore mobile responsiveness  
✅ **Do**: Test on mobile viewport for student/donor flows

❌ **Don't**: Store sensitive data in localStorage without consideration  
✅ **Do**: Use localStorage only for demo/development, plan for proper backend

## Future Enhancements

1. **Real Supabase Integration**: Replace localStorage with actual database
2. **Payment Gateway**: Integrate with Midtrans/Xendit for real payments
3. **Email Notifications**: Automated emails untuk payment confirmations
4. **Analytics Dashboard**: Advanced reporting untuk sekolah
5. **Mobile Apps**: React Native wrapper untuk native experience

---

## 🤖 AI Agent Instructions (CRITICAL)

All AI agents, coding assistants, or LLMs working on this project **MUST** abide by the following rule:

**Documentation Requirement**: 
Whenever you implement a new feature, fix a bug, alter the architecture, or change the database schema, you **MUST** record and document those changes in `DOKUMENTASI_LAPORAN.md`. 
Do not leave the documentation outdated. Your final step before finishing a task should always be updating `DOKUMENTASI_LAPORAN.md` to reflect your work.
