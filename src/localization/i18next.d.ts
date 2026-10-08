import "i18next";

import type en from "./locales/en.json";

/**
 * Types `t()`/`useTranslation()` keys and interpolation values against the
 * shape of `en.json` (the reference locale). A typo'd or missing key becomes
 * a type error instead of silently falling back to the raw key at runtime.
 *
 * @see https://www.i18next.com/overview/typescript
 */
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
    };
    returnNull: false;
  }
}
