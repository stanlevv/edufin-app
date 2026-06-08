-- ================================================================
-- Migration: 0003_multi_tenant_and_indexes.sql
-- Tujuan:
--   1. Tambah tabel 'schools' sebagai master tenant
--   2. Tambah school_id ke semua tabel utama
--   3. Update RLS policies untuk isolasi data antar sekolah
--   4. Tambah indexes untuk performa di skala besar
--   5. Tambah tabel pendukung (school_admins, whatsapp_queue, bills)
-- 
-- ⚠️  JALANKAN DI SUPABASE SQL EDITOR
-- ⚠️  Backup database sebelum menjalankan migration ini!
-- ================================================================

-- ----------------------------------------------------------------
-- BAGIAN 1: TABEL SCHOOLS (Master Tenant)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    npsn TEXT UNIQUE NOT NULL,                    -- Nomor Pokok Sekolah Nasional (8 digit)
    name TEXT NOT NULL,
    address TEXT,
    city TEXT NOT NULL DEFAULT 'Malang',
    province TEXT NOT NULL DEFAULT 'Jawa Timur',
    level TEXT CHECK (level IN ('sd', 'smp', 'sma', 'smk')) NOT NULL DEFAULT 'sd',
    logo_url TEXT,                                -- URL logo dari Supabase Storage
    bank_name TEXT,                               -- Untuk disbursement donasi
    bank_account_number TEXT,
    bank_account_name TEXT,
    xendit_account_id TEXT,                       -- Untuk Xendit disbursement
    status TEXT CHECK (status IN ('active', 'suspended')) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert sekolah pilot (SDN 3 Malang)
INSERT INTO public.schools (npsn, name, city, level, status)
VALUES ('20534812', 'SDN 3 Malang', 'Malang', 'sd', 'active')
ON CONFLICT (npsn) DO NOTHING;

-- ----------------------------------------------------------------
-- BAGIAN 2: TABEL SCHOOL_ADMINS (Multi-admin per sekolah)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',                    -- Jabatan: bendahara, kepala sekolah, dll
    permissions JSONB DEFAULT '{
        "students": true,
        "bills": true,
        "campaigns": true,
        "reports": true,
        "settings": false
    }'::jsonb NOT NULL,
    is_super_admin BOOLEAN DEFAULT false,         -- EDUFIN super admin (lintas sekolah)
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, school_id)
);

-- ----------------------------------------------------------------
-- BAGIAN 3: TABEL BILLS (Tagihan SPP per bulan)
-- ----------------------------------------------------------------
-- Tabel 'payments' yang ada hanya mencatat transaksi,
-- bukan tagihan. Kita perlu tabel 'bills' yang represent tagihan.
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    late_fee INTEGER DEFAULT 0 NOT NULL,
    month TEXT NOT NULL,                          -- "Juni 2026"
    due_date DATE NOT NULL,
    status TEXT CHECK (status IN ('belum_bayar', 'lunas', 'terlambat', 'cicilan')) 
           DEFAULT 'belum_bayar' NOT NULL,
    payment_method TEXT,                          -- 'qris', 'va_bca', 'gopay', 'tunai', dll
    xendit_invoice_id TEXT,
    xendit_payment_url TEXT,
    transfer_proof_url TEXT,                      -- Bukti transfer manual
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------
-- BAGIAN 4: TABEL WHATSAPP_QUEUE (Antrian WA agar tidak rate-limit)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.whatsapp_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_phone TEXT NOT NULL,
    message TEXT NOT NULL,
    event_type TEXT NOT NULL,                     -- 'payment_success', 'payment_reminder', dll
    priority INTEGER DEFAULT 0 NOT NULL,          -- 0=normal, 10=urgent (dibayar dulu)
    status TEXT CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending' NOT NULL,
    retry_count INTEGER DEFAULT 0 NOT NULL,
    error_message TEXT,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    sent_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------
-- BAGIAN 5: TAMBAH SCHOOL_ID KE TABEL YANG SUDAH ADA
-- ----------------------------------------------------------------

