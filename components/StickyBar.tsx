"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT, useWhatsApp } from "./AppProviders";
import { WhatsAppIcon } from "./Icons";
import { track } from "@/lib/analytics";

/**
 * Barre d'action permanente, mobile et desktop : deux chemins de conversion,
 * le devis en bleu et WhatsApp en vert.
 */
export function StickyBar() {
  const t = useT();
  const pathname = usePathname();
  const { openFlow } = useWhatsApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Inutile sur la page de devis elle-même
  if (pathname?.startsWith("/devis")) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 transition-all duration-500 sm:px-6 sm:pb-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "invisible translate-y-8 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="pointer-events-auto flex w-full max-w-2xl items-stretch gap-2 border border-noir/10 bg-white/95 p-2 shadow-[0_16px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <Link
          href="/devis"
          onClick={() => track("cta_click", { location: "sticky_bar" })}
          className="group flex flex-1 items-center justify-center gap-3 bg-azur px-4 py-4 text-white transition-colors hover:bg-azur-hover cursor-pointer focus-azur sm:gap-4"
        >
          <span className="text-[0.72rem] uppercase tracking-[0.18em] sm:text-[0.76rem] sm:tracking-[0.22em]">
            {t.common.cta}
          </span>
          <ArrowRight
            strokeWidth={1.75}
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <button
          type="button"
          onClick={() => openFlow("sticky_bar")}
          className="flex shrink-0 items-center justify-center gap-2.5 bg-whatsapp px-4 py-4 text-white transition-colors hover:bg-whatsapp-dark cursor-pointer focus-azur sm:px-6"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          <span className="text-[0.72rem] uppercase tracking-[0.18em] sm:text-[0.76rem] sm:tracking-[0.22em]">
            {t.common.whatsapp}
          </span>
        </button>
      </div>
    </div>
  );
}
