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
