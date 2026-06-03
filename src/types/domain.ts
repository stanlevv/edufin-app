/**
 * EDUFIN Domain Types
 *
 * Central type definitions following domain-driven design principles.
 * See CONTEXT.md for detailed domain vocabulary and patterns.
 */

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export type UserRole = "siswa" | "sekolah" | "donatur";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
}

export interface StudentUser extends BaseUser {
  role: "siswa";
  nisn: string;
  school: string;
  class: string;
  parentName: string;
}

export interface SchoolUser extends BaseUser {
  role: "sekolah";
  school: string;
  npsn?: string;
}

export interface DonorUser extends BaseUser {
  role: "donatur";
}

export type User = StudentUser | SchoolUser | DonorUser;

// ============================================================================
// STUDENT MANAGEMENT TYPES
// ============================================================================

export type StudentStatus = "aktif" | "nonaktif";

export interface Student {
  id: number;
  name: string;
  nisn: string;
  class: string;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  address: string;
  sppAmount: number;
  status: StudentStatus;
}

// ============================================================================
// PAYMENT & BILLING TYPES
// ============================================================================

export type PaymentStatus = "lunas" | "belum_bayar" | "terlambat" | "cicilan";

export type PaymentMethod = "qris" | "va_bca" | "va_mandiri" | "transfer_bank" | "tunai";

export interface Bill {
  id: number;
  studentId: number;
  amount: number;
  month: string; // "Mei 2025"
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
}

export interface Payment {
  id: number;
  billId: number;
  studentId: number;
  amount: number;
  method: PaymentMethod;
  timestamp: string;
  transactionId?: string;
  status: "pending" | "success" | "failed";
}

export interface Installment {
  id: number;
  billId: number;
  totalPeriods: number;
  currentPeriod: number;
  amountPerPeriod: number;
  paidPeriods: number;
  nextDueDate: string;
}

// ============================================================================
// CAMPAIGN & FUNDRAISING TYPES
// ============================================================================

export type CampaignStatus = "pending" | "approved" | "rejected" | "completed" | "cancelled";

export interface Campaign {
  id: number;
  studentId: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: CampaignStatus;
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
  rejectionReason?: string;
}

export interface Donation {
  id: number;
  campaignId: number;
  donorId?: number; // Optional for anonymous donations
  donorName: string;
  amount: number;
  message?: string;
  timestamp: string;
  isAnonymous: boolean;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = "info" | "warning" | "success" | "urgent";

export type NotificationTarget = "all" | "class" | "student";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  target: NotificationTarget;
  targetValue?: string; // Class name or student NISN
  createdAt: string;
  sentBy: string;
  read: number;
  total: number;
}

export interface NotificationReceipt {
  id: number;
  notificationId: number;
  userId: string;
  readAt?: string;
}

// ============================================================================
// TRANSACTION & HISTORY TYPES
// ============================================================================

export type TransactionType = "spp_payment" | "donation_in" | "campaign_disbursement" | "installment_payment";

export type TransactionCategory = "SPP" | "Donasi" | "Cicilan";

export interface Transaction {
  id: number;
  type: TransactionType;
  category: TransactionCategory;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: "pending" | "success" | "failed";
  relatedId?: number; // billId, campaignId, etc.
}

// ============================================================================
// SCHOOL CONFIGURATION TYPES
// ============================================================================

export interface SchoolConfig {
  schoolName: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
  principalPhone: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  academicYear: string;
  sppAmountDefault: number;
}

// ============================================================================
// FORM & UI TYPES
// ============================================================================

export interface FormState<T> {
  data: Partial<T>;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FilterState {
  search: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  role?: UserRole;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isStudentUser(user: User): user is StudentUser {
  return user.role === "siswa";
}

export function isSchoolUser(user: User): user is SchoolUser {
  return user.role === "sekolah";
}

export function isDonorUser(user: User): user is DonorUser {
  return user.role === "donatur";
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithTimestamps<T> = T & {
  createdAt: string;
  updatedAt: string;
};
