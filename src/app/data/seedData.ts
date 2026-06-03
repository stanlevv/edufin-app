/**
 * Seed Data - Populate database dengan data dummy untuk development
 */

import { Database, Student, Bill, Payment, Installment, Campaign, Donation, Notification, Transaction, Scholarship, ScholarshipRecipient } from "./database";

export function seedDatabase(): void {
  const alreadySeeded = Database.getStudents().length > 0;

  if (alreadySeeded) {
    // Still seed scholarships if they haven't been seeded yet
    if (Database.getScholarships().length === 0) {
      const scholarships: Scholarship[] = [
        {
          id: "sch-1",
          name: "Beasiswa Prestasi Akademik 2025",
          description: "Beasiswa penuh untuk siswa berprestasi dengan nilai rata-rata di atas 85",
          amountPerMonth: 850000,
          totalMonths: 12,
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          source: "Dana BOS",
          status: "active",
          maxRecipients: 5,
          createdAt: "2024-12-15T08:00:00",
        },
        {
          id: "sch-2",
          name: "Beasiswa Yatim Piatu & Dhuafa",
          description: "Subsidi SPP untuk siswa yatim piatu dan keluarga tidak mampu",
          amountPerMonth: 725000,
          totalMonths: 12,
          startDate: "2025-02-01",
          endDate: "2026-01-31",
          source: "Dana Donatur",
          campaignId: "1",
          status: "active",
          maxRecipients: 10,
          createdAt: "2025-01-20T09:00:00",
        },
      ];
      scholarships.forEach((s) => Database.saveScholarship(s));

      const recipients: ScholarshipRecipient[] = [
        {
          id: "recip-1",
          scholarshipId: "sch-1",
          studentId: "student-1",
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          amountPerMonth: 850000,
          status: "active",
          notes: "Peringkat 1 kelas X IPA",
          assignedAt: "2024-12-20T10:00:00",
        },
        {
          id: "recip-2",
          scholarshipId: "sch-2",
          studentId: "student-2",
          startDate: "2025-02-01",
          endDate: "2026-01-31",
          amountPerMonth: 725000,
          status: "active",
          notes: "Orang tua tunggal, ekonomi lemah",
          assignedAt: "2025-01-25T11:00:00",
        },
      ];
      recipients.forEach((r) => Database.saveScholarshipRecipient(r));
      console.log("[SEED] Scholarships seeded for existing database.");
    }
    console.log("[SEED] Database already populated");
    return;
  }

  console.log("[SEED] Populating database...");

  // ─── Students ─────────────────────────────────────────────────────────────────
  const students: Student[] = [
    {
      id: "student-1",
      userId: "demo-1",
      nisn: "0012345678",
      name: "Budi Santoso",
      email: "siswa@edufin.id",
      school: "SDN 3 Malang",
      class: "X IPA 1",
      parentName: "Hendra Santoso",
      address: "Jl. Diponegoro No. 45, Malang",
      sppAmount: 850000,
      status: "active",
      verified: true,
    },
    {
      id: "student-2",
      userId: "local-2",
      nisn: "0098765432",
      name: "Andi Pratama",
      email: "andi@example.com",
      school: "SDN 3 Malang",
      class: "XI IPA 2",
      parentName: "Bambang Pratama",
      address: "Jl. Veteran No. 12, Malang",
      sppAmount: 725000,
      status: "active",
      verified: true,
    },
    {
      id: "student-3",
      userId: "local-3",
      nisn: "0011223344",
      name: "Siti Rahayu",
      email: "siti@example.com",
      school: "SDN 3 Malang",
      class: "IX A",
      parentName: "Ahmad Rahayu",
      address: "Jl. Semeru No. 8, Malang",
      sppAmount: 600000,
      status: "active",
      verified: true,
    },
  ];

  students.forEach((s) => Database.saveStudent(s));

  // ─── Bills ────────────────────────────────────────────────────────────────────
  const bills: Bill[] = [
    // Budi Santoso - Student 1
    {
      id: "bill-1",
      studentId: "student-1",
      month: "Mei",
      year: 2025,
      dueDate: "2025-05-31",
      items: [
        { name: "SPP", amount: 500000 },
        { name: "Kegiatan", amount: 150000 },
        { name: "Lab", amount: 125000 },
        { name: "Perpustakaan", amount: 75000 },
      ],
      total: 850000,
      status: "Tertunggak",
    },
    {
      id: "bill-2",
      studentId: "student-1",
      month: "April",
      year: 2025,
      dueDate: "2025-04-30",
      items: [
        { name: "SPP", amount: 500000 },
        { name: "Kegiatan", amount: 150000 },
        { name: "Lab", amount: 125000 },
      ],
      total: 775000,
      status: "Lunas",
      paymentMethod: "QRIS",
      paidAt: "2025-04-10",
    },
    {
      id: "bill-3",
      studentId: "student-1",
      month: "Maret",
      year: 2025,
      dueDate: "2025-03-31",
      items: [
        { name: "SPP", amount: 500000 },
        { name: "Kegiatan", amount: 100000 },
      ],
      total: 600000,
      status: "Lunas",
      paymentMethod: "Virtual Account",
      paidAt: "2025-03-12",
    },
    {
      id: "bill-4",
      studentId: "student-1",
      month: "Februari",
      year: 2025,
      dueDate: "2025-02-28",
      items: [
        { name: "SPP", amount: 500000 },
        { name: "Kegiatan", amount: 100000 },
      ],
      total: 600000,
      status: "Lunas",
      paymentMethod: "QRIS",
      paidAt: "2025-02-15",
    },
    {
      id: "bill-5",
      studentId: "student-1",
      month: "Januari",
      year: 2025,
      dueDate: "2025-01-31",
      items: [
        { name: "SPP", amount: 500000 },
        { name: "Kegiatan", amount: 150000 },
      ],
      total: 650000,
      status: "Lunas",
      paymentMethod: "Transfer Bank BCA",
      paidAt: "2025-01-20",
    },
    // Andi Pratama - Student 2
    {
      id: "bill-6",
      studentId: "student-2",
      month: "Mei",
      year: 2025,
      dueDate: "2025-05-31",
      items: [
        { name: "SPP", amount: 500000 },
        { name: "Kegiatan", amount: 100000 },
        { name: "Lab", amount: 125000 },
      ],
      total: 725000,
      status: "Lunas",
      paymentMethod: "QRIS",
      paidAt: "2025-05-10",
    },
    {
      id: "bill-7",
      studentId: "student-2",
      month: "April",
      year: 2025,
      dueDate: "2025-04-30",
      items: [
        { name: "SPP", amount: 500000 },
        { name: "Kegiatan", amount: 100000 },
        { name: "Lab", amount: 125000 },
      ],
      total: 725000,
      status: "Lunas",
      paymentMethod: "Virtual Account BCA",
      paidAt: "2025-04-09",
    },
  ];

  bills.forEach((b) => Database.saveBill(b));

  // ─── Payments ─────────────────────────────────────────────────────────────────
  const payments: Payment[] = [
    {
      id: "payment-1",
      billId: "bill-2",
      studentId: "student-1",
      amount: 775000,
      method: "QRIS",
      status: "success",
      paidAt: "2025-04-10T10:30:00",
      receiptNo: "EDU202504100001",
    },
    {
      id: "payment-2",
      billId: "bill-3",
      studentId: "student-1",
      amount: 600000,
      method: "Virtual Account",
      status: "success",
      paidAt: "2025-03-12T14:20:00",
      receiptNo: "EDU202503120001",
    },
    {
      id: "payment-3",
      billId: "bill-4",
      studentId: "student-1",
      amount: 600000,
      method: "QRIS",
      status: "success",
      paidAt: "2025-02-15T09:15:00",
      receiptNo: "EDU202502150001",
    },
    {
      id: "payment-4",
      billId: "bill-5",
      studentId: "student-1",
      amount: 650000,
      method: "Transfer Bank BCA",
      status: "success",
      paidAt: "2025-01-20T16:45:00",
      receiptNo: "EDU202501200001",
    },
    {
      id: "payment-5",
      billId: "bill-6",
      studentId: "student-2",
      amount: 725000,
      method: "QRIS",
      status: "success",
      paidAt: "2025-05-10T11:20:00",
      receiptNo: "EDU202505100002",
    },
    {
      id: "payment-6",
      billId: "bill-7",
      studentId: "student-2",
      amount: 725000,
      method: "Virtual Account BCA",
      status: "success",
      paidAt: "2025-04-09T13:10:00",
      receiptNo: "EDU202504090002",
    },
  ];

  payments.forEach((p) => Database.savePayment(p));

  // ─── Campaigns ────────────────────────────────────────────────────────────────
  const campaigns: Campaign[] = [
    {
      id: "1",
      studentId: "student-1",
      schoolId: "school-1",
      title: "Beasiswa Siswa Berprestasi SDN 3 Malang",
      description: "Program beasiswa untuk 10 siswa berprestasi yang terkendala biaya",
      story: "SDN 3 Malang memiliki banyak siswa berprestasi namun terbentur keterbatasan biaya pendidikan. Program beasiswa ini bertujuan untuk membantu 10 siswa terbaik agar dapat melanjutkan pendidikan ke jenjang yang lebih tinggi tanpa hambatan finansial.\n\nDana yang terkumpul akan digunakan untuk biaya SPP, seragam, perlengkapan belajar, dan transportasi selama 1 tahun ajaran penuh.",
      target: 15000000,
      collected: 11200000,
      image: "https://images.unsplash.com/photo-1758316289766-d483969b7f90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      school: "SDN 3 Malang",
      location: "Kota Malang, Jawa Timur",
      category: "Beasiswa",
      verified: true,
      status: "active",
      donors: 124,
      startDate: "2025-04-20",
      endDate: "2025-06-12",
      updates: [
        { date: "5 Mei 2025", text: "Dana sudah mencapai 74% dari target! Terima kasih para donatur." },
        { date: "20 Apr 2025", text: "Kampanye resmi diluncurkan dan telah diverifikasi oleh sekolah." },
      ],
    },
    {
      id: "2",
      schoolId: "school-2",
      title: "Renovasi Lab Komputer SMP Negeri 5 Batu",
      description: "Pembelian 15 unit komputer baru untuk lab komputer",
      story: "Lab komputer SMPN 5 Batu sudah berusia lebih dari 10 tahun dan komputer-komputernya sudah usang. Kami membutuhkan dana untuk membeli 15 unit komputer baru beserta perlengkapannya agar siswa dapat belajar teknologi informasi dengan lebih baik.",
      target: 25000000,
      collected: 18500000,
      image: "https://images.unsplash.com/photo-1551161001-5c4184cc4317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      school: "SMPN 5 Batu",
      location: "Kota Batu, Jawa Timur",
      category: "Fasilitas",
      verified: true,
      status: "active",
      donors: 89,
      startDate: "2025-04-01",
      endDate: "2025-06-25",
      updates: [
        { date: "1 Mei 2025", text: "Proses tender pembelian komputer sudah dimulai." },
      ],
    },
    {
      id: "3",
      schoolId: "school-3",
      title: "Dana Buku & Alat Tulis Siswa Kurang Mampu",
      description: "Perlengkapan belajar untuk 30 siswa kurang mampu",
      story: "Banyak siswa di SMA Negeri 2 Kepanjen yang tidak mampu membeli buku pelajaran dan alat tulis yang diperlukan. Kampanye ini bertujuan untuk menyediakan perlengkapan belajar bagi 30 siswa kurang mampu.",
      target: 8000000,
      collected: 6100000,
      image: "https://images.unsplash.com/photo-1752920299180-e8fd9276c202?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      school: "SMA Negeri 2 Kepanjen",
      location: "Kab. Malang, Jawa Timur",
      category: "Perlengkapan",
      verified: false,
      status: "active",
      donors: 67,
      startDate: "2025-04-15",
      endDate: "2025-06-08",
      updates: [],
    },
    {
      id: "4",
      schoolId: "school-4",
      title: "Bantuan Biaya Ujian Siswa Tidak Mampu",
      description: "Dana ujian untuk 20 siswa dari keluarga tidak mampu",
      story: "Ujian nasional dan ujian sekolah memerlukan biaya yang tidak sedikit. Dana ini akan membantu 20 siswa dari keluarga tidak mampu agar dapat mengikuti ujian dengan tenang tanpa khawatir soal biaya.",
      target: 5000000,
      collected: 3200000,
      image: "https://images.unsplash.com/photo-1569173675610-42c361a86e37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      school: "MAN 1 Malang",
      location: "Kota Malang, Jawa Timur",
      category: "Ujian",
      verified: true,
      status: "active",
      donors: 45,
      startDate: "2025-04-10",
      endDate: "2025-05-28",
      updates: [],
    },
  ];

  campaigns.forEach((c) => Database.saveCampaign(c));

  // ─── Donations ────────────────────────────────────────────────────────────────
  const donations: Donation[] = [
    {
      id: "donation-1",
      campaignId: "1",
      donorId: "demo-3",
      donorName: "Rina Permata",
      amount: 200000,
      isAnonymous: false,
      message: "Semangat untuk pendidikan Indonesia!",
      method: "QRIS",
      donatedAt: "2025-05-05T14:30:00",
      status: "success",
    },
    {
      id: "donation-2",
      campaignId: "2",
      donorId: "demo-3",
      donorName: "Rina Permata",
      amount: 150000,
      isAnonymous: false,
      method: "Transfer Bank",
      donatedAt: "2025-03-15T10:20:00",
      status: "success",
    },
    {
      id: "donation-3",
      campaignId: "3",
      donorId: "demo-3",
      donorName: "Anonim",
      amount: 100000,
      isAnonymous: true,
      method: "QRIS",
      donatedAt: "2025-02-01T16:45:00",
      status: "success",
    },
    {
      id: "donation-4",
      campaignId: "1",
      donorId: "demo-3",
      donorName: "Rina Permata",
      amount: 250000,
      isAnonymous: false,
      message: "Untuk masa depan anak-anak Indonesia",
      method: "Virtual Account",
      donatedAt: "2025-01-15T09:15:00",
      status: "success",
    },
  ];

  donations.forEach((d) => Database.saveDonation(d));

  // ─── Notifications ────────────────────────────────────────────────────────────
  const notifications: Notification[] = [
    // Student notifications
    {
      id: "notif-1",
      userId: "demo-1",
      title: "Tagihan SPP Mei 2025 telah jatuh tempo",
      message: "Tagihan SPP bulan Mei sebesar Rp850.000 telah jatuh tempo. Segera lakukan pembayaran.",
      type: "reminder",
      read: false,
      createdAt: "2025-05-31T08:00:00",
    },
    {
      id: "notif-2",
      userId: "demo-1",
      title: "Pembayaran SPP April berhasil dikonfirmasi",
      message: "Pembayaran SPP April sebesar Rp775.000 telah berhasil dikonfirmasi. Terima kasih!",
      type: "payment",
      read: false,
      createdAt: "2025-04-10T10:35:00",
    },
    {
      id: "notif-3",
      userId: "demo-1",
      title: "Selamat! Kampanye kamu disetujui",
      message: 'Kampanye "Beasiswa Siswa Berprestasi SDN 3 Malang" telah disetujui dan dipublikasikan.',
      type: "campaign",
      read: true,
      createdAt: "2025-04-20T14:00:00",
    },
    {
      id: "notif-8",
      userId: "demo-1",
      title: "Reminder: Jatuh tempo 3 hari lagi",
      message: "Tagihan SPP bulan Mei akan jatuh tempo dalam 3 hari. Mohon segera lakukan pembayaran.",
      type: "reminder",
      read: true,
      createdAt: "2025-05-28T09:00:00",
    },
    {
      id: "notif-9",
      userId: "demo-1",
      title: "Pengajuan pinjaman SPP disetujui",
      message: "Pengajuan pinjaman SPP sebesar Rp850.000 telah disetujui. Dana akan segera dicairkan.",
      type: "system",
      read: true,
      createdAt: "2025-05-15T10:00:00",
    },
    {
      id: "notif-10",
      userId: "demo-1",
      title: "Donasi diterima untuk kampanye kamu",
      message: "Kampanye kamu menerima donasi sebesar Rp150.000 dari donatur anonim. Terima kasih!",
      type: "donation",
      read: true,
      createdAt: "2025-05-12T15:30:00",
    },
    {
      id: "notif-11",
      userId: "demo-1",
      title: "Update sistem EduFin",
      message: "Kami telah menambahkan fitur pembayaran cicilan SPP. Cek halaman pembayaran untuk info lebih lanjut.",
      type: "system",
      read: true,
      createdAt: "2025-05-08T08:00:00",
    },
    {
      id: "notif-12",
      userId: "demo-1",
      title: "Pembayaran Maret berhasil",
      message: "Pembayaran SPP bulan Maret sebesar Rp600.000 telah berhasil dikonfirmasi. Terima kasih!",
      type: "payment",
      read: true,
      createdAt: "2025-03-12T11:20:00",
    },
    {
      id: "notif-13",
      userId: "demo-1",
      title: "Verifikasi akun berhasil",
      message: "Akun kamu telah diverifikasi oleh admin sekolah. Kamu sekarang dapat mengakses semua fitur EduFin.",
      type: "system",
      read: true,
      createdAt: "2025-03-01T09:00:00",
    },
    // Donor notifications
    {
      id: "notif-4",
      userId: "demo-3",
      title: "Terima kasih atas donasi Anda!",
      message: "Donasi Anda sebesar Rp200.000 untuk kampanye Beasiswa Siswa Berprestasi telah berhasil.",
      type: "donation",
      read: false,
      createdAt: "2025-05-05T14:32:00",
    },
    {
      id: "notif-5",
      userId: "demo-3",
      title: "Update Kampanye: Beasiswa Siswa Berprestasi",
      message: "Dana sudah mencapai 74% dari target! Terima kasih para donatur.",
      type: "campaign",
      read: false,
      createdAt: "2025-05-05T16:00:00",
    },
    // School notifications
    {
      id: "notif-6",
      userId: "demo-2",
      title: "Pembayaran SPP diterima",
      message: "Andi Pratama telah membayar SPP Mei 2025 sebesar Rp725.000 via QRIS.",
      type: "payment",
      read: false,
      createdAt: "2025-05-10T11:22:00",
    },
    {
      id: "notif-7",
      userId: "demo-2",
      title: "Dana kampanye siap dicairkan",
      message: 'Kampanye "Beasiswa Siswa Berprestasi" telah terkumpul Rp11.200.000 dan siap dicairkan.',
      type: "campaign",
      read: false,
      createdAt: "2025-05-05T17:00:00",
    },
  ];

  notifications.forEach((n) => Database.saveNotification(n));

  // ─── Transactions ─────────────────────────────────────────────────────────────
  const transactions: Transaction[] = [
    // Student transactions
    {
      id: "trans-1",
      userId: "demo-1",
      type: "out",
      category: "SPP",
      title: "Pembayaran SPP",
      description: "April 2025 · QRIS",
      amount: 775000,
      date: "2025-04-10",
      status: "Berhasil",
    },
    {
      id: "trans-2",
      userId: "demo-1",
      type: "out",
      category: "SPP",
      title: "Pembayaran SPP",
      description: "Maret 2025 · Virtual Account",
      amount: 600000,
      date: "2025-03-12",
      status: "Berhasil",
    },
    {
      id: "trans-3",
      userId: "demo-1",
      type: "out",
      category: "SPP",
      title: "Pembayaran SPP",
      description: "Februari 2025 · QRIS",
      amount: 600000,
      date: "2025-02-15",
      status: "Berhasil",
    },
    {
      id: "trans-4",
      userId: "demo-1",
      type: "out",
      category: "SPP",
      title: "Pembayaran SPP",
      description: "Januari 2025 · Transfer Bank BCA",
      amount: 650000,
      date: "2025-01-20",
      status: "Berhasil",
    },
    // School transactions (incoming)
    {
      id: "trans-5",
      userId: "demo-2",
      type: "in",
      category: "SPP",
      title: "Penerimaan SPP",
      description: "Andi Pratama · Mei 2025 · QRIS",
      amount: 725000,
      date: "2025-05-10",
      status: "Berhasil",
    },
    {
      id: "trans-6",
      userId: "demo-2",
      type: "in",
      category: "SPP",
      title: "Penerimaan SPP",
      description: "Budi Santoso · April 2025 · QRIS",
      amount: 775000,
      date: "2025-04-10",
      status: "Berhasil",
    },
    {
      id: "trans-7",
      userId: "demo-2",
      type: "in",
      category: "Donasi",
      title: "Pencairan Dana Kampanye",
      description: "Beasiswa Siswa Berprestasi",
      amount: 11200000,
      date: "2025-05-08",
      status: "Berhasil",
    },
    {
      id: "trans-8",
      userId: "demo-2",
      type: "in",
      category: "SPP",
      title: "Penerimaan SPP",
      description: "Siti Rahayu · Maret 2025 · QRIS",
      amount: 600000,
      date: "2025-03-12",
      status: "Berhasil",
    },
  ];

  transactions.forEach((t) => Database.saveTransaction(t));

  console.log("[SEED] Database populated successfully!");
  console.log(`  - Students: ${students.length}`);
  console.log(`  - Bills: ${bills.length}`);
  console.log(`  - Payments: ${payments.length}`);
  console.log(`  - Campaigns: ${campaigns.length}`);
  console.log(`  - Donations: ${donations.length}`);
  console.log(`  - Notifications: ${notifications.length}`);
  console.log(`  - Transactions: ${transactions.length}`);
}