-- 5a. Tambah school_id ke tabel students
ALTER TABLE public.students
    ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS parent_email TEXT,
    ADD COLUMN IF NOT EXISTS parent_phone TEXT,
    ADD COLUMN IF NOT EXISTS grade INTEGER,
    ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2025/2026',
    ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS invite_accepted_at TIMESTAMPTZ;

-- Isi school_id untuk data existing (SDN 3 Malang)
UPDATE public.students
SET school_id = (SELECT id FROM public.schools WHERE npsn = '20534812' LIMIT 1)
WHERE school_id IS NULL;

-- Setelah data diisi, baru enforce NOT NULL
-- ALTER TABLE public.students ALTER COLUMN school_id SET NOT NULL;
-- ⚠️ Uncomment baris di atas setelah semua data existing sudah punya school_id

-- 5b. Tambah school_id ke tabel campaigns
ALTER TABLE public.campaigns
    ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
    ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Update status enum campaigns (tambah 'pending', 'rejected', 'suspended')
-- Untuk PostgreSQL, kita perlu update constraint
ALTER TABLE public.campaigns 
    DROP CONSTRAINT IF EXISTS campaigns_status_check;
ALTER TABLE public.campaigns 
    ADD CONSTRAINT campaigns_status_check 
    CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'rejected', 'suspended'));

-- Isi school_id untuk data existing
UPDATE public.campaigns
SET school_id = (SELECT id FROM public.schools WHERE npsn = '20534812' LIMIT 1)
WHERE school_id IS NULL;

-- 5c. Tambah school_id ke tabel notifications
ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS action_url TEXT,
    ADD COLUMN IF NOT EXISTS category TEXT;

-- 5d. Tambah school_id ke tabel transactions
ALTER TABLE public.transactions
    ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;

-- ----------------------------------------------------------------
-- BAGIAN 6: DATABASE INDEXES (Performa skala besar)
-- ----------------------------------------------------------------
-- CONCURRENTLY = tidak lock tabel saat membuat index (aman untuk production)

