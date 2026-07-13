import type { DashboardFilters } from 'src/components/dashboard';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

/** Empty filter state used to seed and reset the dashboard filters drawer. */
export const defaultDashboardFilters: DashboardFilters = {
  startDate: null,
  endDate: null,
  country: '',
};

/** Count the active (set) filters — drives the toolbar filter badge. */
export function countActiveFilters(filters: DashboardFilters): number {
  let count = 0;
  if (filters.startDate || filters.endDate) count += 1;
  if (filters.country) count += 1;
  return count;
}

/** Format a seller / transaction amount together with its currency code. */
export function formatAmount(amount: number, currency: string): string {
  return `${fCurrency(amount, { minimumFractionDigits: 0 })} ${currency}`;
}

/** Format a client's join date for the "New Clients" list. */
export function formatJoinedAt(isoDate: string): string {
  return fDate(isoDate);
}
