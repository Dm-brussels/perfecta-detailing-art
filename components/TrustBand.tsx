"use client";

import { Clock, FileCheck2, ShieldCheck, Car } from "lucide-react";
import { useT } from "./AppProviders";

/**
 * Bandeau de réassurance placé juste sous le hero : quatre garanties lisibles
 * d'un coup d'œil, puis le défilé des marques traitées — volontairement mixte,
 * du véhicule du quotidien à la sportive.
 */
const ICONS = [Clock, FileCheck2, ShieldCheck, Car];

const VEHICLE_BRANDS = [
  "BMW",
  "Audi",
  "Mercedes-Benz",
  "Volkswagen",
  "Porsche",
  "Tesla",
  "Volvo",
  "Range Rover",
  "Peugeot",
  "Aston Martin",
];

export function TrustBand() {
  const t = useT();
  const items = [...VEHICLE_BRANDS, ...VEHICLE_BRANDS];

  return (
    <section
      aria-label={t.trust.note}
      className="border-y border-noir/8 bg-bone py-10 sm:py-12"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {t.trust.items.map((item, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div
                key={item.k}
                className="card flex items-start gap-3.5 p-4 sm:items-center sm:p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-azur/[0.08] text-azur">
                  <Icon strokeWidth={1.5} className="h-4 w-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[0.58rem] uppercase tracking-[0.24em] text-noir/45">
                    {item.k}
                  </span>
                  <span className="mt-1 font-display text-sm font-light leading-snug text-noir sm:text-[0.95rem]">
                    {item.v}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-10 px-6 text-center font-display text-sm italic text-noir/55 sm:text-base">
        {t.trust.note}
      </p>

      <div className="relative mt-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-bone to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-bone to-transparent sm:w-32" />
        <div className="flex animate-marquee gap-14 whitespace-nowrap will-change-transform">
          {items.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="display-lockup text-xl tracking-[0.18em] text-noir/45 sm:text-2xl"
            >
              {brand}
              <span aria-hidden className="ml-14 text-noir/15">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 14s linear infinite;
        }
        @media (min-width: 640px) {
          .animate-marquee {
            animation-duration: 28s;
          }
        }
      `}</style>
    </section>
  );
}
