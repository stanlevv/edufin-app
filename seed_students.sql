-- ============================================================
-- JALANKAN INI DI SUPABASE SQL EDITOR
-- ============================================================

-- Step 1: Tambah kolom baru yang diperlukan
ALTER TABLE students ADD COLUMN IF NOT EXISTS registration_status TEXT DEFAULT 'data_only';
ALTER TABLE students ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ;

-- Step 2: Pastikan RLS dimatikan (jika belum)
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;

-- Step 3: Insert 10 siswa (HANYA kolom yang ada di tabel)
INSERT INTO students (nisn, name, class, parent_name, spp_amount, status, registration_status)
VALUES
  ('0012345678', 'Budi Santoso',          'X IPA 1',   'Hendra Santoso',   725000, 'active', 'data_only'),
  ('0087654321', 'Citra Dewi Rahayu',     'X IPA 2',   'Dewi Rahayu',      725000, 'active', 'data_only'),
  ('0099887766', 'Ahmad Rizki Pratama',   'XI IPA 1',  'Rizki Purnama',    725000, 'active', 'data_only'),
  ('0011223344', 'Siti Nurhaliza',        'XI IPA 2',  'Nurhaliza Binti',  725000, 'active', 'data_only'),
  ('0055667788', 'Denny Setiawan',        'XI IPS 1',  'Setiawan Hadi',    725000, 'active', 'data_only'),
  ('0033445566', 'Rina Marlina',          'XII IPA 1', 'Marlina Hasan',    725000, 'active', 'data_only'),
  ('0077889900', 'Farhan Hidayat',        'XII IPA 2', 'Hidayat Gunawan',  725000, 'active', 'data_only'),
  ('0044556677', 'Maya Anggraini',        'XII IPS 1', 'Anggraini Putri',  725000, 'active', 'data_only'),
  ('0066778899', 'Rizal Firmansyah',      'X IPS 1',   'Firmansyah Rudi',  725000, 'active', 'data_only'),
  ('0088990011', 'Laila Fitriani',        'X IPS 2',   'Fitriani Surya',   725000, 'active', 'data_only')
ON CONFLICT (nisn) DO NOTHING;

-- Step 4: Verifikasi
SELECT name, class, registration_status FROM students ORDER BY class, name;
