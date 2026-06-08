-- Migration 0008: Enable Row Level Security (RLS)

-- 1. Enable RLS on core tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any (for idempotency)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admin and Superadmin can manage users" ON public.users;

DROP POLICY IF EXISTS "Students can view own data" ON public.students;
DROP POLICY IF EXISTS "Admin and Superadmin can manage students" ON public.students;

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admin and Superadmin can manage payments" ON public.payments;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admin and Superadmin can manage transactions" ON public.transactions;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin and Superadmin can manage notifications" ON public.notifications;

DROP POLICY IF EXISTS "Public can view active campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admin and Superadmin can manage campaigns" ON public.campaigns;

DROP POLICY IF EXISTS "Public can view active scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Admin and Superadmin can manage scholarships" ON public.scholarships;

-- 3. Create helper function for role checking to avoid recursion and make it cleaner
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS text AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'role')::text;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;


-- 4. Policies for Users Table
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admin and Superadmin can manage users" 
ON public.users FOR ALL 
USING (auth.user_role() IN ('sekolah', 'superadmin'));


-- 5. Policies for Students Table
CREATE POLICY "Students can view own data" 
ON public.students FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admin and Superadmin can manage students" 
ON public.students FOR ALL 
USING (auth.user_role() IN ('sekolah', 'superadmin'));


-- 6. Policies for Payments Table
CREATE POLICY "Users can view own payments" 
ON public.payments FOR SELECT 
USING (
  -- Bisa lihat jika student_id nya terkait dengan auth.uid()
  EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = payments.student_id AND students.user_id = auth.uid()
  )
);

CREATE POLICY "Admin and Superadmin can manage payments" 
ON public.payments FOR ALL 
USING (auth.user_role() IN ('sekolah', 'superadmin'));


-- 7. Policies for Transactions Table
CREATE POLICY "Users can view own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admin and Superadmin can manage transactions" 
ON public.transactions FOR ALL 
USING (auth.user_role() IN ('sekolah', 'superadmin'));


-- 8. Policies for Notifications Table
CREATE POLICY "Users can view own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admin and Superadmin can manage notifications" 
ON public.notifications FOR ALL 
USING (auth.user_role() IN ('sekolah', 'superadmin'));


-- 9. Policies for Campaigns Table
CREATE POLICY "Public can view active campaigns" 
ON public.campaigns FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admin and Superadmin can manage campaigns" 
ON public.campaigns FOR ALL 
USING (auth.user_role() IN ('sekolah', 'superadmin'));


-- 10. Policies for Scholarships Table
CREATE POLICY "Public can view active scholarships" 
ON public.scholarships FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admin and Superadmin can manage scholarships" 
ON public.scholarships FOR ALL 
USING (auth.user_role() IN ('sekolah', 'superadmin'));
