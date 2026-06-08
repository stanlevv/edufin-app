-- ================================================================
-- Migration: 0004_superadmin_role.sql
-- Tujuan:
--   1. Tambah role 'superadmin' ke tabel public.users
--   2. Buat tabel admin_audit_logs (log aktivitas super admin)
--   3. Buat fungsi helper is_super_admin() untuk RLS
--   4. Insert contoh akun super admin (gunakan Supabase Auth dashboard)
--   5. Update trigger handle_new_user agar support role superadmin
--
-- ⚠️  JALANKAN DI SUPABASE SQL EDITOR
-- ⚠️  Setelah menjalankan SQL ini:
--      - Buat user superadmin via Supabase Dashboard → Auth → Users → Add user
--      - Set email: superadmin@edufin.id, password sesuai keinginan
--      - Lalu jalankan query INSERT di bawah untuk set role-nya
-- ================================================================

-- ----------------------------------------------------------------
-- BAGIAN 1: UPDATE CONSTRAINT ROLE DI public.users
-- Tambah 'superadmin' ke daftar role yang diizinkan
-- ----------------------------------------------------------------
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('siswa', 'sekolah', 'donatur', 'superadmin'));

-- ----------------------------------------------------------------
-- BAGIAN 2: TABEL ADMIN_AUDIT_LOGS
-- Mencatat semua aktivitas kritis yang dilakukan super admin
-- (login, hapus data, ubah sekolah, dll)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action      TEXT NOT NULL,          -- 'LOGIN', 'DELETE_SCHOOL', 'SUSPEND_USER', dll
    target_type TEXT,                   -- 'school', 'user', 'campaign', dll
    target_id   TEXT,                   -- ID entitas yang diubah
    detail      JSONB DEFAULT '{}',     -- Informasi tambahan (before/after, IP, dll)
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index agar log bisa diquery cepat per admin
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id
    ON public.admin_audit_logs(admin_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON public.admin_audit_logs(action, created_at DESC);

-- ----------------------------------------------------------------
-- BAGIAN 3: UPDATE TRIGGER handle_new_user
-- Agar trigger tidak gagal saat insert user dengan role 'superadmin'
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
BEGIN
  -- Ambil role dari metadata; default ke 'donatur' jika kosong
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'donatur');

  -- Validasi role (jangan izinkan nilai arbitrary masuk)
  IF v_role NOT IN ('siswa', 'sekolah', 'donatur', 'superadmin') THEN
    v_role := 'donatur';
  END IF;

  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    v_role
  )
  ON CONFLICT (id) DO UPDATE
    SET role = EXCLUDED.role,
        name = EXCLUDED.name;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------
-- BAGIAN 4: HELPER FUNCTION — is_super_admin()
-- Digunakan oleh RLS policies untuk cek role superadmin
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
      AND role = 'superadmin'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ----------------------------------------------------------------
-- BAGIAN 5: RLS untuk tabel admin_audit_logs
-- Hanya super admin yang bisa read/write
-- ----------------------------------------------------------------
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_super_admin_only" ON public.admin_audit_logs
    FOR ALL USING (public.is_super_admin());

-- ----------------------------------------------------------------
-- BAGIAN 6: RLS UPDATE — Super admin bisa akses semua data
-- Update policies yang sudah ada agar super admin tidak terblokir
-- ----------------------------------------------------------------

-- Super admin bisa lihat semua users
DROP POLICY IF EXISTS "users_super_admin_all" ON public.users;
CREATE POLICY "users_super_admin_all" ON public.users
    FOR ALL USING (public.is_super_admin());

-- Super admin bisa lihat semua students lintas sekolah
DROP POLICY IF EXISTS "students_super_admin_all" ON public.students;
CREATE POLICY "students_super_admin_all" ON public.students
    FOR ALL USING (public.is_super_admin());

-- Super admin bisa lihat semua transactions
DROP POLICY IF EXISTS "transactions_super_admin_all" ON public.transactions;
CREATE POLICY "transactions_super_admin_all" ON public.transactions
    FOR ALL USING (public.is_super_admin());

-- ----------------------------------------------------------------
-- BAGIAN 7: INSERT SUPER ADMIN USER
--
-- ⚠️  LANGKAH MANUAL:
--   1. Buka Supabase Dashboard → Authentication → Users → Add user
--   2. Email: superadmin@edufin.id
--   3. Password: (pilih password kuat)
--   4. Setelah user dibuat, ambil UUID-nya dari dashboard
--   5. Jalankan query berikut di SQL Editor (ganti UUID sebenarnya):
--
--   UPDATE public.users
--   SET role = 'superadmin',
--       name = 'Super Admin EduFin'
--   WHERE email = 'superadmin@edufin.id';
--
-- Atau jika user belum ada di public.users (trigger belum jalan):
--
--   INSERT INTO public.users (id, email, name, role)
--   VALUES (
--     '<UUID-dari-auth.users>',
--     'superadmin@edufin.id',
--     'Super Admin EduFin',
--     'superadmin'
--   )
--   ON CONFLICT (id) DO UPDATE SET role = 'superadmin';
--
-- ----------------------------------------------------------------

-- ================================================================
-- SELESAI! Summary:
-- ✅ Role 'superadmin' ditambahkan ke constraint public.users
-- ✅ Tabel admin_audit_logs untuk tracking aktivitas admin
-- ✅ Fungsi is_super_admin() untuk RLS checks
-- ✅ Trigger handle_new_user diperbarui (support superadmin)
-- ✅ RLS policies: super admin bisa akses semua data
-- ================================================================
