import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxqamlbdamrkwrdnbhmf.supabase.co';
const supabaseKey = 'sb_publishable_kR-qLNL8nf-G4ReZTML1pg_MvXqiDLi';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing signInWithPassword...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@edufin.app',
    password: 'EduFin@SuperAdmin2026!'
  });
  if (error) {
    console.error("Login failed:", error.message, error);
  } else {
    console.log("Login success!", data.user.email, data.user.id);
  }
}
test();
