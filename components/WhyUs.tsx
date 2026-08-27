"use client";

import { motion } from "framer-motion";
import { Hand, Microscope, ShieldCheck, Sparkles, Timer, Workflow } from "lucide-react";
import { useT } from "./AppProviders";
import { SectionTitle } from "./SectionTitle";
import { CTAButton } from "./CTAButton";

const ICONS: Record<string, typeof Hand> = {
  hand: Hand,
  microscope: Microscope,
  shield: ShieldCheck,
  workflow: Workflow,
  timer: Timer,
  sparkles: Sparkles,
};

export function WhyUs() {
  const t = useT();
  return (
    <section id="pourquoi" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionTitle
          eyebrow={t.why.eyebrow}
          title={
            <>
              {t.why.title1}
              <br />
              <span className="italic">{t.why.title2}</span>
            </>
          }
          description={t.why.desc}
        />

        <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {t.why.pillars.map((p, i) => {
            const Icon = ICONS[p.icon] ?? Sparkles;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.06 }}
                className="card group relative p-8 transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(9,9,9,0.07)]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center bg-olive/[0.08] text-olive">
                  <Icon
                    strokeWidth={1.3}
                    className="h-5 w-5 transition-transform duration-500 group-hover:scale-110"
                  />
                </span>
                <h3 className="mt-5 font-display text-lg font-light text-noir sm:text-xl">
                  {p.title}
                </h3>
                <span aria-hidden className="my-4 block h-px w-8 bg-noir/15" />
                <p className="text-sm leading-relaxed text-noir/65">{p.text}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <CTAButton variant="azur" size="lg" label={t.why.cta} location="why_us" />
        </div>
      </div>
    </section>
  );
}
