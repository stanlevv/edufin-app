-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel users (Sinkron dengan auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('siswa', 'sekolah', 'donatur')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger untuk otomatis menambahkan user ke public.users saat register
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'role'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Tabel students
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nisn TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Diklaim nanti
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    spp_amount INTEGER NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Admin yg membuat
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel payments (Pembayaran SPP)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    month_paid TEXT NOT NULL,
    year_paid INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel campaigns (Kampanye Donasi)
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_amount INTEGER NOT NULL,
    collected_amount INTEGER DEFAULT 0 NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel donations (Donasi)
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
    donor_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Bisa null jika anonim total
    amount INTEGER NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabel scholarships (Beasiswa)
CREATE TABLE public.scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    amount_per_month INTEGER NOT NULL,
    total_months INTEGER NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabel scholarship_recipients
CREATE TABLE public.scholarship_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('active', 'graduated', 'terminated')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabel notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('payment', 'donation', 'system', 'campaign')) NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tabel transactions (Laporan Keuangan Global)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    type TEXT CHECK (type IN ('in', 'out')) NOT NULL,
    category TEXT CHECK (category IN ('SPP', 'Donasi', 'Pencairan Beasiswa')) NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TRIGGERS & FUNCTIONS

-- A. Trigger: Saat Tagihan SPP dibayar ('completed'), catat ke Transactions dan Notifications
CREATE OR REPLACE FUNCTION handle_payment_completed()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Hanya jalankan jika status berubah menjadi completed
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        
        -- Dapatkan user_id dari siswa yang membayar
        SELECT user_id INTO v_user_id FROM public.students WHERE id = NEW.student_id;
        
        -- 1. Buat Notifikasi untuk siswa
        IF v_user_id IS NOT NULL THEN
            INSERT INTO public.notifications (user_id, title, message, type)
            VALUES (
                v_user_id, 
                'Pembayaran Berhasil', 
                'Terima kasih, pembayaran SPP bulan ' || NEW.month_paid || ' ' || NEW.year_paid || ' sebesar Rp ' || NEW.amount || ' telah berhasil dikonfirmasi.', 
                'payment'
            );
        END IF;

        -- 2. Buat Notifikasi untuk Admin (Sekolah)
        INSERT INTO public.notifications (user_id, title, message, type)
        SELECT id, 'Pemasukan SPP Baru', 'SPP bulan ' || NEW.month_paid || ' telah dibayar sebesar Rp ' || NEW.amount, 'payment'
        FROM public.users WHERE role = 'sekolah' LIMIT 1;

        -- 3. Catat di Transactions (Pemasukan SPP)
        INSERT INTO public.transactions (user_id, type, category, amount, description)
        VALUES (v_user_id, 'in', 'SPP', NEW.amount, 'Pembayaran SPP Bulan ' || NEW.month_paid || ' ' || NEW.year_paid);
        
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_payment_status_change
    AFTER INSERT OR UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION handle_payment_completed();


-- B. Trigger: Saat Donasi dibayar ('completed'), catat ke Campaigns, Transactions, dan Notifications
CREATE OR REPLACE FUNCTION handle_donation_completed()
RETURNS TRIGGER AS $$
DECLARE
    v_campaign_title TEXT;
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        
        -- Dapatkan judul kampanye
        SELECT title INTO v_campaign_title FROM public.campaigns WHERE id = NEW.campaign_id;

        -- 1. Update total terkumpul di tabel campaigns
        UPDATE public.campaigns 
        SET collected_amount = collected_amount + NEW.amount 
        WHERE id = NEW.campaign_id;

        -- 2. Buat Notifikasi untuk Donatur (jika punya akun)
        IF NEW.donor_id IS NOT NULL THEN
            INSERT INTO public.notifications (user_id, title, message, type)
            VALUES (
                NEW.donor_id, 
                'Donasi Berhasil', 
                'Terima kasih! Donasi sebesar Rp ' || NEW.amount || ' untuk kampanye "' || v_campaign_title || '" telah diterima.', 
                'donation'
            );
        END IF;

        -- 3. Catat di Transactions (Pemasukan Donasi)
        INSERT INTO public.transactions (user_id, type, category, amount, description)
        VALUES (NEW.donor_id, 'in', 'Donasi', NEW.amount, 'Donasi untuk kampanye: ' || v_campaign_title);
        
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_donation_status_change
    AFTER INSERT OR UPDATE ON public.donations
    FOR EACH ROW EXECUTE FUNCTION handle_donation_completed();


-- SECURITY & RLS (Row Level Security)
-- Matikan pembatasan RLS agar aplikasi dapat dibaca/ditulis dengan mudah pada tahap development awal
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_recipients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
