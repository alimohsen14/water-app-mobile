import * as Localization from "expo-localization";
import { useEffect } from "react";
import { I18nManager } from "react-native";
import RNRestart from "react-native-restart";

import { type LocaleMode, useLocaleStore } from "@/stores/locale-store";
import i18n, { isRTLLocale, SupportedLocale, toSupportedLocale } from "./i18n";

/** The device's current system locale, normalized to a locale the app ships. */
function getSystemLocale(): SupportedLocale {
  const [primary] = Localization.getLocales();
  return toSupportedLocale(primary?.languageCode ?? primary?.languageTag);
}

/**
 * Resolution order: an explicit user override wins; otherwise fall back to
 * the detected system locale (which itself falls back to English when the
 * system locale isn't shipped).
 */
function resolveLocale(mode: LocaleMode): SupportedLocale {
  if (mode === "en" || mode === "ar") return mode;
  return getSystemLocale();
}

/**
 * Keeps the i18next language, the native layout direction, and the locale
 * preference store in sync. Call once near the app root.
 *
 * When a locale change flips writing direction, this forces the native RTL
 * flag and restarts the app so the layout change takes effect immediately,
 * without the user having to manually relaunch.
 */
export function useLocaleSync(): void {
  const mode = useLocaleStore((state) => state.mode);

  useEffect(() => {
    const nextLocale = resolveLocale(mode);
    const nextIsRTL = isRTLLocale(nextLocale);

    if (i18n.language !== nextLocale) {
      i18n.changeLanguage(nextLocale);
    }

    if (I18nManager.isRTL !== nextIsRTL) {
      I18nManager.allowRTL(nextIsRTL);
      I18nManager.forceRTL(nextIsRTL);
      setTimeout(() => {
        RNRestart.restart();
      }, 350);
    }
  }, [mode]);
}
