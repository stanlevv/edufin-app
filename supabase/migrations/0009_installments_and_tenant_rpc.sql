-- Add columns for installments to bills table
ALTER TABLE bills 
ADD COLUMN IF NOT EXISTS installment_status text CHECK (installment_status IN ('none', 'pending', 'approved', 'rejected')) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS installment_type text, -- '2x' or '3x'
ADD COLUMN IF NOT EXISTS installment_reason text;

-- RPC to create a new tenant (school) and its first admin securely
-- This bypasses the normal signup flow by inserting directly into auth.users 
-- (Only available because this function runs with SECURITY DEFINER)
CREATE OR REPLACE FUNCTION create_tenant_and_admin(
    p_npsn text,
    p_name text,
    p_level text,
    p_city text,
    p_address text,
    p_admin_name text,
    p_admin_email text,
    p_admin_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_school_id uuid;
    v_user_id uuid;
    v_encrypted_password text;
BEGIN
    -- 1. Insert School
    INSERT INTO schools (npsn, name, level, city, address)
    VALUES (p_npsn, p_name, p_level, p_city, p_address)
    RETURNING id INTO v_school_id;

    -- 2. Create User in auth.users (simulating signup)
    -- Supabase uses bcrypt for passwords
    -- Note: Since pgcrypto is required, ensure it is enabled: CREATE EXTENSION IF NOT EXISTS pgcrypto;
    v_encrypted_password := crypt(p_admin_password, gen_salt('bf'));

    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', p_admin_email, v_encrypted_password, now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        jsonb_build_object('name', p_admin_name, 'role', 'sekolah'),
        now(), now()
    )
    RETURNING id INTO v_user_id;

    -- 3. Insert into public.users
    INSERT INTO users (id, email, role, name)
    VALUES (v_user_id, p_admin_email, 'sekolah', p_admin_name);

    -- 4. Insert into school_admins
    INSERT INTO school_admins (user_id, school_id)
    VALUES (v_user_id, v_school_id);

    RETURN json_build_object(
        'success', true,
        'school_id', v_school_id,
        'user_id', v_user_id
    );
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;
