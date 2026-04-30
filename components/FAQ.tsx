"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useT } from "./AppProviders";
import { SectionTitle } from "./SectionTitle";
import { CTAButton } from "./CTAButton";

export function FAQ() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionTitle
              eyebrow={t.faq.eyebrow}
              title={
                <>
                  {t.faq.title1}
                  <br />
                  <span className="italic">{t.faq.title2}</span>
                </>
              }
              description={t.faq.desc}
            />
            <div className="mt-10">
              <CTAButton variant="primary-dark" label={t.faq.cta} />
            </div>
          </div>

          <ul className="lg:col-span-8">
            {t.faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={item.q}
                  className="border-t border-noir/10 last:border-b last:border-noir/10"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-start gap-8 py-7 text-left transition-colors duration-300 hover:text-olive cursor-pointer"
                  >
                    <span className="font-display text-sm tracking-[0.32em] text-olive shrink-0 pt-1">
                      0{i + 1}
                    </span>
                    <span className="flex-1 font-display text-lg font-light text-noir transition-colors group-hover:text-olive sm:text-xl">
                      {item.q}
                    </span>
                    <span
                      className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center border transition-all duration-500 ${
                        isOpen
                          ? "border-olive bg-olive text-white"
                          : "border-noir/30 text-noir group-hover:border-olive group-hover:text-olive"
                      }`}
                    >
                      {isOpen ? (
                        <Minus strokeWidth={1.5} className="h-3.5 w-3.5" />
                      ) : (
                        <Plus strokeWidth={1.5} className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-12 gap-8 pb-8 pl-0 sm:pl-2">
                          <div className="col-span-12 sm:col-span-1" />
                          <p className="col-span-12 max-w-2xl text-sm leading-relaxed text-noir/65 sm:col-span-11 sm:text-base">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
