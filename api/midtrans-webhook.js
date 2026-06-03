import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    const { order_id, transaction_status, fraud_status } = payload;

    console.log(`[midtrans-webhook] Notification received: ${order_id} - ${transaction_status}`);

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
       console.log("Supabase ENV variables missing, just logging webhook:", payload);
       return res.status(200).json({ message: 'OK (No DB)' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let status = "";
    if (transaction_status == 'capture') {
        if (fraud_status == 'challenge') {
          status = 'pending';
        } else if (fraud_status == 'accept') {
          status = 'success';
        }
    } else if (transaction_status == 'settlement') {
        status = 'success';
    } else if (transaction_status == 'cancel' || transaction_status == 'deny' || transaction_status == 'expire') {
      status = 'failed';
    } else if (transaction_status == 'pending') {
      status = 'pending';
    }

    if (status === 'success') {
      if (order_id && order_id.startsWith('BILL-')) {
         const parts = order_id.split('-');
         if (parts.length > 1) {
            const billId = parts[1];
            await supabase.from('bills').update({ status: 'Lunas' }).eq('id', billId);
         }
      }
    }

    return res.status(200).json({ message: "Notification handled" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}
