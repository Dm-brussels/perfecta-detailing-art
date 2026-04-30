"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useT } from "./AppProviders";
import { SectionTitle } from "./SectionTitle";
import { CTAButton } from "./CTAButton";

export function Gallery() {
  const t = useT();
  return (
    <section id="galerie" className="relative bg-bone py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrow={t.gallery.eyebrow}
            title={
              <>
                {t.gallery.title1}
                <br />
                <span className="italic">{t.gallery.title2}</span>
              </>
            }
            description={t.gallery.desc}
          />
          <CTAButton
            variant="ghost-dark"
            label={t.gallery.cta}
            arrow="up-right"
            className="hidden self-start lg:inline-flex"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {t.gallery.items.map((item, i) => (
            <motion.figure
              key={item.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.06 }}
              className={`group relative overflow-hidden ${
                i === 0 || i === 5 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div className={`relative ${i === 0 || i === 5 ? "aspect-square" : "aspect-[4/5]"}`}>
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="eyebrow text-white/70">{item.tag}</span>
                  <p className="mt-2 font-display text-base font-light text-white sm:text-lg">
                    {item.title}
                  </p>
                </figcaption>
                <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center bg-white/0 text-white/0 ring-1 ring-white/0 transition-all duration-500 group-hover:bg-white group-hover:text-noir group-hover:ring-white">
                  <ArrowUpRight strokeWidth={1.25} className="h-4 w-4" />
                </div>
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <CTAButton variant="primary-dark" size="lg" label={t.gallery.cta} />
        </div>
      </div>
    </section>
  );
}
