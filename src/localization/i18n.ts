import type { ParseKeys, TOptions } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./locales/ar.json";
import en from "./locales/en.json";

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

/** Locales the app ships translations for. Adding a locale is just a new entry here + a new JSON file. */
export type SupportedLocale = keyof typeof resources;

export const supportedLocales = Object.keys(resources) as SupportedLocale[];

/** Used whenever the requested/system locale isn't one we ship. */
export const fallbackLocale: SupportedLocale = "en";

const rtlLocales: readonly SupportedLocale[] = ["ar"];

export function isRTLLocale(locale: SupportedLocale): boolean {
  return rtlLocales.includes(locale);
}

function isSupportedLocale(tag: string): tag is SupportedLocale {
  return (supportedLocales as string[]).includes(tag);
}

/** Every valid `t()` key, derived from `en.json`'s shape via `i18next`'s own key-parsing type. Use this instead of `string` whenever a key is held in a variable (e.g. built from a list) rather than passed as a literal. */
export type TxKey = ParseKeys;
export type TxOptions = TOptions;

/** Normalizes a BCP-47 tag (e.g. "ar-EG") to a supported locale, falling back to `en`. */
export function toSupportedLocale(
  tag: string | null | undefined,
): SupportedLocale {
  const base = tag?.split("-")[0]?.toLowerCase();
  return base && isSupportedLocale(base) ? base : fallbackLocale;
}

if (!i18n.isInitialized) {
  // eslint-disable-next-line import/no-named-as-default-member -- `use`/`init` are the documented i18next default-export API
  i18n.use(initReactI18next).init({
    resources,
    lng: fallbackLocale,
    fallbackLng: fallbackLocale,
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export default i18n;
