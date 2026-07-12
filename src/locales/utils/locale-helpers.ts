import type { LanguageValue } from '../locales-config';

/**
 * Resolves which Arabic locale to use based on the user's country code.
 * @param countryCode - ISO country code from user profile (e.g., "EG", "SA")
 * @returns 'ar-EG' for Egypt, 'ar-SA' for everything else
 */
export const resolveArabicLocale = (countryCode: string | undefined): 'ar-SA' | 'ar-EG' =>
  countryCode?.toUpperCase() === 'EG' ? 'ar-EG' : 'ar-SA';

// ----------------------------------------------------------------------

/**
 * Resolves the dashboard locale from the `lang` URL query parameter + user country.
 *
 * | lang param | User country | Resolved locale |
 * |------------|--------------|-----------------|
 * | `en`       | any          | `en`            |
 * | `ar`       | SA           | `ar-SA`         |
 * | `ar`       | EG           | `ar-EG`         |
 * | `ar`       | unknown/null | `ar-SA` (default)|
 * | missing    | any          | `null`          |
 *
 * @param langParam - Value of the `lang` query parameter (e.g., "ar", "en")
 * @param countryCode - ISO country code from user profile (e.g., "EG", "SA")
 * @returns Resolved LanguageValue, or `null` if param is missing/unrecognized
 */
export const resolveLocaleFromLangParam = (
  langParam: string | null | undefined,
  countryCode: string | undefined
): LanguageValue | null => {
  if (!langParam) return null;

  const normalized = langParam.trim().toLowerCase();

  if (normalized === 'en') return 'en';
  if (normalized === 'ar') return resolveArabicLocale(countryCode);

  return null;
};

// ----------------------------------------------------------------------

type ParsedLocale = {
  language: string;
  country: string | null;
};

/**
 * Parses a locale string into language and country components
 * @param locale - Locale string like "ar-SA", "ar-EG", or "en"
 * @returns Object with language and country (or null if no country)
 *
 * @example
 * parseLocale("ar-SA") // { language: "ar", country: "saudi" }
 * parseLocale("ar-EG") // { language: "ar", country: "egypt" }
 * parseLocale("en") // { language: "en", country: null }
 */
export const parseLocale = (locale: string): ParsedLocale | null => {
  if (!locale) return null;

  const parts = locale.split('-');
  const language = parts[0]?.toLowerCase();

  if (!language) return null;

  // If there's no country code, return just the language
  if (parts.length === 1) {
    return { language, country: null };
  }

  // Map country codes to readable names
  const countryCode = parts[1]?.toUpperCase();
  const countryMap: Record<string, string> = {
    SA: 'saudi',
    EG: 'egypt',
  };

  const country = countryCode ? countryMap[countryCode] || null : null;

  return { language, country };
};

/**
 * Extracts the translated text from an object or string based on the current language
 * @param text - Either a string or an object with locale keys (ar-SA, ar-EG, en)
 * @param language - Current language code (e.g., "ar-SA", "ar-EG", "en")
 * @returns The translated text string
 *
 * @example
 * // API response object
 * const name = { "ar-SA": "اسم سعودي", "ar-EG": "اسم مصري", "en": "English name" }
 * getTranslatedText(name, "ar-SA") // "اسم سعودي"
 * getTranslatedText(name, "en") // "English name"
 *
 * // Plain string
 * getTranslatedText("Hello", "en") // "Hello"
 */
export const getTranslatedText = (text: any | string | undefined, language: string) => {
  if (!text) return '';
  if (typeof text === 'string') return text;

  const parsed = parseLocale(language);
  if (!parsed) return '';

  const { country, language: lang } = parsed;

  // If English is selected from any country, use 'en'
  if (lang === 'en') {
    return text.en || text.ar || '';
  }

  // For Arabic, check country-specific version first, then the other variant, then generic
  if (lang === 'ar') {
    if (country === 'egypt') {
      return text['ar-EG'] || text.ar || text['ar-SA'] || '';
    }
    if (country === 'saudi') {
      return text['ar-SA'] || text.ar || text['ar-EG'] || '';
    }
    // Bare 'ar' (no country) — try both variants before generic
    return text.ar || text['ar-SA'] || text['ar-EG'] || '';
  }

  // For other languages (like French), use the language key
  return text[lang as keyof typeof text] || text.en || text.ar || '';
};
