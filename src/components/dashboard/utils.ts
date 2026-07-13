import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import type { DashboardFilters } from './types';

// ----------------------------------------------------------------------
// Generic helpers shared by every dashboard-style page (dashboard, auctions, …)
// ----------------------------------------------------------------------

/** Empty filter state used to seed and reset the shared filters drawer. */
export const defaultDashboardFilters: DashboardFilters = {
  startDate: null,
  endDate: null,
  // Empty country id = the "All countries" option (unfiltered).
  country: '',
};

/** Count the active (set) filters — drives the toolbar filter badge. */
export function countActiveFilters(filters: DashboardFilters): number {
  let count = 0;
  if (filters.startDate || filters.endDate) count += 1;
  if (filters.country) count += 1;
  return count;
}

/** Format a monetary amount together with its currency code (e.g. "1,820,000 EGP"). */
export function formatAmount(amount: number, currency: string): string {
  return `${fCurrency(amount, { minimumFractionDigits: 0 })} ${currency}`;
}

/** Format an ISO date for list rows (e.g. a client's join date). */
export function formatJoinedAt(isoDate: string): string {
  return fDate(isoDate);
}
