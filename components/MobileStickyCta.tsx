"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useQuoteModal, useT } from "./AppProviders";

export function MobileStickyCta() {
  const t = useT();
  const { openModal, open } = useQuoteModal();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after the user has scrolled past first viewport
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 transition-all duration-500 lg:hidden ${
        visible && !open
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0"
      }`}
      aria-hidden={!visible || open}
    >
      <button
        type="button"
        onClick={() => openModal()}
        className="pointer-events-auto group flex w-full max-w-md items-center justify-between gap-6 bg-noir px-6 py-4 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-colors hover:bg-olive cursor-pointer"
      >
        <span className="flex flex-col items-start">
          <span className="text-[0.62rem] uppercase tracking-[0.32em] text-white/55">
            — PDA
          </span>
          <span className="mt-1 text-[0.78rem] uppercase tracking-[0.22em]">
            {t.common.cta}
          </span>
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-noir transition-transform duration-500 group-hover:translate-x-1">
          <ArrowRight strokeWidth={1.4} className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
}
