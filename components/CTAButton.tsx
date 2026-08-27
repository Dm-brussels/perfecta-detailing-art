"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useT } from "./AppProviders";
import { track } from "@/lib/analytics";

type Variant =
  /** CTA de conversion — bleu franc, à utiliser partout où l'on demande un devis */
  | "azur"
  | "primary-light"
  | "primary-dark"
  | "ghost-light"
  | "ghost-dark"
  | "outline-dark"
  | "outline-light";

type Props = {
  variant?: Variant;
  size?: "md" | "lg";
  label?: string;
  presetServiceId?: string;
  arrow?: "right" | "up-right" | "none";
  className?: string;
  fullWidth?: boolean;
  /** Repère envoyé au tracking pour situer le clic dans la page */
  location?: string;
};

export function CTAButton({
  variant = "azur",
  size = "md",
  label,
  presetServiceId,
  arrow = "right",
  className = "",
  fullWidth = false,
  location,
}: Props) {
  const t = useT();

  const finalLabel = label ?? t.common.cta;
  const isLg = size === "lg";

  const base = `group inline-flex items-center justify-between transition-all duration-300 cursor-pointer focus-azur ${
    fullWidth ? "w-full" : ""
  } ${isLg ? "px-8 py-5 gap-10" : "px-7 py-4 gap-8"}`;

  const variantClass = {
    azur: "bg-azur text-white hover:bg-azur-hover shadow-azur",
    "primary-light": "bg-white text-noir hover:bg-olive hover:text-white",
    "primary-dark": "bg-noir text-white hover:bg-olive",
    "outline-light": "border border-white/40 text-white hover:bg-white hover:text-noir",
    "outline-dark": "border border-noir text-noir hover:bg-noir hover:text-white",
    "ghost-light": "text-white hover:text-olive-light px-2 py-3",
    "ghost-dark": "text-noir hover:text-olive px-2 py-3",
  }[variant];

  const Icon = arrow === "up-right" ? ArrowUpRight : ArrowRight;

  const href = presetServiceId
    ? `/devis?service=${encodeURIComponent(presetServiceId)}`
    : "/devis";

  return (
    <Link
      href={href}
      onClick={() =>
        track("cta_click", { location: location ?? "page", service: presetServiceId })
      }
      className={`${base} ${variantClass} ${className}`}
    >
      <span
        className={`uppercase ${
          isLg ? "text-[0.78rem] tracking-[0.24em]" : "text-[0.72rem] tracking-[0.22em]"
        }`}
      >
        {finalLabel}
      </span>
      {arrow !== "none" && (
        <Icon
          strokeWidth={1.5}
          className={`${isLg ? "h-5 w-5" : "h-4 w-4"} transition-transform duration-300 ${
            arrow === "up-right"
              ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              : "group-hover:translate-x-1"
          }`}
        />
      )}
    </Link>
  );
}
