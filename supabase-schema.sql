-- EduFin Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('siswa', 'sekolah', 'donatur')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    nisn VARCHAR(10) UNIQUE NOT NULL,
    school VARCHAR(255) NOT NULL,
    class VARCHAR(50) NOT NULL,
    parent_name VARCHAR(255),
    address TEXT,
    spp_amount DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(50),
    total_donated DECIMAL(12, 2) DEFAULT 0,
    campaigns_supported INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills table
CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    due_date DATE NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Lunas', 'Tertunggak', 'Belum Bayar')) DEFAULT 'Belum Bayar',
    payment_method VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bill items table
CREATE TABLE IF NOT EXISTS bill_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    purpose TEXT NOT NULL,
    period_months INT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Disetujui', 'Ditolak', 'Selesai')) DEFAULT 'Pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loan installments table
CREATE TABLE IF NOT EXISTS loan_installments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Belum Bayar', 'Lunas')) DEFAULT 'Belum Bayar',
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    story TEXT,
    target DECIMAL(12, 2) NOT NULL,
    collected DECIMAL(12, 2) DEFAULT 0,
    school VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    category VARCHAR(100),
    image TEXT,
    verified BOOLEAN DEFAULT false,
    status VARCHAR(20) CHECK (status IN ('pending', 'active', 'completed', 'rejected')) DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    message TEXT,
    anonymous BOOLEAN DEFAULT false,
    status VARCHAR(20) CHECK (status IN ('completed', 'pending', 'failed')) DEFAULT 'completed',
    donated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) CHECK (type IN ('payment', 'loan', 'campaign', 'donation', 'reminder', 'system')) NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (for audit trail)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(20) CHECK (type IN ('in', 'out')) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_nisn ON students(nisn);
CREATE INDEX IF NOT EXISTS idx_bills_student_id ON bills(student_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_loans_student_id ON loans(student_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - adjust based on your needs)
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = id::text);

-- Students can read their own data
CREATE POLICY "Students can read own data" ON students FOR SELECT USING (auth.uid()::text = user_id::text);

-- Students can read their own bills
CREATE POLICY "Students can read own bills" ON bills FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id::text = auth.uid()::text)
);

-- Students can read their own payments
CREATE POLICY "Students can read own payments" ON payments FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id::text = auth.uid()::text)
);

-- Anyone can read active campaigns
CREATE POLICY "Anyone can read active campaigns" ON campaigns FOR SELECT USING (status = 'active');

-- Donors can read their own donations
CREATE POLICY "Donors can read own donations" ON donations FOR SELECT USING (
    donor_id IN (SELECT id FROM donors WHERE user_id::text = auth.uid()::text)
);

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (user_id::text = auth.uid()::text);

-- Schools (admin) can read all data - add policies as needed
CREATE POLICY "Schools can read all students" ON students FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'sekolah')
);

CREATE POLICY "Schools can read all bills" ON bills FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'sekolah')
);

-- Insert some seed data (demo accounts)
INSERT INTO users (id, email, name, role) VALUES
    ('demo-1', 'siswa@edufin.id', 'Budi Santoso', 'siswa'),
    ('demo-2', 'sekolah@edufin.id', 'SDN 3 Malang', 'sekolah'),
    ('demo-3', 'donatur@edufin.id', 'Rudi Hermawan', 'donatur')
ON CONFLICT (email) DO NOTHING;
