"use client";

export type StoreAnalyticsEventType =
  | "PRODUCT_VIEW"
  | "PRODUCT_CLICK"
  | "ADD_TO_CART"
  | "PURCHASE_INTENT";

type TrackStoreEventInput = {
  eventType: StoreAnalyticsEventType;
  productId?: number;
  source?: string;
};

const SESSION_STORAGE_KEY = "store_analytics_session_id";

function resolveBaseUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return value ? value.replace(/\/$/, "") : null;
}

function resolveSlug(): string {
  return process.env.NEXT_PUBLIC_STORE_API_SLUG?.trim() || "01";
}

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getSessionId(): string {
  if (typeof window === "undefined") return createSessionId();

  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const generated = createSessionId();
  window.localStorage.setItem(SESSION_STORAGE_KEY, generated);
  return generated;
}

export function trackStoreEvent({
  eventType,
  productId,
  source,
}: TrackStoreEventInput): void {
  if (typeof window === "undefined") return;

  const baseUrl = resolveBaseUrl();
  const endpoint = baseUrl
    ? `${baseUrl}/stores/${resolveSlug()}/analytics/events`
    : "/api/analytics/events";
  const payload = {
    productId,
    eventType,
    sessionId: getSessionId(),
    source: source?.slice(0, 128),
  };

  void fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Silent failure: analytics should never break UX.
  });
}
