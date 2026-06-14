/**
 * Localized text reader (build spec §4b). Reads `*_i18n` JSONB by locale with
 * fallback to the base column: name_i18n->>locale ?? name.
 * Phase 1 only populates the base columns; this keeps components locale-ready.
 */
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en-US";

export function localized(
  base: string | null,
  i18n: Record<string, string> | null | undefined,
  locale: string = DEFAULT_LOCALE
): string {
  if (i18n) {
    // try exact ("fr-FR"), then language only ("fr")
    const lang = locale.split("-")[0];
    if (i18n[locale]) return i18n[locale];
    if (i18n[lang]) return i18n[lang];
  }
  return base ?? "";
}
