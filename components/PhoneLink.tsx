"use client";

import { Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { track } from "@/lib/analytics";

type Props = {
  /** Repère envoyé au tracking (header, footer, visit…) */
  location: string;
  variant?: "light" | "dark";
  /** Affiche le libellé « Appelez-nous » au-dessus du numéro */
  label?: string;
  className?: string;
  showIcon?: boolean;
};

export function PhoneLink({
  location,
  variant = "dark",
  label,
  className = "",
  showIcon = true,
}: Props) {
  const light = variant === "light";

  return (
    <a
      href={PHONE_HREF}
      onClick={() => track("phone_click", { location })}
      className={`group inline-flex items-center gap-2.5 transition-colors duration-300 focus-azur ${
        light ? "text-white/85 hover:text-white" : "text-noir/75 hover:text-noir"
      } ${className}`}
    >
      {showIcon && (
        <Phone
          strokeWidth={1.5}
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-rotate-12"
        />
      )}
      <span className="flex flex-col leading-tight">
        {label && (
          <span
            className={`text-[0.58rem] uppercase tracking-[0.24em] ${
              light ? "text-white/50" : "text-noir/45"
            }`}
          >
            {label}
          </span>
        )}
        <span className="font-display text-[0.82rem] tracking-[0.06em] whitespace-nowrap">
          {PHONE_DISPLAY}
        </span>
      </span>
    </a>
  );
}
