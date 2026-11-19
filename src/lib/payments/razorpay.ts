import crypto from "crypto";
import Razorpay from "razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateDownloadToken } from "@/lib/delivery/vault";
import { sendOrderConfirmationEmail } from "@/lib/email";

/**
 * Initializes Razorpay Instance with Server-side Environment Keys
 */
export function getRazorpayClient() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === "rzp_test_placeholder") {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Verify Razorpay Signature Server-Side
 * Formula: HMAC_SHA256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
}

/**
 * Verify Razorpay Webhook Signature against Raw Body
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
}

/**
 * Idempotent Webhook Event Processor
 * Deduplicates events using the `webhook_events` table.
 */
export async function processIdempotentWebhookEvent(
  eventId: string,
  eventType: string,
  payload: any
): Promise<{ processed: boolean; reason?: string }> {
  const adminDb = createAdminClient();

  // Check if event has already been recorded
  const { data: existing } = await adminDb
    .from("webhook_events")
    .select("id, processed")
    .eq("event_id", eventId)
    .single();

  if (existing) {
    if (existing.processed) {
      return { processed: false, reason: "Duplicate webhook event: already processed." };
    }
  } else {
    // Record the webhook event
    await adminDb.from("webhook_events").insert({
      event_id: eventId,
      gateway: "razorpay",
      event_type: eventType,
      payload,
      processed: false,
    });
  }

  // Handle payment.captured or order.paid
  if (eventType === "payment.captured" || eventType === "order.paid") {
    const paymentEntity = payload.payload?.payment?.entity || payload.payment?.entity;
    if (paymentEntity) {
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;
      const amount = paymentEntity.amount / 100; // in INR

      // Find order in DB
      const { data: paymentRecord } = await adminDb
        .from("payments")
        .select("order_id")
        .eq("gateway_order_id", razorpayOrderId)
        .single();

      if (paymentRecord?.order_id) {
        // Update payment & order
        await adminDb
          .from("payments")
          .update({
            gateway_payment_id: razorpayPaymentId,
            status: "captured",
            raw_response: paymentEntity,
          })
          .eq("order_id", paymentRecord.order_id);

        await adminDb
          .from("orders")
          .update({ status: "paid", updated_at: new Date().toISOString() })
          .eq("id", paymentRecord.order_id);

        // Fetch order details to grant entitlements
        const { data: orderDetails } = await adminDb
          .from("orders")
          .select("order_number, total_amount, customer_email, user_id, items:order_items(product_id, products(id, title, author, price))")
          .eq("id", paymentRecord.order_id)
          .single();

        if (orderDetails && orderDetails.items) {
          const entitlements = orderDetails.items.map((item: any) => ({
            customer_email: orderDetails.customer_email.toLowerCase().trim(),
            user_id: orderDetails.user_id,
            product_id: item.product_id,
            order_id: paymentRecord.order_id,
            is_active: true,
            download_count: 0,
            max_downloads: 50,
          }));

          await adminDb
            .from("purchase_entitlements")
            .upsert(entitlements, { onConflict: "customer_email,product_id" });

          // Dispatch confirmation email with signed download links
          try {
            const { data: createdEnts } = await adminDb
              .from("purchase_entitlements")
              .select("id, product_id")
              .eq("order_id", paymentRecord.order_id);

            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apex-chi-sandy.vercel.app";

            const emailItems = (orderDetails.items as any[]).map((item) => {
              const prod = item.products || {};
              const ent = createdEnts?.find((e) => e.product_id === item.product_id);
              let downloadUrl: string | undefined;
              if (ent) {
                const token = generateDownloadToken(ent.id, orderDetails.customer_email);
                downloadUrl = `${siteUrl}/api/downloads/${ent.id}?token=${token}&redirect=true`;
              }
              return {
                id: item.product_id,
                title: prod.title || "Purchased eBook",
                author: prod.author || "ApexBooks",
                price: prod.price || 0,
                entitlementId: ent?.id,
                downloadUrl,
              };
            });

            sendOrderConfirmationEmail({
              orderNumber: orderDetails.order_number || `ORD-${paymentRecord.order_id.slice(0, 8)}`,
              customerName: "Valued Customer",
              customerEmail: orderDetails.customer_email,
              items: emailItems,
              totalAmount: orderDetails.total_amount || 0,
            }).catch((err) => console.error("[RazorpayWebhook] Email dispatch failed:", err));
          } catch (emailErr) {
            console.error("[RazorpayWebhook] Failed preparing email:", emailErr);
          }
        }
      }
    }
  }

  // Mark event as processed
  await adminDb
    .from("webhook_events")
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq("event_id", eventId);

  return { processed: true };
}
