import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createHmac, timingSafeEqual } from "node:crypto";

function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    if (signatureBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-cms-signature-256");
    const secret = process.env.CMS_REVALIDATION_SECRET || "em_sec_iygca2i0nq";

    const bodyText = await req.text();

    if (!signature || !verifySignature(bodyText, signature, secret)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const affectedRoutes: string[] = payload.affectedRoutes || [];
    const revalidatedRoutes: string[] = [];

    // Revalidate affected URL paths
    for (const route of affectedRoutes) {
      try {
        revalidatePath(route);
        revalidatePath(route, "page");
        revalidatedRoutes.push(route);
      } catch (err) {
        console.warn(`Failed to revalidate path: ${route}`, err);
      }
    }

    // Also revalidate cache tags
    try {
      const bustTag = revalidateTag as (tag: string) => void;
      bustTag("cms-posts");
      if (payload.slug) bustTag(`post-${payload.slug}`);
    } catch {}

    return NextResponse.json({
      success: true,
      revalidated: revalidatedRoutes,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
