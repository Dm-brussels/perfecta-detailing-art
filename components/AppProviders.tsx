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
import { track } from "@/lib/analytics";
import { WhatsAppFlow } from "./WhatsAppFlow";

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

/* ───────── WhatsApp context ───────── */
const WhatsAppCtx = createContext<{
  open: boolean;
  /** `location` sert au tracking pour situer le déclencheur */
  openFlow: (location: string) => void;
  close: () => void;
} | null>(null);

export function useWhatsApp() {
  const ctx = useContext(WhatsAppCtx);
  if (!ctx) throw new Error("useWhatsApp must be inside <AppProviders>");
  return ctx;
}

/* ───────── Provider ───────── */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [waOpen, setWaOpen] = useState(false);

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

  const langValue = useMemo(
    () => ({ lang, setLang, t: dict[lang] as Dict }),
    [lang, setLang],
  );

  const openFlow = useCallback((location: string) => {
    track("whatsapp_open", { location });
    setWaOpen(true);
  }, []);
  const close = useCallback(() => setWaOpen(false), []);

  const waValue = useMemo(
    () => ({ open: waOpen, openFlow, close }),
    [waOpen, openFlow, close],
  );

  return (
    <LangCtx.Provider value={langValue}>
      <WhatsAppCtx.Provider value={waValue}>
        {children}
        <WhatsAppFlow />
      </WhatsAppCtx.Provider>
    </LangCtx.Provider>
  );
}
