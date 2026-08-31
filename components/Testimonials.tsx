"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useT } from "./AppProviders";
import { CTAButton } from "./CTAButton";

export function Testimonials() {
  const t = useT();
  const [i, setI] = useState(0);
  const items = t.testimonials.items;
  const item = items[i];

  return (
    <section id="avis" className="relative bg-bone-glow py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="eyebrow text-noir/55">{t.testimonials.eyebrow}</span>
            <span aria-hidden className="my-6 block h-px w-12 bg-olive" />
            <h2 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-noir text-balance sm:text-5xl">
              {t.testimonials.title1}
              <br />
              <span className="italic">{t.testimonials.title2}</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-noir/65">
              {t.testimonials.desc}
            </p>

            <div className="mt-10 flex items-center gap-4">
              <button
                type="button"
                aria-label={t.testimonials.prev}
                onClick={() => setI((p) => (p === 0 ? items.length - 1 : p - 1))}
                className="inline-flex h-12 w-12 items-center justify-center border border-noir/15 text-noir/70 transition-colors hover:border-olive hover:bg-olive hover:text-white cursor-pointer"
              >
                <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={t.testimonials.next}
                onClick={() => setI((p) => (p === items.length - 1 ? 0 : p + 1))}
                className="inline-flex h-12 w-12 items-center justify-center border border-noir/15 text-noir/70 transition-colors hover:border-olive hover:bg-olive hover:text-white cursor-pointer"
              >
                <ArrowRight strokeWidth={1.25} className="h-4 w-4" />
              </button>
              <span className="ml-2 font-display text-sm tracking-[0.2em] text-noir/45">
                0{i + 1} / 0{items.length}
              </span>
            </div>

            <div className="mt-10">
              <CTAButton variant="outline-dark" label={t.testimonials.cta} location="testimonials" />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="relative min-h-[18rem]">
                <motion.figure
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="absolute -left-2 -top-12 font-display text-[12rem] font-light leading-none text-olive/20 sm:text-[16rem]"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="relative font-display text-2xl font-light italic leading-snug text-noir text-balance sm:text-3xl lg:text-4xl">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-10 flex items-center gap-4">
                    <span aria-hidden className="block h-px w-12 bg-noir/40" />
                    <div>
                      <span className="block font-display text-base text-noir">
                        {item.name}
                      </span>
                      <span className="block text-sm text-noir/55">{item.car}</span>
                    </div>
                  </figcaption>
                </motion.figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
