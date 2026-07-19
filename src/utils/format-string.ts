import type { ILanguage } from 'src/types/main.types';

/**
 * Resolve a localized string from an `ILanguage` bag for the given locale.
 * Falls back: exact locale → generic Arabic (`ar`) for any `ar-*` locale → English.
 *
 * @param value The localized bag (e.g. a country/category `name`).
 * @param lang  The active locale value (`en` | `ar-SA` | `ar-EG`).
 */
export function getLocalizedText(
  value: string | ILanguage | undefined | null,
  lang: string
): string {
  if (!value) {
    return '';
  }

  let parsedValue: any = value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        parsedValue = JSON.parse(trimmed);
      } catch {
        // Return original string if JSON parsing fails
        return value;
      }
    } else {
      // It's a plain string, return it directly
      return value;
    }
  }

  // If parsedValue is not an object, return string representation
  if (typeof parsedValue !== 'object' || parsedValue === null) {
    return String(value);
  }

  const direct = parsedValue[lang as keyof ILanguage];
  if (direct) {
    return direct;
  }

  // Handle case-insensitive keys (like ar-SA / ar-sa / ar-EG / ar-eg)
  const normalizedLang = lang.toLowerCase();
  for (const key of Object.keys(parsedValue)) {
    if (key.toLowerCase() === normalizedLang) {
      return parsedValue[key];
    }
  }

  if (lang.startsWith('ar')) {
    const arVal =
      parsedValue.ar ||
      parsedValue['ar-EG'] ||
      parsedValue['ar-SA'] ||
      parsedValue['ar-eg'] ||
      parsedValue['ar-sa'];
    if (arVal) return arVal;
  }

  return parsedValue.en ?? parsedValue.ar ?? Object.values(parsedValue)[0] ?? '';
}

/**
 * Truncates a string to a specified length and appends an ellipsis if necessary.
 *
 * @param text The string to truncate.
 * @param length The maximum length of the string before truncation.
 * @returns The truncated string or original string if it's shorter than the max length.
 */
export function fTruncate(text: string | null | undefined, length: number = 50): string {
  if (!text) {
    return '';
  }

  if (text.length <= length) {
    return text;
  }

  return `${text.slice(0, length)}...`;
}
