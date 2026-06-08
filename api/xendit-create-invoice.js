export default async function handler(req, res) {
  // CORS — hanya izinkan origin resmi EDUFIN
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.VITE_APP_URL,
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, amount, customerName, customerEmail, description } = req.body;

    const secretKey = process.env.XENDIT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('XENDIT_SECRET_KEY tidak dikonfigurasi di Environment Variables');
    }

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'orderId dan amount wajib diisi' });
    }

    console.log(`[xendit-create-invoice] Creating invoice: ${orderId}, Rp ${amount}`);

    // Xendit Invoice API — https://developers.xendit.co/api-reference/#create-invoice
    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Xendit gunakan Basic Auth: secretKey sebagai username, password kosong
        'Authorization': 'Basic ' + Buffer.from(secretKey + ':').toString('base64'),
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
        // Aktifkan semua metode pembayaran Xendit
        payment_methods: ['QRIS', 'OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY', 'BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA', 'INDOMARET', 'ALFAMART'],
        invoice_duration: 86400, // 24 jam
        success_redirect_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/student/spp?status=success`,
        failure_redirect_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/student/spp?status=failed`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.invoice_url) {
      console.error('[xendit-create-invoice] Xendit API error:', data);
      return res.status(400).json({
        error: data.message || data.error_code || 'Gagal membuat invoice Xendit',
      });
    }

    console.log(`[xendit-create-invoice] Success! Invoice ID: ${data.id}, URL: ${data.invoice_url}`);

    return res.status(200).json({
      invoiceId: data.id,
      invoiceUrl: data.invoice_url,
      externalId: data.external_id,
      status: data.status,
    });
  } catch (error) {
    console.error('[xendit-create-invoice] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
