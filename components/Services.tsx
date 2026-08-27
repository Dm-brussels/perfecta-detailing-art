"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useT } from "./AppProviders";
import { SectionTitle } from "./SectionTitle";
import { CTAButton } from "./CTAButton";

const SERVICE_IMAGES: Record<string, string> = {
  ppf: "/photos/services/ppf.jpg",
  ceramique: "/photos/services/ceramique.jpg",
  detailing: "/photos/services/detailing.jpg",
  nettoyage: "/photos/services/nettoyage.jpg",
};

export function Services() {
  const t = useT();
  const [active, setActive] = useState<number>(0);
  const items = t.services.items;

  return (
    <section id="services" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrow={t.services.eyebrow}
            title={
              <>
                {t.services.title1}
                <br />
                <span className="italic">{t.services.title2}</span>
              </>
            }
            description={t.services.desc}
          />
          <CTAButton
            variant="azur"
            label={t.services.startProject}
            location="services_header"
            arrow="up-right"
            className="hidden self-start lg:inline-flex"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px bg-noir/10 lg:grid-cols-12">
          {/* Tabs list */}
          <ul className="flex flex-col bg-white lg:col-span-5">
            {items.map((s, i) => {
              const isActive = active === i;
              return (
                <li key={s.id} className="border-b border-noir/8 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`group flex w-full items-center justify-between gap-6 px-2 py-7 text-left transition-colors duration-500 cursor-pointer ${
                      isActive ? "text-noir" : "text-noir/55 hover:text-noir"
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <span
                        className={`font-display text-xs tracking-[0.32em] transition-colors ${
                          isActive ? "text-olive" : "text-noir/40"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span className="font-display text-2xl font-light leading-tight sm:text-3xl">
                        {s.name}
                      </span>
                    </div>
                    <span
                      className={`hidden h-px shrink-0 transition-all duration-500 sm:block ${
                        isActive ? "w-12 bg-olive" : "w-6 bg-noir/20"
                      }`}
                      aria-hidden
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Active service detail */}
          <div className="relative bg-bone p-8 lg:col-span-7 lg:p-12">
            {/* `key` change à chaque onglet : la div est remontée et rejoue
                son entrée. Pas d'`AnimatePresence`, dont la sortie ne se
                résout pas ici et bloquerait le montage du panneau suivant. */}
              <motion.div
                key={items[active].id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 gap-10 lg:grid-cols-2"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={SERVICE_IMAGES[items[active].id]}
                    alt={items[active].name}
                    fill
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-noir/10" />
                </div>

                <div className="flex flex-col justify-between gap-8">
                  <div>
                    <p className="font-display text-xl font-light italic leading-snug text-noir/85 sm:text-2xl">
                      {items[active].short}
                    </p>
                    <p className="mt-6 text-sm leading-relaxed text-noir/70 sm:text-base">
                      {items[active].description}
                    </p>
                    <ul className="mt-8 space-y-3">
                      {items[active].bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-3 text-sm text-noir/80 sm:text-[0.95rem]"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.55rem] block h-px w-4 shrink-0 bg-olive"
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <CTAButton
                    variant="azur"
                    label={t.services.ctaForThis}
                    presetServiceId={items[active].id}
                    location="services_detail"
                    arrow="up-right"
                    className="self-start"
                  />
                </div>
              </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
