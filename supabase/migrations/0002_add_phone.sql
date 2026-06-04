-- Migration: Add phone and parent_phone to students table

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS parent_phone TEXT;
