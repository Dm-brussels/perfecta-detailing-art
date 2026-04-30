"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useT } from "./AppProviders";
import { CTAButton } from "./CTAButton";

export function Showcase() {
  const t = useT();
  return (
    <section className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
          {/* Image collage */}
          <div className="relative lg:col-span-7">
            <div className="grid grid-cols-12 grid-rows-12 gap-3 sm:gap-4 aspect-[4/5] sm:aspect-[6/5]">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative col-span-7 row-span-8 overflow-hidden"
              >
                <Image
                  src="/photos/porsche/01.jpg"
                  alt="Porsche GT4 RS"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="relative col-span-5 col-start-8 row-span-5 overflow-hidden"
              >
                <Image
                  src="/photos/porsche/05.jpg"
                  alt="Porsche GT4 RS"
                  fill
                  sizes="(min-width: 1024px) 25vw, 45vw"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative col-span-5 col-start-8 row-span-7 row-start-6 overflow-hidden"
              >
                <Image
                  src="/photos/porsche/12.jpg"
                  alt="Porsche GT4 RS"
                  fill
                  sizes="(min-width: 1024px) 25vw, 45vw"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="relative col-span-7 row-span-4 row-start-9 overflow-hidden"
              >
                <Image
                  src="/photos/porsche/08.jpg"
                  alt="Porsche GT4 RS"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-5">
            <span className="eyebrow text-noir/55">{t.showcase.eyebrow}</span>
            <span aria-hidden className="my-6 block h-px w-12 bg-olive" />
            <h2 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-noir text-balance sm:text-5xl">
              {t.showcase.title1}
              <br />
              <span className="italic">{t.showcase.title2}</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-noir/70">
              {t.showcase.desc}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-px bg-noir/10">
              {t.showcase.stats.map((s) => (
                <div key={s.k} className="bg-white p-6">
                  <dt className="eyebrow text-noir/50">{s.k}</dt>
                  <dd className="mt-2 font-display text-lg font-light text-noir">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <CTAButton variant="primary-dark" label={t.showcase.cta} />
              <a
                href="#galerie"
                className="group inline-flex items-center gap-3 px-2 py-3 text-[0.72rem] uppercase tracking-[0.22em] text-noir transition-colors hover:text-olive cursor-pointer"
              >
                {t.showcase.seeMore}
                <ArrowUpRight
                  strokeWidth={1.25}
                  className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 font-display text-sm italic text-noir/60">
              <span aria-hidden className="block h-px w-6 bg-noir/40" />
              PDA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
