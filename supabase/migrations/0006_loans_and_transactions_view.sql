-- ==========================================
-- 1. TABEL PINJAMAN MIKRO (LOANS)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    purpose TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Disetujui', 'Ditolak', 'Lunas')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    installment_count INTEGER NOT NULL CHECK (installment_count > 0)
);

CREATE TABLE IF NOT EXISTS public.loan_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE NOT NULL,
    month TEXT NOT NULL,  -- misal: "Oktober 2023"
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL DEFAULT 'Belum Bayar' CHECK (status IN ('Belum Bayar', 'Lunas')),
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Mengaktifkan RLS untuk tabel pinjaman
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_installments ENABLE ROW LEVEL SECURITY;

-- Policy Loans
CREATE POLICY "Users can view their own loans" ON public.loans
FOR SELECT USING (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.school_admins sa
    JOIN public.students s ON sa.school_id = s.school_id
    WHERE sa.user_id = auth.uid() AND s.id = loans.student_id
  )
);

CREATE POLICY "Users can insert their own loans" ON public.loans
FOR INSERT WITH CHECK (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update loans" ON public.loans
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.school_admins sa
    JOIN public.students s ON sa.school_id = s.school_id
    WHERE sa.user_id = auth.uid() AND s.id = loans.student_id
  )
);

-- Policy Loan Installments
CREATE POLICY "Users can view their loan installments" ON public.loan_installments
FOR SELECT USING (
  loan_id IN (
    SELECT id FROM public.loans WHERE student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  )
  OR
  EXISTS (
    SELECT 1 FROM public.school_admins sa
    JOIN public.students s ON sa.school_id = s.school_id
    JOIN public.loans l ON l.student_id = s.id
    WHERE sa.user_id = auth.uid() AND l.id = loan_installments.loan_id
  )
);

CREATE POLICY "Admins can update installments" ON public.loan_installments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.school_admins sa
    JOIN public.students s ON sa.school_id = s.school_id
    JOIN public.loans l ON l.student_id = s.id
    WHERE sa.user_id = auth.uid() AND l.id = loan_installments.loan_id
  )
);


-- ==========================================
-- 2. MEMPERBAIKI RLS SCHOLARSHIPS
-- ==========================================
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scholarships visible to everyone" ON public.scholarships
FOR SELECT USING (true);

CREATE POLICY "Admins can manage scholarships" ON public.scholarships
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.school_admins sa WHERE sa.user_id = auth.uid() AND sa.school_id = scholarships.school_id
  )
);


-- ==========================================
-- 3. UNIFIED TRANSACTIONS VIEW
-- ==========================================
-- View ini menggabungkan bills, donations, dan loan_installments 
-- untuk memudahkan History UI.

CREATE OR REPLACE VIEW public.vw_transactions AS
SELECT 
    b.id as transaction_id,
    s.user_id as user_id,
    'out' as type,
    'SPP' as category,
    'Pembayaran SPP ' || b.month || ' ' || b.year as title,
    'Lunas' as description,
    b.amount as amount,
    b.paid_at as transaction_date,
    b.status as status,
    s.school_id
FROM public.bills b
JOIN public.students s ON b.student_id = s.id
WHERE b.status = 'lunas' AND b.paid_at IS NOT NULL

UNION ALL

SELECT 
    d.id as transaction_id,
    d.user_id as user_id,
    'in' as type,
    'Donasi' as category,
    'Donasi Kampanye: ' || c.title as title,
    'Selesai' as description,
    d.amount as amount,
    d.created_at as transaction_date,
    d.status as status,
    c.school_id
FROM public.donations d
JOIN public.campaigns c ON d.campaign_id = c.id
WHERE d.status = 'completed'

UNION ALL

SELECT 
    li.id as transaction_id,
    s.user_id as user_id,
    'out' as type,
    'Cicilan' as category,
    'Pembayaran Cicilan Pinjaman ' || li.month as title,
    'Lunas' as description,
    li.amount as amount,
    li.paid_at as transaction_date,
    li.status as status,
    s.school_id
FROM public.loan_installments li
JOIN public.loans l ON li.loan_id = l.id
JOIN public.students s ON l.student_id = s.id
WHERE li.status = 'Lunas' AND li.paid_at IS NOT NULL;
