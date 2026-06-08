-- Mengaktifkan ekstensi pg_cron jika belum aktif
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- Membuat fungsi untuk update tagihan terlambat
CREATE OR REPLACE FUNCTION update_late_bills()
RETURNS void AS $$
BEGIN
  -- Ubah status menjadi 'terlambat' untuk tagihan yang due_date-nya sudah lewat 
  -- dan statusnya masih 'belum_bayar'
  UPDATE public.bills
  SET status = 'terlambat'
  WHERE status = 'belum_bayar' 
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Jadwalkan cron job untuk berjalan setiap tengah malam (00:00) setiap hari
-- Format cron: 'menit jam tanggal bulan hari_dalam_minggu'
SELECT cron.schedule(
    'update_late_bills_daily', -- Nama job unik
    '0 0 * * *',               -- Berjalan setiap 00:00
    'SELECT update_late_bills();'
);
