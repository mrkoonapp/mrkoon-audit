import type { Dayjs } from 'dayjs';
import type { DatePeriod } from 'src/utils/constants';

import dayjs from 'dayjs';

import { fDate } from 'src/utils/format-time';
import { DATE_PERIODS } from 'src/utils/constants';
import { fCurrency } from 'src/utils/format-number';

import type { DashboardFilters } from './types';

// ----------------------------------------------------------------------
// Generic helpers shared by every dashboard-style page (dashboard, auctions, …)
// ----------------------------------------------------------------------

/** Empty filter state used to seed and reset the shared filters drawer. */
export const defaultDashboardFilters: DashboardFilters = {
  // Empty period = no date filter selected.
  period: '',
  startDate: null,
  endDate: null,
  // Empty country id = the "All countries" option (unfiltered).
  country: '',
};

/** Count the active (set) filters — drives the toolbar filter badge. */
export function countActiveFilters(filters: DashboardFilters): number {
  let count = 0;
  if (filters.period) count += 1;
  if (filters.country) count += 1;
  return count;
}

/**
 * Resolve a preset period to a concrete `[startDate, endDate]` range spanning
 * the current period (e.g. `monthly` → the current calendar month). `custom`
 * and `''` return a null range — the caller keeps the manually-picked dates.
 * (dayjs' `quarter` plugin isn't loaded, so the quarter is computed manually.)
 */
export function getPeriodRange(period: DatePeriod): {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
} {
  const now = dayjs();

  switch (period) {
    case DATE_PERIODS.WEEKLY:
      return { startDate: now.startOf('week'), endDate: now.endOf('week') };
    case DATE_PERIODS.MONTHLY:
      return { startDate: now.startOf('month'), endDate: now.endOf('month') };
    case DATE_PERIODS.QUARTERLY: {
      const quarterStart = now.month(Math.floor(now.month() / 3) * 3).startOf('month');
      return { startDate: quarterStart, endDate: quarterStart.add(2, 'month').endOf('month') };
    }
    case DATE_PERIODS.YEARLY:
      return { startDate: now.startOf('year'), endDate: now.endOf('year') };
    default:
      return { startDate: null, endDate: null };
  }
}

/** Format a monetary amount together with its currency code (e.g. "1,820,000 EGP"). */
export function formatAmount(amount: number, currency: string): string {
  return `${fCurrency(amount, { minimumFractionDigits: 0 })} ${currency}`;
}

/** Format an ISO date for list rows (e.g. a client's join date). */
export function formatJoinedAt(isoDate: string): string {
  return fDate(isoDate);
}
