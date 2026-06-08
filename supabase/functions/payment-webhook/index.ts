import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();

    // Pastikan ini adalah callback dari Xendit
    // Biasanya webhook invoice Xendit akan mengirimkan `external_id` dan `status`
    const { external_id, status } = body;

    if (!external_id || !status) {
      return new Response("Invalid webhook payload", { status: 400 });
    }

    if (status === "PAID" || status === "SETTLED") {
      // 1. Cek apakah ini transaksi tagihan (bill) atau donasi (donation)
      if (external_id.startsWith("BILL-")) {
        const billId = external_id.replace("BILL-", "");
        
        // Update status bill menjadi lunas
        const { error: billError } = await supabase
          .from("bills")
          .update({ 
            status: "lunas", 
            paid_at: new Date().toISOString(),
            payment_method: body.payment_method || "transfer"
          })
          .eq("id", billId);

        if (billError) throw billError;

        // Bikin notifikasi
        // Kita butuh student_id dari bill tersebut
        const { data: bill } = await supabase.from("bills").select("student_id").eq("id", billId).single();
        if (bill) {
          await supabase.from("notifications").insert({
            user_id: bill.student_id,
            title: "Pembayaran Berhasil",
            message: `Tagihan Anda telah berhasil dilunasi.`,
            type: "success",
            is_read: false
          });
        }
      } 
      else if (external_id.startsWith("DON-")) {
        const donationId = external_id.replace("DON-", "");
        
        // Update donation status
        const { error: donError } = await supabase
          .from("donations")
          .update({ status: "completed" })
          .eq("id", donationId);
          
        if (donError) throw donError;
      }
    }

    return new Response(JSON.stringify({ message: "Webhook processed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
