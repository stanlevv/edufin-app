/**
 * Local Database - Store semua data aplikasi
 * Data disimpan di localStorage untuk demo/development
 */
import { supabase } from '../lib/supabase';

export interface Student {
  id: string;
  userId: string;
  nisn: string;
  name: string;
  email: string;
  school: string;
  class: string;
  parentName: string;
  phone?: string;
  parentPhone?: string;
  address: string;
  sppAmount: number;
  status: "active" | "inactive";
  registrationStatus?: "data_only" | "pending" | "active";
  verified: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amountPerMonth: number;
  totalMonths: number;
  startDate: string;
  endDate: string;
  source: string;
  campaignId?: string;
  status: "active" | "completed" | "cancelled";
  maxRecipients: number;
  createdAt: string;
}

export interface ScholarshipRecipient {
  id: string;
  scholarshipId: string;
  studentId: string;
  startDate: string;
  endDate: string;
  amountPerMonth: number;
  status: "active" | "graduated" | "terminated";
  notes?: string;
  assignedAt: string;
}

export interface Donor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalDonated: number;
  donationCount: number;
  lastDonatedAt: string;
}

export interface Bill {
  id: string;
  studentId: string;
  month: string;
  year: number;
  dueDate: string;
  items: Array<{ name: string; amount: number }>;
  total: number;
  status: "Lunas" | "Tertunggak" | "Cicilan";
  paymentMethod?: string;
  paidAt?: string;
}

export interface Payment {
  id: string;
  billId: string;
  studentId: string;
  amount: number;
  method: string;
  status: "success" | "pending" | "failed";
  paidAt: string;
  receiptNo: string;
}

export interface Installment {
  id: string;
  billId: string;
  studentId: string;
  totalAmount: number;
  paidAmount: number;
  totalPeriods: number;
  paidPeriods: number;
  amountPerPeriod: number;
  nextDueDate: string;
  status: "active" | "completed" | "overdue";
}

export interface Campaign {
  id: string;
  studentId?: string;
  schoolId?: string;
  title: string;
  description: string;
  story: string;
  target: number;
  collected: number;
  image: string;
  school: string;
  location: string;
  category: "Beasiswa" | "Fasilitas" | "Perlengkapan" | "Ujian";
  verified: boolean;
  status: "active" | "completed" | "cancelled";
  donors: number;
  startDate: string;
  endDate: string;
  updates: Array<{ date: string; text: string }>;
}

export interface Donation {
  id: string;
  campaignId: string;
  donorId: string;
  donorName: string;
  amount: number;
  isAnonymous: boolean;
  message?: string;
  method: string;
  donatedAt: string;
  status: "success" | "pending" | "failed";
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "payment" | "donation" | "campaign" | "system" | "reminder";
  read: boolean;
  createdAt: string;
  data?: any;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "in" | "out";
  category: "SPP" | "Cicilan" | "Donasi";
  title: string;
  description: string;
  amount: number;
  date: string;
  status: string;
}

// ─── Pinjaman Mikro ─────────────────────────────────────────────────────────
export interface Loan {
  id: string;
  studentId: string;
  amount: number;
  purpose: string;
  status: "Menunggu" | "Disetujui" | "Ditolak" | "Lunas";
  appliedAt: string;
  approvedAt: string | null;
  installmentCount: number;
}

