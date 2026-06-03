# Student Pages - Mobile-Friendly Guidelines

## Overview
Semua halaman siswa harus mengikuti guidelines ini untuk memastikan konsistensi dan mobile-friendly experience.

## Core Principles
1. **Mobile-First**: Design untuk mobile dulu, scale up ke desktop
2. **Consistency**: Gunakan konstanta style dari `studentStyles.ts`
3. **Touch-Friendly**: Minimum touch target 44x44px (iOS standard)
4. **No Overflow**: Text harus truncate, bukan overflow keluar container
5. **Responsive Grid**: Grid harus collapse jadi 1 kolom di mobile

## Style Constants
Import dari `src/app/styles/studentStyles.ts`:
```typescript
import { formatRupiah, STUDENT_STYLES } from "../../styles/studentStyles";
```

## Layout Structure

### 1. Page Container
```tsx
<div className="flex flex-col min-h-screen bg-gray-50">
  {/* Content */}
</div>
```

### 2. Header Section
```tsx
<div className={`${STUDENT_STYLES.padding.page} py-6 md:py-8`}>
  <h1 className={`${STUDENT_STYLES.text.pageTitle} text-white`}>
    Page Title
  </h1>
  <p className={`${STUDENT_STYLES.text.caption} text-gray-500`}>
    Subtitle
  </p>
</div>
```

### 3. Content Section
```tsx
<div className={`${STUDENT_STYLES.padding.page} ${STUDENT_STYLES.padding.section}`}>
  {/* Content */}
</div>
```

### 4. Card Component
```tsx
<div className={`
  bg-white 
  ${STUDENT_STYLES.radius.medium} 
  ${STUDENT_STYLES.padding.card} 
  ${STUDENT_STYLES.shadow.sm}
`}>
  {/* Card content */}
</div>
```

## Responsive Grid

### 2 Columns (Mobile: 1, Desktop: 2)
```tsx
<div className={`${STUDENT_STYLES.grid.cols2} ${STUDENT_STYLES.gap.medium}`}>
  {/* Items */}
</div>
```

### 3 Columns (Mobile: 1, Tablet: 2, Desktop: 3)
```tsx
<div className={`${STUDENT_STYLES.grid.cols3} ${STUDENT_STYLES.gap.medium}`}>
  {/* Items */}
</div>
```

### 4 Columns (Mobile: 2, Desktop: 4)
```tsx
<div className={`${STUDENT_STYLES.grid.cols4} ${STUDENT_STYLES.gap.medium}`}>
  {/* Items */}
</div>
```

## Typography

### Page Title
```tsx
<h1 className={STUDENT_STYLES.text.pageTitle}>Title</h1>
// Output: text-xl md:text-2xl font-bold
```

### Section Title
```tsx
<h2 className={STUDENT_STYLES.text.sectionTitle}>Section</h2>
// Output: text-lg md:text-xl font-bold
```

### Card Title
```tsx
<h3 className={STUDENT_STYLES.text.cardTitle}>Card Title</h3>
// Output: text-base md:text-lg font-semibold
```

### Body Text
```tsx
<p className={STUDENT_STYLES.text.body}>Body text</p>
// Output: text-sm md:text-base
```

### Caption/Small Text
```tsx
<p className={STUDENT_STYLES.text.caption}>Caption</p>
// Output: text-xs md:text-sm
```

## Icon Sizing
```tsx
import { Home } from "lucide-react";

// Small icon (16px)
<Home size={STUDENT_STYLES.icon.small} />

// Medium icon (20px)
<Home size={STUDENT_STYLES.icon.medium} />

// Large icon (24px)
<Home size={STUDENT_STYLES.icon.large} />

// XL icon (28px)
<Home size={STUDENT_STYLES.icon.xl} />
```

## Colors
```tsx
// Primary Blue
style={{ color: STUDENT_STYLES.colors.primary }} // #1677FF
style={{ background: STUDENT_STYLES.colors.primaryLight }} // #EEF4FF

// Gray Scale
style={{ color: STUDENT_STYLES.colors.gray[900] }} // #242424
style={{ color: STUDENT_STYLES.colors.gray[600] }} // #595959
style={{ color: STUDENT_STYLES.colors.gray[500] }} // #8C8C8C
style={{ color: STUDENT_STYLES.colors.gray[400] }} // #BFBFBF
```

## Touch Targets
Semua button harus punya minimum size 44x44px:
```tsx
<button className={`
  px-4 py-2 
  ${STUDENT_STYLES.touchTarget.min}
  ${STUDENT_STYLES.radius.full}
`}>
  Button
</button>
```

## Text Truncation
Untuk text yang panjang, tambahkan truncate:
```tsx
<p className="truncate">{longText}</p>

// Untuk multi-line truncation:
<p className="line-clamp-2">{longText}</p>
```

## Scrollable Horizontal
Untuk horizontal scroll (kategori filter, dll):
```tsx
<div className={`
  overflow-x-auto 
  flex 
  ${STUDENT_STYLES.gap.small}
  scrollbar-hide
`}>
  {items.map(item => (
    <button className="flex-shrink-0">
      {item}
    </button>
  ))}
</div>
```

## Best Practices

### ✅ DO:
- Gunakan STUDENT_STYLES constants
- Test di mobile view (max-width: 430px)
- Gunakan responsive classes (md:, lg:)
- Truncate text yang panjang
- Min-width untuk horizontal scroll items
- Safe area inset untuk iOS

### ❌ DON'T:
- Hardcode spacing values
- Fixed width tanpa max-width
- Gunakan viewport units (vh, vw) tanpa fallback
- Lupa flex-shrink-0 pada horizontal scroll items
- Text overflow tanpa truncate

## Testing Checklist
- [ ] Tampil bagus di mobile (375px)
- [ ] Tampil bagus di desktop (1024px+)
- [ ] Text tidak overflow
- [ ] Grid collapse jadi 1 kolom di mobile
- [ ] Touch target minimum 44px
- [ ] Icons proporsional
- [ ] Consistent spacing
- [ ] No horizontal scroll (kecuali intentional)

## Example: Complete Page
```tsx
import React from "react";
import { Home, Heart } from "lucide-react";
import { formatRupiah, STUDENT_STYLES } from "../../styles/studentStyles";

export function ExamplePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${STUDENT_STYLES.padding.page} py-6 md:py-8 bg-gradient-to-br from-blue-600 to-blue-700`}>
        <h1 className={`${STUDENT_STYLES.text.pageTitle} text-white`}>
          Page Title
        </h1>
        <p className={`${STUDENT_STYLES.text.caption} text-white/70`}>
          Subtitle here
        </p>
      </div>

      {/* Stats Grid */}
      <div className={`${STUDENT_STYLES.padding.page} ${STUDENT_STYLES.padding.section}`}>
        <div className={`${STUDENT_STYLES.grid.cols2} ${STUDENT_STYLES.gap.medium}`}>
          <div className={`
            bg-white 
            ${STUDENT_STYLES.radius.medium} 
            ${STUDENT_STYLES.padding.card}
          `}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${STUDENT_STYLES.text.caption} text-gray-500`}>
                  Total
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatRupiah(850000)}
                </p>
              </div>
              <div className={`
                w-12 h-12 
                ${STUDENT_STYLES.radius.small}
                flex items-center justify-center
              `} style={{ background: STUDENT_STYLES.colors.primaryLight }}>
                <Home size={STUDENT_STYLES.icon.large} color={STUDENT_STYLES.colors.primary} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Updated: 2025-06-03
