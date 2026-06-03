/**
 * EDUFIN - Single School Configuration
 *
 * Karena aplikasi ini untuk 1 sekolah saja (single-tenant),
 * semua konfigurasi sekolah di-hardcode di sini.
 */

export const SCHOOL = {
  // Identitas Sekolah
  id: "SDN-3-MALANG",
  name: "SDN 3 Malang",
  npsn: "20534812",
  address: "Jl. Veteran No. 12, Malang, Jawa Timur 65145",
  phone: "(0341) 123-4567",
  email: "admin@sdn3malang.sch.id",
  logo: "/assets/school-logo.png",

  // Biaya SPP Default (dalam Rupiah)
  defaultFee: {
    spp: 500000,
    lab: 125000,
    library: 75000,
    activities: 150000,
    get total() {
      return this.spp + this.lab + this.library + this.activities;
    }
  },

  // Pengaturan Cicilan SPP
  installment: {
    enabled: true,
    options: [
      { label: "2x", value: 2, fee: 0 }, // Cicil 2x, gratis
      { label: "3x", value: 3, fee: 0 }, // Cicil 3x, gratis
    ],
    minimumDownPayment: 0.3, // 30% DP minimal
  },

  // Pengaturan Tangguh SPP
  deferred: {
    enabled: true,
    maxPerYear: 2, // Maksimal 2x tangguh per tahun ajaran
    maxPerSemester: 1, // Maksimal 1x tangguh per semester
    fee: 0, // Gratis, tidak ada bunga
  },

  // Pengaturan Donasi
  donation: {
    minimumAmount: 10000, // Minimal Rp10.000
    certificateEnabled: false, // Sertifikat donasi dinonaktifkan
    publicCampaigns: true, // Kampanye bisa diakses publik
  },

  // Tahun Ajaran Aktif
  academicYear: {
    current: "2025/2026",
    semester: "Genap",
    startDate: "2026-01-01",
    endDate: "2026-06-30",
  },

  // Rekening Sekolah (Primary)
  bankAccount: {
    primary: {
      bankName: "Bank BCA",
      accountNumber: "1234567890",
      accountHolder: "SDN 3 Malang",
    },
  },
};

/**
 * Helper: Format nama sekolah lengkap dengan NPSN
 */
export function getSchoolFullName() {
  return `${SCHOOL.name} (NPSN: ${SCHOOL.npsn})`;
}

/**
 * Helper: Hitung total SPP default
 */
export function getDefaultSPPTotal() {
  return SCHOOL.defaultFee.total;
}

/**
 * Helper: Validasi cicilan
 */
export function canUseInstallment(amount: number, times: 2 | 3): boolean {
  const minDP = amount * SCHOOL.installment.minimumDownPayment;
  return amount >= minDP;
}

/**
 * Helper: Check apakah user masih bisa tangguh SPP
 */
export function canUseDeferred(deferredCountThisYear: number, deferredCountThisSemester: number): boolean {
  return (
    deferredCountThisYear < SCHOOL.deferred.maxPerYear &&
    deferredCountThisSemester < SCHOOL.deferred.maxPerSemester
  );
}
