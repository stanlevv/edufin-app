import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as api from "./api.tsx";

const app = new Hono();

// Enable logger
app.use("*", logger(console.log));

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow Figma Make preview origins + localhost dev + production domain
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://edufin.sch.id",
  // Supabase / Figma Make previews (match by pattern below)
];

app.use(
  "/*",
  cors({
    origin: (origin) => {
      if (!origin) return "*"; // non-browser / server-to-server
      if (allowedOrigins.includes(origin)) return origin;
      // Allow Figma Make preview URLs (*.figma.com, *.supabase.co)
      if (
        origin.endsWith(".figma.com") ||
        origin.endsWith(".supabase.co") ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app")
      ) {
        return origin;
      }
      return null; // block others
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// ── Simple password hashing (SHA-256 via Web Crypto API available in Deno) ──
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "edufin-salt-2025");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Input sanitization ────────────────────────────────────────────────────────
function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, 500); // limit length
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/make-server-87d0698a/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Auth: Register ────────────────────────────────────────────────────────────
app.post("/make-server-87d0698a/auth/register", async (c) => {
  try {
    const body = await c.req.json();
    const email = sanitizeString(body.email).toLowerCase();
    const password = sanitizeString(body.password);
    const role = sanitizeString(body.role);
    const name = sanitizeString(body.name);
    const nisn = sanitizeString(body.nisn);
    const school = sanitizeString(body.school);
    const cls = sanitizeString(body.class);
    const parentName = sanitizeString(body.parentName);

    // Validate required fields
    if (!email || !password || !role || !name) {
      return c.json({ success: false, message: "Data tidak lengkap." }, 400);
    }

    if (!isValidEmail(email)) {
      return c.json({ success: false, message: "Format email tidak valid." }, 400);
    }

    if (password.length < 6) {
      return c.json({ success: false, message: "Kata sandi minimal 6 karakter." }, 400);
    }

    const validRoles = ["siswa", "sekolah", "donatur"];
    if (!validRoles.includes(role)) {
      return c.json({ success: false, message: "Role tidak valid." }, 400);
    }

    // Check if email already exists
    const emailKey = `edufin:account:${email}`;
    const existing = await kv.get(emailKey);
    if (existing) {
      return c.json({ success: false, message: "Email sudah terdaftar. Silakan masuk." }, 409);
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      email,
      role,
      verified: role === "donatur" ? true : false,
      nisn: nisn || null,
      school: school || null,
      class: cls || null,
      parentName: parentName || null,
    };

    const account = {
      email,
      passwordHash: hashedPassword, // NEVER store plain-text password
      user: newUser,
      createdAt: new Date().toISOString(),
    };

    await kv.set(emailKey, account);

    console.log(`[REGISTER] New account: ${email} (${role})`);
    return c.json({ success: true, message: "Akun berhasil dibuat!", user: newUser });
  } catch (err) {
    console.error(`[REGISTER ERROR] ${err}`);
    return c.json({ success: false, message: "Gagal mendaftar. Coba lagi." }, 500);
  }
});

// ── Auth: Login ───────────────────────────────────────────────────────────────
app.post("/make-server-87d0698a/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    const email = sanitizeString(body.email).toLowerCase();
    const password = sanitizeString(body.password);

    if (!email || !password) {
      return c.json({ success: false, message: "Email dan kata sandi wajib diisi." }, 400);
    }

    const emailKey = `edufin:account:${email}`;
    const account = (await kv.get(emailKey)) as any;

    if (!account) {
      return c.json(
        { success: false, message: "Email belum terdaftar. Silakan daftar terlebih dahulu." },
        404,
      );
    }

    // Support both old plain-text (legacy) and new hashed passwords
    let passwordMatch = false;
    if (account.passwordHash) {
      const hashedInput = await hashPassword(password);
      passwordMatch = account.passwordHash === hashedInput;
    } else if (account.password) {
      // Legacy plain-text — accept but migrate to hash
      passwordMatch = account.password === password;
      if (passwordMatch) {
        // Migrate to hashed password
        const hashedPassword = await hashPassword(password);
        await kv.set(emailKey, {
          ...account,
          passwordHash: hashedPassword,
          password: undefined, // remove plain-text
        });
      }
    }

    if (!passwordMatch) {
      return c.json({ success: false, message: "Kata sandi salah. Coba lagi." }, 401);
    }

    console.log(`[LOGIN] Success: ${email} (${account.user.role})`);
    return c.json({ success: true, message: "Login berhasil!", user: account.user });
  } catch (err) {
    console.error(`[LOGIN ERROR] ${err}`);
    return c.json({ success: false, message: "Gagal login. Coba lagi." }, 500);
  }
});

