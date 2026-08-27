"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, MailCheck, X } from "lucide-react";
import { submitQuote } from "@/app/actions";
import { useLang, useT, useWhatsApp } from "./AppProviders";
import { LangToggle } from "./LangToggle";
import { PhoneLink } from "./PhoneLink";
import { WhatsAppIcon } from "./Icons";
import { track } from "@/lib/analytics";

const STEPS = 3;

/**
 * Transition commune aux trois étapes.
 *
 * Volontairement sans `AnimatePresence` ni `exit` : dans ce projet, les
 * animations de sortie ne se résolvent jamais et l'étape suivante ne se monte
 * donc pas. Chaque étape est une section dont la `key` change, ce qui la
 * remonte et rejoue l'entrée.
 */
const slide = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.35 },
};

/** Accepte +32 470 10 53 81, 0470105381, 0032470105381… */
function isValidPhone(v: string) {
  const cleaned = v.replace(/[\s.\-()]/g, "");
  return /^\+?\d{8,15}$/.test(cleaned);
}

export function QuoteFlow({ presetServiceId }: { presetServiceId?: string }) {
  const { lang } = useLang();
  const t = useT();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  // Le lien peut préselectionner une prestation (?service=ppf)
  const presetIsKnown = t.serviceTypes.some((s) => s.id === presetServiceId);

  const [service, setService] = useState<string>(
    presetIsKnown ? (presetServiceId as string) : "ppf",
  );
  const [vehicle, setVehicle] = useState("");
  const [timing, setTiming] = useState<string>("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot

  // Scroll to top on step change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, success]);

  const validateStep = (i: number): string | null => {
    if (i === 0 && !service) return t.errors.service;
    if (i === 1) {
      if (!vehicle || vehicle.trim().length < 2) return t.errors.model;
      if (!timing) return t.errors.timing;
    }
    if (i === 2) {
      if (!name || name.trim().length < 2) return t.errors.name;
      if (!isValidPhone(phone)) return t.errors.phone;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t.errors.email;
      if (!consent) return t.errors.consent;
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    track("cta_click", { location: `quote_step_${step + 1}` });
    setStep((s) => Math.min(STEPS - 1, s + 1));
  };

  const goBack = () => {
    setStepError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const reset = () => {
    setStep(0);
    setSuccess(false);
    setServerError(null);
    setService("ppf");
    setVehicle("");
    setTiming("");
    setMessage("");
    setName("");
    setPhone("");
    setEmail("");
    setConsent(false);
    setStepError(null);
  };

  const handleSubmit = () => {
    const err = validateStep(step);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    setServerError(null);

    const serviceLabel =
      t.serviceTypes.find((s) => s.id === service)?.label ?? service;
    const timingLabel = t.timings.find((x) => x.id === timing)?.label ?? timing;

    startTransition(async () => {
      const res = await submitQuote({
        service,
        serviceLabel,
        vehicle: vehicle.trim(),
        timing,
        timingLabel,
        message,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        consent,
        lang,
        website,
      });
      if (res.status === "success") {
        track("quote_submit", { service, timing });
        setSuccess(true);
      } else {
        setServerError(t.errors.genericServer);
      }
    });
  };

  /* ───────── Success screen ───────── */
  if (success) {
    return (
      <div className="relative flex min-h-svh flex-col bg-noir-glow text-white grain">
        <TopBar />
        <main className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-xl text-center"
          >
            <span className="inline-flex h-16 w-16 items-center justify-center bg-azur">
              <MailCheck strokeWidth={1.25} className="h-7 w-7 text-white" />
            </span>
            <span aria-hidden className="my-8 mx-auto block h-px w-12 bg-white/25" />
            <h1 className="font-display text-4xl font-light leading-tight sm:text-5xl">
              {t.modal.success.title}
              <br />
              <span className="italic text-white/85">{t.modal.success.title2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/70">
              {t.modal.success.desc}
            </p>

            <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="group inline-flex items-center justify-between gap-8 bg-white px-7 py-4 text-noir transition-colors hover:bg-bone cursor-pointer focus-azur"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                  {t.common.close}
                </span>
                <ArrowRight strokeWidth={1.25} className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={reset}
                className="group inline-flex items-center justify-between gap-8 border border-white/25 px-7 py-4 text-white transition-colors hover:border-white cursor-pointer focus-azur"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                  {t.modal.success.again}
                </span>
              </button>
            </div>

            <div className="mt-12 flex justify-center">
              <PhoneLink location="quote_success" variant="light" label={t.common.callUs} />
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  /* ───────── Flow ───────── */
  return (
    <div className="relative flex min-h-svh flex-col bg-bone-glow">
      <TopBar />

      {/* Stepper */}
      <div className="border-b border-noir/8 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-6 py-4 sm:gap-3 sm:px-8">
          {t.modal.stepLabels.map((label, i) => {
            const reached = i <= step;
            const current = i === step;
            return (
              <div key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.62rem] tracking-[0.08em] transition-all duration-500 ${
                    current
                      ? "border-azur bg-azur text-white"
                      : reached
                        ? "border-azur/50 text-azur"
                        : "border-noir/20 text-noir/35"
                  }`}
                >
                  {reached && !current ? (
                    <Check strokeWidth={2.5} className="h-3.5 w-3.5" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`hidden truncate text-[0.7rem] uppercase tracking-[0.16em] sm:block ${
                    current ? "text-noir" : "text-noir/40"
                  }`}
                >
                  {label}
                </span>
                {i < STEPS - 1 && (
                  <span
                    aria-hidden
                    className={`h-px flex-1 transition-colors duration-500 ${
                      i < step ? "bg-azur/60" : "bg-noir/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <main className="flex-1 px-5 pb-32 pt-10 sm:px-8 sm:pb-28 sm:pt-14">
        <div className="mx-auto max-w-3xl">
            {/* STEP 1 — Prestation */}
            {step === 0 && (
              <motion.section key="s0" {...slide}>
                <Eyebrow index={0} total={STEPS} label={t.modal.stepLabels[0]} />
                <h1 className="mt-3 font-display text-3xl font-light leading-tight text-noir sm:text-4xl">
                  {t.modal.step1.title}
                </h1>
                <p className="mt-3 text-sm text-noir/60 sm:text-base">
                  {t.modal.step1.sub}
                </p>

                <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {t.serviceTypes.map((s) => {
                    const selected = service === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => {
                          setService(s.id);
                          setStepError(null);
                        }}
                        aria-pressed={selected}
                        className={`group flex flex-col gap-2 border p-5 text-left transition-all duration-200 cursor-pointer focus-azur ${
                          selected
                            ? "border-azur bg-azur/[0.05] shadow-[0_1px_2px_rgba(0,113,227,0.12)]"
                            : "border-noir/10 bg-white hover:border-noir/35"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-display text-sm font-medium uppercase tracking-[0.14em] text-noir">
                            {s.label}
                          </span>
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                              selected ? "border-azur bg-azur" : "border-noir/25"
                            }`}
                          >
                            {selected && (
                              <Check strokeWidth={3} className="h-3 w-3 text-white" />
                            )}
                          </span>
                        </span>
                        <span className="text-xs leading-relaxed text-noir/55 sm:text-sm">
                          {s.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* STEP 2 — Le projet */}
            {step === 1 && (
              <motion.section key="s1" {...slide}>
                <Eyebrow index={1} total={STEPS} label={t.modal.stepLabels[1]} />
                <h1 className="mt-3 font-display text-3xl font-light leading-tight text-noir sm:text-4xl">
                  {t.modal.step2.title}
                </h1>
                <p className="mt-3 text-sm text-noir/60 sm:text-base">
                  {t.modal.step2.sub}
                </p>

                <div className="mt-9">
                  <label
                    htmlFor="f-vehicle"
                    className="block text-[0.7rem] uppercase tracking-[0.2em] text-noir/55"
                  >
                    {t.modal.step2.modelLabel}
                  </label>
                  <input
                    id="f-vehicle"
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder={t.modal.step2.modelPlaceholder}
                    autoComplete="off"
                    className="mt-2 w-full border border-noir/15 bg-white px-4 py-4 text-base text-noir placeholder:text-noir/30 outline-none transition-colors focus:border-azur"
                  />
                </div>

                <fieldset className="mt-8">
                  <legend className="text-[0.7rem] uppercase tracking-[0.2em] text-noir/55">
                    {t.modal.step2.timingLabel}
                  </legend>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {t.timings.map((x) => {
                      const selected = timing === x.id;
                      return (
                        <button
                          type="button"
                          key={x.id}
                          onClick={() => {
                            setTiming(x.id);
                            setStepError(null);
                          }}
                          aria-pressed={selected}
                          className={`flex items-center justify-between gap-3 border px-4 py-4 text-left text-sm transition-all duration-200 cursor-pointer focus-azur ${
                            selected
                              ? "border-azur bg-azur/[0.05] text-noir"
                              : "border-noir/12 bg-white text-noir/70 hover:border-noir/35 hover:text-noir"
                          }`}
                        >
                          <span className="leading-snug">{x.label}</span>
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                              selected ? "border-azur bg-azur" : "border-noir/25"
                            }`}
                          >
                            {selected && (
                              <Check strokeWidth={3} className="h-2.5 w-2.5 text-white" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-8">
                  <label
                    htmlFor="f-msg"
                    className="flex items-baseline gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-noir/55"
                  >
                    {t.modal.step2.message}
                    <span className="text-[0.62rem] tracking-[0.12em] text-noir/35 normal-case">
                      ({t.common.optional})
                    </span>
                  </label>
                  <textarea
                    id="f-msg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.modal.step2.messagePlaceholder}
                    className="mt-2 w-full resize-none border border-noir/15 bg-white px-4 py-4 text-base text-noir placeholder:text-noir/30 outline-none transition-colors focus:border-azur"
                  />
                </div>
              </motion.section>
            )}

            {/* STEP 3 — Coordonnées */}
            {step === 2 && (
              <motion.section key="s2" {...slide}>
                <Eyebrow index={2} total={STEPS} label={t.modal.stepLabels[2]} />
                <h1 className="mt-3 font-display text-3xl font-light leading-tight text-noir sm:text-4xl">
                  {t.modal.step3.title}
                </h1>
                <p className="mt-3 text-sm text-noir/60 sm:text-base">
                  {t.modal.step3.sub}
                </p>

                <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="f-name"
                      className="block text-[0.7rem] uppercase tracking-[0.2em] text-noir/55"
                    >
                      {t.modal.step3.nameLabel}
                    </label>
                    <input
                      id="f-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full border border-noir/15 bg-white px-4 py-4 text-base text-noir outline-none transition-colors focus:border-azur"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="f-phone"
                      className="block text-[0.7rem] uppercase tracking-[0.2em] text-noir/55"
                    >
                      {t.modal.step3.phoneLabel}
                    </label>
                    <input
                      id="f-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.modal.step3.phonePlaceholder}
                      className="mt-2 w-full border border-noir/15 bg-white px-4 py-4 text-base text-noir placeholder:text-noir/30 outline-none transition-colors focus:border-azur"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="f-email"
                      className="block text-[0.7rem] uppercase tracking-[0.2em] text-noir/55"
                    >
                      {t.modal.step3.emailLabel}
                    </label>
                    <input
                      id="f-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full border border-noir/15 bg-white px-4 py-4 text-base text-noir outline-none transition-colors focus:border-azur"
                    />
                  </div>
                </div>

                <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-noir/70">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 cursor-pointer accent-azur"
                  />
                  <span>{t.modal.step3.consent}</span>
                </label>

                {/* Récapitulatif */}
                <div className="mt-10 card-bone p-6">
                  <span className="eyebrow text-noir/45">{t.modal.summary}</span>
                  <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                    <Recap
                      label={t.modal.service}
                      value={t.serviceTypes.find((s) => s.id === service)?.label}
                    />
                    <Recap label={t.modal.vehicle} value={vehicle || "…"} />
                    <Recap
                      label={t.modal.timing}
                      value={t.timings.find((x) => x.id === timing)?.label}
                    />
                  </dl>
                </div>
              </motion.section>
            )}

          {(stepError || serverError) && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-8 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {serverError ?? stepError}
            </p>
          )}

          {/* Honeypot */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute left-[-9999px] h-px w-px overflow-hidden"
          />
        </div>
      </main>

      {/* Sticky bottom action bar */}
      <div className="sticky bottom-0 z-10 border-t border-noir/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
          <span className="font-display text-xs tracking-[0.18em] text-noir/45 sm:text-sm">
            {t.common.step} {step + 1} {t.common.of} {STEPS}
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="group inline-flex items-center gap-2 px-3 py-3 text-noir/70 transition-colors hover:text-noir cursor-pointer focus-azur sm:px-4"
              >
                <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
                <span className="hidden text-[0.72rem] uppercase tracking-[0.2em] sm:inline">
                  {t.common.back}
                </span>
              </button>
            )}
            {step < STEPS - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="group inline-flex items-center justify-between gap-6 bg-azur px-6 py-4 text-white shadow-azur transition-colors hover:bg-azur-hover cursor-pointer focus-azur sm:gap-8 sm:px-8"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.2em]">
                  {t.common.next}
                </span>
                <ArrowRight
                  strokeWidth={1.75}
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="group inline-flex items-center justify-between gap-6 bg-azur px-6 py-4 text-white shadow-azur transition-colors hover:bg-azur-hover cursor-pointer focus-azur disabled:opacity-60 disabled:cursor-wait sm:gap-8 sm:px-8"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.2em]">
                  {isPending ? t.common.submitting : t.common.submitCta}
                </span>
                {isPending ? (
                  <Loader2 strokeWidth={1.5} className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight
                    strokeWidth={1.75}
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Recap({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[0.66rem] uppercase tracking-[0.2em] text-noir/45">
        {label}
      </dt>
      <dd className="mt-1 text-noir">{value ?? "…"}</dd>
    </div>
  );
}

/* ───────── Top bar (logo + téléphone + WhatsApp + langue) ───────── */
function TopBar() {
  const t = useT();
  const { openFlow } = useWhatsApp();
  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-noir/8 bg-white/90 px-5 backdrop-blur-md sm:h-20 sm:px-8">
      <Link
        href="/"
        aria-label={t.nav.home}
        className="flex flex-col items-start text-noir"
      >
        <span className="display-lockup text-[0.7rem] leading-none sm:text-[0.78rem]">
          {t.common.brandName}
        </span>
        <span aria-hidden className="mt-1 h-px w-full bg-noir/40" />
        <span className="mt-1 display-lockup text-[0.5rem] tracking-[0.32em] opacity-75 sm:text-[0.58rem]">
          {t.common.brandTagline}
        </span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        <span className="hidden sm:contents">
          <PhoneLink location="quote_topbar" />
        </span>
        <button
          type="button"
          onClick={() => openFlow("quote_topbar")}
          aria-label={t.common.whatsapp}
          className="inline-flex h-10 w-10 items-center justify-center bg-whatsapp text-white transition-colors hover:bg-whatsapp-dark cursor-pointer focus-azur"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </button>
        <LangToggle variant="dark" />
        <Link
          href="/"
          aria-label={t.common.close}
          className="inline-flex h-10 w-10 items-center justify-center border border-noir/15 text-noir/70 transition-colors hover:border-noir hover:bg-noir hover:text-white cursor-pointer focus-azur"
        >
          <X strokeWidth={1.25} className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

/* ───────── Eyebrow above the step title ───────── */
function Eyebrow({
  index,
  total,
  label,
}: {
  index: number;
  total: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-xs tracking-[0.24em] text-azur">
        0{index + 1}
      </span>
      <span aria-hidden className="block h-px w-6 bg-noir/25" />
      <span className="font-display text-[0.65rem] uppercase tracking-[0.28em] text-noir/55">
        {label}
      </span>
      <span className="font-display text-[0.62rem] tracking-[0.2em] text-noir/35">
        / 0{total}
      </span>
    </div>
  );
}
