"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useT, useWhatsApp } from "./AppProviders";
import { Wordmark } from "./Wordmark";
import { LangToggle } from "./LangToggle";
import { PhoneLink } from "./PhoneLink";
import { WhatsAppIcon } from "./Icons";
import { track } from "@/lib/analytics";

export function Header() {
  const t = useT();
  const { openFlow } = useWhatsApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const NAV = [
    { href: "#realisations", label: t.nav.work },
    { href: "#services", label: t.nav.services },
    { href: "#process", label: t.nav.process },
    { href: "#pourquoi", label: t.nav.why },
    { href: "#avis", label: t.nav.reviews },
    { href: "#faq", label: t.nav.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-noir/8"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-6 sm:px-8">
          <Link href="#top" aria-label={t.nav.home} className="flex items-center gap-3">
            <Wordmark variant={scrolled ? "dark" : "light"} />
          </Link>

          <nav className="hidden xl:flex items-center gap-6">
            {NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap text-[0.74rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  scrolled ? "text-noir/65 hover:text-noir" : "text-white/75 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 sm:gap-5">
            {/* Téléphone — visible dès le tablet */}
            <span className="hidden md:contents">
              <PhoneLink
                location="header"
                variant={scrolled ? "dark" : "light"}
                label={t.common.callUs}
              />
              <span
                aria-hidden
                className={`h-6 w-px ${scrolled ? "bg-noir/12" : "bg-white/20"}`}
              />
            </span>

            <LangToggle variant={scrolled ? "dark" : "light"} />

            <Link
              href="/devis"
              onClick={() => track("cta_click", { location: "header" })}
              className="hidden sm:inline-flex h-11 shrink-0 items-center whitespace-nowrap bg-noir px-5 text-[0.7rem] uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-noir/80 cursor-pointer focus-azur lg:px-6 lg:text-[0.72rem] lg:tracking-[0.18em]"
            >
              {t.common.cta}
            </Link>

            <button
              type="button"
              aria-label={t.nav.menuOpen}
              onClick={() => setOpen(true)}
              className={`xl:hidden inline-flex h-10 w-10 items-center justify-center cursor-pointer focus-azur ${
                scrolled ? "text-noir" : "text-white"
              }`}
            >
              <Menu strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] overflow-y-auto bg-noir text-white transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-20 items-center justify-between gap-4 px-6 sm:px-8 max-w-7xl mx-auto">
          <Wordmark variant="light" />
          <div className="flex items-center gap-4">
            <LangToggle variant="light" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.nav.menuClose}
              className="inline-flex h-10 w-10 items-center justify-center cursor-pointer focus-azur"
            >
              <X strokeWidth={1.4} />
            </button>
          </div>
        </div>

        <nav className="mt-10 flex flex-col items-center gap-7 px-6 pb-16">
          {NAV.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display-lockup text-2xl tracking-[0.2em] text-white/85 hover:text-white transition-colors"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 600ms ${i * 60}ms, transform 600ms ${i * 60}ms`,
              }}
            >
              {l.label}
            </a>
          ))}

          <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
            <Link
              href="/devis"
              onClick={() => {
                track("cta_click", { location: "mobile_menu" });
                setOpen(false);
              }}
              className="inline-flex h-14 items-center justify-center bg-white px-8 text-[0.74rem] uppercase tracking-[0.22em] text-noir transition-colors hover:bg-bone cursor-pointer focus-azur"
            >
              {t.common.cta}
            </Link>
            <button
              type="button"
              onClick={() => {
                openFlow("mobile_menu");
                setOpen(false);
              }}
              className="inline-flex h-14 items-center justify-center gap-3 bg-whatsapp px-8 text-[0.74rem] uppercase tracking-[0.22em] text-white transition-colors hover:bg-whatsapp-dark cursor-pointer focus-azur"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.common.whatsapp}
            </button>
            <PhoneLink
              location="mobile_menu"
              variant="light"
              label={t.common.callUs}
              className="mt-3 justify-center"
            />
          </div>
        </nav>
      </div>
    </>
  );
}
