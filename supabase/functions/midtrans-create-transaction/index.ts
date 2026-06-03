import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, amount, customerName, customerEmail } = await req.json()
    
    // Server key dari Supabase environment
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY belum di set di Supabase Secrets");

    // Call Midtrans Sandbox API
    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Basic " + btoa(serverKey + ":")
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
    })

    const data = await response.json()
    
    if (!response.ok || !data.token) {
      console.error("Midtrans error:", data);
      throw new Error(data.error_messages ? data.error_messages[0] : "Gagal memproses pembayaran");
    }

    return new Response(JSON.stringify({ snapToken: data.token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
