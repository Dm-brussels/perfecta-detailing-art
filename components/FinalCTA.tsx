"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useT, useWhatsApp } from "./AppProviders";
import { CTAButton } from "./CTAButton";
import { PhoneLink } from "./PhoneLink";
import { WhatsAppIcon } from "./Icons";

export function FinalCTA() {
  const t = useT();
  const { openFlow } = useWhatsApp();

  return (
    <section className="relative isolate overflow-hidden bg-noir-glow py-24 text-white sm:py-32 grain">
      {/* Subtle background image */}
      <div className="absolute inset-0 -z-10 opacity-25">
        <Image
          src="/photos/services/ceramique.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/80 via-noir/85 to-noir/95" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">
        <span className="eyebrow text-white/60">{t.cta.eyebrow}</span>
        <span aria-hidden className="my-7 mx-auto block h-px w-12 bg-azur" />
        <h2 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-balance text-white sm:text-6xl">
          {t.cta.title1}
          <br />
          <span className="italic text-white/85">{t.cta.title2}</span>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          {t.cta.desc}
        </p>

        <ul className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3">
          {t.cta.bullets.map((b) => (
            <li key={b} className="flex items-center justify-center gap-3">
              <Check strokeWidth={2} className="h-4 w-4 shrink-0 text-azur-light" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-11 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <CTAButton
            variant="azur"
            size="lg"
            label={t.cta.cta}
            location="final_cta"
          />
          <button
            type="button"
            onClick={() => openFlow("final_cta")}
            className="inline-flex items-center justify-center gap-3 border border-white/30 bg-white/5 px-8 py-5 text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/60 hover:bg-white/10 cursor-pointer focus-azur"
          >
            <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
            <span className="text-[0.78rem] uppercase tracking-[0.24em]">
              {t.common.whatsapp}
            </span>
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
            {t.common.orCall}
          </span>
          <PhoneLink location="final_cta" variant="light" showIcon={false} />
        </div>
      </div>
    </section>
  );
}
