/**
 * Typed mock data for the overview dashboard.
 *
 * Shapes mirror what a future `src/api/` endpoint would return, so a real
 * TanStack Query hook (standalone fn + hook per CLAUDE.md §0) can replace
 * `overviewMockData` 1:1 without touching the widgets or the view. Human-facing
 * copy that is *data* (client names, categories) stays here; copy that is *UI*
 * (section titles, "last 7 days") is resolved from translations in the view.
 */

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type OverviewStat = {
  id: string;
  /** i18n key resolved by the view under the `overview.stats` namespace. */
  labelKey: string;
  value: number;
  /** Signed percentage trend vs. the previous period. */
  trend: number;
};

export type OverviewClient = {
  id: string;
  name: string;
  category: string;
  avatarUrl?: string;
  /** ISO date string. */
  joinedAt: string;
};

export type OverviewSeller = {
  id: string;
  name: string;
  category: string;
  avatarUrl?: string;
  amount: number;
  currency: string;
  quantity: number;
};

export type OverviewCategory = {
  id: string;
  name: string;
  value: number;
  percent: number;
};

export type OverviewData = {
  stats: OverviewStat[];
  successRate: {
    successful: number;
    failed: number;
    /** 0–100 rate shown in the donut center. */
    rate: number;
  };
  transactions: {
    categories: string[];
    series: number[];
    totalAmount: number;
    totalCount: number;
    currency: string;
  };
  newClients: {
    total: number;
    items: OverviewClient[];
  };
  topSellers: OverviewSeller[];
  topCategories: OverviewCategory[];
};

// ----------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------

export const overviewMockData: OverviewData = {
  stats: [
    { id: 'gmv', labelKey: 'gmv', value: 9890776, trend: 12 },
    { id: 'sellers', labelKey: 'totalSellers', value: 2323, trend: 86.6 },
    { id: 'inspections', labelKey: 'totalInspections', value: 70783, trend: 12 },
    { id: 'bidders', labelKey: 'totalBidders', value: 73900, trend: 73.9 },
  ],
  successRate: {
    successful: 28900,
    failed: 679,
    rate: 77.6,
  },
  transactions: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    series: [42000, 35000, 51000, 49000, 62000, 75000, 68000, 58000, 61000, 72000, 80000, 86700],
    totalAmount: 8670000,
    totalCount: 2877,
    currency: 'EGP',
  },
  newClients: {
    total: 8392,
    items: [
      { id: 'c1', name: 'BMW', category: 'Cars & Trucks', joinedAt: '2024-02-08' },
      { id: 'c2', name: 'HP', category: 'Electronics', joinedAt: '2025-05-10' },
      { id: 'c3', name: 'Ezz Steel', category: 'Steel', joinedAt: '2020-03-01' },
      { id: 'c4', name: 'Daraby', category: 'Electronics', joinedAt: '2023-11-19' },
      { id: 'c5', name: 'Marlboro', category: 'Vape', joinedAt: '2022-07-24' },
    ],
  },
  topSellers: [
    { id: 's1', name: 'BMW', category: 'Cars & Trucks', amount: 1630000, currency: 'EGP', quantity: 21 },
    { id: 's2', name: 'Ezz Steel', category: 'Steel', amount: 1250000, currency: 'SAR', quantity: 12 },
    { id: 's3', name: 'HP', category: 'Electronics', amount: 19000000, currency: 'EGP', quantity: 2 },
    { id: 's4', name: 'Daraby', category: 'Electronics', amount: 78000000, currency: 'EGP', quantity: 15 },
    { id: 's5', name: 'Marlboro', category: 'Vape', amount: 90000000, currency: 'QAR', quantity: 10 },
  ],
  topCategories: [
    { id: 'cat1', name: 'Wood', value: 78329, percent: 100 },
    { id: 'cat2', name: 'Plastic', value: 10392, percent: 62 },
    { id: 'cat3', name: 'Cars & Trucks', value: 10392, percent: 48 },
    { id: 'cat4', name: 'Electronics', value: 459, percent: 22 },
    { id: 'cat5', name: 'Stainless steel', value: 7288, percent: 34 },
  ],
};
