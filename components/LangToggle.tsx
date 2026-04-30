"use client";

import { useLang } from "./AppProviders";

type Variant = "light" | "dark";

export function LangToggle({
  variant = "dark",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const { lang, setLang } = useLang();
  const isEn = lang === "en";
  const light = variant === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEn}
      aria-label={`Switch language — currently ${lang.toUpperCase()}`}
      onClick={() => setLang(isEn ? "fr" : "en")}
      className={`group relative inline-flex h-7 w-[4.25rem] items-center rounded-full transition-colors duration-500 cursor-pointer ${
        light
          ? "bg-white/8 ring-1 ring-inset ring-white/20 hover:ring-white/35"
          : "bg-noir/[0.04] ring-1 ring-inset ring-noir/10 hover:ring-noir/25"
      } ${className}`}
    >
      {/* Track labels */}
      <span
        className={`absolute inset-y-0 left-0 flex w-1/2 items-center justify-center text-[0.6rem] font-medium uppercase tracking-[0.18em] transition-colors duration-500 ${
          isEn
            ? light
              ? "text-white/40"
              : "text-noir/35"
            : light
              ? "text-white/95"
              : "text-noir/85"
        }`}
      >
        FR
      </span>
      <span
        className={`absolute inset-y-0 right-0 flex w-1/2 items-center justify-center text-[0.6rem] font-medium uppercase tracking-[0.18em] transition-colors duration-500 ${
          isEn
            ? light
              ? "text-white/95"
              : "text-noir/85"
            : light
              ? "text-white/40"
              : "text-noir/35"
        }`}
      >
        EN
      </span>

      {/* Pearl */}
      <span
        aria-hidden
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 transform-gpu transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isEn ? "left-[calc(100%-1.5rem)]" : "left-1"
        }`}
      >
        <span
          className={`relative block h-5 w-5 rounded-full transition-shadow duration-500 ${
            light
              ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.10)]"
              : "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.10),0_4px_12px_rgba(0,0,0,0.06)] ring-1 ring-noir/8"
          }`}
        >
          {/* Olive accent dot — appears only when EN active */}
          <span
            className={`absolute left-1/2 top-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-olive transition-opacity duration-500 ${
              isEn ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>
      </span>
    </button>
  );
}
