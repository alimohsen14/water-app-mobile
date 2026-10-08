import * as Localization from "expo-localization";
import { useEffect } from "react";
import { I18nManager } from "react-native";

import i18n, { isRTLLocale, SupportedLocale, toSupportedLocale } from "./i18n";

/** The device's current system locale, normalized to a locale the app ships. */
function getSystemLocale(): SupportedLocale {
  const [primary] = Localization.getLocales();
  return toSupportedLocale(primary?.languageCode ?? primary?.languageTag);
}

/**
 * Keeps the i18next language and the native layout direction in sync with the
 * detected system locale (which itself falls back to English when the system
 * locale isn't shipped). Call once near the app root.
 */
export function useLocaleSync(): void {
  useEffect(() => {
    const nextLocale = getSystemLocale();
    const nextIsRTL = isRTLLocale(nextLocale);

    if (i18n.language !== nextLocale) {
      i18n.changeLanguage(nextLocale);
    }

    if (I18nManager.isRTL !== nextIsRTL) {
      I18nManager.allowRTL(nextIsRTL);
      I18nManager.forceRTL(nextIsRTL);
    }
  }, []);
}
