import { NextResponse } from "next/server";
import { recordEvent, type EventKind } from "@/lib/store";

const KINDS: EventKind[] = ["whatsapp_open", "whatsapp_click", "phone_click"];

/**
 * Compteur d'interactions, alimenté par `lib/analytics.ts`.
 * Les événements Google Ads / GA4 passent, eux, par le dataLayer côté client.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { event?: string };
    const kind = KINDS.find((k) => k === body.event);
    if (!kind) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await recordEvent(kind);
  } catch (err) {
    console.error("Track error:", err);
    // Le tracking ne doit jamais faire échouer une interaction utilisateur
  }
  return NextResponse.json({ ok: true });
}
