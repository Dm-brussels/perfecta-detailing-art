"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, MailCheck, X } from "lucide-react";
import { submitQuote } from "@/app/actions";
import { useLang, useQuoteModal, useT } from "./AppProviders";

const STEPS = 4;

export function QuoteModal() {
  const { open, closeModal, preset } = useQuoteModal();
  const { lang } = useLang();
  const t = useT();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Form state
  const [serviceType, setServiceType] = useState<string>("ppf-only");
  const [carCategory, setCarCategory] = useState<string>(t.carCategories[3]);
  const [carModel, setCarModel] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [stepError, setStepError] = useState<string | null>(null);

  // Apply preset when modal opens
  useEffect(() => {
    if (open) {
      if (preset) setServiceType(preset);
      // Always reset error and re-enter at appropriate step
      setStepError(null);
      setServerError(null);
    }
  }, [open, preset]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  // When category list changes (lang), reset to default if invalid
  useEffect(() => {
    const cats: readonly string[] = t.carCategories;
    if (!cats.includes(carCategory)) {
      setCarCategory(t.carCategories[3]);
    }
  }, [t.carCategories, carCategory]);

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

  const closeAll = () => {
    closeModal();
    setTimeout(reset, 400);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.modal.title}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label={t.common.close}
            onClick={closeAll}
            className="absolute inset-0 bg-noir/80 backdrop-blur-md cursor-pointer"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-4 my-8 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          >
            {/* Header */}
            <div className="relative bg-noir px-6 py-6 text-white sm:px-10 sm:py-8 grain">
              <div className="absolute inset-0 bg-noir-glow opacity-95" />
              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <span className="eyebrow text-white/55">— {t.modal.title}</span>
                  <h2 className="mt-3 font-display text-2xl font-light leading-tight sm:text-3xl">
                    {success ? t.modal.success.title : t.modal.title}
                    {!success && (
                      <span className="block italic text-white/85">
                        {t.modal.subtitle}
                      </span>
                    )}
                    {success && (
                      <span className="block italic text-white/85">
                        {t.modal.success.title2}
                      </span>
                    )}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label={t.common.close}
                  onClick={closeAll}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 text-white/85 transition-colors hover:border-white hover:bg-white hover:text-noir cursor-pointer"
                >
                  <X strokeWidth={1.25} className="h-4 w-4" />
                </button>
              </div>

              {/* Stepper */}
              {!success && (
                <div className="relative mt-8 flex items-center gap-2 sm:gap-3">
                  {t.modal.stepLabels.map((label, i) => {
                    const reached = i <= step;
                    const current = i === step;
                    return (
                      <div
                        key={label}
                        className="flex flex-1 items-center gap-2 sm:gap-3"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center border text-[0.65rem] tracking-[0.18em] transition-all duration-500 ${
                            current
                              ? "border-olive-light bg-olive text-white"
                              : reached
                                ? "border-olive-light/60 bg-white/10 text-white"
                                : "border-white/20 text-white/45"
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
                            current ? "text-white" : "text-white/45"
                          }`}
                        >
                          {label}
                        </span>
                        {i < STEPS - 1 && (
                          <span
                            aria-hidden
                            className={`h-px flex-1 transition-colors duration-500 ${
                              i < step ? "bg-olive-light" : "bg-white/15"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="relative flex-1 overflow-y-auto bg-white">
              {success ? (
                <div className="flex flex-col items-center px-8 py-16 text-center sm:px-10">
                  <span className="inline-flex h-16 w-16 items-center justify-center bg-olive">
                    <MailCheck strokeWidth={1.25} className="h-7 w-7 text-white" />
                  </span>
                  <span aria-hidden className="my-8 block h-px w-12 bg-olive" />
                  <p className="max-w-md text-base leading-relaxed text-noir/70">
                    {t.modal.success.desc}
                  </p>
                  <div className="mt-8 flex items-center gap-3 font-display text-sm italic text-noir/55">
                    <span aria-hidden className="block h-px w-6 bg-noir/35" />
                    PDA
                  </div>

                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={closeAll}
                      className="inline-flex items-center justify-between gap-8 bg-noir px-7 py-4 text-white transition-colors hover:bg-olive cursor-pointer"
                    >
                      <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                        {t.common.close}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center justify-between gap-8 border border-noir/20 px-7 py-4 text-noir transition-colors hover:border-olive hover:text-olive cursor-pointer"
                    >
                      <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                        {t.modal.success.again}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-8 sm:px-10 sm:py-10">
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
                        <h3 className="font-display text-2xl font-light text-noir sm:text-3xl">
                          {t.modal.step1.title}
                        </h3>
                        <p className="mt-2 text-sm text-noir/55">
                          {t.modal.step1.sub}
                        </p>
                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {t.serviceTypes.map((s) => {
                            const selected = serviceType === s.id;
                            return (
                              <button
                                type="button"
                                key={s.id}
                                onClick={() => setServiceType(s.id)}
                                className={`group flex flex-col gap-1 border p-5 text-left transition-all duration-300 cursor-pointer ${
                                  selected
                                    ? "border-olive bg-olive/[0.06]"
                                    : "border-noir/10 hover:border-noir/40 hover:bg-bone"
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
                                <span className="text-xs text-noir/55">{s.desc}</span>
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
                        <h3 className="font-display text-2xl font-light text-noir sm:text-3xl">
                          {t.modal.step2.title}
                        </h3>
                        <p className="mt-2 text-sm text-noir/55">
                          {t.modal.step2.sub}
                        </p>

                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="m-cat"
                              className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                            >
                              {t.modal.step2.catLabel}
                            </label>
                            <div className="relative mt-2">
                              <select
                                id="m-cat"
                                value={carCategory}
                                onChange={(e) => setCarCategory(e.target.value)}
                                className="w-full appearance-none border border-noir/15 bg-white px-4 py-3 pr-10 text-noir outline-none transition-colors focus:border-olive cursor-pointer"
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
                              htmlFor="m-model"
                              className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                            >
                              {t.modal.step2.modelLabel}
                            </label>
                            <input
                              id="m-model"
                              type="text"
                              value={carModel}
                              onChange={(e) => setCarModel(e.target.value)}
                              placeholder={t.modal.step2.modelPlaceholder}
                              className="mt-2 w-full border border-noir/15 bg-white px-4 py-3 text-noir placeholder:text-noir/30 outline-none transition-colors focus:border-olive"
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
                        <h3 className="font-display text-2xl font-light text-noir sm:text-3xl">
                          {t.modal.step3.title}
                        </h3>
                        <p className="mt-2 text-sm text-noir/55">
                          {t.modal.step3.sub}
                        </p>

                        <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                                    : "border-noir/10 hover:border-noir/40 hover:bg-bone"
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
                                <span className="text-sm text-noir/85">{a.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-8">
                          <label
                            htmlFor="m-msg"
                            className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                          >
                            {t.modal.step3.message}
                          </label>
                          <textarea
                            id="m-msg"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t.modal.step3.messagePlaceholder}
                            className="mt-2 w-full resize-none border border-noir/15 bg-white px-4 py-3 text-noir placeholder:text-noir/30 outline-none transition-colors focus:border-olive"
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
                        <h3 className="font-display text-2xl font-light text-noir sm:text-3xl">
                          {t.modal.step4.title}
                        </h3>
                        <p className="mt-2 text-sm text-noir/55">
                          {t.modal.step4.sub}
                        </p>

                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="m-name"
                              className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                            >
                              {t.modal.step4.nameLabel}
                            </label>
                            <input
                              id="m-name"
                              type="text"
                              autoComplete="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="mt-2 w-full border border-noir/15 bg-white px-4 py-3 text-noir outline-none transition-colors focus:border-olive"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="m-email"
                              className="block text-[0.7rem] uppercase tracking-[0.22em] text-noir/55"
                            >
                              {t.modal.step4.emailLabel}
                            </label>
                            <input
                              id="m-email"
                              type="email"
                              autoComplete="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="mt-2 w-full border border-noir/15 bg-white px-4 py-3 text-noir outline-none transition-colors focus:border-olive"
                            />
                          </div>
                        </div>

                        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-noir/65">
                          <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-1 h-4 w-4 cursor-pointer accent-olive"
                          />
                          <span>{t.modal.step4.consent}</span>
                        </label>

                        {/* Recap */}
                        <div className="mt-10 border-t border-noir/10 pt-8">
                          <span className="eyebrow text-noir/45">
                            — {t.modal.summary}
                          </span>
                          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <div className="flex flex-col">
                              <dt className="text-[0.7rem] uppercase tracking-[0.22em] text-noir/45">
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
                              <dt className="text-[0.7rem] uppercase tracking-[0.22em] text-noir/45">
                                {t.modal.vehicle}
                              </dt>
                              <dd className="mt-1 text-noir">
                                {carCategory} — {carModel || "—"}
                              </dd>
                            </div>
                            {addons.length > 0 && (
                              <div className="flex flex-col sm:col-span-2">
                                <dt className="text-[0.7rem] uppercase tracking-[0.22em] text-noir/45">
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
                      className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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
              )}
            </div>

            {/* Footer */}
            {!success && (
              <div className="flex items-center justify-between gap-4 border-t border-noir/8 bg-bone px-6 py-5 sm:px-10">
                <span className="font-display text-xs tracking-[0.22em] text-noir/45">
                  {t.common.step} 0{step + 1} {t.common.of} 0{STEPS}
                </span>
                <div className="flex items-center gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="group inline-flex items-center gap-3 px-4 py-3 text-noir/70 transition-colors hover:text-olive cursor-pointer"
                    >
                      <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
                      <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                        {t.common.back}
                      </span>
                    </button>
                  )}
                  {step < STEPS - 1 && (
                    <button
                      type="button"
                      onClick={goNext}
                      className="group inline-flex items-center justify-between gap-8 bg-noir px-7 py-4 text-white transition-colors hover:bg-olive cursor-pointer"
                    >
                      <span className="text-[0.72rem] uppercase tracking-[0.22em]">
                        {t.common.next}
                      </span>
                      <ArrowRight
                        strokeWidth={1.25}
                        className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                      />
                    </button>
                  )}
                  {step === STEPS - 1 && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="group inline-flex items-center justify-between gap-8 bg-olive px-7 py-4 text-white transition-colors hover:bg-olive-dark cursor-pointer disabled:opacity-60 disabled:cursor-wait"
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
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
