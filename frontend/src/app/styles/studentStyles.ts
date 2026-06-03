/**
 * Global Style Constants for Student Pages
 * Ensures consistency across all student pages
 */

export const STUDENT_STYLES = {
  // Spacing
  padding: {
    page: "px-4 md:px-6",
    section: "py-4 md:py-5",
    card: "p-4 md:p-5",
    compact: "p-3 md:p-4",
  },

  // Typography
  text: {
    pageTitle: "text-xl md:text-2xl font-bold",
    sectionTitle: "text-lg md:text-xl font-bold",
    cardTitle: "text-base md:text-lg font-semibold",
    body: "text-sm md:text-base",
    caption: "text-xs md:text-sm",
    small: "text-[11px] md:text-xs",
  },

  // Border Radius
  radius: {
    small: "rounded-xl md:rounded-2xl",
    medium: "rounded-2xl md:rounded-3xl",
    large: "rounded-3xl",
    full: "rounded-full",
  },

  // Shadows
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  },

  // Grid
  grid: {
    cols2: "grid grid-cols-1 md:grid-cols-2",
    cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cols4: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  },

  // Gap
  gap: {
    small: "gap-2 md:gap-3",
    medium: "gap-3 md:gap-4",
    large: "gap-4 md:gap-5",
  },

  // Icon Sizes
  icon: {
    small: 16,
    medium: 20,
    large: 24,
    xl: 28,
  },

  // Colors
  colors: {
    primary: "#1677FF",
    primaryLight: "#EEF4FF",
    secondary: "#FDD504",
    success: "#52C41A",
    warning: "#FD9A16",
    error: "#F95654",
    gray: {
      50: "#F5F7FA",
      100: "#F0F0F0",
      400: "#BFBFBF",
      500: "#8C8C8C",
      600: "#595959",
      900: "#242424",
    },
  },

  // Touch Target
  touchTarget: {
    min: "min-w-[44px] min-h-[44px]", // iOS recommended
  },

  // Safe Area
  safeArea: {
    bottom: "pb-[calc(env(safe-area-inset-bottom,0px)+16px)]",
  },
} as const;

/**
 * Helper function to format Rupiah
 */
export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

/**
 * Helper function for responsive classes
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
