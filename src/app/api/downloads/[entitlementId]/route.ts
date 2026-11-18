import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSecureDownloadUrl } from "@/lib/delivery/vault";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ entitlementId: string }> }
) {
  try {
    const { entitlementId } = await context.params;

    if (!entitlementId) {
      return NextResponse.json(
        { error: "Missing entitlement ID parameter." },
        { status: 400 }
      );
    }

    // 1. Inspect Session (if logged in)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. Inspect Query Parameters
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const shouldRedirect = searchParams.get("redirect") === "true";

    // 3. Inspect Client Metadata for Audit Logging
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // 4. Secure Vault Authorization & Signed URL Generation
    const result = await generateSecureDownloadUrl(
      entitlementId,
      {
        userId: user?.id || null,
        email: user?.email || null,
        token: token || null,
      },
      {
        ip,
        userAgent,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    // Direct browser redirect to signed URL if requested
    if (shouldRedirect && result.downloadUrl) {
      return NextResponse.redirect(result.downloadUrl);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during digital download delivery." },
      { status: 500 }
    );
  }
}
