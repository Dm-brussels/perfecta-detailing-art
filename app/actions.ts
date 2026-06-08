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

const FROM_DEFAULT = "Perfecta Detailing Art <info@perfectadetailing.be>";
const TO_DEFAULT = "perfectadetailingart@gmail.com";

function safeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildAdminHtml(data: QuoteInput) {
  return `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; color: #0a0a0a; max-width: 640px; margin: 0 auto;">
      <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 16px; margin-bottom: 24px;">
        <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #4b5834; margin: 0 0 6px 0;">Nouvelle demande de devis · ${data.lang.toUpperCase()}</p>
        <h1 style="font-size: 22px; margin: 0; font-weight: 300;">Perfecta Detailing Art</h1>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #555; width: 180px;">Service</td><td><strong>${safeHtml(data.serviceLabel)}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #555;">Catégorie</td><td>${safeHtml(data.carCategory)}</td></tr>
        <tr><td style="padding: 8px 0; color: #555;">Modèle</td><td>${safeHtml(data.carModel)}</td></tr>
        <tr><td style="padding: 8px 0; color: #555; vertical-align: top;">Options</td><td>${data.addonsLabels.length ? data.addonsLabels.map(safeHtml).join(", ") : "Aucune"}</td></tr>
        <tr><td colspan="2" style="padding: 16px 0 4px 0; color: #555; border-top: 1px solid #eee;">Message</td></tr>
        <tr><td colspan="2" style="white-space: pre-wrap;">${safeHtml(data.message || "(sans message)")}</td></tr>
        <tr><td colspan="2" style="padding: 16px 0 4px 0; color: #555; border-top: 1px solid #eee;">Coordonnées</td></tr>
        <tr><td style="padding: 4px 0; color: #555;">Nom</td><td>${safeHtml(data.name)}</td></tr>
        <tr><td style="padding: 4px 0; color: #555;">Email</td><td><a href="mailto:${safeHtml(data.email)}">${safeHtml(data.email)}</a></td></tr>
      </table>
      <p style="margin-top: 24px; font-size: 11px; color: #888; letter-spacing: 0.18em; text-transform: uppercase;">PDA · Centre esthétique automobile</p>
    </div>
  `;
}

function buildClientHtml(data: QuoteInput) {
  const isEn = data.lang === "en";
  const T = isEn
    ? {
        greeting: `Hi ${safeHtml(data.name.split(" ")[0] ?? data.name)},`,
        intro:
          "Thank you for trusting us with your project. We have received your request and our team will get back to you within 24 working hours with an initial reply.",
        summary: "Your request",
        service: "Service",
        category: "Category",
        model: "Make & model",
        addons: "Add-ons",
        message: "Notes",
        none: "None",
        noMsg: "(no message)",
        closing:
          "In the meantime, feel free to reply directly to this email if you have any extra details to share.",
        signoff: "Warm regards,",
        team: "The Perfecta Detailing Art team",
        footer: "Perfecta Detailing Art · Automotive aesthetics studio · Brussels",
        subject: "We received your request",
      }
    : {
        greeting: `Bonjour ${safeHtml(data.name.split(" ")[0] ?? data.name)},`,
        intro:
          "Merci pour votre confiance. Nous avons bien reçu votre demande et notre équipe revient vers vous sous 24 heures ouvrées avec un premier retour personnalisé.",
        summary: "Votre demande",
        service: "Service",
        category: "Catégorie",
        model: "Marque & modèle",
        addons: "Options",
        message: "Précisions",
        none: "Aucune",
        noMsg: "(sans message)",
        closing:
          "D'ici là, n'hésitez pas à répondre directement à cet email si vous avez d'autres précisions à nous transmettre.",
        signoff: "À très vite,",
        team: "L'équipe Perfecta Detailing Art",
        footer: "Perfecta Detailing Art · Centre esthétique automobile · Bruxelles",
        subject: "Nous avons bien reçu votre demande",
      };

  return {
    subject: T.subject,
    html: `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; color: #0a0a0a; max-width: 600px; margin: 0 auto; padding: 8px;">
      <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 18px; margin-bottom: 28px;">
        <p style="font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; color: #4b5834; margin: 0 0 6px 0;">Perfecta Detailing Art</p>
        <h1 style="font-size: 24px; margin: 0; font-weight: 300; letter-spacing: -0.01em;">${T.subject}</h1>
      </div>

      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 14px 0;">${T.greeting}</p>
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: #333;">${T.intro}</p>

      <div style="border: 1px solid #eaeaea; padding: 18px 20px; margin: 0 0 24px 0; background: #fafafa;">
        <p style="font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: #888; margin: 0 0 14px 0;">${T.summary}</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #666; width: 140px;">${T.service}</td><td><strong>${safeHtml(data.serviceLabel)}</strong></td></tr>
          <tr><td style="padding: 6px 0; color: #666;">${T.category}</td><td>${safeHtml(data.carCategory)}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">${T.model}</td><td>${safeHtml(data.carModel)}</td></tr>
          <tr><td style="padding: 6px 0; color: #666; vertical-align: top;">${T.addons}</td><td>${data.addonsLabels.length ? data.addonsLabels.map(safeHtml).join(", ") : T.none}</td></tr>
          ${
            data.message
              ? `<tr><td colspan="2" style="padding: 12px 0 4px 0; color: #666;">${T.message}</td></tr><tr><td colspan="2" style="white-space: pre-wrap; color: #333;">${safeHtml(data.message)}</td></tr>`
              : ""
          }
        </table>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #555; margin: 0 0 26px 0;">${T.closing}</p>

      <p style="font-size: 14px; line-height: 1.4; margin: 0; color: #333;">${T.signoff}<br/><strong>${T.team}</strong></p>

      <p style="margin-top: 32px; padding-top: 18px; border-top: 1px solid #eaeaea; font-size: 10px; color: #999; letter-spacing: 0.2em; text-transform: uppercase;">${T.footer}</p>
    </div>
    `,
  };
}

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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_EMAIL_TO ?? TO_DEFAULT;
  const from = process.env.QUOTE_EMAIL_FROM ?? FROM_DEFAULT;

  if (!apiKey) {
    console.log("[QUOTE] (RESEND_API_KEY not set) →", data);
    return { status: "success" };
  }

  try {
    const resend = new Resend(apiKey);

    // 1) Notification to the studio (admin)
    const adminEmail = resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Demande de devis · ${data.serviceLabel} · ${data.carModel}`,
      html: buildAdminHtml(data),
    });

    // 2) Confirmation to the client
    const { subject: clientSubject, html: clientHtml } = buildClientHtml(data);
    const clientEmail = resend.emails.send({
      from,
      to: data.email,
      replyTo: to,
      subject: clientSubject,
      html: clientHtml,
    });

    const results = await Promise.allSettled([adminEmail, clientEmail]);
    const adminResult = results[0];
    const clientResult = results[1];

    if (adminResult.status === "rejected") {
      console.error("Resend admin error:", adminResult.reason);
      return { status: "error", message: "SEND_FAILED" };
    }
    if (clientResult.status === "rejected") {
      // Admin received, client failed — still success for the user, log for ops
      console.warn("Resend client confirmation failed:", clientResult.reason);
    }
  } catch (err) {
    console.error("Resend unexpected error:", err);
    return { status: "error", message: "SEND_FAILED" };
  }

  return { status: "success" };
}
