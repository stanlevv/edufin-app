-- ==========================================
-- SUPABASE SCHEMA V2 - EDUFIN
-- ==========================================

-- 1. Tabel Micro Loans (Pinjaman Mikro dari Kas Sekolah)
CREATE TABLE IF NOT EXISTS micro_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    requested_amount NUMERIC NOT NULL,
    purpose TEXT NOT NULL,
    tenor_months INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    rejection_reason TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Siswa hanya bisa lihat pinjaman mereka sendiri, admin bisa lihat semua
ALTER TABLE micro_loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Siswa dapat melihat pinjaman sendiri" ON micro_loans
    FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Siswa dapat membuat pinjaman" ON micro_loans
    FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admin dapat melihat dan update semua pinjaman" ON micro_loans
    FOR ALL USING (auth.jwt() ->> 'role' = 'sekolah');

-- 2. Tabel Campaign Updates (Feed Transparansi)
CREATE TABLE IF NOT EXISTS campaign_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    receipt_amount NUMERIC NOT NULL,
    is_verified_by_school BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Public bisa lihat, siswa pembuat campaign bisa insert
ALTER TABLE campaign_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publik dapat melihat update campaign" ON campaign_updates
    FOR SELECT USING (true);
CREATE POLICY "Siswa pemilik campaign dapat insert" ON campaign_updates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = campaign_updates.campaign_id 
            AND campaigns.student_id = auth.uid()
        )
    );
CREATE POLICY "Admin dapat update status verifikasi" ON campaign_updates
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'sekolah');

-- 3. Update Storage Bucket
-- (Dijalankan via Supabase Dashboard atau Storage API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('feed_updates', 'feed_updates', true);
-- CREATE POLICY "Public read feed_updates" ON storage.objects FOR SELECT USING (bucket_id = 'feed_updates');
-- CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'feed_updates' AND auth.role() = 'authenticated');
