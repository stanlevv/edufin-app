import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    const {
      id: invoiceId,
      external_id: externalId,
      status,
      payment_method: paymentMethod,
      amount,
    } = payload;

    console.log(`[xendit-callback] Callback received: ${externalId} - ${status}`);

    // ── Verifikasi Xendit Callback Token ─────────────────────────────────────
    // Xendit mengirimkan header x-callback-token untuk validasi keamanan
    const callbackToken = process.env.XENDIT_CALLBACK_TOKEN;
    const receivedToken = req.headers['x-callback-token'];

    if (callbackToken && receivedToken !== callbackToken) {
      console.warn('[xendit-callback] Invalid callback token — request ditolak');
      return res.status(401).json({ error: 'Unauthorized callback' });
    }

    // ── Inisialisasi Supabase ─────────────────────────────────────────────────
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('[xendit-callback] Supabase ENV missing — hanya logging callback:', payload);
      return res.status(200).json({ message: 'OK (No DB)' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── Logika status Xendit ──────────────────────────────────────────────────
    // Status Xendit Invoice: PENDING | PAID | SETTLED | EXPIRED
    const isPaid = status === 'PAID' || status === 'SETTLED';

    if (isPaid) {
      // Format external_id: EDUFIN-{timestamp}-{random}
      // Jika berisi BILL- berarti pembayaran SPP
      if (externalId && externalId.includes('BILL-')) {
        const parts = externalId.split('BILL-');
        if (parts.length > 1) {
          const billId = parts[1].split('-')[0]; // ambil UUID setelah BILL-
          const { error } = await supabase
            .from('bills')
            .update({
              status: 'lunas',
              payment_method: paymentMethod || 'xendit',
              paid_at: new Date().toISOString(),
              xendit_invoice_id: invoiceId,
            })
            .eq('id', billId);

          if (error) {
            console.error('[xendit-callback] Gagal update bills:', error);
          } else {
            console.log(`[xendit-callback] Bill ${billId} diupdate ke LUNAS`);
          }
        }
      }

      // Format untuk payments SPP (tabel lama)
      if (externalId && externalId.startsWith('EDUFIN-')) {
        // Cari payment berdasarkan external_id / invoice reference
        await supabase
          .from('payments')
          .update({ status: 'completed' })
          .eq('xendit_invoice_id', invoiceId);
      }
    }

    return res.status(200).json({ message: 'Callback handled successfully' });
  } catch (error) {
    console.error('[xendit-callback] Error:', error);
    return res.status(400).json({ error: error.message });
  }
}
