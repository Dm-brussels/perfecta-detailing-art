"use client";

import { useT } from "./AppProviders";

export function Stats() {
  const t = useT();
  return (
    <section className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-px overflow-hidden bg-noir/10 sm:grid-cols-2 lg:grid-cols-4">
          {t.stats.map((s) => (
            <div
              key={s.label}
              className="bg-white p-10 transition-colors duration-500 hover:bg-bone"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-light tracking-tight text-noir sm:text-6xl">
                  {s.value}
                </span>
                {s.suffix && (
                  <span className="font-display text-base font-light tracking-wide text-noir/60">
                    {s.suffix}
                  </span>
                )}
              </div>
              <span aria-hidden className="my-5 block h-px w-10 bg-olive" />
              <p className="text-sm leading-relaxed text-noir/65">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
