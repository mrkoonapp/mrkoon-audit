/**
 * API Helper Utilities
 * Provides utility functions for API requests
 */

/**
 * Builds URL query parameters from an object
 * Filters out blacklisted keys, empty values, and encodes parameters properly
 *
 * @param params - Object containing query parameters
 * @returns Formatted query string with leading '?'
 *
 * @example
 * buildQueryParams({ page: 1, search: 'test' }) // returns '?page=1&search=test'
 */
export function buildQueryParams(
  params:
    | Record<string, number | string | boolean | object | object[] | string[] | unknown>
    | undefined
): string {
  if (!params) return '?';

  // Keys to exclude from query string
  const blacklist = ['signal', 'queryKey', 'meta'];

  const query = Object.entries(params)
    .filter(
      ([k, v]) =>
        !blacklist.includes(k) && v !== undefined && v !== null && v !== '' && !!v
    )
    .map(([k, v]) => {
      let value = v;

      // Handle arrays
      if (Array.isArray(v)) {
        if (v.every((item) => typeof item === 'object')) {
          // Array of objects - extract IDs
          value = v.map((item) => item?.id).join(',');
        } else {
          // Array of primitives
          value = v.join(',');
        }
      }
      // Handle objects with id property
      else if (typeof v === 'object' && v !== null && 'id' in v) {
        value = (v as any)?.id || '';
      }

      return `${encodeURIComponent(k)}=${encodeURIComponent(String(value))}`;
    })
    .join('&');

  return query ? `?${query}` : '?';
}

import type { UseFormSetError } from 'react-hook-form';

import { toast } from 'src/components/snackbar';

/**
 * Generic API Error handler. Formats the error into field errors if present,
 * otherwise shows a global toast notification.
 */
export function handleApiError(error: any, setError?: UseFormSetError<any>) {
  if (setError && error.fieldErrors && typeof error.fieldErrors === 'object') {
    Object.entries(error.fieldErrors).forEach(([field, message]) => {
      setError(field as any, { type: 'server', message: message as string });
    });
  } else {
    toast.error(error?.message || 'Something went wrong');
  }
}
