"use client";

import { useT } from "./AppProviders";

type Variant = "light" | "dark";

export function Wordmark({
  variant = "dark",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const t = useT();
  const color = variant === "light" ? "text-white" : "text-noir";
  return (
    <div className={`flex flex-col items-start ${color} ${className}`}>
      <span className="display-lockup text-[0.78rem] sm:text-sm leading-none">
        {t.common.brandName}
      </span>
      <span
        aria-hidden
        className={`mt-1 h-px w-full ${variant === "light" ? "bg-white/40" : "bg-noir/40"}`}
      />
      <span className="mt-1 display-lockup text-[0.55rem] sm:text-[0.6rem] tracking-[0.32em] opacity-80">
        {t.common.brandTagline}
      </span>
    </div>
  );
}
