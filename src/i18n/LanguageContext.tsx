import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { type Lang, DEFAULT_LANG, LANGUAGES, translations } from "./config";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "sph-lang";
const isLang = (v: string | null): v is Lang => !!v && LANGUAGES.some((l) => l.code === v);

const readInitialLang = (): Lang => {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLang(stored) ? stored : DEFAULT_LANG;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi-IN" : "en-IN";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable (private mode) - non-fatal */
    }
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? translations[DEFAULT_LANG][key] ?? key,
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useT(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  // Fallback so components render even if used outside the provider (e.g. isolated tests).
  if (!ctx) {
    return { lang: DEFAULT_LANG, setLang: () => {}, t: (k) => translations[DEFAULT_LANG][k] ?? k };
  }
  return ctx;
}
