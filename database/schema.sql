-- ============================================================================
-- EDUFIN DATABASE SCHEMA (Single School - Simplified)
-- Untuk 1 sekolah saja, tidak perlu multi-tenant logic
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: users (Gabungan semua role)
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'donor', 'admin')),
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb, -- Data custom per role
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- TABLE: students (Data siswa)
-- ============================================================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nisn TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  class TEXT NOT NULL, -- "XII IPA 2"
  grade_level INTEGER NOT NULL, -- 10, 11, 12 (untuk SD: 1-6)
  enrollment_year INTEGER NOT NULL, -- 2024
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_students_nisn ON students(nisn);

-- ============================================================================
-- TABLE: bills (Tagihan SPP)
-- ============================================================================
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  month_year DATE NOT NULL, -- '2026-04-01' untuk April 2026
  amount NUMERIC(12,2) NOT NULL,
  breakdown JSONB NOT NULL, -- { spp: 500000, lab: 125000, library: 75000, activities: 150000 }
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'installment', 'deferred')),
  paid_at TIMESTAMPTZ,
  payment_method TEXT, -- 'qris', 'va', 'bank_transfer'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bills_student ON bills(student_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_month_year ON bills(month_year);

-- ============================================================================
-- TABLE: payments (Transaksi pembayaran)
-- ============================================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id), -- Yang bayar (parent)
  amount NUMERIC(12,2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('full', 'installment', 'deferred')),
  payment_method TEXT NOT NULL, -- 'qris', 'va', 'bank_transfer'
  installment_plan JSONB, -- { total: 3, current: 1, schedule: [...] }
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  gateway_ref TEXT, -- Reference ID dari payment gateway
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_bill ON payments(bill_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================================
-- TABLE: campaigns (Kampanye donasi)
-- ============================================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reason TEXT NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL,
  collected_amount NUMERIC(12,2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'rejected')),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL, -- Opsional, jika untuk siswa tertentu
  cover_image_url TEXT,
  verified_by UUID REFERENCES users(id), -- Admin yang verifikasi
  verified_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) NOT NULL, -- Bisa parent/admin
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);

-- ============================================================================
-- TABLE: donations (Donasi ke kampanye)
-- ============================================================================
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES users(id), -- NULL jika anonim/guest
  amount NUMERIC(12,2) NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  gateway_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);

-- ============================================================================
-- TABLE: aid_requests (Pengajuan bantuan SPP)
-- ============================================================================
CREATE TABLE aid_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  requested_amount NUMERIC(12,2) NOT NULL,
  approved_amount NUMERIC(12,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'disbursed')),
  reviewed_by UUID REFERENCES users(id), -- Admin
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aid_requests_student ON aid_requests(student_id);
CREATE INDEX idx_aid_requests_status ON aid_requests(status);

-- ============================================================================
-- TABLE: support_tickets (Form bantuan IT)
-- ============================================================================
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bug', 'password', 'payment', 'data', 'feature', 'other')),
  description TEXT NOT NULL,
  attachment_url TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- ============================================================================
-- TRIGGERS: Updated_at auto-update
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bills_updated_at BEFORE UPDATE ON bills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER aid_requests_updated_at BEFORE UPDATE ON aid_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Basic setup
-- ============================================================================
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE aid_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Admin dapat akses semua data
CREATE POLICY admin_all_access ON users FOR ALL USING (role = 'admin');
CREATE POLICY admin_all_students ON students FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
-- ... (lanjutkan untuk tabel lainnya jika perlu)

-- ============================================================================
-- SEED DATA (Demo/Testing)
-- ============================================================================
-- Demo admin account
INSERT INTO users (id, email, password_hash, role, name, phone, metadata) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@sdn3malang.sch.id', '$2a$10$demohashdemo', 'admin', 'Admin SDN 3', '081234567890', '{}');

-- Demo parent account
INSERT INTO users (id, email, password_hash, role, name, phone, metadata) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 'parent@demo.id', '$2a$10$demohashdemo', 'parent', 'Hendra Santoso', '081234567891', '{}');

-- Demo student
INSERT INTO students (id, parent_id, nisn, name, class, grade_level, enrollment_year, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '0012345678', 'Budi Santoso', 'XII IPA 2', 12, 2023, 'active');

-- Demo bill
INSERT INTO bills (id, student_id, month_year, amount, breakdown, due_date, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '2026-04-01', 850000, '{"spp":500000,"lab":125000,"library":75000,"activities":150000}', '2026-04-10', 'pending');
