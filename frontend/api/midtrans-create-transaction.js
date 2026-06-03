export default async function handler(req, res) {
  // CORS configuration (in case it's called directly)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, amount, customerName, customerEmail } = req.body;
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    
    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY tidak dikonfigurasi di Environment Variables");
    }

    console.log(`[midtrans-create-transaction] Creating transaction for Order: ${orderId}, Amount: ${amount}`);
    
    // Convert serverKey to Base64 for Basic Auth
    const encodedKey = Buffer.from(serverKey + ':').toString('base64');

    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Basic " + encodedKey
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: amount
        },
        customer_details: {
          first_name: customerName || "Customer",
          email: customerEmail || "customer@example.com"
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok || !data.token) {
      console.error("Midtrans API error:", data);
      return res.status(400).json({ error: data.error_messages ? data.error_messages[0] : "Gagal memproses pembayaran" });
    }

    console.log(`[midtrans-create-transaction] Success! Snap Token: ${data.token}`);
    return res.status(200).json({ snapToken: data.token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
