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

        <div className="mt-16 grid grid-cols-1 gap-px bg-noir/8 sm:grid-cols-2 lg:grid-cols-3">
          {t.why.pillars.map((p, i) => {
            const Icon = ICONS[p.icon] ?? Sparkles;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06 }}
                className="group relative bg-white p-10 transition-colors duration-500 hover:bg-bone"
              >
                <Icon
                  strokeWidth={1.1}
                  className="h-6 w-6 text-olive transition-transform duration-500 group-hover:scale-110"
                />
                <h3 className="mt-6 font-display text-xl font-light text-noir sm:text-2xl">
                  {p.title}
                </h3>
                <span aria-hidden className="my-5 block h-px w-8 bg-noir/15" />
                <p className="text-sm leading-relaxed text-noir/65">{p.text}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <CTAButton variant="primary-dark" size="lg" label={t.why.cta} />
        </div>
      </div>
    </section>
  );
}
