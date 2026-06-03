/**
 * Local Database - Store semua data aplikasi
 * Data disimpan di localStorage untuk demo/development
 */

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
  // Students
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
    // Cascading delete: hapus semua data terkait siswa
    saveToStorage(KEYS.STUDENTS,      this.getStudents().filter((s) => s.id !== id));
    saveToStorage(KEYS.BILLS,         this.getBills().filter((b) => b.studentId !== id));
    saveToStorage(KEYS.PAYMENTS,      this.getPayments().filter((p) => p.studentId !== id));
    saveToStorage(KEYS.INSTALLMENTS,  this.getSPPInstallments().filter((i) => i.studentId !== id));
    saveToStorage(KEYS.TRANSACTIONS,  this.getTransactions().filter((t) => t.userId !== id));
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

  // Clear all data (for testing)
  static clearAll(): void {
    Object.values(KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