// ── Helpdesk: Submit Ticket ───────────────────────────────────────────────────
app.post("/make-server-87d0698a/helpdesk/ticket", async (c) => {
  try {
    const body = await c.req.json();
    const name = sanitizeString(body.name);
    const email = sanitizeString(body.email).toLowerCase();
    const subject = sanitizeString(body.subject);
    const message = sanitizeString(body.message);

    if (!email || !message) {
      return c.json({ success: false, message: "Email dan pesan wajib diisi." }, 400);
    }

    if (!isValidEmail(email)) {
      return c.json({ success: false, message: "Format email tidak valid." }, 400);
    }

    const ticketId = `ticket-${Date.now()}`;
    const ticket = {
      id: ticketId,
      name: name || "Anonim",
      email,
      subject: subject || "Pertanyaan Umum",
      message,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`edufin:helpdesk:${ticketId}`, ticket);

    console.log(`[HELPDESK] New ticket: ${ticketId} from ${email}`);
    return c.json({
      success: true,
      message: "Tiket berhasil dikirim! Tim kami akan segera merespons.",
      ticketId,
    });
  } catch (err) {
    console.error(`[HELPDESK ERROR] ${err}`);
    return c.json({ success: false, message: "Gagal mengirim tiket. Coba lagi." }, 500);
  }
});

// ── Midtrans: Create Transaction ──────────────────────────────────────────────
app.post("/make-server-87d0698a/midtrans/create-transaction", async (c) => {
  try {
    const body = await c.req.json();
    const { orderId, amount, customerName, customerEmail, billId } = body;

    if (!orderId || !amount || amount <= 0) {
      return c.json({ success: false, message: "Data transaksi tidak lengkap." }, 400);
    }

    const midtransServerKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    const midtransBaseUrl = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true"
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    if (!midtransServerKey) {
      return c.json({ success: false, message: "Konfigurasi pembayaran tidak tersedia." }, 503);
    }

    const authHeader = "Basic " + btoa(midtransServerKey + ":");

    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(amount),
      },
      customer_details: {
        first_name: customerName || "Siswa",
        email: customerEmail || "siswa@edufin.id",
      },
      item_details: [
        {
          id: billId || orderId,
          price: Math.round(amount),
          quantity: 1,
          name: "Pembayaran SPP EDUFIN",
        },
      ],
      callbacks: {
        finish: `${Deno.env.get("FRONTEND_URL") || "http://localhost:5173"}/student/spp?payment=success`,
        error: `${Deno.env.get("FRONTEND_URL") || "http://localhost:5173"}/student/spp?payment=error`,
        pending: `${Deno.env.get("FRONTEND_URL") || "http://localhost:5173"}/student/spp?payment=pending`,
      },
    };

    const midtransResponse = await fetch(midtransBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(midtransPayload),
    });

    const midtransData = await midtransResponse.json();

    if (!midtransResponse.ok) {
      console.error("[MIDTRANS ERROR]", midtransData);
      return c.json({ success: false, message: "Gagal membuat transaksi pembayaran." }, 502);
    }

    console.log(`[MIDTRANS] Transaction created: ${orderId}`);
    return c.json({
      success: true,
      snapToken: midtransData.token,
      redirectUrl: midtransData.redirect_url,
      orderId,
    });
  } catch (err) {
    console.error(`[MIDTRANS ERROR] ${err}`);
    return c.json({ success: false, message: "Gagal menghubungi payment gateway." }, 500);
  }
});

