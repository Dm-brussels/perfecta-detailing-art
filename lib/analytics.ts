/**
 * Tracking des actions de conversion.
 *
 * Chaque événement part vers deux destinations :
 *  1. `dataLayer` / `gtag` — exploitable par GTM, GA4 et Google Ads.
 *  2. `/api/track` — compteur interne persistant, lu par le dashboard /leads.
 */

export type TrackEvent =
  | "quote_submit"
  | "whatsapp_open"
  | "whatsapp_click"
  | "phone_click"
  | "cta_click";

/** Événements comptabilisés côté serveur (les autres restent purement GA). */
const PERSISTED: TrackEvent[] = [
  "whatsapp_open",
  "whatsapp_click",
  "phone_click",
];

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: TrackEvent, payload: Payload = {}) {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...payload });
    window.gtag?.("event", event, payload);
  } catch {
    /* le tracking ne doit jamais casser l'interaction */
  }

  if (PERSISTED.includes(event)) {
    try {
      const body = JSON.stringify({ event, ...payload });
      // keepalive : survit à la navigation vers WhatsApp / au décrochage tel:
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* idem */
    }
  }
}
