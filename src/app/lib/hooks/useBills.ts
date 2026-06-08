/**
 * useBills.ts
 * 
 * Contoh hook TanStack Query untuk data tagihan SPP.
 * 
 * Cara pakai di komponen:
 * 
 *   const { data: bills, isLoading, error } = useBills(schoolId)
 *   const { mutate: createBill, isPending } = useCreateBill()
 * 
 * Keuntungan vs useState + useEffect:
 *   ✅ Caching otomatis (2 menit)
 *   ✅ Loading/error state out of the box
 *   ✅ Auto re-fetch saat data stale
 *   ✅ Optimistic update untuk UX lebih smooth
 *   ✅ Tidak ada memory leak
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Bill {
  id: string;
  school_id: string;
  student_id: string;
  amount: number;
  late_fee: number;
  month: string;
  due_date: string;
  status: 'belum_bayar' | 'lunas' | 'terlambat' | 'cicilan';
  payment_method: string | null;
  xendit_invoice_id: string | null;
  xendit_payment_url: string | null;
  transfer_proof_url: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  // Relasi (dari join)
  student?: {
    name: string;
    nisn: string;
    class: string;
  };
}

export interface CreateBillInput {
  school_id: string;
  student_id: string;
  amount: number;
  month: string;
  due_date: string;
  notes?: string;
}

export interface BillsFilter {
  status?: Bill['status'];
  studentClass?: string;
  month?: string;
}

// ─── Query Keys (konsisten agar invalidasi cache bisa tepat sasaran) ──────────

export const billKeys = {
  all: ['bills'] as const,
  bySchool: (schoolId: string) => ['bills', 'school', schoolId] as const,
  byStudent: (studentId: string) => ['bills', 'student', studentId] as const,
  detail: (billId: string) => ['bills', 'detail', billId] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Ambil semua tagihan untuk 1 sekolah (untuk admin dashboard).
 * 
 * @example
 * const { data, isLoading } = useBillsBySchool(schoolId, { status: 'belum_bayar' })
 */
export function useBillsBySchool(
  schoolId: string | undefined,
  filter?: BillsFilter,
  page = 1,
  pageSize = 20
) {
  return useQuery({
    queryKey: [...billKeys.bySchool(schoolId ?? ''), filter, page],
    queryFn: async () => {
      if (!schoolId) throw new Error('schoolId is required');

      let query = supabase
        .from('bills')
        .select(`
          *,
          student:students(name, nisn, class)
        `, { count: 'exact' })
        .eq('school_id', schoolId)
        .order('due_date', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (filter?.status) {
        query = query.eq('status', filter.status);
      }
      if (filter?.month) {
        query = query.eq('month', filter.month);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        bills: data as Bill[],
        total: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      };
    },
    enabled: !!schoolId,
    placeholderData: (prev) => prev, // Smooth pagination — jangan flash kosong
  });
}

/**
 * Ambil tagihan milik 1 siswa (untuk dashboard siswa/orang tua).
 * 
 * @example
 * const { data: bills } = useBillsByStudent(studentId)
 */
export function useBillsByStudent(studentId: string | undefined) {
  return useQuery({
    queryKey: billKeys.byStudent(studentId ?? ''),
    queryFn: async () => {
      if (!studentId) throw new Error('studentId is required');

      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('student_id', studentId)
        .order('due_date', { ascending: false });

      if (error) throw error;
      return data as Bill[];
    },
    enabled: !!studentId,
  });
}

/**
 * Ambil 1 tagihan berdasarkan ID.
 */
export function useBill(billId: string | undefined) {
  return useQuery({
    queryKey: billKeys.detail(billId ?? ''),
    queryFn: async () => {
      if (!billId) throw new Error('billId is required');

      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          student:students(name, nisn, class, parent_name, parent_phone)
        `)
        .eq('id', billId)
        .single();

      if (error) throw error;
      return data as Bill;
    },
    enabled: !!billId,
  });
}

/**
 * Buat tagihan SPP baru (admin).
 * Otomatis invalidate cache setelah berhasil.
 * 
 * @example
 * const { mutate: createBill, isPending } = useCreateBill()
 * createBill({ school_id, student_id, amount, month, due_date })
 */
export function useCreateBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBillInput) => {
      const { data, error } = await supabase
        .from('bills')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as Bill;
    },
    onSuccess: (newBill) => {
      // Invalidate cache tagihan untuk sekolah ini → auto re-fetch
      queryClient.invalidateQueries({ queryKey: billKeys.bySchool(newBill.school_id) });
      toast.success('Tagihan berhasil dibuat');
    },
  });
}

/**
 * Update status tagihan (admin — untuk cash payment atau approve transfer).
 * 
 * @example
 * const { mutate: updateBill } = useUpdateBill()
 * updateBill({ id: billId, status: 'lunas', payment_method: 'tunai' })
 */
export function useUpdateBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Bill> & { id: string }) => {
      const { data, error } = await supabase
        .from('bills')
        .update({
          ...updates,
          ...(updates.status === 'lunas' ? { paid_at: new Date().toISOString() } : {}),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Bill;
    },
    onSuccess: (updatedBill) => {
      // Update cache lokal tanpa re-fetch (optimistic)
      queryClient.setQueryData(billKeys.detail(updatedBill.id), updatedBill);
      // Invalidate list untuk refresh tabel admin
      queryClient.invalidateQueries({ queryKey: billKeys.bySchool(updatedBill.school_id) });
      queryClient.invalidateQueries({ queryKey: billKeys.byStudent(updatedBill.student_id) });
      toast.success('Tagihan berhasil diperbarui');
    },
  });
}

/**
 * Bulk create tagihan untuk semua siswa di 1 sekolah (admin).
 * Berguna untuk generate tagihan SPP awal bulan.
 * 
 * @example
 * const { mutate: bulkCreateBills, isPending } = useBulkCreateBills()
 * bulkCreateBills({ school_id, month: 'Juli 2026', due_date: '2026-07-15', amount: 500000 })
 */
export function useBulkCreateBills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      school_id,
      month,
      due_date,
      amount,
    }: {
      school_id: string;
      month: string;
      due_date: string;
      amount?: number; // Jika tidak diisi, pakai spp_amount per siswa
    }) => {
      // Ambil semua siswa aktif dari sekolah ini
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, spp_amount')
        .eq('school_id', school_id)
        .eq('status', 'active');

      if (studentsError) throw studentsError;
      if (!students?.length) throw new Error('Tidak ada siswa aktif di sekolah ini');

      // Buat tagihan untuk setiap siswa
      const billsToInsert = students.map((student) => ({
        school_id,
        student_id: student.id,
        amount: amount ?? student.spp_amount,
        month,
        due_date,
        status: 'belum_bayar' as const,
      }));

      const { data, error } = await supabase
        .from('bills')
        .insert(billsToInsert)
        .select();

      if (error) throw error;
      return { created: data?.length ?? 0, bills: data };
    },
    onSuccess: ({ created }, variables) => {
      queryClient.invalidateQueries({ queryKey: billKeys.bySchool(variables.school_id) });
      toast.success(`${created} tagihan berhasil dibuat untuk bulan ${variables.month}`);
    },
  });
}
