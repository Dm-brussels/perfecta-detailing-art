"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useT } from "./AppProviders";
import { Wordmark } from "./Wordmark";
import { LangToggle } from "./LangToggle";

export function Header() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const NAV = [
    { href: "#services", label: t.nav.services },
    { href: "#process", label: t.nav.process },
    { href: "#galerie", label: t.nav.gallery },
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
            ? "bg-white/85 backdrop-blur-xl border-b border-noir/5"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 sm:px-8">
          <Link href="#top" aria-label={t.nav.home} className="flex items-center gap-3">
            <Wordmark variant={scrolled ? "dark" : "light"} />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-[0.78rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  scrolled ? "text-noir/70 hover:text-olive" : "text-white/80 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LangToggle variant={scrolled ? "dark" : "light"} />
            <Link
              href="/devis"
              className={`hidden sm:inline-flex h-10 items-center px-5 text-[0.72rem] uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer ${
                scrolled
                  ? "bg-noir text-white hover:bg-olive"
                  : "bg-white text-noir hover:bg-olive hover:text-white"
              }`}
            >
              {t.common.cta}
            </Link>
            <button
              type="button"
              aria-label={t.nav.menuOpen}
              onClick={() => setOpen(true)}
              className={`lg:hidden inline-flex h-10 w-10 items-center justify-center cursor-pointer ${
                scrolled ? "text-noir" : "text-white"
              }`}
            >
              <Menu strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-noir text-white transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-20 items-center justify-between gap-4 px-6 sm:px-8 max-w-7xl mx-auto">
          <Wordmark variant="light" />
          <div className="flex items-center gap-3">
            <LangToggle variant="light" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.nav.menuClose}
              className="inline-flex h-10 w-10 items-center justify-center cursor-pointer"
            >
              <X strokeWidth={1.25} />
            </button>
          </div>
        </div>
        <nav className="mt-12 flex flex-col items-center gap-8 px-6">
          {NAV.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display-lockup text-2xl tracking-[0.2em] text-white/85 hover:text-olive-light transition-colors"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 600ms ${i * 60}ms, transform 600ms ${i * 60}ms`,
              }}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/devis"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex h-12 items-center bg-white px-8 text-[0.72rem] uppercase tracking-[0.22em] text-noir hover:bg-olive hover:text-white transition-colors cursor-pointer"
          >
            {t.common.cta}
          </Link>
        </nav>
      </div>
    </>
  );
}
