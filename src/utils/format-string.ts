import type { ILanguage } from 'src/types/main.types';

/**
 * Resolve a localized string from an `ILanguage` bag for the given locale.
 * Falls back: exact locale → generic Arabic (`ar`) for any `ar-*` locale → English.
 *
 * @param value The localized bag (e.g. a country/category `name`).
 * @param lang  The active locale value (`en` | `ar-SA` | `ar-EG`).
 */
export function getLocalizedText(value: ILanguage | undefined | null, lang: string): string {
  if (!value) {
    return '';
  }

  const direct = value[lang as keyof ILanguage];
  if (direct) {
    return direct;
  }

  if (lang.startsWith('ar') && value.ar) {
    return value.ar;
  }

  return value.en ?? value.ar ?? '';
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
