import type { LabelColor } from 'src/components/label';
import type { IconifyName } from 'src/components/iconify';

/**
 * Typed mock data for the inspections page. Shapes mirror a future `src/api/`
 * response so a real TanStack Query hook can replace `inspectionsMockData` 1:1.
 * Category/product/payment names are data (not translated); UI labels come from
 * i18n in the view.
 */

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type InspectionStat = {
  id: string;
  /** i18n key under `dashboard.inspections.stats`. */
  labelKey: string;
  value: number;
  format: 'number' | 'percent';
  /** Signed percentage rendered as the corner trend pill. */
  trend: number;
};

export type InspectionCategory = {
  name: string;
  value: number;
};

export type PaymentMethod = {
  id: string;
  name: string;
  icon: IconifyName;
  /** Theme palette key driving the icon tile tint. */
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  count: number;
};

export type LatestInspection = {
  id: string;
  product: string;
  description: string;
  imageUrl?: string;
  category: string;
  categoryIcon: IconifyName;
  successful: number;
  totalEarning: number;
  currency: string;
  /** Signed percentage rendered as the trailing trend pill. */
  trend: number;
  trendColor: LabelColor;
};

export type InspectionsData = {
  stats: InspectionStat[];
  byCategory: {
    items: InspectionCategory[];
  };
  paymentMethods: {
    total: number;
    items: PaymentMethod[];
  };
  latestInspections: LatestInspection[];
};

// ----------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------

export const inspectionsMockData: InspectionsData = {
  stats: [
    { id: 'total', labelKey: 'totalInspections', value: 873, format: 'number', trend: 15 },
    { id: 'categories', labelKey: 'categoriesCovered', value: 80, format: 'percent', trend: 6 },
    { id: 'clients', labelKey: 'clientServed', value: 8792, format: 'number', trend: -20 },
  ],
  byCategory: {
    items: [
      { name: 'Wood', value: 68 },
      { name: 'Steel', value: 88 },
      { name: 'Plastic', value: 54 },
      { name: 'Paper', value: 66 },
      { name: 'PET', value: 61 },
      { name: 'PVC', value: 72 },
      { name: 'PT', value: 90 },
      { name: 'Cartoon', value: 47 },
    ],
  },
  paymentMethods: {
    total: 14856,
    items: [
      {
        id: 'instapay',
        name: 'Instapay',
        icon: 'solar:transfer-horizontal-bold-duotone',
        color: 'secondary',
        count: 377,
      },
      {
        id: 'vodafone',
        name: 'Vodafone Cash',
        icon: 'solar:phone-bold',
        color: 'error',
        count: 6663,
      },
      {
        id: 'wallet',
        name: 'Wallet',
        icon: 'solar:wad-of-money-bold',
        color: 'warning',
        count: 7728,
      },
      {
        id: 'visa',
        name: 'Visa',
        icon: 'payments:visa',
        color: 'info',
        count: 88,
      },
    ],
  },
  latestInspections: [
    {
      id: 'i1',
      product: 'MDF Wood',
      description: 'white and red wood, defective and broken pallets',
      category: 'Wood',
      categoryIcon: 'solar:box-minimalistic-bold',
      successful: 676,
      totalEarning: 70000,
      currency: 'EGP',
      trend: 5,
      trendColor: 'success',
    },
    {
      id: 'i2',
      product: 'Automotive spare parts',
      description: 'lot of mixed scrap',
      category: 'Auto Parts',
      categoryIcon: 'solar:settings-bold',
      successful: 120,
      totalEarning: 130000,
      currency: 'EGP',
      trend: 8,
      trendColor: 'success',
    },
    {
      id: 'i3',
      product: 'Steel roll',
      description: 'a group of rebar rolls available in excellent condition',
      category: 'Glass',
      categoryIcon: 'solar:tea-cup-bold',
      successful: 49,
      totalEarning: 49000,
      currency: 'EGP',
      trend: 3,
      trendColor: 'success',
    },
    {
      id: 'i4',
      product: 'High black poly ethylene',
      description: 'distinguished by a deep black',
      category: 'PET',
      categoryIcon: 'solar:tag-horizontal-bold-duotone',
      successful: 53,
      totalEarning: 52000,
      currency: 'EGP',
      trend: 6,
      trendColor: 'success',
    },
  ],
};
