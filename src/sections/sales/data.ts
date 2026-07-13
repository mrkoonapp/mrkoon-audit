import type { IconifyName } from 'src/components/iconify';

/**
 * Typed mock data for the sales page. Shapes mirror a future `src/api/` response
 * so a real TanStack Query hook can replace `salesMockData` 1:1. Merchant names
 * are data (not translated); UI labels come from i18n in the view.
 */

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type SalesStat = {
  id: string;
  /** i18n key under `dashboard.sales.stats`. */
  labelKey: string;
  value: number;
  /** i18n key under `dashboard.sales.units` for the value suffix. */
  unitKey: string;
  /** Faint trailing icon (mutually exclusive with `action`). */
  icon?: IconifyName;
  /** Render the trailing arrow action button instead of an icon. */
  action?: boolean;
};

export type Merchant = {
  id: string;
  name: string;
  category?: string;
  avatarUrl?: string;
  joinedAt: string;
};

export type MerchantUpdate = {
  id: string;
  /** i18n key under `dashboard.sales.updates`. */
  labelKey: string;
  value: number;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

export type TopSuccessItem = {
  id: string;
  name: string;
  value: number;
  percent: number;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

export type SalesData = {
  stats: SalesStat[];
  newMerchants: {
    total: number;
    items: Merchant[];
  };
  merchantsUpdates: MerchantUpdate[];
  topSuccess: TopSuccessItem[];
  topMerchants: Merchant[];
};

// ----------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------

export const salesMockData: SalesData = {
  stats: [
    { id: 'calls', labelKey: 'noOfCalls', value: 21854, unitKey: 'call', icon: 'solar:phone-bold' },
    {
      id: 'products',
      labelKey: 'noOfProducts',
      value: 9712,
      unitKey: 'product',
      icon: 'solar:box-minimalistic-bold',
    },
    { id: 'auctions', labelKey: 'noOfAuctions', value: 77923, unitKey: 'auction', action: true },
  ],
  newMerchants: {
    total: 76439,
    items: [
      { id: 'm1', name: 'Elaraby', joinedAt: '2025-12-12' },
      { id: 'm2', name: 'Starbucks', joinedAt: '2023-09-18' },
      { id: 'm3', name: 'Elaraby', joinedAt: '2023-09-18' },
      { id: 'm4', name: 'Ezz steel', joinedAt: '2024-05-03' },
      { id: 'm5', name: 'Ezz steel', joinedAt: '2024-05-03' },
      { id: 'm6', name: 'LKQ', joinedAt: '2024-05-03' },
      { id: 'm7', name: 'BMW', joinedAt: '2023-09-18' },
      { id: 'm8', name: 'APA Corporation', joinedAt: '2023-09-18' },
      { id: 'm9', name: 'Github', joinedAt: '2024-05-03' },
    ],
  },
  merchantsUpdates: [
    { id: 'reactivated', labelKey: 'reactivated', value: 56380, color: 'success' },
    { id: 'paidInsurance', labelKey: 'paidInsurance', value: 56380, color: 'warning' },
    { id: 'avgPerAuction', labelKey: 'avgMerchantsPerAuction', value: 56380, color: 'info' },
  ],
  topSuccess: [
    { id: 's1', name: 'Elaraby', value: 9820, percent: 100, color: 'primary' },
    { id: 's2', name: 'Ezz steel', value: 8110, percent: 82, color: 'success' },
    { id: 's3', name: 'CF Industries', value: 6540, percent: 66, color: 'warning' },
    { id: 's4', name: 'Starbucks', value: 4980, percent: 51, color: 'info' },
    { id: 's5', name: 'Viatris', value: 3120, percent: 32, color: 'error' },
  ],
  topMerchants: [
    { id: 't1', name: 'Elaraby', category: 'Electronics', joinedAt: '2025-12-10' },
    { id: 't2', name: 'Ezz steel', category: 'steel', joinedAt: '2023-03-15' },
    { id: 't3', name: 'CF Industries', category: 'Auto parts', joinedAt: '2024-08-22' },
    { id: 't4', name: 'Ezz steel', category: 'steel', joinedAt: '2023-03-15' },
    { id: 't5', name: 'Viatris', category: 'Healthcare', joinedAt: '2024-08-22' },
  ],
};
