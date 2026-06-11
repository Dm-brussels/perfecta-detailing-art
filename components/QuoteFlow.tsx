"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  MailCheck,
  X,
} from "lucide-react";
import { submitQuote } from "@/app/actions";
import { useLang, useT } from "./AppProviders";
import { LangToggle } from "./LangToggle";

const STEPS = 4;

export function QuoteFlow({ presetServiceId }: { presetServiceId?: string }) {
  const { lang } = useLang();
  const t = useT();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  // Form state
  const [serviceType, setServiceType] = useState<string>(
    presetServiceId ?? "ppf-only",
  );
  const [carCategory, setCarCategory] = useState<string>(t.carCategories[3]);
  const [carModel, setCarModel] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot

  // Re-sync category if lang changes
  useEffect(() => {
    const cats: readonly string[] = t.carCategories;
    if (!cats.includes(carCategory)) {
      setCarCategory(t.carCategories[3]);
    }
  }, [t.carCategories, carCategory]);

  // Scroll to top on step change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, success]);

  const validateStep = (i: number): string | null => {
    if (i === 0 && !serviceType) return t.errors.service;
    if (i === 1) {
      if (!carCategory) return t.errors.cat;
      if (!carModel || carModel.trim().length < 2) return t.errors.model;
    }
    if (i === 3) {
      if (!name || name.trim().length < 2) return t.errors.name;
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
    setServiceType("ppf-only");
    setCarCategory(t.carCategories[3]);
    setCarModel("");
    setAddons([]);
    setMessage("");
    setName("");
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
      t.serviceTypes.find((s) => s.id === serviceType)?.label ?? serviceType;
    const addonsLabels = addons
      .map((id) => t.addons.find((a) => a.id === id)?.label)
      .filter(Boolean) as string[];

    startTransition(async () => {
      const res = await submitQuote({
        serviceType,
        serviceLabel,
        carCategory,
        carModel: carModel.trim(),
        addons,
        addonsLabels,
        message,
        name: name.trim(),
        email: email.trim(),
        consent,
        lang,
        website,
      });
      if (res.status === "success") {
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
            <span className="inline-flex h-16 w-16 items-center justify-center bg-olive">
              <MailCheck strokeWidth={1.25} className="h-7 w-7 text-white" />
            </span>
            <span aria-hidden className="my-8 mx-auto block h-px w-12 bg-olive-light" />
            <h1 className="font-display text-4xl font-light leading-tight sm:text-5xl">
              {t.modal.success.title}
              <br />
              <span className="italic text-white/85">
                {t.modal.success.title2}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/70">
              {t.modal.success.desc}
            </p>

            <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="group inline-flex items-center justify-between gap-8 bg-white px-7 py-4 text-noir transition-colors hover:bg-olive hover:text-white cursor-pointer"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                  {t.common.close}
                </span>
                <ArrowRight strokeWidth={1.25} className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={reset}
                className="group inline-flex items-center justify-between gap-8 border border-white/25 px-7 py-4 text-white transition-colors hover:border-olive-light hover:text-olive-light cursor-pointer"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                  {t.modal.success.again}
                </span>
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-3 font-display text-sm italic text-white/55">
              <span aria-hidden className="block h-px w-6 bg-white/30" />
              PDA
              <span aria-hidden className="block h-px w-6 bg-white/30" />
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
      <div className="border-b border-noir/8 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-6 py-4 sm:gap-3 sm:px-8">
          {t.modal.stepLabels.map((label, i) => {
            const reached = i <= step;
            const current = i === step;
            return (
              <div
                key={label}
                className="flex flex-1 items-center gap-2 sm:gap-3"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center border text-[0.62rem] tracking-[0.18em] transition-all duration-500 ${
                    current
                      ? "border-olive bg-olive text-white"
                      : reached
                        ? "border-olive/60 text-olive"
                        : "border-noir/20 text-noir/35"
                  }`}
                >
                  {reached && !current ? (
                    <Check strokeWidth={2} className="h-3.5 w-3.5" />
                  ) : (
                    `0${i + 1}`
                  )}
                </span>
                <span
                  className={`hidden truncate text-[0.7rem] uppercase tracking-[0.18em] sm:block ${
                    current ? "text-noir" : "text-noir/40"
                  }`}
                >
                  {label}
                </span>
                {i < STEPS - 1 && (
                  <span
                    aria-hidden
                    className={`h-px flex-1 transition-colors duration-500 ${
                      i < step ? "bg-olive/70" : "bg-noir/10"
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
          <AnimatePresence mode="wait">
            {/* STEP 0 */}
            {step === 0 && (
              <motion.section
                key="s0"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4 }}
              >
                <Eyebrow index={0} total={STEPS} label={t.modal.stepLabels[0]} />
                <h2 className="mt-3 font-display text-3xl font-light leading-tight text-noir sm:text-4xl">
                  {t.modal.step1.title}
                </h2>
                <p className="mt-3 text-sm text-noir/60 sm:text-base">
                  {t.modal.step1.sub}
                </p>

                <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {t.serviceTypes.map((s) => {
                    const selected = serviceType === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setServiceType(s.id)}
                        className={`group flex flex-col gap-2 border p-5 text-left transition-all duration-300 cursor-pointer ${
                          selected
                            ? "border-olive bg-olive/[0.06]"
                            : "border-noir/10 bg-white hover:border-noir/40 hover:bg-bone"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-display text-sm font-medium uppercase tracking-[0.18em] text-noir">
                            {s.label}
                          </span>
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
                              selected
                                ? "border-olive bg-olive"
                                : "border-noir/30"
                            }`}
                          >
                            {selected && (
                              <Check
                                strokeWidth={2}
                                className="h-3 w-3 text-white"
                              />
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

            {/* STEP 1 */}
            {step === 1 && (
              <motion.section
                key="s1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4 }}
              >
                <Eyebrow index={1} total={STEPS} label={t.modal.stepLabels[1]} />
                <h2 className="mt-3 font-display text-3xl font-light leading-tight text-noir sm:text-4xl">
                  {t.modal.step2.title}
                </h2>
                <p className="mt-3 text-sm text-noir/60 sm:text-base">
                  {t.modal.step2.sub}
                </p>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                  <div>
                    <label
                      htmlFor="f-cat"
                      className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                    >
                      {t.modal.step2.catLabel}
                    </label>
                    <div className="relative mt-2">
                      <select
                        id="f-cat"
                        value={carCategory}
                        onChange={(e) => setCarCategory(e.target.value)}
                        className="w-full appearance-none border border-noir/15 bg-white px-4 py-4 pr-10 text-base text-noir outline-none transition-colors focus:border-olive cursor-pointer sm:py-3"
                      >
                        {t.carCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-noir/55"
                      >
                        ▾
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="f-model"
                      className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                    >
                      {t.modal.step2.modelLabel}
                    </label>
                    <input
                      id="f-model"
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder={t.modal.step2.modelPlaceholder}
                      className="mt-2 w-full border border-noir/15 bg-white px-4 py-4 text-base text-noir placeholder:text-noir/30 outline-none transition-colors focus:border-olive sm:py-3"
                    />
                  </div>
                </div>
              </motion.section>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.section
                key="s2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4 }}
              >
                <Eyebrow index={2} total={STEPS} label={t.modal.stepLabels[2]} />
                <h2 className="mt-3 font-display text-3xl font-light leading-tight text-noir sm:text-4xl">
                  {t.modal.step3.title}
                </h2>
                <p className="mt-3 text-sm text-noir/60 sm:text-base">
                  {t.modal.step3.sub}
                </p>

                <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  {t.addons.map((a) => {
                    const checked = addons.includes(a.id);
                    return (
                      <button
                        type="button"
                        key={a.id}
                        onClick={() =>
                          setAddons((prev) =>
                            checked
                              ? prev.filter((x) => x !== a.id)
                              : [...prev, a.id],
                          )
                        }
                        className={`group flex items-center gap-3 border p-4 text-left transition-all duration-300 cursor-pointer ${
                          checked
                            ? "border-olive bg-olive/[0.06]"
                            : "border-noir/10 bg-white hover:border-noir/40 hover:bg-bone"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
                            checked
                              ? "border-olive bg-olive"
                              : "border-noir/30"
                          }`}
                        >
                          {checked && (
                            <Check
                              strokeWidth={2}
                              className="h-3 w-3 text-white"
                            />
                          )}
                        </span>
                        <span className="text-sm leading-snug text-noir/85">
                          {a.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10">
                  <label
                    htmlFor="f-msg"
                    className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                  >
                    {t.modal.step3.message}
                  </label>
                  <textarea
                    id="f-msg"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.modal.step3.messagePlaceholder}
                    className="mt-2 w-full resize-none border border-noir/15 bg-white px-4 py-4 text-base text-noir placeholder:text-noir/30 outline-none transition-colors focus:border-olive sm:py-3"
                  />
                </div>
              </motion.section>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.section
                key="s3"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4 }}
              >
                <Eyebrow index={3} total={STEPS} label={t.modal.stepLabels[3]} />
                <h2 className="mt-3 font-display text-3xl font-light leading-tight text-noir sm:text-4xl">
                  {t.modal.step4.title}
                </h2>
                <p className="mt-3 text-sm text-noir/60 sm:text-base">
                  {t.modal.step4.sub}
                </p>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                  <div>
                    <label
                      htmlFor="f-name"
                      className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                    >
                      {t.modal.step4.nameLabel}
                    </label>
                    <input
                      id="f-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full border border-noir/15 bg-white px-4 py-4 text-base text-noir outline-none transition-colors focus:border-olive sm:py-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="f-email"
                      className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                    >
                      {t.modal.step4.emailLabel}
                    </label>
                    <input
                      id="f-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full border border-noir/15 bg-white px-4 py-4 text-base text-noir outline-none transition-colors focus:border-olive sm:py-3"
                    />
                  </div>
                </div>

                <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-noir/70">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 cursor-pointer accent-olive"
                  />
                  <span>{t.modal.step4.consent}</span>
                </label>

                {/* Recap */}
                <div className="mt-12 border-t border-noir/10 pt-8">
                  <span className="eyebrow text-noir/45">
                    {t.modal.summary}
                  </span>
                  <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                    <div className="flex flex-col">
                      <dt className="text-[0.68rem] uppercase tracking-[0.22em] text-noir/45">
                        {t.modal.service}
                      </dt>
                      <dd className="mt-1 text-noir">
                        {
                          t.serviceTypes.find((s) => s.id === serviceType)
                            ?.label
                        }
                      </dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-[0.68rem] uppercase tracking-[0.22em] text-noir/45">
                        {t.modal.vehicle}
                      </dt>
                      <dd className="mt-1 text-noir">
                        {carCategory} · {carModel || "…"}
                      </dd>
                    </div>
                    {addons.length > 0 && (
                      <div className="flex flex-col sm:col-span-2">
                        <dt className="text-[0.68rem] uppercase tracking-[0.22em] text-noir/45">
                          {t.modal.addons}
                        </dt>
                        <dd className="mt-1 text-noir">
                          {addons
                            .map(
                              (id) =>
                                t.addons.find((a) => a.id === id)?.label,
                            )
                            .filter(Boolean)
                            .join(", ")}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

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
          <span className="font-display text-xs tracking-[0.22em] text-noir/45 sm:text-sm">
            {t.common.step} 0{step + 1} {t.common.of} 0{STEPS}
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="group inline-flex items-center gap-2 px-3 py-3 text-noir/70 transition-colors hover:text-olive cursor-pointer sm:px-4"
              >
                <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
                <span className="hidden text-[0.72rem] uppercase tracking-[0.22em] sm:inline">
                  {t.common.back}
                </span>
              </button>
            )}
            {step < STEPS - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="group inline-flex items-center justify-between gap-6 bg-noir px-5 py-3.5 text-white transition-colors hover:bg-olive cursor-pointer sm:gap-8 sm:px-7 sm:py-4"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                  {t.common.next}
                </span>
                <ArrowRight
                  strokeWidth={1.25}
                  className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="group inline-flex items-center justify-between gap-6 bg-olive px-5 py-3.5 text-white transition-colors hover:bg-olive-dark cursor-pointer disabled:opacity-60 disabled:cursor-wait sm:gap-8 sm:px-7 sm:py-4"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                  {isPending ? t.common.submitting : t.common.submitCta}
                </span>
                {isPending ? (
                  <Loader2 strokeWidth={1.5} className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight
                    strokeWidth={1.25}
                    className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
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

/* ───────── Top bar (logo + lang + close) ───────── */
function TopBar() {
  const t = useT();
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
        <span
          aria-hidden
          className="mt-1 h-px w-full bg-noir/40"
        />
        <span className="mt-1 display-lockup text-[0.5rem] tracking-[0.32em] opacity-75 sm:text-[0.58rem]">
          {t.common.brandTagline}
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <LangToggle variant="dark" />
        <Link
          href="/"
          aria-label={t.common.close}
          className="inline-flex h-10 w-10 items-center justify-center border border-noir/15 text-noir/70 transition-colors hover:border-noir hover:bg-noir hover:text-white cursor-pointer"
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
      <span className="font-display text-xs tracking-[0.32em] text-olive">
        0{index + 1}
      </span>
      <span aria-hidden className="block h-px w-6 bg-noir/30" />
      <span className="font-display text-[0.65rem] uppercase tracking-[0.32em] text-noir/55">
        {label}
      </span>
      <span className="font-display text-[0.62rem] tracking-[0.22em] text-noir/35">
        / 0{total}
      </span>
    </div>
  );
}
