"use client";

import Link from "next/link";
import { useT, useWhatsApp } from "./AppProviders";
import { Wordmark } from "./Wordmark";
import { CTAButton } from "./CTAButton";
import { LangToggle } from "./LangToggle";
import { PhoneLink } from "./PhoneLink";
import { WhatsAppIcon } from "./Icons";

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  const t = useT();
  const { openFlow } = useWhatsApp();

  const NAV = [
    { href: "#realisations", label: t.nav.work },
    { href: "#services", label: t.nav.services },
    { href: "#process", label: t.nav.process },
    { href: "#pourquoi", label: t.nav.why },
    { href: "#avis", label: t.nav.reviews },
    { href: "#faq", label: t.nav.faq },
  ];

  return (
    <footer className="relative bg-noir text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark variant="light" />
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/55">
              {t.common.footerSig}
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <CTAButton variant="outline-light" label={t.common.cta} location="footer" />
              <button
                type="button"
                onClick={() => openFlow("footer")}
                className="inline-flex items-center gap-3 border border-white/25 px-6 py-4 text-white transition-colors duration-300 hover:border-white/60 cursor-pointer focus-azur"
              >
                <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
                <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                  {t.common.whatsapp}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <span className="eyebrow text-white/55">{t.common.navigate}</span>
            <span aria-hidden className="my-5 block h-px w-8 bg-white/20" />
            <ul className="space-y-3 text-sm text-white/75">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-olive-light"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <span className="eyebrow text-white/55">{t.common.contact}</span>
            <span aria-hidden className="my-5 block h-px w-8 bg-white/20" />
            <p className="text-sm text-white/75">{t.common.visitText}</p>
            <div className="mt-4">
              <PhoneLink location="footer" variant="light" label={t.common.callUs} />
            </div>

            <div className="mt-10">
              <span className="eyebrow text-white/55">{t.common.socials}</span>
              <span aria-hidden className="my-5 block h-px w-8 bg-white/20" />
              <a
                href="https://instagram.com/perfectadetailingart"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-sm text-white/75 transition-colors hover:text-olive-light"
              >
                <InstagramIcon className="h-4 w-4" />
                @perfectadetailingart
              </a>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <span className="eyebrow text-white/55">{t.common.langLabel}</span>
              <LangToggle variant="light" />
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} Perfecta Detailing Art. {t.common.copyright}
          </p>
          <p className="font-display text-xs italic text-white/45">
            {t.common.footerSig} · PDA
          </p>
        </div>
      </div>

      {/* Massive type at the bottom */}
      <div className="overflow-hidden border-t border-white/8">
        <p
          aria-hidden
          className="display-lockup -my-2 select-none whitespace-nowrap text-center font-light leading-none text-white/[0.05]"
          style={{
            fontSize: "clamp(4rem, 18vw, 14rem)",
          }}
        >
          PERFECTA · DETAILING · ART
        </p>
      </div>
    </footer>
  );
}
