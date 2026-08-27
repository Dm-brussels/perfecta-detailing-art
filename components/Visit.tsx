"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useT, useWhatsApp } from "./AppProviders";
import { CTAButton } from "./CTAButton";
import { PhoneLink } from "./PhoneLink";
import { WhatsAppIcon } from "./Icons";

export function Visit() {
  const t = useT();
  const { openFlow } = useWhatsApp();

  return (
    <section id="contact" className="relative bg-bone py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-5">
            <span className="eyebrow text-noir/55">{t.visit.eyebrow}</span>
            <span aria-hidden className="my-6 block h-px w-12 bg-olive" />
            <h2 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-noir text-balance sm:text-5xl">
              {t.visit.title1}
              <br />
              <span className="italic">{t.visit.title2}</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-noir/65">
              {t.visit.desc}
            </p>

            <div className="mt-10 flex flex-col gap-3">
              {t.visit.cards.map((c) => (
                <div key={c.k} className="card p-5">
                  <span className="eyebrow text-noir/45">{c.k}</span>
                  <p className="mt-2 font-display text-lg font-light text-noir">
                    {c.v}
                  </p>
                  <p className="mt-1 text-sm text-noir/55">{c.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 xl:flex-row xl:items-center">
              <CTAButton
                variant="azur"
                size="lg"
                label={t.visit.cta}
                location="visit"
                className="w-full xl:w-auto"
              />
              <button
                type="button"
                onClick={() => openFlow("visit")}
                className="inline-flex w-full items-center justify-center gap-3 border border-noir/15 bg-white px-8 py-5 text-noir transition-colors duration-300 hover:border-noir/40 cursor-pointer focus-azur xl:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                <span className="text-[0.78rem] uppercase tracking-[0.24em]">
                  {t.common.whatsapp}
                </span>
              </button>
            </div>

            <div className="mt-6">
              <PhoneLink location="visit" label={t.common.callUs} />
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[36rem]"
            >
              <Image
                src="/photos/visit/atelier.jpg"
                alt={t.visit.title1}
                fill
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/15 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="eyebrow text-white/65">PDA</span>
                <p className="mt-3 max-w-md font-display text-xl font-light italic leading-snug sm:text-2xl">
                  {t.visit.pullquote}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
