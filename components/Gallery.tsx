"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { useT } from "./AppProviders";
import { SectionTitle } from "./SectionTitle";
import { CTAButton } from "./CTAButton";

export function Gallery() {
  const t = useT();
  const items = t.gallery.items;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i + 1) % items.length,
      ),
    [items.length],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + items.length) % items.length,
      ),
    [items.length],
  );

  // Body scroll lock
  useEffect(() => {
    if (openIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [openIndex]);

  // Keyboard nav
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, next, prev]);

  const current = openIndex !== null ? items[openIndex] : null;

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
          {items.map((item, i) => (
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
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`${t.gallery.viewLarge} : ${item.title}`}
                className="block w-full cursor-pointer text-left"
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
                  <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center bg-white/10 text-white/0 backdrop-blur-sm ring-1 ring-white/15 transition-all duration-500 group-hover:bg-white group-hover:text-noir group-hover:ring-white">
                    <Maximize2 strokeWidth={1.25} className="h-4 w-4" />
                  </div>
                </div>
              </button>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <CTAButton variant="primary-dark" size="lg" label={t.gallery.cta} />
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {current && openIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            className="fixed inset-0 z-[120] flex items-center justify-center"
          >
            <button
              type="button"
              aria-label={t.gallery.lightboxClose}
              onClick={close}
              className="absolute inset-0 cursor-zoom-out bg-noir/95 backdrop-blur-md"
            />

            {/* Top bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-6 px-6 py-6 sm:px-10 sm:py-8">
              <div className="pointer-events-auto text-white">
                <span className="eyebrow text-white/55">{current.tag}</span>
                <p className="mt-2 font-display text-lg font-light sm:text-xl">
                  {current.title}
                </p>
              </div>
              <div className="pointer-events-auto flex items-center gap-3">
                <span className="font-display text-xs tracking-[0.22em] text-white/55">
                  {String(openIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.gallery.lightboxClose}
                  className="inline-flex h-11 w-11 items-center justify-center border border-white/20 text-white/85 transition-colors hover:border-white hover:bg-white hover:text-noir cursor-pointer"
                >
                  <X strokeWidth={1.25} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-[1] mx-4 my-24 flex max-h-[80vh] w-full max-w-6xl items-center justify-center sm:mx-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={current.src}
                    alt={current.title}
                    width={2400}
                    height={1800}
                    sizes="(min-width: 1024px) 90vw, 100vw"
                    className="mx-auto max-h-[80vh] w-auto object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next */}
            <button
              type="button"
              onClick={prev}
              aria-label={t.gallery.lightboxPrev}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center border border-white/20 text-white/85 transition-colors hover:border-white hover:bg-white hover:text-noir cursor-pointer sm:left-8 sm:h-14 sm:w-14"
            >
              <ArrowLeft strokeWidth={1.25} className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t.gallery.lightboxNext}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center border border-white/20 text-white/85 transition-colors hover:border-white hover:bg-white hover:text-noir cursor-pointer sm:right-8 sm:h-14 sm:w-14"
            >
              <ArrowRight strokeWidth={1.25} className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
