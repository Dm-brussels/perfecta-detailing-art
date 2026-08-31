"use client";

import { useT } from "./AppProviders";

export function Stats() {
  const t = useT();
  return (
    <section className="relative bg-bone-glow py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {t.stats.map((s) => (
            <div
              key={s.label}
              className="card p-6 transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(9,9,9,0.07)] sm:p-8"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-light tracking-tight text-noir sm:text-5xl">
                  {s.value}
                </span>
                {s.suffix && (
                  <span className="font-display text-sm font-light tracking-wide text-noir/55">
                    {s.suffix}
                  </span>
                )}
              </div>
              <span aria-hidden className="my-4 block h-px w-10 bg-olive" />
              <p className="text-sm leading-relaxed text-noir/65">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
