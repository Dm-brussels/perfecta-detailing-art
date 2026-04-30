"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useQuoteModal, useT } from "./AppProviders";

type Variant = "primary-light" | "primary-dark" | "ghost-light" | "ghost-dark" | "outline-dark" | "outline-light";

type Props = {
  variant?: Variant;
  size?: "md" | "lg";
  label?: string;
  presetServiceId?: string;
  arrow?: "right" | "up-right" | "none";
  className?: string;
  fullWidth?: boolean;
};

export function CTAButton({
  variant = "primary-light",
  size = "md",
  label,
  presetServiceId,
  arrow = "right",
  className = "",
  fullWidth = false,
}: Props) {
  const t = useT();
  const { openModal } = useQuoteModal();

  const finalLabel = label ?? t.common.cta;
  const isLg = size === "lg";

  const base = `group inline-flex items-center justify-between transition-all duration-500 cursor-pointer ${
    fullWidth ? "w-full" : ""
  } ${isLg ? "px-8 py-5 gap-10" : "px-7 py-4 gap-8"}`;

  const variantClass = {
    "primary-light": "bg-white text-noir hover:bg-olive hover:text-white",
    "primary-dark": "bg-noir text-white hover:bg-olive",
    "outline-light": "border border-white/40 text-white hover:bg-white hover:text-noir",
    "outline-dark": "border border-noir text-noir hover:bg-noir hover:text-white",
    "ghost-light": "text-white hover:text-olive-light px-2 py-3",
    "ghost-dark": "text-noir hover:text-olive px-2 py-3",
  }[variant];

  const Icon = arrow === "up-right" ? ArrowUpRight : ArrowRight;

  return (
    <button
      type="button"
      onClick={() => openModal(presetServiceId)}
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
          strokeWidth={1.25}
          className={`${isLg ? "h-5 w-5" : "h-4 w-4"} transition-transform duration-500 ${
            arrow === "up-right"
              ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              : "group-hover:translate-x-1"
          }`}
        />
      )}
    </button>
  );
}
