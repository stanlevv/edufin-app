# 🚀 Tech Stack - EduFin Frontend

## Core Technologies

### ⚛️ **React 18.3.1**
- **Framework**: React (Library untuk building UI)
- **Version**: 18.3.1
- **Features**: Hooks, Context API, Component-based architecture
- **Usage**: Core framework untuk semua UI components

### 📦 **Vite 6.3.5**
- **Build Tool**: Vite (Next Generation Frontend Tooling)
- **Version**: 6.3.5
- **Features**: 
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized builds
  - ES modules support
  - Plugin system
- **Config**: `/vite.config.ts`

### 🎨 **Tailwind CSS v4.1.12**
- **CSS Framework**: Tailwind CSS (Utility-first CSS framework)
- **Version**: 4.1.12
- **Integration**: Via `@tailwindcss/vite` plugin
- **Features**:
  - Utility-first classes
  - Custom design system in `/src/styles/theme.css`
  - Responsive design
  - Dark mode support
- **Theme**: Custom color palette (blue primary #1677FF)

### 🔀 **React Router 7.13.0**
- **Routing**: React Router v7
- **Type**: Client-side routing
- **Features**:
  - Nested routes
  - Protected routes
  - Route-based code splitting
- **Config**: `/src/app/routes.tsx`

### 📘 **TypeScript**
- **Language**: TypeScript (typed JavaScript)
- **Usage**: All `.tsx` and `.ts` files
- **Benefits**: Type safety, better IDE support, fewer runtime errors

---

## UI Component Libraries

### 🎭 **Radix UI**
Complete set of unstyled, accessible UI components:
- `@radix-ui/react-dialog` - Modal/Dialog
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `@radix-ui/react-popover` - Popovers
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-tabs` - Tabs
- `@radix-ui/react-accordion` - Accordions
- `@radix-ui/react-select` - Select dropdowns
- `@radix-ui/react-checkbox` - Checkboxes
- `@radix-ui/react-switch` - Toggle switches
- `@radix-ui/react-slider` - Sliders
- `@radix-ui/react-scroll-area` - Custom scrollbars
- **Total**: 20+ Radix UI components

**Why Radix UI?**
- ✅ Fully accessible (ARIA compliant)
- ✅ Unstyled (easy to customize)
- ✅ Keyboard navigation
- ✅ Focus management

### 🎨 **Material-UI (MUI) 7.3.5**
- **Components**: `@mui/material`
- **Icons**: `@mui/icons-material`
- **Styling**: `@emotion/react` + `@emotion/styled`
- **Usage**: Additional pre-styled components when needed

---

## Icon & Graphics

### 🎯 **Lucide React 0.487.0**
- **Icon Library**: Lucide Icons
- **Total Icons**: 1000+ beautiful, consistent icons
- **Usage**: Primary icon library di seluruh aplikasi
- **Examples**: `<Bell />`, `<Heart />`, `<Receipt />`, `<User />`

### 🎪 **Canvas Confetti 1.9.4**
- **Animation**: Confetti animations
- **Usage**: Success celebrations, achievements

---

## Animation & Motion

### 🌊 **Motion (Framer Motion) 12.23.24**
- **Animation Library**: Motion (formerly Framer Motion)
- **Package**: `motion` (latest version)
- **Import**: `import { motion } from "motion/react"`
- **Features**:
  - Spring animations
  - Gesture animations
  - Layout animations
  - SVG animations
- **Usage**: Smooth transitions, interactive animations

### 🎬 **TW Animate CSS 1.3.8**
- **CSS Animations**: Tailwind-integrated animations
- **Usage**: Utility classes untuk animations

---

## Data Visualization

### 📊 **Recharts 2.15.2**
- **Chart Library**: Recharts (Built on D3.js)
- **Types**: Bar charts, Line charts, Pie charts, Area charts
- **Usage**: 
  - Payment trends
  - Bill breakdowns
  - Donation statistics
- **Features**: Responsive, composable, declarative

---

## Forms & Input

### 📝 **React Hook Form 7.55.0**
- **Form Library**: React Hook Form
- **Features**:
  - Performance optimization
  - Easy validation
  - Minimal re-renders
  - TypeScript support
- **Usage**: Complex forms (registration, profiles, submissions)

### 🔢 **Input OTP 1.4.2**
- **Component**: OTP (One-Time Password) input
- **Usage**: Verification codes, authentication

### 📅 **React Day Picker 8.10.1**
- **Date Picker**: Calendar component
- **Library**: `react-day-picker`
- **Usage**: Date selection for bills, campaigns

### ⏰ **Date-fns 3.6.0**
- **Date Utility**: Date manipulation and formatting
- **Usage**: Format dates, calculate date differences

---

## UI Enhancements

### 🖱️ **React DnD 16.0.1**
- **Drag & Drop**: React DnD (Drag and Drop)
- **Backend**: `react-dnd-html5-backend`
- **Usage**: Reorderable lists, drag-to-upload

### 🎠 **React Slick 0.31.0**
- **Carousel**: Carousel/slider component
- **Usage**: Campaign galleries, image carousels

### 🧱 **React Responsive Masonry 2.7.1**
- **Layout**: Masonry grid layout
- **Usage**: Pinterest-style grids

### 📏 **React Resizable Panels 2.1.7**
- **Panels**: Resizable panel layouts
- **Usage**: Split views, adjustable sidebars

### 🌊 **Embla Carousel 8.6.0**
- **Carousel**: Modern carousel library
- **Features**: Touch-friendly, accessible

### 🎉 **Sonner 2.0.3**
- **Toast Notifications**: Beautiful toast notifications
- **Import**: `import { toast } from "sonner"`
- **Usage**: Success messages, errors, notifications

### 📱 **Vaul 1.1.2**
- **Drawer**: Mobile-first drawer component
- **Usage**: Bottom sheets, mobile drawers

---

## Database & Backend

### 🗄️ **Supabase 2.107.0**
- **BaaS**: Supabase (Backend as a Service)
- **Package**: `@supabase/supabase-js`
- **Features**:
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage
  - Row Level Security
- **Config**: `/src/lib/supabase.ts`

---

## Utilities

### 🎨 **Styling Utilities**
- **clsx 2.1.1**: Conditional class names
- **tailwind-merge 3.2.0**: Merge Tailwind classes
- **class-variance-authority 0.7.1**: Variant-based styling

### 🎭 **Component Utilities**
- **@popperjs/core 2.11.8**: Positioning engine (tooltips, popovers)
- **react-popper 2.3.0**: React wrapper for Popper.js
- **cmdk 1.1.1**: Command menu component

### 🌓 **Theme**
- **next-themes 0.4.6**: Dark/light mode management

---

## Development Tools

### 🛠️ **Build Tools**
- **Vite 6.3.5**: Build tool & dev server
- **@vitejs/plugin-react 4.7.0**: React plugin for Vite

### 📦 **Package Manager**
- **pnpm**: Fast, disk space efficient package manager

---

## Project Structure

```
/workspaces/default/code/
├── src/
│   ├── app/
│   │   ├── components/      # React components
│   │   │   ├── student/     # Student-specific components
│   │   │   ├── donor/       # Donor-specific components
│   │   │   ├── school/      # School admin components
│   │   │   └── shared/      # Shared components
│   │   ├── context/         # React Context providers
│   │   ├── data/            # Local database & seed data
│   │   └── routes.tsx       # React Router configuration
│   ├── lib/
│   │   └── supabase.ts      # Supabase client
│   ├── styles/
│   │   ├── theme.css        # Tailwind theme
│   │   └── fonts.css        # Font imports
│   └── imports/             # Figma assets
├── supabase/
│   └── functions/           # Supabase Edge Functions
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Key Features

### ✨ **Design System**
- **Primary Color**: #1677FF (Blue)
- **Typography**: Custom font system
- **Components**: 50+ reusable components
- **Responsive**: Mobile-first approach
- **Accessibility**: ARIA-compliant components

### 🔐 **Authentication**
- Role-based access (Siswa, Sekolah, Donatur)
- Protected routes
- Context-based auth state

### 📱 **Responsive Design**
- Mobile-optimized (430px max-width for mobile views)
- Desktop-optimized (School admin dashboard)
- Tablet support

### ⚡ **Performance**
- Vite for fast builds
- Code splitting
- Lazy loading
- Optimized assets

---

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build
```

---

## Useful Commands

```bash
# Add new dependency
pnpm add <package-name>

# Add dev dependency
pnpm add -D <package-name>

# Remove dependency
pnpm remove <package-name>

# Update dependencies
pnpm update

# Check outdated packages
pnpm outdated
```

---

## Documentation Links

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com
- **Radix UI**: https://radix-ui.com
- **Lucide Icons**: https://lucide.dev
- **Motion**: https://motion.dev
- **Recharts**: https://recharts.org
- **Supabase**: https://supabase.com/docs

---

## Notes

- This is a **Figma Make** project (Figma's web app builder)
- Uses **Tailwind CSS v4** (latest version)
- **No Next.js** - Pure Vite + React SPA
- **No traditional backend** - Uses Supabase as BaaS
- **TypeScript** throughout for type safety
