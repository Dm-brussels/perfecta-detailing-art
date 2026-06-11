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

/* ───────── Provider ───────── */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

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

  return <LangCtx.Provider value={langValue}>{children}</LangCtx.Provider>;
}
