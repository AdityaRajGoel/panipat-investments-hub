// Lightweight i18n foundation (no external dep, prerender-safe).
// Phase 1 covers the global chrome (nav + primary actions). Add more keys as
// surfaces are translated; add a new language by adding its column below.

export type Lang = "en" | "hi";

export const DEFAULT_LANG: Lang = "en";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  // Punjabi (pa) and Gujarati (gu) drop in here once translations are ready.
];

// Keys are stable ids; English is the source of truth and the fallback.
export const translations: Record<Lang, Record<string, string>> = {
  en: {
    "nav.services": "Services",
    "nav.unlistedSpace": "Unlisted Space",
    "nav.markets": "Markets",
    "nav.tools": "Tools",
    "nav.learn": "Learn",
    "nav.about": "About",
    "nav.contact": "Contact",
    "cta.clientLogin": "Client Login",
    "cta.webTrade": "Web Trade",
    "cta.openAccount": "Open Account",
    "lang.label": "Language",
  },
  hi: {
    "nav.services": "सेवाएँ",
    "nav.unlistedSpace": "अनलिस्टेड शेयर",
    "nav.markets": "बाज़ार",
    "nav.tools": "टूल्स",
    "nav.learn": "सीखें",
    "nav.about": "हमारे बारे में",
    "nav.contact": "संपर्क करें",
    "cta.clientLogin": "क्लाइंट लॉगिन",
    "cta.webTrade": "वेब ट्रेड",
    "cta.openAccount": "खाता खोलें",
    "lang.label": "भाषा",
  },
};

// Maps the English nav labels used in megaMenuData to translation keys, so the
// existing nav config doesn't need restructuring.
export const NAV_LABEL_KEYS: Record<string, string> = {
  "Services": "nav.services",
  "Unlisted Space": "nav.unlistedSpace",
  "Markets": "nav.markets",
  "Tools": "nav.tools",
  "Learn": "nav.learn",
  "About": "nav.about",
  "Contact": "nav.contact",
};