-- Index untuk schools
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_schools_status 
    ON public.schools(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_schools_npsn 
    ON public.schools(npsn);

-- Index untuk students (query paling sering: per sekolah, per kelas)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_school_id 
    ON public.students(school_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_nisn 
    ON public.students(nisn);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_user_id 
    ON public.students(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_school_class 
    ON public.students(school_id, class);        -- Filter per kelas dalam 1 sekolah
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_status 
    ON public.students(status);

-- Index untuk bills (tagihan)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bills_school_id 
    ON public.bills(school_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bills_student_id 
    ON public.bills(student_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bills_status 
    ON public.bills(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bills_school_status 
    ON public.bills(school_id, status);          -- Dashboard: outstanding per sekolah
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bills_due_date 
    ON public.bills(due_date) WHERE status = 'belum_bayar'; -- Partial index untuk reminder

-- Index untuk payments (transaksi SPP lama)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_student_id 
    ON public.payments(student_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_status 
    ON public.payments(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_created_at 
    ON public.payments(created_at DESC);         -- Sorting by newest

-- Index untuk campaigns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_school_id 
    ON public.campaigns(school_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_status 
    ON public.campaigns(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_school_status 
    ON public.campaigns(school_id, status);      -- Admin: campaigns per sekolah per status

-- Index untuk donations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_donations_campaign_id 
    ON public.donations(campaign_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_donations_donor_id 
    ON public.donations(donor_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_donations_status 
    ON public.donations(status);

-- Index untuk notifications (paling sering diquery: unread per user)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_id 
    ON public.notifications(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_unread 
    ON public.notifications(user_id, read) WHERE read = false; -- Partial index: hanya unread

-- Index untuk whatsapp_queue (proses antrian: pending dulu, priority tertinggi dulu)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_whatsapp_queue_status_priority 
    ON public.whatsapp_queue(status, priority DESC) WHERE status = 'pending';

-- ----------------------------------------------------------------
-- BAGIAN 7: ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------
-- Enable RLS untuk semua tabel (matikan saat development jika perlu)

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_queue ENABLE ROW LEVEL SECURITY;

-- Helper function: ambil school_id dari JWT claims
CREATE OR REPLACE FUNCTION auth.school_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() ->> 'school_id')::UUID;
$$ LANGUAGE SQL STABLE;

-- Helper function: cek apakah user adalah super admin
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE((auth.jwt() ->> 'is_super_admin')::BOOLEAN, false);
$$ LANGUAGE SQL STABLE;

-- RLS Policy: Schools
-- Semua user bisa lihat sekolah aktif (untuk halaman publik donatur)
CREATE POLICY "schools_public_read" ON public.schools
    FOR SELECT USING (status = 'active');

-- Hanya super admin yang bisa modify sekolah
CREATE POLICY "schools_super_admin_all" ON public.schools
    FOR ALL USING (auth.is_super_admin());

-- RLS Policy: Students
-- Admin sekolah bisa lihat semua siswa sekolahnya
CREATE POLICY "students_school_admin_read" ON public.students
    FOR SELECT USING (
        auth.is_super_admin()
        OR school_id = auth.school_id()
    );

-- Orang tua hanya bisa lihat data anaknya sendiri
CREATE POLICY "students_parent_own_read" ON public.students
    FOR SELECT USING (user_id = auth.uid());

-- Hanya admin sekolah yang bisa CRUD students
CREATE POLICY "students_school_admin_write" ON public.students
    FOR ALL USING (
        auth.is_super_admin()
        OR school_id = auth.school_id()
    );

-- RLS Policy: Bills
CREATE POLICY "bills_school_admin_all" ON public.bills
    FOR ALL USING (
        auth.is_super_admin()
        OR school_id = auth.school_id()
    );

-- Siswa/orang tua bisa lihat tagihan mereka sendiri
CREATE POLICY "bills_student_own_read" ON public.bills
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- RLS Policy: Campaigns
-- Public: semua bisa lihat campaign yang active
CREATE POLICY "campaigns_public_read" ON public.campaigns
    FOR SELECT USING (status IN ('active', 'completed'));

-- Admin sekolah bisa lihat semua campaign sekolahnya
CREATE POLICY "campaigns_school_admin_all" ON public.campaigns
    FOR ALL USING (
        auth.is_super_admin()
        OR school_id = auth.school_id()
    );

-- Siswa bisa buat dan lihat campaign miliknya
CREATE POLICY "campaigns_student_own" ON public.campaigns
    FOR ALL USING (
        created_by = auth.uid()
        OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    );

-- RLS Policy: Donations
-- Semua bisa membuat donasi (termasuk guest checkout via edge function)
CREATE POLICY "donations_insert_public" ON public.donations
    FOR INSERT WITH CHECK (true);

-- Hanya donor yang bisa lihat donasi mereka sendiri
CREATE POLICY "donations_donor_own_read" ON public.donations
    FOR SELECT USING (donor_id = auth.uid());

-- Admin sekolah bisa lihat semua donasi untuk campaign sekolahnya
CREATE POLICY "donations_school_admin_read" ON public.donations
    FOR SELECT USING (
        auth.is_super_admin()
        OR campaign_id IN (
            SELECT id FROM public.campaigns WHERE school_id = auth.school_id()
        )
    );

-- RLS Policy: Notifications (user hanya lihat notif miliknya)
CREATE POLICY "notifications_own_read" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_own_update" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policy: WhatsApp Queue (hanya service role yang bisa akses)
CREATE POLICY "whatsapp_queue_service_only" ON public.whatsapp_queue
    FOR ALL USING (auth.is_super_admin());

-- ----------------------------------------------------------------
-- BAGIAN 8: UPDATED_AT TRIGGER (auto-update timestamp)
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON public.schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_bills_updated_at
    BEFORE UPDATE ON public.bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- SELESAI! Summary:
-- ✅ Tabel schools (master tenant)
-- ✅ Tabel school_admins (multi-admin per sekolah)
-- ✅ Tabel bills (tagihan SPP)
-- ✅ Tabel whatsapp_queue (antrian WA)
-- ✅ school_id ditambahkan ke: students, campaigns, notifications, transactions
-- ✅ 20+ database indexes untuk performa
-- ✅ RLS policies untuk isolasi data antar sekolah
-- ================================================================
