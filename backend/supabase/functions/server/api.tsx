/**
 * API Routes for EDUFIN
 * All CRUD operations for database entities
 */

import { Context } from "npm:hono";
import * as kv from "./kv_store.tsx";

// ─── Students ─────────────────────────────────────────────────────────────────

export async function getStudents(c: Context) {
  try {
    const students = await kv.getByPrefix("edufin:student:");
    return c.json({ success: true, data: students });
  } catch (err) {
    console.error("[GET_STUDENTS ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function getStudentById(c: Context) {
  try {
    const id = c.req.param("id");
    const student = await kv.get(`edufin:student:${id}`);

    if (!student) {
      return c.json({ success: false, message: "Student not found" }, 404);
    }

    return c.json({ success: true, data: student });
  } catch (err) {
    console.error("[GET_STUDENT ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function saveStudent(c: Context) {
  try {
    const body = await c.req.json();
    const { id, ...studentData } = body;

    if (!id) {
      return c.json({ success: false, message: "Student ID required" }, 400);
    }

    await kv.set(`edufin:student:${id}`, { id, ...studentData });
    console.log(`[SAVE_STUDENT] Saved: ${id}`);

    return c.json({ success: true, message: "Student saved", data: { id, ...studentData } });
  } catch (err) {
    console.error("[SAVE_STUDENT ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

// ─── Bills ────────────────────────────────────────────────────────────────────

export async function getBills(c: Context) {
  try {
    const bills = await kv.getByPrefix("edufin:bill:");
    return c.json({ success: true, data: bills });
  } catch (err) {
    console.error("[GET_BILLS ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function getBillsByStudentId(c: Context) {
  try {
    const studentId = c.req.param("studentId");
    const allBills = await kv.getByPrefix("edufin:bill:");
    const studentBills = allBills.filter((b: any) => b.studentId === studentId);

    return c.json({ success: true, data: studentBills });
  } catch (err) {
    console.error("[GET_BILLS_BY_STUDENT ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function saveBill(c: Context) {
  try {
    const body = await c.req.json();
    const { id, ...billData } = body;

    if (!id) {
      return c.json({ success: false, message: "Bill ID required" }, 400);
    }

    await kv.set(`edufin:bill:${id}`, { id, ...billData });
    console.log(`[SAVE_BILL] Saved: ${id}`);

    return c.json({ success: true, message: "Bill saved", data: { id, ...billData } });
  } catch (err) {
    console.error("[SAVE_BILL ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function getPayments(c: Context) {
  try {
    const payments = await kv.getByPrefix("edufin:payment:");
    return c.json({ success: true, data: payments });
  } catch (err) {
    console.error("[GET_PAYMENTS ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function savePayment(c: Context) {
  try {
    const body = await c.req.json();
    const { id, ...paymentData } = body;

    if (!id) {
      return c.json({ success: false, message: "Payment ID required" }, 400);
    }

    await kv.set(`edufin:payment:${id}`, { id, ...paymentData });
    console.log(`[SAVE_PAYMENT] Saved: ${id}`);

    return c.json({ success: true, message: "Payment saved", data: { id, ...paymentData } });
  } catch (err) {
    console.error("[SAVE_PAYMENT ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

export async function getCampaigns(c: Context) {
  try {
    const campaigns = await kv.getByPrefix("edufin:campaign:");
    return c.json({ success: true, data: campaigns });
  } catch (err) {
    console.error("[GET_CAMPAIGNS ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function getCampaignById(c: Context) {
  try {
    const id = c.req.param("id");
    const campaign = await kv.get(`edufin:campaign:${id}`);

    if (!campaign) {
      return c.json({ success: false, message: "Campaign not found" }, 404);
    }

    return c.json({ success: true, data: campaign });
  } catch (err) {
    console.error("[GET_CAMPAIGN ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function saveCampaign(c: Context) {
  try {
    const body = await c.req.json();
    const { id, ...campaignData } = body;

    if (!id) {
      return c.json({ success: false, message: "Campaign ID required" }, 400);
    }

    await kv.set(`edufin:campaign:${id}`, { id, ...campaignData });
    console.log(`[SAVE_CAMPAIGN] Saved: ${id}`);

    return c.json({ success: true, message: "Campaign saved", data: { id, ...campaignData } });
  } catch (err) {
    console.error("[SAVE_CAMPAIGN ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

// ─── Donations ────────────────────────────────────────────────────────────────

export async function getDonations(c: Context) {
  try {
    const donations = await kv.getByPrefix("edufin:donation:");
    return c.json({ success: true, data: donations });
  } catch (err) {
    console.error("[GET_DONATIONS ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function saveDonation(c: Context) {
  try {
    const body = await c.req.json();
    const { id, ...donationData } = body;

    if (!id) {
      return c.json({ success: false, message: "Donation ID required" }, 400);
    }

    await kv.set(`edufin:donation:${id}`, { id, ...donationData });
    console.log(`[SAVE_DONATION] Saved: ${id}`);

    return c.json({ success: true, message: "Donation saved", data: { id, ...donationData } });
  } catch (err) {
    console.error("[SAVE_DONATION ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(c: Context) {
  try {
    const notifications = await kv.getByPrefix("edufin:notification:");
    return c.json({ success: true, data: notifications });
  } catch (err) {
    console.error("[GET_NOTIFICATIONS ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function getNotificationsByUserId(c: Context) {
  try {
    const userId = c.req.param("userId");
    const allNotifications = await kv.getByPrefix("edufin:notification:");
    const userNotifications = allNotifications.filter((n: any) => n.userId === userId);

    return c.json({ success: true, data: userNotifications });
  } catch (err) {
    console.error("[GET_NOTIFICATIONS_BY_USER ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function saveNotification(c: Context) {
  try {
    const body = await c.req.json();
    const { id, ...notificationData } = body;

    if (!id) {
      return c.json({ success: false, message: "Notification ID required" }, 400);
    }

    await kv.set(`edufin:notification:${id}`, { id, ...notificationData });
    console.log(`[SAVE_NOTIFICATION] Saved: ${id}`);

    return c.json({ success: true, message: "Notification saved", data: { id, ...notificationData } });
  } catch (err) {
    console.error("[SAVE_NOTIFICATION ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function markNotificationAsRead(c: Context) {
  try {
    const id = c.req.param("id");
    const notification = await kv.get(`edufin:notification:${id}`) as any;

    if (!notification) {
      return c.json({ success: false, message: "Notification not found" }, 404);
    }

    notification.read = true;
    await kv.set(`edufin:notification:${id}`, notification);

    return c.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.error("[MARK_NOTIFICATION_READ ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function getTransactions(c: Context) {
  try {
    const transactions = await kv.getByPrefix("edufin:transaction:");
    return c.json({ success: true, data: transactions });
  } catch (err) {
    console.error("[GET_TRANSACTIONS ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function getTransactionsByUserId(c: Context) {
  try {
    const userId = c.req.param("userId");
    const allTransactions = await kv.getByPrefix("edufin:transaction:");
    const userTransactions = allTransactions.filter((t: any) => t.userId === userId);

    return c.json({ success: true, data: userTransactions });
  } catch (err) {
    console.error("[GET_TRANSACTIONS_BY_USER ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

export async function saveTransaction(c: Context) {
  try {
    const body = await c.req.json();
    const { id, ...transactionData } = body;

    if (!id) {
      return c.json({ success: false, message: "Transaction ID required" }, 400);
    }

    await kv.set(`edufin:transaction:${id}`, { id, ...transactionData });
    console.log(`[SAVE_TRANSACTION] Saved: ${id}`);

    return c.json({ success: true, message: "Transaction saved", data: { id, ...transactionData } });
  } catch (err) {
    console.error("[SAVE_TRANSACTION ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}

// ─── Seed Database ────────────────────────────────────────────────────────────

export async function seedDatabase(c: Context) {
  try {
    // Check if already seeded
    const existingStudents = await kv.getByPrefix("edufin:student:");
    if (existingStudents.length > 0) {
      return c.json({ success: false, message: "Database already seeded" }, 400);
    }

    console.log("[SEED] Starting database seed...");

    // Import and run seed data
    const { seedSupabaseDatabase } = await import("./seedData.tsx");
    await seedSupabaseDatabase();

    console.log("[SEED] Database seeded successfully!");
    return c.json({ success: true, message: "Database seeded successfully" });
  } catch (err) {
    console.error("[SEED_DATABASE ERROR]", err);
    return c.json({ success: false, message: `Error: ${err}` }, 500);
  }
}