export interface LoanInstallment {
  id: string;
  loanId: string;
  month: string;
  amount: number;
  status: "Belum Bayar" | "Lunas";
  dueDate: string;
  paidAt: string | null;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const KEYS = {
  STUDENTS: "edufin_students",
  BILLS: "edufin_bills",
  PAYMENTS: "edufin_payments",
  INSTALLMENTS: "edufin_installments",
  CAMPAIGNS: "edufin_campaigns",
  DONATIONS: "edufin_donations",
  NOTIFICATIONS: "edufin_notifications",
  TRANSACTIONS: "edufin_transactions",
  SCHOLARSHIPS: "edufin_scholarships",
  SCHOLARSHIP_RECIPIENTS: "edufin_scholarship_recipients",
  LOANS: "edufin_loans",
  LOAN_INSTALLMENTS: "edufin_loan_installments",
};

// ─── Helper Functions ─────────────────────────────────────────────────────────
function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);

    // Check if it's a quota exceeded error
    if (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      alert('Penyimpanan penuh! Data tidak dapat disimpan. Silakan hapus beberapa data lama atau bersihkan cache browser Anda.');
    } else {
      alert(`Gagal menyimpan data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    throw err; // Re-throw so calling code knows save failed
  }
}

// ─── Database Class ───────────────────────────────────────────────────────────
export class Database {
  // Students (Lokal & Supabase)
  static getStudents(): Student[] {
    return getFromStorage<Student>(KEYS.STUDENTS);
  }

  static getStudentById(id: string): Student | undefined {
    return this.getStudents().find((s) => s.id === id);
  }

  static getStudentByUserId(userId: string): Student | undefined {
    return this.getStudents().find((s) => s.userId === userId);
  }

  static saveStudent(student: Student): void {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === student.id);
    if (index >= 0) {
      students[index] = student;
    } else {
      students.push(student);
    }
    saveToStorage(KEYS.STUDENTS, students);
  }

  // --- SUPABASE ASYNC METHODS FOR STUDENTS ---
  static async fetchStudentsSupabase(): Promise<Student[]> {
    
    // Ambil SEMUA siswa termasuk data_only, pending, active
    const { data, error } = await supabase.from('students').select('*').order('name', { ascending: true });
    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }
    return data.map((d: any) => ({
      id: d.id,
      userId: d.user_id || "",
      nisn: d.nisn,
      name: d.name,
      email: d.email || "",
      school: "",
      class: d.class,
      parentName: d.parent_name,
      phone: "",
      parentPhone: "",
      address: "",
      sppAmount: d.spp_amount,
      status: d.status,
      registrationStatus: d.registration_status || 'data_only',
      verified: d.registration_status === 'active',
    }));
  }

  static async insertStudentSupabase(student: Partial<Student>, adminUserId: string): Promise<boolean> {
    
    const { error } = await supabase.from('students').insert([{
      nisn: student.nisn,
      name: student.name,
      class: student.class,
      parent_name: student.parentName,
      spp_amount: student.sppAmount || 725000,
      status: student.status || "active",
      registration_status: "active",
      created_by: adminUserId
    }]);
    if (error) {
      console.error('Error inserting student:', error);
      return false;
    }
    return true;
  }

  static async updateStudentSupabase(student: Student): Promise<boolean> {
    
    const { error } = await supabase.from('students').update({
      nisn: student.nisn,
      name: student.name,
      class: student.class,
      parent_name: student.parentName,
      spp_amount: student.sppAmount,
      status: student.status
    }).eq('id', student.id);
    
    if (error) {
      console.error('Error updating student:', error);
      return false;
    }
    return true;
  }

  static async deleteStudentSupabase(id: string): Promise<boolean> {
    
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
      console.error('Error deleting student:', error);
      return false;
    }
    return true;
  }

  // ─── Registration Flow Methods ────────────────────────────────────────────

  /** Cari siswa berdasarkan NISN (untuk langkah registrasi mandiri) */
  static async findStudentByNISN(nisn: string): Promise<any | null> {
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('nisn', nisn)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      nisn: data.nisn,
      name: data.name,
      class: data.class,
      parentName: data.parent_name,
      address: data.address,
      sppAmount: data.spp_amount,
      registrationStatus: data.registration_status || 'data_only',
      userId: data.user_id,
    };
  }

  /**
   * Generate email edufin.app dari nama siswa
   * Format: nama.depan@edufin.app
   * Jika duplikat: nama.depan.4digitNISN@edufin.app
   */
  static generateEdufinEmail(name: string, nisn: string): string {
    const clean = name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // hapus aksen
      .replace(/[^a-z\s]/g, '')    // hanya huruf & spasi
      .trim()
      .split(/\s+/)
      .slice(0, 2)                 // ambil 2 kata pertama
      .join('.');
    return `${clean}@edufin.app`;
  }

  static async generateUniqueEdufinEmail(name: string, nisn: string): Promise<string> {
    const base = Database.generateEdufinEmail(name, nisn);
    
    // Cek apakah email sudah ada
    const { data } = await supabase.from('students').select('edufin_email').eq('edufin_email', base);
    if (!data || data.length === 0) return base;
    // Duplikat → tambah 4 digit NISN terakhir
    const suffix = nisn.slice(-4);
    const [local] = base.split('@');
    return `${local}.${suffix}@edufin.app`;
  }

  /** Siswa apply registrasi: update user_id, personal_email, edufin_email, dan set status pending */
  static async applyStudentRegistration(
    studentId: string,
    userId: string,
    personalEmail: string,
    edufinEmail: string
  ): Promise<boolean> {
    
    const { error } = await supabase.from('students').update({
      user_id: userId,
      email: edufinEmail,           // login email = edufin.app
      personal_email: personalEmail, // untuk notifikasi
      edufin_email: edufinEmail,
      registration_status: 'pending',
      registered_at: new Date().toISOString(),
    }).eq('id', studentId);
    if (error) { console.error('Error applying registration:', error); return false; }
    return true;
  }

  /** Admin konfirmasi siswa pending → active + kirim email notifikasi */
  static async confirmStudentRegistration(studentId: string): Promise<boolean> {
    
    
    // Ambil data siswa dulu (untuk email notifikasi)
    const { data: studentData } = await supabase
      .from('students')
      .select('name, personal_email, edufin_email')
      .eq('id', studentId)
      .single();

    // Update status
    const { error } = await supabase.from('students').update({
      registration_status: 'active',
      status: 'active',
    }).eq('id', studentId);
    if (error) { console.error('Error confirming student:', error); return false; }

    // Kirim email notifikasi ke email pribadi siswa via Edge Function
    if (studentData?.personal_email && studentData?.edufin_email) {
      try {
        await supabase.functions.invoke('send-confirmation-email', {
          body: {
            to: studentData.personal_email,
            studentName: studentData.name,
            edufinEmail: studentData.edufin_email,
          }
        });
      } catch (e) {
        console.warn('Email notification failed (non-critical):', e);
      }
    }

    return true;
  }

  /** Admin tolak siswa pending → kembalikan ke data_only */
  static async rejectStudentRegistration(studentId: string): Promise<boolean> {
    
    const { error } = await supabase.from('students').update({
      registration_status: 'data_only',
      user_id: null,
      email: null,
      personal_email: null,
      edufin_email: null,
      registered_at: null,
    }).eq('id', studentId);
    if (error) { console.error('Error rejecting student:', error); return false; }
    return true;
  }

  /** Ambil semua siswa pending untuk admin */
  static async fetchPendingStudentsSupabase(): Promise<any[]> {
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('registration_status', 'pending')
      .order('registered_at', { ascending: false });
    if (error) { console.error('Error fetching pending students:', error); return []; }
    return (data || []).map((d: any) => ({
      id: d.id,
      userId: d.user_id || '',
      nisn: d.nisn,
      name: d.name,
      email: d.edufin_email || d.email || '',
      personalEmail: d.personal_email || '',
      edufinEmail: d.edufin_email || '',
      class: d.class,
      parentName: d.parent_name,
      address: d.address || '',
      sppAmount: d.spp_amount,
      status: d.status,
      registrationStatus: d.registration_status,
      registeredAt: d.registered_at,
    }));
  }
  // -------------------------------------------


  // Bills
  static getBills(): Bill[] {
    return getFromStorage<Bill>(KEYS.BILLS);
  }

  static getBillsByStudentId(studentId: string): Bill[] {
    return this.getBills().filter((b) => b.studentId === studentId);
  }

  static getBillById(id: string): Bill | undefined {
    return this.getBills().find((b) => b.id === id);
  }

  static saveBill(bill: Bill): void {
    const bills = this.getBills();
    const index = bills.findIndex((b) => b.id === bill.id);
    if (index >= 0) {
      bills[index] = bill;
    } else {
      bills.push(bill);
    }
    saveToStorage(KEYS.BILLS, bills);
  }

  // Payments
  static getPayments(): Payment[] {
    return getFromStorage<Payment>(KEYS.PAYMENTS);
  }

  static getPaymentsByStudentId(studentId: string): Payment[] {
    return this.getPayments().filter((p) => p.studentId === studentId);
  }

  static savePayment(payment: Payment): void {
    const payments = this.getPayments();
    payments.push(payment);
    saveToStorage(KEYS.PAYMENTS, payments);
  }

  // --- SUPABASE ASYNC METHODS FOR PAYMENTS ---
  static async fetchPaymentsSupabase(): Promise<any[]> {
    
    const { data, error } = await supabase.from('payments').select(`
      *,
      students ( name, nisn, class )
    `);
    if (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
    return data.map((d: any) => ({
      id: d.id,
      studentId: d.student_id,
      studentName: d.students?.name || 'Unknown',
      studentNisn: d.students?.nisn || '',
      studentClass: d.students?.class || '',
      month: d.month_paid,
      year: d.year_paid,
      amount: d.amount,
      method: d.payment_method,
      status: d.status,
      paidAt: d.created_at
    }));
  }

  static async insertPaymentSupabase(payment: any): Promise<boolean> {
    
    const { error } = await supabase.from('payments').insert([{
      student_id: payment.studentId,
      month_paid: payment.month,
      year_paid: payment.year,
      amount: payment.amount,
      payment_method: payment.method || 'Manual Cash',
      status: payment.status || 'completed'
    }]);
    if (error) {
      console.error('Error inserting payment:', error);
      return false;
    }
    return true;
  }

  static async updatePaymentSupabase(payment: any): Promise<boolean> {
    
    const { error } = await supabase.from('payments').update({
      month_paid: payment.month,
      year_paid: payment.year,
      amount: payment.amount,
      payment_method: payment.method,
      status: payment.status
    }).eq('id', payment.id);
    if (error) {
      console.error('Error updating payment:', error);
      return false;
    }
    return true;
  }

  static async deletePaymentSupabase(id: string): Promise<boolean> {
    
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) {
      console.error('Error deleting payment:', error);
      return false;
    }
    return true;
  }
  // -------------------------------------------

  // Installments
  static getSPPInstallments(): Installment[] {
    return getFromStorage<Installment>(KEYS.INSTALLMENTS);
  }

  static getSPPInstallmentsByStudentId(studentId: string): Installment[] {
    return this.getSPPInstallments().filter((i) => i.studentId === studentId);
  }

  static saveSPPInstallment(installment: Installment): void {
    const installments = this.getSPPInstallments();
    const index = installments.findIndex((i) => i.id === installment.id);
    if (index >= 0) {
      installments[index] = installment;
    } else {
      installments.push(installment);
    }
    saveToStorage(KEYS.INSTALLMENTS, installments);
  }

  // Campaigns
  static getCampaigns(): Campaign[] {
    return getFromStorage<Campaign>(KEYS.CAMPAIGNS);
  }

  static getCampaignById(id: string): Campaign | undefined {
    return this.getCampaigns().find((c) => c.id === id);
  }

  static saveCampaign(campaign: Campaign): void {
    const campaigns = this.getCampaigns();
    const index = campaigns.findIndex((c) => c.id === campaign.id);
    if (index >= 0) {
      campaigns[index] = campaign;
    } else {
      campaigns.push(campaign);
    }
    saveToStorage(KEYS.CAMPAIGNS, campaigns);
  }

  // --- SUPABASE ASYNC METHODS FOR CAMPAIGNS ---
  static async fetchCampaignsSupabase(): Promise<Campaign[]> {
    
    const { data, error } = await supabase.from('campaigns').select('*');
    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      story: d.story || "",
      target: d.target_amount,
      collected: d.collected_amount,
      category: d.category,
      image: d.image_url || "",
      school: "SMA Negeri 1 Jakarta", // Dummy for now
      location: "Jakarta",
      verified: true, // Assuming verified if it's in DB for now
      status: d.status,
      donors: 0,
      startDate: d.created_at,
      endDate: d.end_date || "",
      updates: []
    }));
  }

  static async insertCampaignSupabase(campaign: Partial<Campaign>, adminUserId: string): Promise<boolean> {
    
    const { error } = await supabase.from('campaigns').insert([{
      title: campaign.title,
      description: campaign.description,
      story: campaign.story || "",
      target_amount: campaign.target,
      category: campaign.category || "Fasilitas",
      image_url: campaign.image || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
      status: campaign.status || "active",
      created_by: adminUserId
    }]);
    if (error) {
      console.error('Error inserting campaign:', error);
      return false;
    }
    return true;
  }

  static async updateCampaignSupabase(campaign: Campaign): Promise<boolean> {
    
    const { error } = await supabase.from('campaigns').update({
      title: campaign.title,
      description: campaign.description,
      story: campaign.story || "",
      target_amount: campaign.target,
      category: campaign.category,
      status: campaign.status
    }).eq('id', campaign.id);
    
    if (error) {
      console.error('Error updating campaign:', error);
      return false;
    }
    return true;
  }

  static async deleteCampaignSupabase(id: string): Promise<boolean> {
    
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    if (error) {
      console.error('Error deleting campaign:', error);
      return false;
    }
    return true;
  }
  // ---------------------------------------------

  // Donations
  static getDonations(): Donation[] {
    return getFromStorage<Donation>(KEYS.DONATIONS);
  }

  static getDonationsByDonorId(donorId: string): Donation[] {
    return this.getDonations().filter((d) => d.donorId === donorId);
  }

  static getDonationsByCampaignId(campaignId: string): Donation[] {
    return this.getDonations().filter((d) => d.campaignId === campaignId);
  }

  static saveDonation(donation: Donation): void {
    const donations = this.getDonations();
    donations.push(donation);
    saveToStorage(KEYS.DONATIONS, donations);
  }

  // Notifications
  static getNotifications(): Notification[] {
    return getFromStorage<Notification>(KEYS.NOTIFICATIONS);
  }

  static getNotificationsByUserId(userId: string): Notification[] {
    return this.getNotifications().filter((n) => n.userId === userId);
  }

  static saveNotification(notification: Notification): void {
    const notifications = this.getNotifications();
    notifications.push(notification);
    saveToStorage(KEYS.NOTIFICATIONS, notifications);
  }

  static markNotificationAsRead(id: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      saveToStorage(KEYS.NOTIFICATIONS, notifications);
    }
  }

  // Transactions
  static getTransactions(): Transaction[] {
    return getFromStorage<Transaction>(KEYS.TRANSACTIONS);
  }

  static getTransactionsByUserId(userId: string): Transaction[] {
    return this.getTransactions().filter((t) => t.userId === userId);
  }

  static saveTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    saveToStorage(KEYS.TRANSACTIONS, transactions);
  }

  // Scholarships
  static getScholarships(): Scholarship[] {
    return getFromStorage<Scholarship>(KEYS.SCHOLARSHIPS);
  }

  static getScholarshipById(id: string): Scholarship | undefined {
    return this.getScholarships().find((s) => s.id === id);
  }

  static saveScholarship(scholarship: Scholarship): void {
    const list = this.getScholarships();
    const idx = list.findIndex((s) => s.id === scholarship.id);
    if (idx >= 0) list[idx] = scholarship; else list.push(scholarship);
    saveToStorage(KEYS.SCHOLARSHIPS, list);
  }

  static deleteScholarship(id: string): void {
    saveToStorage(KEYS.SCHOLARSHIPS, this.getScholarships().filter((s) => s.id !== id));
    saveToStorage(KEYS.SCHOLARSHIP_RECIPIENTS, this.getScholarshipRecipients().filter((r) => r.scholarshipId !== id));
  }

  // Scholarship Recipients
  static getScholarshipRecipients(): ScholarshipRecipient[] {
    return getFromStorage<ScholarshipRecipient>(KEYS.SCHOLARSHIP_RECIPIENTS);
  }

  static getRecipientsByScholarshipId(scholarshipId: string): ScholarshipRecipient[] {
    return this.getScholarshipRecipients().filter((r) => r.scholarshipId === scholarshipId);
  }

  static getScholarshipsByStudentId(studentId: string): ScholarshipRecipient[] {
    return this.getScholarshipRecipients().filter((r) => r.studentId === studentId);
  }

  static saveScholarshipRecipient(recipient: ScholarshipRecipient): void {
    const list = this.getScholarshipRecipients();
    const idx = list.findIndex((r) => r.id === recipient.id);
    if (idx >= 0) list[idx] = recipient; else list.push(recipient);
    saveToStorage(KEYS.SCHOLARSHIP_RECIPIENTS, list);
  }

  static deleteScholarshipRecipient(id: string): void {
    saveToStorage(KEYS.SCHOLARSHIP_RECIPIENTS, this.getScholarshipRecipients().filter((r) => r.id !== id));
  }

  // Delete operations
  static deleteStudent(id: string): void {
    const student = this.getStudentById(id);
    // Cascading delete: hapus semua data terkait siswa
    saveToStorage(KEYS.STUDENTS,      this.getStudents().filter((s) => s.id !== id));
    saveToStorage(KEYS.BILLS,         this.getBills().filter((b) => b.studentId !== id));
    saveToStorage(KEYS.PAYMENTS,      this.getPayments().filter((p) => p.studentId !== id));
    saveToStorage(KEYS.INSTALLMENTS,  this.getSPPInstallments().filter((i) => i.studentId !== id));
    if (student) {
      saveToStorage(KEYS.TRANSACTIONS,  this.getTransactions().filter((t) => t.userId !== student.userId));
      saveToStorage(KEYS.NOTIFICATIONS, this.getNotifications().filter((n) => n.userId !== student.userId));
    }
    saveToStorage(KEYS.SCHOLARSHIP_RECIPIENTS, this.getScholarshipRecipients().filter((r) => r.studentId !== id));
    saveToStorage(KEYS.LOANS,         this.getLoans().filter((l) => l.studentId !== id));
  }

  static deleteBill(id: string): void {
    // Cascading delete: hapus installments & payments terkait tagihan ini
    saveToStorage(KEYS.BILLS,         this.getBills().filter((b) => b.id !== id));
    saveToStorage(KEYS.INSTALLMENTS,  this.getSPPInstallments().filter((i) => i.billId !== id));
    saveToStorage(KEYS.PAYMENTS,      this.getPayments().filter((p) => p.billId !== id));
  }

  static deleteCampaign(id: string): void {
    // Cascading delete: hapus donations terkait kampanye ini
    saveToStorage(KEYS.CAMPAIGNS, this.getCampaigns().filter((c) => c.id !== id));
    saveToStorage(KEYS.DONATIONS, this.getDonations().filter((d) => d.campaignId !== id));
  }

  static deleteNotification(id: string): void {
    saveToStorage(KEYS.NOTIFICATIONS, this.getNotifications().filter((n) => n.id !== id));
  }

  static deleteDonation(id: string): void {
    saveToStorage(KEYS.DONATIONS, this.getDonations().filter((d) => d.id !== id));
  }

  static deleteTransaction(id: string): void {
    saveToStorage(KEYS.TRANSACTIONS, this.getTransactions().filter((t) => t.id !== id));
  }

  // ─── Pinjaman Mikro ──────────────────────────────────────────────────────────
  static getLoans(): Loan[] {
    return getFromStorage<Loan>(KEYS.LOANS);
  }

  static getLoansByStudentId(studentId: string): Loan[] {
    return this.getLoans().filter((l) => l.studentId === studentId);
  }

  static getLoanById(id: string): Loan | undefined {
    return this.getLoans().find((l) => l.id === id);
  }

  static saveLoan(loan: Loan): void {
    const loans = this.getLoans();
    const idx = loans.findIndex((l) => l.id === loan.id);
    if (idx >= 0) loans[idx] = loan; else loans.push(loan);
    saveToStorage(KEYS.LOANS, loans);
  }

  static deleteLoan(id: string): void {
    saveToStorage(KEYS.LOANS, this.getLoans().filter((l) => l.id !== id));
    saveToStorage(KEYS.LOAN_INSTALLMENTS, this.getLoanInstallments().filter((i) => i.loanId !== id));
  }

  static getLoanInstallments(): LoanInstallment[] {
    return getFromStorage<LoanInstallment>(KEYS.LOAN_INSTALLMENTS);
  }

  static getInstallmentsByLoanId(loanId: string): LoanInstallment[] {
    return this.getLoanInstallments().filter((i) => i.loanId === loanId);
  }

  static saveInstallment(installment: LoanInstallment): void {
    const list = this.getLoanInstallments();
    const idx = list.findIndex((i) => i.id === installment.id);
    if (idx >= 0) list[idx] = installment; else list.push(installment);
    saveToStorage(KEYS.LOAN_INSTALLMENTS, list);
  }

  // Derived: aggregate donors from donations
  static getDonors(): Donor[] {
    const donations = this.getDonations().filter((d) => d.status === "success");
    const map = new Map<string, Donor>();
    for (const d of donations) {
      const key = d.isAnonymous ? `anon-${d.donorId}` : d.donorId;
      const name = d.isAnonymous ? "Anonim" : d.donorName;
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.totalDonated += d.amount;
        existing.donationCount += 1;
        if (d.donatedAt > existing.lastDonatedAt) existing.lastDonatedAt = d.donatedAt;
      } else {
        map.set(key, {
          id: key,
          name,
          totalDonated: d.amount,
          donationCount: 1,
          lastDonatedAt: d.donatedAt,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalDonated - a.totalDonated);
  }

  // --- SUPABASE ASYNC METHODS FOR TRANSACTIONS, DONATIONS, SCHOLARSHIPS ---
  static async fetchNotificationsSupabase(): Promise<any[]> {
    
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) { console.error('Error notifications:', error); return []; }
    return data || [];
  }

  static async fetchTransactionsSupabase(): Promise<any[]> {
    
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) { console.error('Error transactions:', error); return []; }
    return data;
  }

  static async fetchDonationsSupabase(): Promise<any[]> {
    
    const { data, error } = await supabase.from('donations').select(`
      *,
      campaigns ( title ),
      users ( name )
    `);
    if (error) { console.error('Error donations:', error); return []; }
    return data.map((d: any) => ({
      id: d.id,
      campaignId: d.campaign_id,
      campaignTitle: d.campaigns?.title || 'Donasi Umum',
      donorId: d.donor_id,
      donorName: d.is_anonymous ? 'Anonim' : (d.users?.name || 'Anonim'),
      amount: d.amount,
      message: d.message,
      isAnonymous: d.is_anonymous,
      status: d.status,
      donatedAt: d.created_at
    }));
  }

  static async fetchScholarshipsSupabase(): Promise<any[]> {
    
    const { data, error } = await supabase.from('scholarships').select('*');
    if (error) { console.error('Error scholarships:', error); return []; }
    return data;
  }
  
  static async insertScholarshipSupabase(s: any, adminId: string): Promise<boolean> {
    
    const { error } = await supabase.from('scholarships').insert([{
      name: s.name,
      amount_per_month: s.amount_per_month,
      total_months: s.total_months,
      created_by: adminId
    }]);
    if (error) { console.error('Error insert scholarship:', error); return false; }
    return true;
  }

  static async fetchScholarshipRecipientsSupabase(scholarshipId?: string): Promise<any[]> {
    
    let query = supabase.from('scholarship_recipients').select(`*, students ( name, class, nisn )`);
    if (scholarshipId) query = query.eq('scholarship_id', scholarshipId);
    
    const { data, error } = await query;
    if (error) { console.error('Error recipients:', error); return []; }
    return data.map((d: any) => ({
      id: d.id,
      scholarshipId: d.scholarship_id,
      studentId: d.student_id,
      studentName: d.students?.name,
      studentClass: d.students?.class,
      studentNisn: d.students?.nisn,
      status: d.status,
      joinedAt: d.created_at
    }));
  }

  static async insertScholarshipRecipientSupabase(scholarshipId: string, studentId: string): Promise<boolean> {
    
    const { error } = await supabase.from('scholarship_recipients').insert([{
      scholarship_id: scholarshipId,
      student_id: studentId
    }]);
    return !error;
  }

  static async deleteScholarshipRecipientSupabase(id: string): Promise<boolean> {
    
    const { error } = await supabase.from('scholarship_recipients').delete().eq('id', id);
    return !error;
  }

  // Clear all data (for testing)
  static clearAll(): void {
    Object.values(KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
