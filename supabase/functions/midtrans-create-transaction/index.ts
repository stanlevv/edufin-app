import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
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
    // ── Auth check — hanya user yang login bisa buat invoice ──────────────────
    const authHeader = req.headers.get('Authorization')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let userId: string | null = null
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id ?? null
    }

    const body = await req.json()
    const { orderId, amount, customerName, customerEmail, description, billId } = body

    if (!orderId || !amount) {
      return new Response(
        JSON.stringify({ error: 'orderId dan amount wajib diisi' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // ── Ambil Xendit Secret Key dari Supabase Secrets ─────────────────────────
    const xenditSecretKey = Deno.env.get('XENDIT_SECRET_KEY')
    if (!xenditSecretKey) {
      throw new Error('XENDIT_SECRET_KEY belum diset di Supabase Edge Function Secrets')
    }

    const appUrl = Deno.env.get('APP_URL') || 'https://edufin.vercel.app'

    console.log(`[xendit-create-invoice] Creating invoice: ${orderId}, Rp ${amount}`)

    // ── Panggil Xendit Invoice API ────────────────────────────────────────────
    // Docs: https://developers.xendit.co/api-reference/#create-invoice
    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Xendit Basic Auth: secret key sebagai username, password kosong
        'Authorization': 'Basic ' + btoa(xenditSecretKey + ':'),
      },
      body: JSON.stringify({
        external_id: orderId,
        amount: amount,
        payer_email: customerEmail || 'siswa@edufin.app',
        description: description || `Pembayaran SPP EDUFIN - ${orderId}`,
        customer: {
          given_names: customerName || 'Siswa EDUFIN',
          email: customerEmail || 'siswa@edufin.app',
        },
        currency: 'IDR',
        // Aktifkan semua metode pembayaran Xendit yang tersedia di Indonesia
        payment_methods: [
          'QRIS',
          'OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY',
          'BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA',
          'INDOMARET', 'ALFAMART',
        ],
        invoice_duration: 86400, // 24 jam kadaluarsa
        success_redirect_url: `${appUrl}/student/spp?status=success&orderId=${orderId}`,
        failure_redirect_url: `${appUrl}/student/spp?status=failed&orderId=${orderId}`,
        // Tambahkan metadata untuk callback
        items: [
          {
            name: description || 'SPP Bulanan EDUFIN',
            quantity: 1,
            price: amount,
            category: 'Pendidikan',
          }
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.invoice_url) {
      console.error('[xendit-create-invoice] Xendit API error:', data)
      return new Response(
        JSON.stringify({ error: data.message || data.error_code || 'Gagal membuat invoice' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`[xendit-create-invoice] Invoice dibuat: ${data.id}`)

    // ── (Opsional) Simpan referensi invoice ke database ───────────────────────
    if (billId) {
      await supabase
        .from('bills')
        .update({
          xendit_invoice_id: data.id,
          xendit_payment_url: data.invoice_url,
          status: 'belum_bayar', // tetap belum bayar sampai callback masuk
        })
        .eq('id', billId)
    }

    return new Response(
      JSON.stringify({
        invoiceId: data.id,
        invoiceUrl: data.invoice_url,
        externalId: data.external_id,
        status: data.status,
        amount: data.amount,
        expiryDate: data.expiry_date,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('[xendit-create-invoice] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
