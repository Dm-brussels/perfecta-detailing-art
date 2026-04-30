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

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEn}
      aria-label={`Switch language — currently ${lang.toUpperCase()}`}
      onClick={() => setLang(isEn ? "fr" : "en")}
      className={`group relative inline-flex h-9 w-[5.25rem] items-center overflow-hidden rounded-full border transition-colors duration-500 cursor-pointer ${
        variant === "light"
          ? "border-white/30 bg-white/10 hover:bg-white/15 hover:border-white/50"
          : "border-noir/15 bg-noir/[0.03] hover:bg-noir/[0.06] hover:border-noir/30"
      } ${className}`}
    >
      {/* Background track labels */}
      <span
        className={`absolute inset-y-0 left-0 flex w-1/2 items-center justify-center text-[0.65rem] font-medium uppercase tracking-[0.2em] transition-colors ${
          isEn
            ? variant === "light"
              ? "text-white/45"
              : "text-noir/35"
            : variant === "light"
              ? "text-white"
              : "text-noir"
        }`}
      >
        FR
      </span>
      <span
        className={`absolute inset-y-0 right-0 flex w-1/2 items-center justify-center text-[0.65rem] font-medium uppercase tracking-[0.2em] transition-colors ${
          isEn
            ? variant === "light"
              ? "text-white"
              : "text-noir"
            : variant === "light"
              ? "text-white/45"
              : "text-noir/35"
        }`}
      >
        EN
      </span>

      {/* Sphere */}
      <span
        aria-hidden
        className={`absolute top-1/2 -translate-y-1/2 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isEn ? "left-[calc(100%-1.875rem)]" : "left-1"
        }`}
      >
        <span className="block h-7 w-7 rounded-full bg-gradient-to-br from-olive-light via-olive to-olive-dark shadow-[0_4px_14px_rgba(75,88,52,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]">
          <span className="block h-2 w-2 translate-x-1.5 translate-y-1.5 rounded-full bg-white/70 blur-[1px]" />
        </span>
      </span>
    </button>
  );
}
