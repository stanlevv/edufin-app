import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  // Xendit hanya akan POST callback — tidak perlu CORS headers
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.json()
    const {
      id: invoiceId,
      external_id: externalId,
      status,
      payment_method: paymentMethod,
      amount,
      paid_at: paidAt,
    } = payload

    console.log(`[xendit-callback] Callback received: ${externalId} - ${status}`)

    // ── Verifikasi Xendit Callback Token ──────────────────────────────────────
    // Xendit mengirim header x-callback-token untuk mencegah request palsu
    const callbackToken = Deno.env.get('XENDIT_CALLBACK_TOKEN')
    const receivedToken = req.headers.get('x-callback-token')

    if (callbackToken && receivedToken !== callbackToken) {
      console.warn('[xendit-callback] Invalid callback token — request ditolak')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    // ── Inisialisasi Supabase dengan Service Role (bypass RLS) ───────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('[xendit-callback] Supabase ENV missing — hanya logging callback')
      return new Response('OK', { status: 200 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // ── Logika status Xendit Invoice ──────────────────────────────────────────
    // Status Xendit: PENDING | PAID | SETTLED | EXPIRED
    const isPaid = status === 'PAID' || status === 'SETTLED'

    if (!isPaid) {
      console.log(`[xendit-callback] Status ${status} — tidak ada aksi yang diambil`)
      return new Response(JSON.stringify({ message: `Status ${status} received` }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // ── Update Bills jika external_id mengandung ID tagihan ───────────────────
    // Format yang didukung:
    // 1. "BILL-{uuid}-{timestamp}" → update tabel bills
    // 2. "EDUFIN-{timestamp}-{random}" → update tabel payments (alur lama)
    if (externalId?.includes('BILL-')) {
      // Ekstrak billId dari external_id
      const billMatch = externalId.match(/BILL-([a-f0-9-]{36})/i)
      if (billMatch) {
        const billId = billMatch[1]
        const { error: billError } = await supabase
          .from('bills')
          .update({
            status: 'lunas',
            payment_method: paymentMethod?.toLowerCase() || 'xendit',
            paid_at: paidAt || new Date().toISOString(),
            xendit_invoice_id: invoiceId,
          })
          .eq('id', billId)

        if (billError) {
          console.error('[xendit-callback] Gagal update bills:', billError)
        } else {
          console.log(`[xendit-callback] ✅ Bill ${billId} → LUNAS via ${paymentMethod}`)
        }
      }
    }

    // ── Update tabel payments (alur lama sebelum migrasi penuh ke bills) ─────
    const { error: paymentError } = await supabase
      .from('payments')
      .update({ status: 'completed' })
      .eq('xendit_invoice_id', invoiceId)

    if (paymentError) {
      console.warn('[xendit-callback] Gagal update payments (mungkin belum ada record):', paymentError)
    }

    // ── Buat notifikasi untuk siswa ───────────────────────────────────────────
    // Ambil student berdasarkan external_id / bill
    if (externalId?.includes('BILL-')) {
      const billMatch = externalId.match(/BILL-([a-f0-9-]{36})/i)
      if (billMatch) {
        const billId = billMatch[1]
        const { data: billData } = await supabase
          .from('bills')
          .select('student_id, month, amount, students(user_id)')
          .eq('id', billId)
          .single()

        if (billData?.students?.user_id) {
          await supabase.from('notifications').insert({
            user_id: billData.students.user_id,
            title: 'Pembayaran SPP Berhasil ✅',
            message: `Pembayaran SPP bulan ${billData.month} sebesar Rp ${(billData.amount || amount).toLocaleString('id-ID')} telah dikonfirmasi via ${paymentMethod || 'Xendit'}.`,
            type: 'payment',
            read: false,
          })
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Callback handled successfully' }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('[xendit-callback] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }
})
