import http from 'http';

const PORT = 54321;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse Body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    let payload = {};
    if (body) {
      try {
        payload = JSON.parse(body);
      } catch (e) {}
    }

    if (req.url === '/functions/v1/midtrans-create-transaction' && req.method === 'POST') {
      try {
        const { orderId, amount, customerName, customerEmail } = payload;
        
        console.log(`[midtrans-create-transaction] Creating transaction for Order: ${orderId}, Amount: ${amount}`);
        
        const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic " + Buffer.from(MIDTRANS_SERVER_KEY + ":").toString('base64')
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
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: data.error_messages ? data.error_messages[0] : "Gagal memproses pembayaran" }));
          return;
        }

        console.log(`[midtrans-create-transaction] Success! Snap Token: ${data.token}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ snapToken: data.token }));
      } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    } else if (req.url === '/functions/v1/midtrans-webhook' && req.method === 'POST') {
      console.log(`[midtrans-webhook] Webhook received!`, payload);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Local Edge Function Simulator running on http://127.0.0.1:${PORT}`);
});
