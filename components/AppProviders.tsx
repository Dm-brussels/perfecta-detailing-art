"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dict, type Lang, type Dict } from "@/lib/i18n";

/* ───────── Lang context ───────── */
const LangCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
} | null>(null);

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be inside <AppProviders>");
  return ctx;
}

export function useT() {
  return useLang().t;
}

/* ───────── Quote modal context ───────── */
const QuoteCtx = createContext<{
  open: boolean;
  preset?: string;
  openModal: (presetServiceId?: string) => void;
  closeModal: () => void;
} | null>(null);

export function useQuoteModal() {
  const ctx = useContext(QuoteCtx);
  if (!ctx) throw new Error("useQuoteModal must be inside <AppProviders>");
  return ctx;
}

/* ───────── Provider ───────── */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<string | undefined>();

  // Init from localStorage / browser
  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      window.localStorage.getItem("pda-lang")) as Lang | null;
    if (stored === "fr" || stored === "en") {
      setLangState(stored);
    } else if (typeof window !== "undefined") {
      const browser = (navigator.language || "").toLowerCase();
      if (browser.startsWith("en")) setLangState("en");
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      window.localStorage.setItem("pda-lang", lang);
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const openModal = useCallback((presetServiceId?: string) => {
    setPreset(presetServiceId);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const langValue = useMemo(
    () => ({ lang, setLang, t: dict[lang] as Dict }),
    [lang, setLang],
  );

  const quoteValue = useMemo(
    () => ({ open, preset, openModal, closeModal }),
    [open, preset, openModal, closeModal],
  );

  return (
    <LangCtx.Provider value={langValue}>
      <QuoteCtx.Provider value={quoteValue}>{children}</QuoteCtx.Provider>
    </LangCtx.Provider>
  );
}
