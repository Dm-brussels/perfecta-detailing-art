"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { useT, useWhatsApp } from "./AppProviders";
import { CTAButton } from "./CTAButton";
import { HeroBackground } from "./HeroBackground";
import { PhoneLink } from "./PhoneLink";
import { WhatsAppIcon } from "./Icons";

export function Hero() {
  const t = useT();
  const { openFlow } = useWhatsApp();

  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-noir text-white grain"
    >
      {/* Background video + poster */}
      <HeroBackground alt={t.common.brandName} />

      {/* Decorative side label */}
      <div className="pointer-events-none absolute inset-y-0 right-6 hidden lg:flex items-center">
        <span className="display-lockup origin-center -rotate-90 text-[0.62rem] tracking-[0.4em] text-white/40">
          {t.hero.sideLabel}
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <span className="eyebrow text-white/65">{t.hero.eyebrow}</span>
          <span aria-hidden className="my-6 block h-px w-14 bg-olive-light" />
          <h1 className="font-display text-5xl font-light leading-[1.02] tracking-tight text-white text-balance sm:text-6xl lg:text-[5.25rem]">
            {t.hero.title1}
            <br />
            <span className="italic font-light text-white/95">{t.hero.title2}</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {t.hero.desc}
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <CTAButton
              variant="azur"
              size="lg"
              label={t.hero.cta}
              location="hero"
              className="w-full sm:w-auto"
            />
            <button
              type="button"
              onClick={() => openFlow("hero")}
              className="group inline-flex w-full items-center justify-center gap-3 border border-white/30 bg-white/5 px-8 py-5 text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/60 hover:bg-white/10 cursor-pointer focus-azur sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              <span className="text-[0.78rem] uppercase tracking-[0.24em]">
                {t.common.whatsapp}
              </span>
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <PhoneLink location="hero" variant="light" label={t.common.callUs} />
            <a
              href="#services"
              className="group inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white cursor-pointer"
            >
              {t.hero.secondary}
              <ArrowDownRight
                strokeWidth={1.25}
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </motion.div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 gap-8 border-t border-white/15 pt-8 sm:grid-cols-4 lg:mt-24"
        >
          {t.hero.strip.map((item) => (
            <div key={item.k} className="flex flex-col">
              <span className="eyebrow text-white/55">{item.k}</span>
              <span className="mt-2 font-display text-base font-light text-white">
                {item.v}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
