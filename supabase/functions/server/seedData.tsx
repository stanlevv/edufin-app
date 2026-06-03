/**
 * Seed Data for Supabase KV Store
 */

import * as kv from "./kv_store.tsx";

export async function seedSupabaseDatabase() {
  console.log("[SEED] Populating Supabase database...");

  // ─── Students ─────────────────────────────────────────────────────────────────
  const students = [
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

  for (const student of students) {
    await kv.set(`edufin:student:${student.id}`, student);
  }
  console.log(`[SEED] Students: ${students.length}`);

  // ─── Bills ────────────────────────────────────────────────────────────────────
  const bills = [
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

  for (const bill of bills) {
    await kv.set(`edufin:bill:${bill.id}`, bill);
  }
  console.log(`[SEED] Bills: ${bills.length}`);

  // ─── Payments ─────────────────────────────────────────────────────────────────
  const payments = [
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

  for (const payment of payments) {
    await kv.set(`edufin:payment:${payment.id}`, payment);
  }
  console.log(`[SEED] Payments: ${payments.length}`);

  // ─── Campaigns ────────────────────────────────────────────────────────────────
  const campaigns = [
    {
      id: "1",
      studentId: "student-1",
      schoolId: "school-1",
      title: "Beasiswa Siswa Berprestasi SDN 3 Malang",
      description: "Program beasiswa untuk 10 siswa berprestasi yang terkendala biaya",
      story: "SDN 3 Malang memiliki banyak siswa berprestasi namun terbentur keterbatasan biaya pendidikan.",
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
        { date: "5 Mei 2025", text: "Dana sudah mencapai 74% dari target!" },
        { date: "20 Apr 2025", text: "Kampanye resmi diluncurkan." },
      ],
    },
    {
      id: "2",
      schoolId: "school-2",
      title: "Renovasi Lab Komputer SMP Negeri 5 Batu",
      description: "Pembelian 15 unit komputer baru untuk lab komputer",
      story: "Lab komputer SMPN 5 Batu sudah berusia lebih dari 10 tahun.",
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
      updates: [{ date: "1 Mei 2025", text: "Proses tender pembelian komputer dimulai." }],
    },
  ];

  for (const campaign of campaigns) {
    await kv.set(`edufin:campaign:${campaign.id}`, campaign);
  }
  console.log(`[SEED] Campaigns: ${campaigns.length}`);

  // ─── Donations ────────────────────────────────────────────────────────────────
  const donations = [
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
  ];

  for (const donation of donations) {
    await kv.set(`edufin:donation:${donation.id}`, donation);
  }
  console.log(`[SEED] Donations: ${donations.length}`);

  // ─── Notifications ────────────────────────────────────────────────────────────
  const notifications = [
    {
      id: "notif-1",
      userId: "demo-1",
      title: "Tagihan SPP Mei 2025 telah jatuh tempo",
      message: "Tagihan SPP bulan Mei sebesar Rp850.000 telah jatuh tempo.",
      type: "reminder",
      read: false,
      createdAt: "2025-05-31T08:00:00",
    },
    {
      id: "notif-2",
      userId: "demo-1",
      title: "Pembayaran SPP April berhasil dikonfirmasi",
      message: "Pembayaran SPP April sebesar Rp775.000 telah berhasil dikonfirmasi.",
      type: "payment",
      read: false,
      createdAt: "2025-04-10T10:35:00",
    },
  ];

  for (const notification of notifications) {
    await kv.set(`edufin:notification:${notification.id}`, notification);
  }
  console.log(`[SEED] Notifications: ${notifications.length}`);

  // ─── Transactions ─────────────────────────────────────────────────────────────
  const transactions = [
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
      userId: "demo-2",
      type: "in",
      category: "SPP",
      title: "Penerimaan SPP",
      description: "Andi Pratama · Mei 2025 · QRIS",
      amount: 725000,
      date: "2025-05-10",
      status: "Berhasil",
    },
  ];

  for (const transaction of transactions) {
    await kv.set(`edufin:transaction:${transaction.id}`, transaction);
  }
  console.log(`[SEED] Transactions: ${transactions.length}`);

  console.log("[SEED] Supabase database populated successfully!");
}
