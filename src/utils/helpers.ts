/**
 * EDUFIN Utility Helpers
 *
 * Type-safe utility functions following functional programming principles.
 * All functions are pure (no side effects) and testable.
 */

import type { PaymentStatus, CampaignStatus, NotificationType, StudentStatus } from "../types/domain";

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format number to Indonesian Rupiah currency string
 * @example formatRupiah(1000000) // "Rp 1.000.000"
 */
export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

/**
 * Parse Rupiah string back to number
 * @example parseRupiah("Rp 1.000.000") // 1000000
 */
export function parseRupiah(rupiah: string): number {
  return parseInt(rupiah.replace(/[^\d]/g, ""), 10) || 0;
}

/**
 * Format number with K/M suffix for large numbers
 * @example formatCompactCurrency(1500000) // "1.5M"
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return amount.toString();
}

// ============================================================================
// DATE & TIME FORMATTING
// ============================================================================

/**
 * Format ISO date string to Indonesian date format
 * @example formatIndonesianDate("2025-05-31") // "31 Mei 2025"
 */
export function formatIndonesianDate(isoDate: string): string {
  const date = new Date(isoDate);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Format timestamp to relative time in Indonesian
 * @example formatRelativeTime("2025-05-30") // "1 hari yang lalu"
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 30) return `${diffDays} hari yang lalu`;

  return formatIndonesianDate(timestamp);
}

/**
 * Get current academic year in format "2024/2025"
 */
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  // Academic year starts in July (month 6)
  if (month >= 6) {
    return `${year}/${year + 1}`;
  }
  return `${year - 1}/${year}`;
}

// ============================================================================
// STATUS HELPERS
// ============================================================================

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}

export function getPaymentStatusConfig(status: PaymentStatus): StatusConfig {
  const configs: Record<PaymentStatus, StatusConfig> = {
    lunas: { label: "Lunas", color: "#52C41A", bg: "#F6FFED" },
    belum_bayar: { label: "Belum Bayar", color: "#FD9A16", bg: "#FFF7E6" },
    terlambat: { label: "Terlambat", color: "#F95654", bg: "#FFF2F0" },
    cicilan: { label: "Cicilan", color: "#1677FF", bg: "#EEF4FF" },
  };
  return configs[status];
}

export function getCampaignStatusConfig(status: CampaignStatus): StatusConfig {
  const configs: Record<CampaignStatus, StatusConfig> = {
    pending: { label: "Menunggu", color: "#FD9A16", bg: "#FFF7E6" },
    approved: { label: "Disetujui", color: "#52C41A", bg: "#F6FFED" },
    rejected: { label: "Ditolak", color: "#F95654", bg: "#FFF2F0" },
    completed: { label: "Selesai", color: "#722ED1", bg: "#F9F0FF" },
    cancelled: { label: "Dibatalkan", color: "#8C8C8C", bg: "#F5F5F5" },
  };
  return configs[status];
}

export function getNotificationTypeConfig(type: NotificationType): StatusConfig {
  const configs: Record<NotificationType, StatusConfig> = {
    info: { label: "Info", color: "#1677FF", bg: "#EEF4FF" },
    warning: { label: "Peringatan", color: "#FD9A16", bg: "#FFF7E6" },
    success: { label: "Sukses", color: "#52C41A", bg: "#F6FFED" },
    urgent: { label: "Penting", color: "#F95654", bg: "#FFF2F0" },
  };
  return configs[type];
}

export function getStudentStatusConfig(status: StudentStatus): StatusConfig {
  const configs: Record<StudentStatus, StatusConfig> = {
    aktif: { label: "Aktif", color: "#52C41A", bg: "#F6FFED" },
    nonaktif: { label: "Non-Aktif", color: "#8C8C8C", bg: "#F5F5F5" },
  };
  return configs[status];
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate Indonesian NISN (10 digits)
 */
export function isValidNISN(nisn: string): boolean {
  return /^\d{10}$/.test(nisn);
}

/**
 * Validate Indonesian phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  return /^(\+62|62|0)[0-9]{9,12}$/.test(phone.replace(/\s/g, ""));
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate Indonesian NPSN (National School ID - 8 digits)
 */
export function isValidNPSN(npsn: string): boolean {
  return /^\d{8}$/.test(npsn);
}

// ============================================================================
// ARRAY & COLLECTION HELPERS
// ============================================================================

/**
 * Group array items by a key
 * @example groupBy(students, 'class') // { "X IPA 1": [...], "X IPA 2": [...] }
 */
export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Calculate sum of numeric property in array
 * @example sum(bills, 'amount') // total of all bill amounts
 */
export function sum<T>(array: T[], key: keyof T): number {
  return array.reduce((total, item) => {
    const value = item[key];
    return total + (typeof value === "number" ? value : 0);
  }, 0);
}

/**
 * Get unique values from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Sort array by property
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// ============================================================================
// STRING HELPERS
// ============================================================================

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Generate initials from name
 * @example getInitials("Budi Santoso") // "BS"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ============================================================================
// NUMBER HELPERS
// ============================================================================

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate random ID (for demo purposes)
 */
export function generateId(): number {
  return Math.floor(Math.random() * 1000000) + Date.now();
}

// ============================================================================
// SEARCH & FILTER HELPERS
// ============================================================================

/**
 * Fuzzy search in string (case-insensitive)
 */
export function fuzzySearch(text: string, query: string): boolean {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  return normalizedText.includes(normalizedQuery);
}

/**
 * Multi-field search
 */
export function searchInFields<T>(
  item: T,
  fields: (keyof T)[],
  query: string
): boolean {
  return fields.some(field => {
    const value = item[field];
    return typeof value === "string" && fuzzySearch(value, query);
  });
}

// ============================================================================
// CLASS NAME HELPERS
// ============================================================================

/**
 * Conditionally join class names (simple alternative to clsx)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