// ── Midtrans: Webhook ─────────────────────────────────────────────────────────
app.post("/make-server-87d0698a/midtrans/webhook", async (c) => {
  try {
    const body = await c.req.json();
    const {
      order_id,
      transaction_status,
      fraud_status,
      signature_key,
      gross_amount,
      status_code,
    } = body;

    // Verify Midtrans signature
    const midtransServerKey = Deno.env.get("MIDTRANS_SERVER_KEY") || "";
    const expectedSignature = await sha512(
      `${order_id}${status_code}${gross_amount}${midtransServerKey}`,
    );

    if (signature_key !== expectedSignature) {
      console.error("[MIDTRANS WEBHOOK] Invalid signature for order:", order_id);
      return c.json({ success: false, message: "Invalid signature" }, 403);
    }

    // Determine payment success
    const isSuccess =
      transaction_status === "capture" ||
      (transaction_status === "settlement" && fraud_status !== "deny");
    const isPending = transaction_status === "pending";
    const isFailed =
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire" ||
      fraud_status === "deny";

    // Update bill status in KV store
    // order_id format: BILL-{billId}-{timestamp}
    const billIdMatch = order_id.match(/^BILL-(.+)-\d+$/);
    if (billIdMatch) {
      const billId = billIdMatch[1];
      const bill = (await kv.get(`edufin:bill:${billId}`)) as any;
      if (bill) {
        bill.paymentStatus = isSuccess ? "success" : isPending ? "pending" : "failed";
        if (isSuccess) {
          bill.status = "Lunas";
          bill.paidAt = new Date().toISOString();
          bill.transactionId = order_id;
        }
        await kv.set(`edufin:bill:${billId}`, bill);
        console.log(`[MIDTRANS WEBHOOK] Bill ${billId} updated to ${bill.status}`);
      }
    }

    return c.json({ success: true });
  } catch (err) {
    console.error(`[MIDTRANS WEBHOOK ERROR] ${err}`);
    return c.json({ success: false, message: "Webhook processing failed" }, 500);
  }
});

// SHA-512 for Midtrans signature verification
async function sha512(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Database API Routes ───────────────────────────────────────────────────────

// Seed Database
app.post("/make-server-87d0698a/seed", api.seedDatabase);

// Students
app.get("/make-server-87d0698a/students", api.getStudents);
app.get("/make-server-87d0698a/students/:id", api.getStudentById);
app.post("/make-server-87d0698a/students", api.saveStudent);

// Bills
app.get("/make-server-87d0698a/bills", api.getBills);
app.get("/make-server-87d0698a/bills/student/:studentId", api.getBillsByStudentId);
app.post("/make-server-87d0698a/bills", api.saveBill);

// Payments
app.get("/make-server-87d0698a/payments", api.getPayments);
app.post("/make-server-87d0698a/payments", api.savePayment);

// Campaigns
app.get("/make-server-87d0698a/campaigns", api.getCampaigns);
app.get("/make-server-87d0698a/campaigns/:id", api.getCampaignById);
app.post("/make-server-87d0698a/campaigns", api.saveCampaign);

// Donations
app.get("/make-server-87d0698a/donations", api.getDonations);
app.post("/make-server-87d0698a/donations", api.saveDonation);

// Notifications
app.get("/make-server-87d0698a/notifications", api.getNotifications);
app.get("/make-server-87d0698a/notifications/user/:userId", api.getNotificationsByUserId);
app.post("/make-server-87d0698a/notifications", api.saveNotification);
app.put("/make-server-87d0698a/notifications/:id/read", api.markNotificationAsRead);

// Transactions
app.get("/make-server-87d0698a/transactions", api.getTransactions);
app.get("/make-server-87d0698a/transactions/user/:userId", api.getTransactionsByUserId);
app.post("/make-server-87d0698a/transactions", api.saveTransaction);

Deno.serve(app.fetch);