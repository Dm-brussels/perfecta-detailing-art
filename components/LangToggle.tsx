"use client";

import { useLang } from "./AppProviders";

type Variant = "light" | "dark";

/**
 * Sélecteur de langue discret : « FR | EN ».
 * La langue active est en pleine opacité, l'autre est cliquable et estompée.
 */
export function LangToggle({
  variant = "dark",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const { lang, setLang } = useLang();
  const light = variant === "light";

  const active = light ? "text-white" : "text-noir";
  const idle = light
    ? "text-white/45 hover:text-white/80"
    : "text-noir/40 hover:text-noir/75";

  return (
    <div
      className={`flex items-center gap-1.5 text-[0.68rem] tracking-[0.18em] ${className}`}
    >
      {(["fr", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i === 1 && (
            <span
              aria-hidden
              className={light ? "text-white/25" : "text-noir/20"}
            >
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-current={lang === l ? "true" : undefined}
            aria-label={l === "fr" ? "Français" : "English"}
            className={`font-display uppercase transition-colors duration-300 cursor-pointer focus-azur ${
              lang === l ? active : idle
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
