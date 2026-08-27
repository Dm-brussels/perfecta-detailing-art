/**
 * Coordonnées & liens du studio.
 * Une seule source de vérité : header, sticky bar, footer, WhatsApp, emails.
 */

/** Numéro affiché à l'écran */
export const PHONE_DISPLAY = "+32 470 10 53 81";
/** Format E.164 pour les liens tel: */
export const PHONE_E164 = "+32470105381";
/** Format wa.me (sans + ni espaces) */
export const WHATSAPP_NUMBER = "32470105381";

export const PHONE_HREF = `tel:${PHONE_E164}`;

export const INSTAGRAM_URL = "https://instagram.com/perfectadetailingart";

export const MAPS_URL =
  "https://maps.google.com/?q=Grand'Route+217,+1428+Lillois-Witterz%C3%A9e";

/** Construit le lien WhatsApp avec message pré-rempli. */
export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
