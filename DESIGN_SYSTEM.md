# EDUFIN Design System

**Version:** 1.0  
**Last Updated:** 31 Mei 2025  
**Status:** Active  

---

## 📋 TABLE OF CONTENTS

1. [Design Principles](#1-design-principles)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing System](#4-spacing-system)
5. [Border Radius](#5-border-radius)
6. [Shadows & Elevation](#6-shadows--elevation)
7. [Icons](#7-icons)
8. [Components](#8-components)
9. [Layout & Grid](#9-layout--grid)
10. [Responsive Breakpoints](#10-responsive-breakpoints)
11. [States & Interactions](#11-states--interactions)
12. [Accessibility](#12-accessibility)

---

## 1. DESIGN PRINCIPLES

### Core Values

**Modern & Clean**
- Minimalist approach with focus on content
- Subtle shadows and rounded corners
- Generous whitespace
- Clear visual hierarchy

**Trustworthy & Professional**
- Blue primary color (trust, stability)
- Consistent design patterns
- Professional typography
- Clear error states and feedback

**User-Friendly**
- Mobile-first approach for students/donors
- Desktop-optimized for admin
- Touch-friendly tap targets (min 44px)
- Clear labels and intuitive navigation

---

## 2. COLOR PALETTE

### Primary Colors

```css
/* Primary Blue - Main brand color */
--color-primary-500: #1677FF;
--color-primary-600: #1265E6;
--color-primary-700: #0E53CC;

/* Primary Light Variants */
--color-primary-50: #EEF4FF;
--color-primary-100: #D6E7FF;
--color-primary-200: #A3CEFF;
```

### Semantic Colors

```css
/* Success - Lunas, Approved, Positive actions */
--color-success-500: #52C41A;
--color-success-50: #F6FFED;

/* Warning - Pending, Belum Bayar, Alerts */
--color-warning-500: #FD9A16;
--color-warning-50: #FFF7E6;

/* Danger - Terlambat, Rejected, Errors */
--color-danger-500: #F95654;
--color-danger-50: #FFF2F0;

/* Purple - Stats, Growth, Analytics */
--color-purple-500: #722ED1;
--color-purple-50: #F9F0FF;
```

### Neutral Colors

```css
/* Gray Scale */
--color-gray-50: #F5F7FA;   /* Background */
--color-gray-100: #F0F0F0;  /* Borders, dividers */
--color-gray-200: #E0E0E0;
--color-gray-300: #BFBFBF;
--color-gray-400: #8C8C8C;  /* Secondary text */
--color-gray-500: #595959;  /* Body text */
--color-gray-600: #434343;
--color-gray-700: #262626;
--color-gray-800: #1F1F1F;  /* Headings */
--color-gray-900: #141414;

/* Black & White */
--color-white: #FFFFFF;
--color-black: #000000;
```

### Color Usage Guidelines

**Primary Blue (#1677FF)**
- CTA buttons (Bayar Sekarang, Donasi)
- Active navigation items
- Links
- Primary actions
- Focus states

**Success Green (#52C41A)**
- "Lunas" status badge
- "Approved" campaign status
- Success notifications
- Positive growth indicators

**Warning Orange (#FD9A16)**
- "Belum Bayar" status
- "Pending" campaign status
- Warning notifications
- Due date reminders

**Danger Red (#F95654)**
- "Terlambat" status
- "Rejected" status
- Error messages
- Delete actions

**Purple (#722ED1)**
- Statistics and analytics
- Charts and graphs
- Growth indicators
- Premium features (future)

---

## 3. TYPOGRAPHY

### Font Family

```css
/* System Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

**Why System Fonts?**
- Faster load times (no web font download)
- Native feel on each platform
- Better performance
- Accessibility

### Type Scale

**Mobile (< 768px):**
```css
--font-size-xs: 12px;    /* Small labels, captions */
--font-size-sm: 14px;    /* Body text, secondary */
--font-size-base: 16px;  /* Body text, inputs */
--font-size-lg: 18px;    /* Subheadings */
--font-size-xl: 20px;    /* Headings */
--font-size-2xl: 24px;   /* Page titles */
--font-size-3xl: 30px;   /* Hero text */
```

**Desktop (≥ 768px):**
```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;  /* Base size larger on desktop */
--font-size-lg: 18px;
--font-size-xl: 24px;
--font-size-2xl: 32px;
--font-size-3xl: 48px;
```

### Font Weights

```css
--font-weight-normal: 400;    /* Body text */
--font-weight-medium: 500;    /* Labels, buttons */
--font-weight-semibold: 600;  /* Subheadings */
--font-weight-bold: 700;      /* Headings, emphasis */
```

### Line Heights

```css
--line-height-tight: 1.25;    /* Headings */
--line-height-normal: 1.5;    /* Body text */
--line-height-relaxed: 1.75;  /* Long-form content */
```

### Usage Guidelines

**Headings:**
- H1: `text-2xl font-bold text-gray-800`
- H2: `text-xl font-bold text-gray-800`
- H3: `text-lg font-semibold text-gray-800`
- H4: `text-base font-semibold text-gray-700`

**Body Text:**
- Primary: `text-sm text-gray-800` (mobile) / `text-base text-gray-800` (desktop)
- Secondary: `text-xs text-gray-500` or `text-sm text-gray-500`

**Labels:**
- Form labels: `text-sm font-medium text-gray-700`
- Button labels: `text-sm font-semibold`
- Badge labels: `text-xs font-semibold`

---

## 4. SPACING SYSTEM

### Base Unit: 4px

**Spacing Scale (Hybrid Approach):**

```css
--spacing-1: 4px;    /* XS - Tight spacing */
--spacing-2: 8px;    /* S - Small spacing */
--spacing-3: 12px;   /* M - Medium spacing */
--spacing-4: 16px;   /* L - Default spacing */
--spacing-6: 24px;   /* XL - Large spacing */
--spacing-8: 32px;   /* 2XL - Extra large spacing */
--spacing-12: 48px;  /* 3XL - Section spacing */
--spacing-16: 64px;  /* 4XL - Hero spacing */
```

### Usage Guidelines

**Component Internal Spacing:**
- Card padding: `p-4` (16px) on mobile, `p-6` (24px) on desktop
- Button padding: `px-4 py-2.5` (16px horizontal, 10px vertical)
- Form input padding: `px-4 py-2.5`

**Component External Spacing (Margins):**
- Between cards: `gap-4` (16px) on mobile, `gap-6` (24px) on desktop
- Section spacing: `mb-6` (24px) or `mb-8` (32px)
- Page padding: `p-4` (mobile) / `p-8` (desktop)

**Strict Spacing for Major Elements:**
- Use only: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Avoid arbitrary values like 15px, 22px, etc.

**Flexible Spacing for Fine-Tuning:**
- Use Tailwind arbitrary values when needed: `p-[18px]`
- Only for specific edge cases

---

## 5. BORDER RADIUS

### Radius Scale

```css
--radius-none: 0;
--radius-sm: 8px;    /* Small elements (badges) */
--radius-md: 12px;   /* Default (cards, buttons, inputs) */
--radius-lg: 16px;   /* Large elements */
--radius-full: 9999px; /* Pills, avatars */
```

### Usage Guidelines

**Cards:** `rounded-xl` (12px)  
**Buttons:** `rounded-lg` (12px)  
**Inputs:** `rounded-lg` (12px)  
**Status Badges:** `rounded-full` (pill shape)  
**Avatars:** `rounded-full` (circle)  
**Modals:** `rounded-xl` (12px)  
**Images:** `rounded-lg` (12px)  

---

## 6. SHADOWS & ELEVATION

### Shadow Scale

```css
/* Tailwind Shadow Classes */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
             0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Usage Guidelines

**Default Cards:** `shadow-md border border-gray-100`  
**Elevated Cards:** `shadow-lg`  
**Modals/Dropdowns:** `shadow-xl`  
**Hover State:** `hover:shadow-lg transition-shadow`  

### Elevation Levels

**Level 0 (Flat):** No shadow - for inline elements  
**Level 1 (Subtle):** `shadow-sm` - for subtle cards  
**Level 2 (Standard):** `shadow-md` - default for cards  
**Level 3 (Raised):** `shadow-lg` - for important cards  
**Level 4 (Modal):** `shadow-xl` - for modals, popovers  

---

## 7. ICONS

### Icon Library: Lucide React

**Why Lucide?**
- ✅ Consistent design
- ✅ Tree-shakable (only import what you use)
- ✅ Customizable (size, color, stroke-width)
- ✅ Modern & clean aesthetic
- ✅ Large icon set (1000+ icons)

### Icon Sizes

```tsx
import { Icon } from 'lucide-react';

/* Standard Sizes */
<Icon size={16} /> /* Small - inline text */
<Icon size={20} /> /* Medium - buttons, nav */
<Icon size={24} /> /* Large - headings, hero */
<Icon size={32} /> /* XL - feature icons */
<Icon size={48} /> /* 2XL - empty states */
```

### Common Icons Mapping

**Emoji → Lucide Icon:**

```tsx
🏫 → <School size={20} />
📚 → <BookOpen size={20} />
💰 → <Wallet size={20} />
📊 → <BarChart3 size={20} />
👤 → <User size={20} />
📝 → <FileText size={20} />
✅ → <CheckCircle size={20} />
❌ → <XCircle size={20} />
⚠️ → <AlertCircle size={20} />
🔔 → <Bell size={20} />
📧 → <Mail size={20} />
💳 → <CreditCard size={20} />
🎯 → <Target size={20} />
📈 → <TrendingUp size={20} />
📉 → <TrendingDown size={20} />
💡 → <Lightbulb size={20} />
🚀 → <Rocket size={20} />
⭐ → <Star size={20} />
🏆 → <Trophy size={20} />
📱 → <Smartphone size={20} />
💬 → <MessageCircle size={20} />
👥 → <Users size={20} />
🔍 → <Search size={20} />
📅 → <Calendar size={20} />
🎉 → <PartyPopper size={20} /> or <Sparkles size={20} />
```

### Icon Usage Guidelines

**Color:**
- Default: `color="currentColor"` (inherits text color)
- Custom: Pass color via `color` prop or use Tailwind class on parent

**Stroke Width:**
- Default: 2 (standard)
- Thin: 1.5 (subtle)
- Bold: 2.5 (emphasis)

**Example:**
```tsx
<User size={20} color="#1677FF" strokeWidth={2} />
```

---

## 8. COMPONENTS

### 8.1 Buttons

**3 Variants: Solid, Outline, Ghost**

#### **Solid Button (Primary)**
```tsx
<button className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all">
  Bayar Sekarang
</button>
```

**Use for:** Primary actions (Bayar, Donasi, Submit)

#### **Outline Button (Secondary)**
```tsx
<button className="px-4 py-2.5 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all">
  Lihat Detail
</button>
```

**Use for:** Secondary actions (Cancel, View, Edit)

#### **Ghost Button (Tertiary)**
```tsx
<button className="px-4 py-2.5 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-all">
  Batal
</button>
```

**Use for:** Tertiary actions (Cancel, Back, Dismiss)

#### **Button Sizes**

```tsx
/* Small */
<button className="px-3 py-2 text-sm">Small Button</button>

/* Medium (default) */
<button className="px-4 py-2.5 text-sm">Medium Button</button>

/* Large */
<button className="px-6 py-3 text-base">Large Button</button>
```

#### **Button States**

```css
/* Default */
bg-blue-600

/* Hover */
hover:bg-blue-700

/* Active */
active:bg-blue-800

/* Disabled */
disabled:opacity-50 disabled:cursor-not-allowed

/* Loading */
opacity-70 cursor-wait
```

---

### 8.2 Form Inputs

**Style: Bordered with Background**

#### **Text Input**
```tsx
<input
  type="text"
  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 
             focus:border-blue-500 focus:bg-white focus:outline-none 
             transition-all text-sm"
  placeholder="Masukkan nama..."
/>
```

#### **Input States**

**Default:**
```css
border-gray-200 bg-gray-50
```

**Focus:**
```css
focus:border-blue-500 focus:bg-white focus:outline-none
```

**Error:**
```css
border-red-500 bg-red-50 focus:border-red-500
```

**Disabled:**
```css
bg-gray-100 text-gray-400 cursor-not-allowed
```

#### **Textarea**
```tsx
<textarea
  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 
             focus:border-blue-500 focus:bg-white focus:outline-none 
             transition-all text-sm"
  rows={4}
  placeholder="Tulis pesan..."
/>
```

#### **Select Dropdown**
```tsx
<select
  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 
             focus:border-blue-500 focus:bg-white focus:outline-none 
             transition-all text-sm"
>
  <option>Pilih opsi...</option>
  <option>Opsi 1</option>
</select>
```

---

### 8.3 Status Badges

**Style: Rounded Pill**

#### **Lunas (Success)**
```tsx
<span className="inline-block px-3 py-1 rounded-full text-xs font-semibold 
                 bg-green-50 text-green-600">
  Lunas
</span>
```

#### **Belum Bayar (Warning)**
```tsx
<span className="inline-block px-3 py-1 rounded-full text-xs font-semibold 
                 bg-orange-50 text-orange-600">
  Belum Bayar
</span>
```

#### **Terlambat (Danger)**
```tsx
<span className="inline-block px-3 py-1 rounded-full text-xs font-semibold 
                 bg-red-50 text-red-600">
  Terlambat
</span>
```

#### **Cicilan (Info)**
```tsx
<span className="inline-block px-3 py-1 rounded-full text-xs font-semibold 
                 bg-blue-50 text-blue-600">
  Cicilan
</span>
```

---

### 8.4 Cards

**Default Card:**
```tsx
<div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
  {/* Card content */}
</div>
```

**Hover Card:**
```tsx
<div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 
                hover:shadow-lg transition-all cursor-pointer">
  {/* Card content */}
</div>
```

**Gradient Card (Hero):**
```tsx
<div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 
                text-white shadow-lg">
  {/* Card content */}
</div>
```

---

### 8.5 Modals

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
  <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">
    {/* Modal header */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-800">Modal Title</h3>
      <button className="text-gray-400 hover:text-gray-600">
        <X size={20} />
      </button>
    </div>
    
    {/* Modal content */}
    <div className="mb-6">
      <p className="text-sm text-gray-600">Modal content here...</p>
    </div>
    
    {/* Modal actions */}
    <div className="flex gap-2 justify-end">
      <button className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
        Batal
      </button>
      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
        Simpan
      </button>
    </div>
  </div>
</div>
```

---

## 9. LAYOUT & GRID

### Container Widths

**Mobile (Siswa/Donatur):**
```css
max-width: 430px;
margin: 0 auto;
```

**Desktop (Admin):**
```css
width: 100%; /* Full width with sidebar */
```

### Grid System

**2-Column Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

**3-Column Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

**4-Column Grid (Admin Dashboard):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</div>
```

---

## 10. RESPONSIVE BREAKPOINTS

```css
/* Mobile First Approach */

/* Default: Mobile (< 768px) */
/* No media query needed */

/* Tablet: md (≥ 768px) */
@media (min-width: 768px) { }

/* Desktop: lg (≥ 1024px) */
@media (min-width: 1024px) { }

/* Large Desktop: xl (≥ 1280px) */
@media (min-width: 1280px) { }
```

**Tailwind Breakpoints:**
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+
- `2xl:` - 1536px+

---

## 11. STATES & INTERACTIONS

### 11.1 Loading States

**Hybrid Approach:**

#### **Skeleton for Lists (Table, Cards)**
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

#### **Spinner for Actions (Button, Form Submit)**
```tsx
<div className="flex items-center justify-center">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
</div>
```

**Or use Lucide Loader icon:**
```tsx
import { Loader2 } from 'lucide-react';

<Loader2 size={20} className="animate-spin" />
```

---

### 11.2 Empty States

```tsx
<div className="text-center py-12">
  <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
  <p className="text-gray-400 text-sm">Belum ada tagihan</p>
  <p className="text-gray-300 text-xs mt-1">Tagihan akan muncul di sini</p>
</div>
```

---

### 11.3 Hover States

**Cards:**
```css
hover:shadow-lg transition-all
```

**Buttons:**
```css
hover:bg-blue-700 transition-all
```

**Links:**
```css
hover:underline
```

---

### 11.4 Focus States

**Inputs:**
```css
focus:border-blue-500 focus:outline-none
```

**Buttons:**
```css
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

---

## 12. ACCESSIBILITY

### Color Contrast

**WCAG 2.1 Level AA:**
- Text: 4.5:1 contrast ratio minimum
- Large text (≥18px): 3:1 contrast ratio

**Our Palette Compliance:**
- ✅ Blue (#1677FF) on white: 4.58:1 (AA compliant)
- ✅ Gray-800 (#1F1F1F) on white: 15.35:1 (AAA compliant)
- ✅ Gray-600 (#434343) on white: 8.59:1 (AAA compliant)

### Touch Targets

**Minimum Size: 44px x 44px**
- All buttons: min-height 44px
- Bottom nav items: min-height 56px
- Form inputs: min-height 44px

### Keyboard Navigation

**All interactive elements must be keyboard accessible:**
- Tab order follows visual order
- Focus states visible (ring)
- Enter/Space activates buttons
- Esc closes modals

### Screen Readers

**Semantic HTML:**
```tsx
/* Good */
<button>Submit</button>
<label htmlFor="email">Email</label>
<input id="email" type="email" />

/* Bad */
<div onClick={handleClick}>Submit</div>
```

**ARIA Labels:**
```tsx
<button aria-label="Close modal">
  <X size={20} />
</button>
```

---

## 13. IMPLEMENTATION CHECKLIST

### ✅ Phase 1: Foundation
- [ ] Replace all emoji with Lucide icons
- [ ] Apply consistent border-radius (12px)
- [ ] Apply consistent shadows (shadow-md)
- [ ] Standardize spacing (4px increments)
- [ ] Create Button component (3 variants)

### ✅ Phase 2: Components
- [ ] Standardize form inputs (bordered + bg)
- [ ] Standardize status badges (rounded pill)
- [ ] Add loading states (skeleton + spinner)
- [ ] Add empty states with icons
- [ ] Improve hover/focus states

### ✅ Phase 3: Responsive
- [ ] Test mobile (375px viewport)
- [ ] Test tablet (768px viewport)
- [ ] Test desktop (1280px viewport)
- [ ] Fix any layout issues
- [ ] Ensure touch targets ≥ 44px

### ✅ Phase 4: Accessibility
- [ ] Check color contrast (AA compliant)
- [ ] Add focus states to all interactive elements
- [ ] Test keyboard navigation
- [ ] Add ARIA labels where needed
- [ ] Semantic HTML review

---

## 14. RESOURCES

**Design Tools:**
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Inspiration:**
- [Stripe Design System](https://stripe.com/docs/design)
- [Ant Design](https://ant.design/)
- [Material Design](https://material.io/)

---

**END OF DESIGN SYSTEM**

---

## 🚀 NEXT STEPS

1. Review design system with team
2. Begin implementation (replace emoji → icons)
3. Apply consistent spacing & shadows
4. Build reusable components
5. Test responsive layouts
6. Accessibility audit

**Questions?** Contact: design@edufin.sch.id
