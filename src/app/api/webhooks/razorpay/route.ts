import { NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  processIdempotentWebhookEvent,
} from "@/lib/payments/razorpay";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature header" }, { status: 400 });
    }

    // Verify cryptographic signature against raw body
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // Idempotent processing
    const result = await processIdempotentWebhookEvent(eventId, eventType, payload);

    return NextResponse.json({ received: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
