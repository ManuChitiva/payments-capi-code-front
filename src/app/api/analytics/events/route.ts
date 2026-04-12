import { NextResponse } from "next/server";

type AnalyticsPayload = {
  productId?: number;
  eventType: "PRODUCT_VIEW" | "PRODUCT_CLICK" | "ADD_TO_CART" | "PURCHASE_INTENT";
  sessionId?: string;
  source?: string;
};

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const slug = process.env.NEXT_PUBLIC_STORE_API_SLUG?.trim() || "01";

  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_BASE_URL is not configured" },
      { status: 500 },
    );
  }

  let body: AnalyticsPayload;
  try {
    body = (await request.json()) as AnalyticsPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const endpoint = `${baseUrl.replace(/\/$/, "")}/stores/${slug}/analytics/events`;

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: "Analytics upstream failed" }, { status: upstream.status });
  }

  return new NextResponse(null, { status: 204 });
}
