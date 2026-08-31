"use client";

import { Clock, FileCheck2, ShieldCheck, Car } from "lucide-react";
import { useT } from "./AppProviders";
import { SectionTitle } from "./SectionTitle";

/**
 * Section d'engagements : ce que le prospect obtient en nous contactant,
 * avant tout devis. Se termine par le défilé des marques traitées,
 * volontairement mixte, du véhicule du quotidien à la sportive.
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
    <section className="relative border-y border-noir/8 bg-bone py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionTitle
          eyebrow={t.trust.eyebrow}
          title={
            <>
              {t.trust.title1}
              <br />
              <span className="italic">{t.trust.title2}</span>
            </>
          }
          description={t.trust.desc}
        />

        <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {t.trust.items.map((item, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div
                key={item.k}
                className="card flex flex-col p-6 transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(9,9,9,0.07)] sm:p-7"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center bg-noir/[0.05] text-noir">
                  <Icon strokeWidth={1.4} className="h-5 w-5" />
                </span>
                <span className="mt-5 text-[0.58rem] uppercase tracking-[0.24em] text-noir/45">
                  {item.k}
                </span>
                <span className="mt-1.5 font-display text-lg font-light leading-snug text-noir">
                  {item.v}
                </span>
                <span aria-hidden className="my-4 block h-px w-8 bg-noir/15" />
                <p className="text-sm leading-relaxed text-noir/65">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-14 px-6 text-center font-display text-base italic text-noir/60 sm:text-lg">
        {t.trust.note}
      </p>

      <div className="relative mt-8 overflow-hidden">
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
