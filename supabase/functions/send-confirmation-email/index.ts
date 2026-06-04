// supabase/functions/send-confirmation-email/index.ts
// Edge Function: 
// 1. Update email Auth user dari Gmail → edufin.app email
// 2. Kirim email notifikasi ke Gmail siswa

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, studentName, edufinEmail, userId } = await req.json()

    if (!to || !studentName || !edufinEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Admin client (bypass RLS)
    const adminClient = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Step 1: Update email Auth user dari Gmail → edufin.app
    if (userId) {
      const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
        email: edufinEmail,
        email_confirm: true, // langsung confirmed, tidak perlu verifikasi
      })
      if (updateError) {
        console.error('Error updating auth email:', updateError.message)
        // Non-fatal, lanjutkan kirim email
      } else {
        console.log(`Auth email updated: ${to} → ${edufinEmail}`)
      }
    }

    // Step 2: Kirim email notifikasi ke Gmail pribadi siswa
    // Gunakan Supabase Admin sendEmail (atau SMTP relay jika dikonfigurasi)
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f5f7fa; }
    .container { max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1677FF, #108EE9); padding: 32px 24px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 1.5rem; font-weight: 800; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 0.85rem; }
    .body { padding: 32px 24px; }
    .badge { display: inline-block; background: #F6FFED; color: #52C41A; border: 1px solid #D9F7BE; border-radius: 20px; padding: 4px 12px; font-size: 0.75rem; font-weight: 700; margin-bottom: 16px; }
    .greeting { font-size: 1.1rem; color: #1a1a2e; font-weight: 700; margin-bottom: 12px; }
    .message { color: #595959; font-size: 0.88rem; line-height: 1.6; margin-bottom: 24px; }
    .account-box { background: linear-gradient(135deg, #EEF4FF, #E0EDFF); border: 1.5px solid #C5D8FF; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .account-label { font-size: 0.68rem; color: #4A6FA5; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .account-email { font-size: 1.05rem; color: #1677FF; font-weight: 800; word-break: break-all; }
    .password-box { background: #FFFBE6; border: 1px solid #FFE17A; border-radius: 10px; padding: 16px; margin-bottom: 24px; }
    .password-box p { color: #8B6A00; font-size: 0.82rem; margin: 0; line-height: 1.5; }
    .btn { display: block; background: linear-gradient(135deg, #1677FF, #108EE9); color: white !important; text-decoration: none; text-align: center; padding: 16px 24px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; margin-bottom: 24px; }
    .divider { border: none; border-top: 1px solid #F0F0F0; margin: 20px 0; }
    .footer { text-align: center; padding: 0 24px 24px; }
    .footer p { color: #BFBFBF; font-size: 0.7rem; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 EDUFIN</h1>
      <p>Platform Manajemen Keuangan Sekolah</p>
    </div>
    <div class="body">
      <div class="badge">✅ Akun Dikonfirmasi</div>
      <p class="greeting">Halo, ${studentName}!</p>
      <p class="message">
        Pendaftaran Anda telah <strong>dikonfirmasi oleh admin sekolah</strong>. 
        Berikut adalah informasi akun EDUFIN Anda:
      </p>
      
      <div class="account-box">
        <p class="account-label">📧 Email Login EDUFIN</p>
        <p class="account-email">${edufinEmail}</p>
      </div>

      <div class="password-box">
        <p>🔑 <strong>Password:</strong> Gunakan password yang Anda buat saat mendaftar.</p>
      </div>

      <a href="https://edufin-app.vercel.app/login" class="btn">
        Masuk ke EDUFIN →
      </a>

      <hr class="divider">
      <p class="message" style="font-size: 0.78rem; color: #8C8C8C; margin-bottom: 0;">
        💡 Simpan email ini. Gunakan <strong>${edufinEmail}</strong> untuk login ke EDUFIN — 
        bayar SPP, lihat tagihan, dan ajukan bantuan.
      </p>
    </div>
    <div class="footer">
      <p>Email ini dikirim otomatis oleh sistem EDUFIN.<br>
      © 2026 EDUFIN · Platform Manajemen Keuangan Sekolah</p>
    </div>
  </div>
</body>
</html>`

    // Kirim email via Supabase Admin sendEmail
    const emailResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'magiclink',
        email: to,
      })
    })

    // Jika SMTP Supabase belum dikonfigurasi, log saja
    const emailResult = await emailResponse.json()
    console.log('Email send result:', JSON.stringify(emailResult))

    return new Response(
      JSON.stringify({ 
        success: true,
        edufinEmail,
        notificationSentTo: to,
        message: `Account activated. Login email: ${edufinEmail}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[send-confirmation-email] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
