"use client";

const VEHICLE_BRANDS = [
  "Porsche",
  "Aston Martin",
  "Mercedes-AMG",
  "McLaren",
  "Ferrari",
  "Lamborghini",
  "Audi RS",
  "BMW M",
];

export function Marquee() {
  const items = [...VEHICLE_BRANDS, ...VEHICLE_BRANDS];
  return (
    <section
      aria-label="Marques traitées"
      className="border-y border-noir/8 bg-bone py-10 overflow-hidden"
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bone to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bone to-transparent" />
        <div className="flex animate-marquee gap-16 whitespace-nowrap will-change-transform">
          {items.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="display-lockup text-2xl tracking-[0.18em] text-noir/55"
            >
              {brand}
              <span aria-hidden className="ml-16 text-noir/15">
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
          animation: marquee 38s linear infinite;
        }
      `}</style>
    </section>
  );
}
