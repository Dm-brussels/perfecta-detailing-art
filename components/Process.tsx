"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useT } from "./AppProviders";
import { SectionTitle } from "./SectionTitle";
import { CTAButton } from "./CTAButton";

export function Process() {
  const t = useT();
  return (
    <section
      id="process"
      className="relative bg-noir-glow py-24 text-white sm:py-32 grain"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionTitle
          variant="dark"
          eyebrow={t.process.eyebrow}
          title={
            <>
              {t.process.title1}
              <br />
              <span className="italic text-white/85">{t.process.title2}</span>
            </>
          }
          description={t.process.desc}
        />

        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Visual */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/photos/process/main.jpg"
                alt={t.process.title1}
                fill
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/55 via-noir/10 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/15" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="eyebrow text-white/65">{t.process.atelier}</span>
                <p className="mt-2 font-display text-lg font-light italic text-white">
                  {t.process.pullquote}
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol className="lg:col-span-7">
            {t.process.steps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="grid grid-cols-12 items-start gap-6 border-t border-white/15 py-10 last:border-b last:pb-12"
              >
                <span className="col-span-3 font-display text-xs tracking-[0.32em] text-olive-light sm:col-span-2">
                  {s.n}
                </span>
                <div className="col-span-9 sm:col-span-10">
                  <h3 className="font-display text-2xl font-light text-white sm:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                    {s.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-16 flex justify-center">
          <CTAButton variant="primary-light" size="lg" label={t.process.cta} />
        </div>
      </div>
    </section>
  );
}
