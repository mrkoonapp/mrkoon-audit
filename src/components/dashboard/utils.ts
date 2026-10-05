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
  period: DATE_PERIODS.MONTHLY,
  ...getPeriodRange(DATE_PERIODS.MONTHLY),
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
    case DATE_PERIODS.ALL_TIME:
      return { startDate: dayjs('2020-01-01').startOf('day'), endDate: now.endOf('day') };
    case DATE_PERIODS.WEEKLY:
      return { startDate: now.startOf('week'), endDate: now.endOf('day') };
    case DATE_PERIODS.MONTHLY:
      return { startDate: now.startOf('month'), endDate: now.endOf('day') };
    case DATE_PERIODS.QUARTERLY: {
      const quarterStartMonth = Math.floor(now.month() / 3) * 3;
      return {
        startDate: now.month(quarterStartMonth).startOf('month'),
        endDate: now.endOf('day'),
      };
    }
    case DATE_PERIODS.YEARLY:
      return { startDate: now.startOf('year'), endDate: now.endOf('day') };
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

// ----------------------------------------------------------------------

export type PeriodOption = {
  /** Stable key — the option's start date (`YYYY-MM-DD`). */
  value: string;
  label: string;
  startDate: Dayjs;
  endDate: Dayjs;
};

/** How many past periods the period-value picker lists, per preset. */
const PERIOD_OPTION_COUNTS: Partial<Record<DatePeriod, number>> = {
  [DATE_PERIODS.WEEKLY]: 12,
  [DATE_PERIODS.MONTHLY]: 12,
  [DATE_PERIODS.QUARTERLY]: 8,
  [DATE_PERIODS.YEARLY]: 5,
};

/**
 * Lists the concrete periods a preset can point at, newest first — e.g.
 * `quarterly` → "Q4 2026", "Q3 2026", … The current period ends today (same as
 * `getPeriodRange`); past periods end on their last day. Returns `[]` for
 * presets without discrete values (`all_time`, `custom`, `''`).
 */
export function getPeriodOptions(period: DatePeriod): PeriodOption[] {
  const count = PERIOD_OPTION_COUNTS[period];
  if (!count) return [];

  const now = dayjs();

  return Array.from({ length: count }, (_, index) => {
    let start: Dayjs;
    let end: Dayjs;
    let label: string;

    switch (period) {
      case DATE_PERIODS.WEEKLY:
        start = now.subtract(index, 'week').startOf('week');
        end = start.endOf('week');
        label = `${start.format('D MMM')} – ${end.format('D MMM YYYY')}`;
        break;
      case DATE_PERIODS.QUARTERLY: {
        const quarterStart = now.month(Math.floor(now.month() / 3) * 3).startOf('month');
        start = quarterStart.subtract(index * 3, 'month');
        end = start.add(2, 'month').endOf('month');
        label = `Q${Math.floor(start.month() / 3) + 1} ${start.year()}`;
        break;
      }
      case DATE_PERIODS.YEARLY:
        start = now.subtract(index, 'year').startOf('year');
        end = start.endOf('year');
        label = start.format('YYYY');
        break;
      default:
        start = now.subtract(index, 'month').startOf('month');
        end = start.endOf('month');
        label = start.format('MMM YYYY');
    }

    return {
      value: start.format('YYYY-MM-DD'),
      label,
      startDate: start,
      endDate: index === 0 ? now.endOf('day') : end,
    };
  });
}
