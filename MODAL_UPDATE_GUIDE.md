# Modal Update Guide - Floating Close Button

## Problem
Pop-up modal saat ini memiliki tombol close yang hilang ketika konten di-scroll.

## Solution
Gunakan `ModalWrapper` component yang sudah dibuat dengan floating close button.

## Pattern Lama (❌ Jangan gunakan ini)

```tsx
export function OldModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full bg-white rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2>Title</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {/* Content */}
      </div>
    </div>
  );
}
```

## Pattern Baru (✅ Gunakan ini)

```tsx
import { ModalWrapper } from "../../shared/ModalWrapper"; // adjust path

export function NewModal({ isOpen, onClose }: Props) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Title Here"
      subtitle="Optional subtitle"
      maxWidth="480px" // optional, default 430px
    >
      {/* Content di sini - tidak perlu header lagi */}
      <form>...</form>
    </ModalWrapper>
  );
}
```

## Features ModalWrapper

1. **Floating Close Button**: Tombol X mengambang di kanan atas, selalu terlihat meski di-scroll
2. **Full Page Overlay**: Background gelap menutupi seluruh halaman
3. **Click Outside to Close**: Klik di luar modal otomatis menutup
4. **Smooth Animation**: Scale-in animation saat muncul
5. **Responsive**: Menyesuaikan ukuran layar
6. **Custom Scrollbar**: Scrollbar tipis dan modern

## Daftar Modal yang Perlu Di-Update

### Student Modals
- [x] ITSupportForm (shared) - ✅ Updated
- [ ] PersonalDataForm
- [ ] SchoolInfoForm  
- [ ] AcademicHistoryForm
- [ ] StudentNotificationSettings

### Donor Modals
- [ ] DonorPersonalDataForm
- [ ] DonationStatsForm
- [ ] DonorNotificationSettings

### School Modals
- [ ] SchoolDataForm
- [ ] BankAccountForm
- [ ] AcademicYearForm
- [ ] NotificationSettings

### Shared Modals
- [ ] CampaignSubmissionForm

## Update Steps untuk Setiap Modal

1. Import `ModalWrapper`:
   ```tsx
   import { ModalWrapper } from "../../shared/ModalWrapper";
   ```

2. Hapus `if (!isOpen) return null;`

3. Hapus wrapper div luar:
   ```tsx
   // HAPUS INI:
   <div className="fixed inset-0 z-50..." style={{ background: "rgba(0,0,0,0.5)" }}>
     <div className="w-full bg-white...">
   ```

4. Hapus header dengan close button:
   ```tsx
   // HAPUS INI:
   <div className="flex items-center justify-between mb-5">
     <h2>...</h2>
     <button onClick={onClose}>...</button>
   </div>
   ```

5. Wrap content dengan `<ModalWrapper>`:
   ```tsx
   return (
     <ModalWrapper isOpen={isOpen} onClose={onClose} title="..." subtitle="...">
       {/* Konten form/content langsung */}
     </ModalWrapper>
   );
   ```

6. Hapus closing `</div></div>` lama, ganti dengan `</ModalWrapper>`

## Example: Before & After

### Before
```tsx
export function PersonalDataForm({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Data Pribadi</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form>
          {/* Form content */}
        </form>
      </div>
    </div>
  );
}
```

### After
```tsx
import { ModalWrapper } from "../../shared/ModalWrapper";

export function PersonalDataForm({ isOpen, onClose }: Props) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Data Pribadi"
    >
      <form>
        {/* Form content - sama seperti sebelumnya */}
      </form>
    </ModalWrapper>
  );
}
```

## Testing Checklist

Setelah update, test:
- [ ] Modal muncul dengan benar
- [ ] Tombol close terlihat di kanan atas
- [ ] Scroll content, tombol close tetap terlihat (floating)
- [ ] Klik tombol close menutup modal
- [ ] Klik di luar modal (backdrop) menutup modal
- [ ] Animation smooth saat muncul
- [ ] Responsive di mobile dan desktop
