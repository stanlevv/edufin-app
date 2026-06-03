import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const payload = await req.json()
    const { order_id, transaction_status, fraud_status } = payload

    console.log(`Midtrans notification received: ${order_id} - ${transaction_status}`);

    // Inisialisasi Supabase client menggunakan service role key (supaya bisa bypass RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    // Fallback URL (if testing without env)
    if (!supabaseUrl || !supabaseServiceKey) {
       console.log("Supabase ENV variables missing, just logging webhook:", payload);
       return new Response("OK", { status: 200 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Logika Midtrans status
    let status = ""
    if (transaction_status == 'capture') {
        if (fraud_status == 'challenge') {
          status = 'pending'
        } else if (fraud_status == 'accept') {
          status = 'success'
        }
    } else if (transaction_status == 'settlement') {
        status = 'success'
    } else if (transaction_status == 'cancel' ||
      transaction_status == 'deny' ||
      transaction_status == 'expire') {
      status = 'failed'
    } else if (transaction_status == 'pending') {
      status = 'pending'
    }

    if (status === 'success') {
      // Misalkan format order_id adalah: BILL-{billId}-{timestamp} atau DONATION-{campaignId}-{timestamp}
      if (order_id.startsWith('BILL-')) {
         const parts = order_id.split('-');
         if (parts.length > 1) {
            const billId = parts[1];
            // Karena bill belum migrasi penuh, untuk simulasi kita update bill di Supabase kalau ada
            // Note: di fase saat ini data tagihan mayoritas masih di localStorage,
            // jadi Edge Function ini ditujukan untuk arsitektur masa depan.
            await supabase.from('bills').update({ status: 'Lunas' }).eq('id', billId);
         }
      }
    }

    return new Response(JSON.stringify({ message: "Notification handled" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    })
  }
})
