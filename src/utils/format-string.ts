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
    if (trimmed.includes('{') && trimmed.includes('}')) {
      try {
        const jsonStart = trimmed.indexOf('{');
        const jsonEnd = trimmed.lastIndexOf('}') + 1;
        parsedValue = JSON.parse(trimmed.slice(jsonStart, jsonEnd));
      } catch {
        if (lang.startsWith('ar')) {
          const arMatch = trimmed.match(/"(?:ar|ar-EG|ar-SA|ar-eg|ar-sa)"\s*:\s*"([^"]+)"/i);
          if (arMatch && arMatch[1]) return arMatch[1];
        }
        const enMatch = trimmed.match(/"en"\s*:\s*"([^"]+)"/i);
        if (enMatch && enMatch[1]) return enMatch[1];

        const anyMatch = trimmed.match(/"[^"]+"\s*:\s*"([^"]+)"/);
        if (anyMatch && anyMatch[1]) return anyMatch[1];

        return value;
      }
    } else {
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
