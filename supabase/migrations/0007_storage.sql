-- ==========================================
-- SUPABASE STORAGE FOR UPLOADS
-- ==========================================

-- Pastikan bucket "uploads" ada
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policies agar user bisa membaca file publik
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

-- Policies agar user yang login bisa upload gambar
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'uploads' 
    AND auth.role() = 'authenticated'
);

-- Policies agar user bisa update gambar miliknya sendiri (atau admin)
CREATE POLICY "Users can update their own objects" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'uploads' 
    AND owner = auth.uid()
);

-- Policies agar user bisa hapus gambar miliknya sendiri
CREATE POLICY "Users can delete their own objects" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'uploads' 
    AND owner = auth.uid()
);
