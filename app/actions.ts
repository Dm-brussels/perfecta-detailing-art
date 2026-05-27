"use server";

import { z } from "zod";
import { Resend } from "resend";

const QuoteSchema = z.object({
  serviceType: z.string().min(1, "service"),
  serviceLabel: z.string().min(1),
  carCategory: z.string().min(1, "category"),
  carModel: z.string().min(2, "model").max(120),
  addons: z.array(z.string()).optional().default([]),
  addonsLabels: z.array(z.string()).optional().default([]),
  message: z.string().max(2000).optional().default(""),
  name: z.string().min(2, "name").max(120),
  email: z.string().email("email"),
  consent: z.boolean().refine((v) => v === true, "consent"),
  lang: z.enum(["fr", "en"]).default("fr"),
  // Honeypot
  website: z.string().max(0).optional().default(""),
});

export type QuoteState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type QuoteInput = z.infer<typeof QuoteSchema>;

export async function submitQuote(input: QuoteInput): Promise<QuoteState> {
  // Honeypot check
  if (input.website) {
    return { status: "success" };
  }

  const parsed = QuoteSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "INVALID" };
  }

  const data = parsed.data;
  const safe = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; color: #0a0a0a; max-width: 640px; margin: 0 auto;">
      <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 16px; margin-bottom: 24px;">
        <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #4b5834; margin: 0 0 6px 0;">Nouvelle demande de devis · ${data.lang.toUpperCase()}</p>
        <h1 style="font-size: 22px; margin: 0; font-weight: 300;">Perfecta Detailing Art</h1>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #555; width: 180px;">Service</td><td><strong>${safe(data.serviceLabel)}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #555;">Catégorie</td><td>${safe(data.carCategory)}</td></tr>
        <tr><td style="padding: 8px 0; color: #555;">Modèle</td><td>${safe(data.carModel)}</td></tr>
        <tr><td style="padding: 8px 0; color: #555; vertical-align: top;">Options</td><td>${data.addonsLabels.length ? data.addonsLabels.map(safe).join(", ") : "Aucune"}</td></tr>
        <tr><td colspan="2" style="padding: 16px 0 4px 0; color: #555; border-top: 1px solid #eee;">Message</td></tr>
        <tr><td colspan="2" style="white-space: pre-wrap;">${safe(data.message || "(sans message)")}</td></tr>
        <tr><td colspan="2" style="padding: 16px 0 4px 0; color: #555; border-top: 1px solid #eee;">Coordonnées</td></tr>
        <tr><td style="padding: 4px 0; color: #555;">Nom</td><td>${safe(data.name)}</td></tr>
        <tr><td style="padding: 4px 0; color: #555;">Email</td><td><a href="mailto:${safe(data.email)}">${safe(data.email)}</a></td></tr>
      </table>
      <p style="margin-top: 24px; font-size: 11px; color: #888; letter-spacing: 0.18em; text-transform: uppercase;">PDA · Centre esthétique automobile</p>
    </div>
  `;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_EMAIL_TO ?? "contact@perfectadetailingart.com";
  const from =
    process.env.QUOTE_EMAIL_FROM ?? "Perfecta Detailing Art <onboarding@resend.dev>";

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: `Demande de devis · ${data.serviceLabel} · ${data.carModel}`,
        html,
      });
    } catch (err) {
      console.error("Resend error:", err);
      return { status: "error", message: "SEND_FAILED" };
    }
  } else {
    console.log("[QUOTE] (RESEND_API_KEY not set) →", data);
  }

  return { status: "success" };
}
