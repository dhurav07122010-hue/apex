import { NextResponse } from "next/server";
import { processDemoOrder } from "@/lib/payments/demo";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerEmail, customerName, items } = body;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const result = await processDemoOrder({
      customerEmail,
      customerName,
      items,
      userId: user?.id || null,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
