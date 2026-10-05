import type { TrendDirection } from 'src/types/dashboard-overview.types';

// ----------------------------------------------------------------------
// ⚠️ DUMMY DATA — placeholders for parts of the design the backend does not
// provide yet. Values are copied from the Figma "Dashboard" frame and are NOT
// flagged in the UI. Replace each block with a real API field when one exists (see docs/dashboard-overview.md → "Dummy data").
// ----------------------------------------------------------------------

/**
 * Trend arrow on each summary card. `audit/home/kpis` has no previous-period
 * comparison, so the direction cannot be computed yet.
 */
export const DUMMY_SUMMARY_TRENDS: Record<
  'gmv' | 'products' | 'buyers' | 'sellers',
  TrendDirection
> = {
  gmv: 'up',
  products: 'up',
  buyers: 'down',
  sellers: 'up',
};

/** "Pay Requests" donut — no endpoint reports who created a pay request. */
export const DUMMY_PAY_REQUESTS = {
  createdByBuyers: 9283,
  createdByAdmins: 928,
};

/** "Transaction" tiles — no endpoint reports transaction requests per side. */
export const DUMMY_TRANSACTION_REQUESTS = {
  sellers: { total: 8250, series: [12, 18, 14, 26, 20, 31, 24, 38, 30, 34, 22] },
  buyers: { total: 9328, series: [10, 14, 12, 20, 16, 24, 30, 26, 34, 36, 24] },
};
