/**
 * Locale-aware date formatting for the consumption screens.
 *
 * Uses `Intl.DateTimeFormat` so month names are localized (full names) and the
 * day/month/year parts are ordered and bidi-shaped correctly by the engine —
 * never assembled via string concatenation, which garbles mixed RTL/LTR text.
 *
 * Western (`latn`) digits are forced so a single numeral system is used in
 * every locale.
 */

/** Levantine Arabic yields "كانون الثاني" style month names (vs. "يناير"). */
const LEVANTINE_ARABIC_LOCALE = "ar-SY";

function resolveLocale(language: string): string {
  return language.startsWith("ar") ? LEVANTINE_ARABIC_LOCALE : language;
}

/** e.g. "كانون الثاني 2024" / "January 2024". */
export function formatMonthYear(
  language: string,
  year: number,
  month: number,
): string {
  return new Intl.DateTimeFormat(resolveLocale(language), {
    calendar: "gregory",
    numberingSystem: "latn",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

/** e.g. "21 كانون الثاني 2024" / "January 21, 2024". */
export function formatFullDate(
  language: string,
  year: number,
  month: number,
  day: number,
): string {
  return new Intl.DateTimeFormat(resolveLocale(language), {
    calendar: "gregory",
    numberingSystem: "latn",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, day));
}
