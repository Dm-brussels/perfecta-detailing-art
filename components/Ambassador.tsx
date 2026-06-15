"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";
import { useT } from "./AppProviders";

export function Ambassador() {
  const t = useT();
  return (
    <section className="relative overflow-hidden border-y border-noir/8 bg-bone py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:col-span-5 lg:justify-start"
          >
            <div className="relative w-full max-w-[20rem] sm:max-w-[24rem]">
              <Image
                src="/logos/labocosmetica-navy.png"
                alt={t.ambassador.alt}
                width={1100}
                height={536}
                sizes="(min-width: 1024px) 24rem, 20rem"
                className="h-auto w-full"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <span className="eyebrow text-noir/55">{t.ambassador.eyebrow}</span>
            <span aria-hidden className="my-5 block h-px w-12 bg-olive" />
            <h2 className="font-display text-3xl font-light leading-[1.1] tracking-tight text-noir text-balance sm:text-4xl">
              {t.ambassador.lead}{" "}
              <span className="italic">{t.ambassador.titleLine}.</span>
            </h2>

            <ul className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-3">
              <li className="inline-flex items-center gap-3 border border-noir/12 bg-white px-5 py-3">
                <Award strokeWidth={1.25} className="h-5 w-5 shrink-0 text-olive" />
                <span className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-noir">
                  {t.ambassador.role1}
                </span>
              </li>
              <li className="inline-flex items-center gap-3 border border-noir/12 bg-white px-5 py-3">
                <GraduationCap
                  strokeWidth={1.25}
                  className="h-5 w-5 shrink-0 text-olive"
                />
                <span className="text-[0.8rem] font-medium uppercase tracking-[0.16em] text-noir">
                  {t.ambassador.role2}
                </span>
              </li>
            </ul>

            <p className="mt-8 max-w-xl text-sm leading-relaxed text-noir/60 sm:text-base">
              {t.ambassador.note}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
