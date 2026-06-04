// Seed script - jalankan dengan: node seed_supabase.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pxqamlbdamrkwrdnbhmf.supabase.co';
// Gunakan service role key agar bisa bypass RLS
// Cari di Supabase Dashboard > Settings > API > service_role key
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Set environment variable SUPABASE_SERVICE_KEY terlebih dahulu');
  console.error('   Cari di: https://app.supabase.com > Settings > API > service_role (secret)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const students = [
  { nisn: '0012345678', name: 'Budi Santoso',       class: 'X IPA 1',   parent_name: 'Hendra Santoso',   phone: '081234567890', parent_phone: '081234567891', address: 'Jl. Veteran No.12, Jakarta Pusat',     spp_amount: 725000, status: 'active', registration_status: 'data_only' },
  { nisn: '0087654321', name: 'Citra Dewi Rahayu',  class: 'X IPA 2',   parent_name: 'Dewi Rahayu',      phone: '081234567892', parent_phone: '081234567893', address: 'Jl. Diponegoro No.45, Jakarta Selatan', spp_amount: 725000, status: 'active', registration_status: 'data_only' },
  { nisn: '0099887766', name: 'Ahmad Rizki Pratama',class: 'XI IPA 1',  parent_name: 'Rizki Purnama',    phone: '081234567894', parent_phone: '081234567895', address: 'Jl. Pahlawan No.7, Jakarta Barat',     spp_amount: 725000, status: 'active', registration_status: 'data_only' },
  { nisn: '0011223344', name: 'Siti Nurhaliza',     class: 'XI IPA 2',  parent_name: 'Nurhaliza Binti',  phone: '081234567896', parent_phone: '081234567897', address: 'Jl. Sudirman No.88, Jakarta Pusat',    spp_amount: 725000, status: 'active', registration_status: 'data_only' },
  { nisn: '0055667788', name: 'Denny Setiawan',     class: 'XI IPS 1',  parent_name: 'Setiawan Hadi',    phone: '081234567898', parent_phone: '081234567899', address: 'Jl. Gatot Subroto No.23, Jakarta',     spp_amount: 725000, status: 'active', registration_status: 'data_only' },
  { nisn: '0033445566', name: 'Rina Marlina',       class: 'XII IPA 1', parent_name: 'Marlina Hasan',    phone: '081234567810', parent_phone: '081234567811', address: 'Jl. Thamrin No.5, Jakarta Pusat',      spp_amount: 725000, status: 'active', registration_status: 'data_only' },
  { nisn: '0077889900', name: 'Farhan Hidayat',     class: 'XII IPA 2', parent_name: 'Hidayat Gunawan',  phone: '081234567812', parent_phone: '081234567813', address: 'Jl. Kuningan No.11, Jakarta Selatan',  spp_amount: 725000, status: 'active', registration_status: 'data_only' },
  { nisn: '0044556677', name: 'Maya Anggraini',     class: 'XII IPS 1', parent_name: 'Anggraini Putri',  phone: '081234567814', parent_phone: '081234567815', address: 'Jl. Rasuna Said No.19, Jakarta',        spp_amount: 725000, status: 'active', registration_status: 'data_only' },
  { nisn: '0066778899', name: 'Rizal Firmansyah',   class: 'X IPS 1',   parent_name: 'Firmansyah Rudi',  phone: '081234567816', parent_phone: '081234567817', address: 'Jl. HR Rasuna No.31, Jakarta Selatan',  spp_amount: 725000, status: 'active', registration_status: 'data_only' },
  { nisn: '0088990011', name: 'Laila Fitriani',     class: 'X IPS 2',   parent_name: 'Fitriani Surya',   phone: '081234567818', parent_phone: '081234567819', address: 'Jl. Kebon Jeruk No.8, Jakarta Barat',   spp_amount: 725000, status: 'active', registration_status: 'data_only' },
];

async function seed() {
  console.log('🌱 Menambah kolom registration_status...');

  // Try inserting with registration_status - if column doesn't exist, will error
  const { data, error } = await supabase
    .from('students')
    .upsert(students, { onConflict: 'nisn', ignoreDuplicates: true })
    .select();

  if (error) {
    console.error('❌ Error inserting students:', error.message);
    console.error('   Detail:', error.details || error.hint || '');
    
    if (error.message.includes('registration_status')) {
      console.log('\n⚠️  Kolom registration_status belum ada!');
      console.log('   Buka Supabase SQL Editor dan jalankan:');
      console.log('   ALTER TABLE students ADD COLUMN IF NOT EXISTS registration_status TEXT DEFAULT \'data_only\';');
      console.log('   ALTER TABLE students ADD COLUMN IF NOT EXISTS email TEXT;');
      console.log('   ALTER TABLE students ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ;');
    }
    process.exit(1);
  }

  console.log(`✅ Berhasil insert ${data?.length || 0} siswa!`);
  data?.forEach(s => console.log(`   - ${s.name} (${s.class}) NISN: ${s.nisn}`));
}

seed();
