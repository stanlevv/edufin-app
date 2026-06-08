-- Migration 0010: Fix OAuth Trigger for Default Role and Conflict

-- Mengganti trigger handle_new_user agar memberikan role 'donatur' jika login via Google (OAuth)
-- dan menghindari bentrok saat proses create_tenant_and_admin

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  v_role text;
  v_name text;
BEGIN
  -- Ambil data dari metadata
  v_role := new.raw_user_meta_data->>'role';
  
  -- Jika role kosong (seperti pada pendaftaran Google OAuth), set default ke 'donatur'
  IF v_role IS NULL THEN
    v_role := 'donatur';
  END IF;

  -- Ambil nama, jika kosong gunakan bagian depan email
  v_name := new.raw_user_meta_data->>'name';
  IF v_name IS NULL THEN
    v_name := split_part(new.email, '@', 1);
  END IF;

  -- Lakukan insert ke tabel public.users
  -- Gunakan ON CONFLICT DO NOTHING untuk mencegah duplicate key jika 
  -- pengguna sudah dimasukkan secara manual (misal oleh fungsi RPC admin)
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, v_name, v_role)
  ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
