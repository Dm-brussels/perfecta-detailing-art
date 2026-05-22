"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useT } from "./AppProviders";
import { CTAButton } from "./CTAButton";

export function FinalCTA() {
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden bg-noir-glow py-28 text-white sm:py-36 grain">
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
        <span aria-hidden className="my-8 mx-auto block h-px w-12 bg-olive-light" />
        <h2 className="font-display text-5xl font-light leading-[1.05] tracking-tight text-balance text-white sm:text-6xl lg:text-7xl">
          {t.cta.title1}
          <br />
          <span className="italic text-white/85">{t.cta.title2}</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          {t.cta.desc}
        </p>

        <ul className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 text-sm text-white/65 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3 sm:text-[0.95rem]">
          {t.cta.bullets.map((b) => (
            <li key={b} className="flex items-center justify-center gap-3">
              <Check strokeWidth={1.5} className="h-4 w-4 text-olive-light" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <CTAButton variant="primary-light" size="lg" label={t.cta.cta} />
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 font-display text-sm italic text-white/55">
          <span aria-hidden className="block h-px w-6 bg-white/30" />
          PDA
          <span aria-hidden className="block h-px w-6 bg-white/30" />
        </div>
      </div>
    </section>
  );
}
