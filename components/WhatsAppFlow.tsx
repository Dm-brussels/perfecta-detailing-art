"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useT, useWhatsApp } from "./AppProviders";
import { WhatsAppIcon } from "./Icons";
import { whatsappUrl } from "@/lib/site";
import { track } from "@/lib/analytics";

/**
 * Mini-formulaire d'une seule étape : deux choix, puis ouverture de WhatsApp
 * avec un message déjà rédigé. Le but est que le studio reçoive du contexte
 * avant même le premier échange.
 */
export function WhatsAppFlow() {
  const t = useT();
  const { open, close } = useWhatsApp();

  const services = t.serviceTypes.filter((s) =>
    (t.whatsappServiceIds as readonly string[]).includes(s.id),
  );

  const [service, setService] = useState<string>(services[0]?.id ?? "ppf");
  const [timing, setTiming] = useState<string>(t.timings[0].id);

  // Verrouille le défilement de la page pendant l'ouverture
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const serviceItem = t.serviceTypes.find((s) => s.id === service);
  const timingItem = t.timings.find((x) => x.id === timing);

  const message = `${t.whatsapp.msgIntro} ${t.whatsapp.msgBody(
    serviceItem?.wa ?? "",
    timingItem?.wa ?? "",
  )}`;

  const onContinue = () => {
    track("whatsapp_click", { service, timing });
    close();
  };

  return (
    /* Toujours monté, masqué en CSS : l'ouverture comme la fermeture sont
       animées de façon fiable, sans dépendre d'une animation de sortie. */
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.whatsapp.title}
      aria-hidden={!open}
      className={`fixed inset-0 z-[130] flex items-end justify-center transition-opacity duration-300 sm:items-center ${
        open ? "opacity-100" : "pointer-events-none invisible opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label={t.whatsapp.close}
        onClick={close}
        tabIndex={open ? 0 : -1}
        className="absolute inset-0 cursor-pointer bg-noir/70 backdrop-blur-sm"
      />

      <div
        className={`relative z-10 max-h-[92svh] w-full overflow-y-auto bg-white shadow-[0_-8px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-w-lg sm:shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${
          open ? "translate-y-0" : "translate-y-8"
        }`}
      >
        {/* En-tête */}
        <div className="flex items-start justify-between gap-4 border-b border-noir/8 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-whatsapp text-white">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-light leading-tight text-noir">
                {t.whatsapp.title}
              </p>
              <p className="mt-0.5 text-xs text-noir/55">{t.whatsapp.sub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t.whatsapp.close}
            tabIndex={open ? 0 : -1}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-noir/12 text-noir/60 transition-colors hover:border-noir hover:bg-noir hover:text-white cursor-pointer focus-azur"
          >
            <X strokeWidth={1.5} className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {/* Choix de la prestation */}
          <fieldset>
            <legend className="text-[0.68rem] uppercase tracking-[0.22em] text-noir/55">
              {t.whatsapp.serviceLabel}
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {services.map((s) => (
                <Choice
                  key={s.id}
                  label={s.label}
                  selected={service === s.id}
                  disabled={!open}
                  onClick={() => setService(s.id)}
                />
              ))}
            </div>
          </fieldset>

          {/* Choix du délai */}
          <fieldset className="mt-7">
            <legend className="text-[0.68rem] uppercase tracking-[0.22em] text-noir/55">
              {t.whatsapp.timingLabel}
            </legend>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {t.timings.map((x) => (
                <Choice
                  key={x.id}
                  label={x.label}
                  selected={timing === x.id}
                  disabled={!open}
                  onClick={() => setTiming(x.id)}
                />
              ))}
            </div>
          </fieldset>

          {/* Aperçu du message généré */}
          <div className="mt-7 card-bone p-4">
            <span className="text-[0.6rem] uppercase tracking-[0.24em] text-noir/45">
              {t.whatsapp.preview}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-noir/75">{message}</p>
          </div>

          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noreferrer"
            onClick={onContinue}
            tabIndex={open ? 0 : -1}
            className="mt-6 flex w-full items-center justify-center gap-3 bg-whatsapp px-6 py-4 text-white transition-colors hover:bg-whatsapp-dark cursor-pointer focus-azur"
          >
            <WhatsAppIcon className="h-5 w-5" />
            <span className="text-[0.74rem] uppercase tracking-[0.22em]">
              {t.whatsapp.submit}
            </span>
          </a>

          <p className="mt-3 text-center text-xs text-noir/50">{t.whatsapp.note}</p>
        </div>
      </div>
    </div>
  );
}

function Choice({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      tabIndex={disabled ? -1 : 0}
      className={`flex items-center justify-between gap-2 border px-4 py-3 text-left text-sm transition-all duration-200 cursor-pointer focus-azur ${
        selected
          ? "border-azur bg-azur/[0.06] text-noir"
          : "border-noir/12 bg-white text-noir/70 hover:border-noir/35 hover:text-noir"
      }`}
    >
      <span className="leading-snug">{label}</span>
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
          selected ? "border-azur bg-azur" : "border-noir/25"
        }`}
      >
        {selected && <Check strokeWidth={3} className="h-2.5 w-2.5 text-white" />}
      </span>
    </button>
  );
}
