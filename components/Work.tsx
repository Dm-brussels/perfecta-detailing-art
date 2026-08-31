"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useT } from "./AppProviders";
import { SectionTitle } from "./SectionTitle";
import { CTAButton } from "./CTAButton";
import { track } from "@/lib/analytics";

/**
 * Carrousel des prestations, juste sous le hero.
 *
 * Chaque vignette met en avant la prestation, pas le modèle du véhicule, et
 * mène directement au formulaire avec le service pré-sélectionné.
 *
 * Défilement natif avec scroll-snap : pas de dépendance, geste tactile natif
 * sur mobile, flèches sur desktop.
 */
export function Work() {
  const t = useT();
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <section id="realisations" className="relative bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrow={t.work.eyebrow}
            title={
              <>
                {t.work.title1}
                <br />
                <span className="italic">{t.work.title2}</span>
              </>
            }
            description={t.work.desc}
          />

          {/* Flèches — desktop uniquement, le tactile suffit sur mobile */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label={t.work.prev}
              className="inline-flex h-12 w-12 items-center justify-center border border-noir/15 text-noir/70 transition-colors hover:border-noir hover:bg-noir hover:text-white disabled:pointer-events-none disabled:opacity-30 cursor-pointer focus-azur"
            >
              <ArrowLeft strokeWidth={1.4} className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label={t.work.next}
              className="inline-flex h-12 w-12 items-center justify-center border border-noir/15 text-noir/70 transition-colors hover:border-noir hover:bg-noir hover:text-white disabled:pointer-events-none disabled:opacity-30 cursor-pointer focus-azur"
            >
              <ArrowRight strokeWidth={1.4} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Piste : déborde volontairement de la grille pour un effet de continuité */}
      <ul
        ref={trackRef}
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {t.work.items.map((item) => (
          <li
            key={item.src}
            className="w-[76vw] shrink-0 snap-start sm:w-[42vw] lg:w-[23rem]"
          >
            <Link
              href={`/devis?service=${item.serviceId}`}
              onClick={() =>
                track("cta_click", {
                  location: "work_card",
                  service: item.serviceId,
                })
              }
              className="group block focus-azur"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-bone">
                <Image
                  src={item.src}
                  alt={item.service}
                  fill
                  sizes="(min-width: 1024px) 23rem, (min-width: 640px) 42vw, 76vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                />
              </div>

              {/* Encart sous la photo : prestation, puis CTA discret */}
              <div className="card border-t-0 px-5 py-5">
                <span className="block font-display text-sm font-medium uppercase tracking-[0.14em] text-noir">
                  {item.service}
                </span>
                <span className="mt-3 flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-noir/45 transition-colors duration-300 group-hover:text-noir">
                  {t.work.cardCta}
                  <ArrowUpRight
                    strokeWidth={1.6}
                    className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-10 flex max-w-7xl justify-center px-6 sm:px-8">
        <CTAButton
          variant="primary-dark"
          size="lg"
          label={t.work.cta}
          location="work_footer"
        />
      </div>
    </section>
  );
}
