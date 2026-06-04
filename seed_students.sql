-- ============================================================
-- STEP 1: Tambah kolom yang diperlukan ke tabel students
-- Jalankan di Supabase SQL Editor (https://app.supabase.com)
-- ============================================================

ALTER TABLE students ADD COLUMN IF NOT EXISTS registration_status TEXT DEFAULT 'data_only';
ALTER TABLE students ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ;

-- ============================================================
-- STEP 2: Seed 10 data siswa SMA Negeri 1 Jakarta
-- (data_only = hanya data, belum punya akun, bisa daftar mandiri)
-- ============================================================

INSERT INTO students (nisn, name, class, parent_name, phone, parent_phone, address, spp_amount, status, registration_status)
VALUES
  ('0012345678', 'Budi Santoso',         'X IPA 1',   'Hendra Santoso',    '081234567890', '081234567891', 'Jl. Veteran No.12, Jakarta Pusat',    725000, 'active', 'data_only'),
  ('0087654321', 'Citra Dewi Rahayu',    'X IPA 2',   'Dewi Rahayu',       '081234567892', '081234567893', 'Jl. Diponegoro No.45, Jakarta Selatan',725000, 'active', 'data_only'),
  ('0099887766', 'Ahmad Rizki Pratama',  'XI IPA 1',  'Rizki Purnama',     '081234567894', '081234567895', 'Jl. Pahlawan No.7, Jakarta Barat',    725000, 'active', 'data_only'),
  ('0011223344', 'Siti Nurhaliza',       'XI IPA 2',  'Nurhaliza Binti',   '081234567896', '081234567897', 'Jl. Sudirman No.88, Jakarta Pusat',   725000, 'active', 'data_only'),
  ('0055667788', 'Denny Setiawan',       'XI IPS 1',  'Setiawan Hadi',     '081234567898', '081234567899', 'Jl. Gatot Subroto No.23, Jakarta',    725000, 'active', 'data_only'),
  ('0033445566', 'Rina Marlina',         'XII IPA 1', 'Marlina Hasan',     '081234567810', '081234567811', 'Jl. Thamrin No.5, Jakarta Pusat',     725000, 'active', 'data_only'),
  ('0077889900', 'Farhan Hidayat',       'XII IPA 2', 'Hidayat Gunawan',   '081234567812', '081234567813', 'Jl. Kuningan No.11, Jakarta Selatan', 725000, 'active', 'data_only'),
  ('0044556677', 'Maya Anggraini',       'XII IPS 1', 'Anggraini Putri',   '081234567814', '081234567815', 'Jl. Rasuna Said No.19, Jakarta',      725000, 'active', 'data_only'),
  ('0066778899', 'Rizal Firmansyah',     'X IPS 1',   'Firmansyah Rudi',   '081234567816', '081234567817', 'Jl. HR Rasuna No.31, Jakarta Selatan', 725000, 'active', 'data_only'),
  ('0088990011', 'Laila Fitriani',       'X IPS 2',   'Fitriani Surya',    '081234567818', '081234567819', 'Jl. Kebon Jeruk No.8, Jakarta Barat', 725000, 'active', 'data_only')
ON CONFLICT (nisn) DO NOTHING;

-- ============================================================
-- STEP 3: Verifikasi data berhasil masuk
-- ============================================================
SELECT nisn, name, class, registration_status FROM students ORDER BY class, name;
