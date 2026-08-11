/**
 * Application Constants
 * Defines constant values used throughout the application
 */

// ----------------------------------------------------------------------
// Product Status Constants
// ----------------------------------------------------------------------

/**
 * Product status constants
 * Used to filter and display products based on their current status
 */
export const PRODUCT_STATUS = {
  SOLD: '68',
  NEW_WAITING_FOR_ACTIVATION: '1',
  ACTIVE: '2',
  NOT_ACTIVATED: '3',
  AUCTION_DATE_ENDED: '18',
  PREVIEW: '22',
  REJECTED: '57',
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

// ----------------------------------------------------------------------
// Price Type Constants
// ----------------------------------------------------------------------

/**
 * Price type constants
 * Defines the pricing model for products
 */
export const PRICE_TYPES = {
  FIXED: 1, // Fixed price
  HIGH: 2, // Auction (highest bid)
  OFFERS: 3, // Price offers/negotiation
} as const;

export type PriceType = (typeof PRICE_TYPES)[keyof typeof PRICE_TYPES];

/**
 * Returns the auction price type based on the user's country.
 * Saudi Arabia (SA) → OFFERS (3), all others → HIGH (2)
 */
export function getAuctionPriceType(countryGlobalCode?: string | null): PriceType {
  return countryGlobalCode === 'SA' ? PRICE_TYPES.OFFERS : PRICE_TYPES.HIGH;
}

/**
 * Checks if a price type value represents an auction (either HIGH=2 or OFFERS=3).
 */
export function isAuctionPriceType(priceType: number | string): boolean {
  const num = typeof priceType === 'string' ? Number(priceType) : priceType;
  return num === PRICE_TYPES.HIGH || num === PRICE_TYPES.OFFERS;
}

// ----------------------------------------------------------------------
// Product Type Constants
// ----------------------------------------------------------------------

/**
 * Product type constants
 */
export const PRODUCT_TYPES = {
  STAGNANT: 1,
  SCRAPS: 2,
} as const;

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

// ----------------------------------------------------------------------
// Pay / Insurance Status Constants
// ----------------------------------------------------------------------

export enum PAY_STATUS_ENUM {
  NEW = 1,
  PAID = 2,
  UNPAID = 3,
  REFUND = 4,
  EXCLUDED = 5,
}

export const PAY_STATUS = (t: (key: string) => string) => [
  { id: PAY_STATUS_ENUM.NEW, name: t('dashboard.products.inspectionsTable.statusNew') },
  { id: PAY_STATUS_ENUM.PAID, name: t('dashboard.products.inspectionsTable.statusPaid') },
  { id: PAY_STATUS_ENUM.UNPAID, name: t('dashboard.products.inspectionsTable.statusUnpaid') },
  { id: PAY_STATUS_ENUM.REFUND, name: t('dashboard.products.inspectionsTable.statusRefund') },
  {
    id: PAY_STATUS_ENUM.EXCLUDED,
    name: t('dashboard.products.inspectionsTable.statusExcluded'),
  },
];

export const INSURANCE_STATUS = (t: (key: string) => string) => [
  { id: PAY_STATUS_ENUM.NEW, name: t('dashboard.products.inspectionsTable.statusNew') },
  { id: PAY_STATUS_ENUM.PAID, name: t('dashboard.products.inspectionsTable.statusPaid') },
  { id: PAY_STATUS_ENUM.UNPAID, name: t('dashboard.products.inspectionsTable.statusUnpaid') },
  { id: PAY_STATUS_ENUM.REFUND, name: t('dashboard.products.inspectionsTable.statusRefund') },
];

// ----------------------------------------------------------------------
// Inspection Constants
// ----------------------------------------------------------------------

export enum InspectionTypeEnum {
  OFFLINE = 1,
  ONLINE,
}

export enum InspectionStatusEnum {
  NOT_REQUESTED = 0,
  REQUESTED,
  DONE,
}

export const INSPECTION_STATUS = (t: (key: string) => string) => [
  {
    id: InspectionStatusEnum.NOT_REQUESTED,
    name: t('dashboard.products.inspectionsTable.inspectionNotRequested'),
  },
  {
    id: InspectionStatusEnum.REQUESTED,
    name: t('dashboard.products.inspectionsTable.inspectionRequested'),
  },
  {
    id: InspectionStatusEnum.DONE,
    name: t('dashboard.products.inspectionsTable.inspectionDone'),
  },
];

// ----------------------------------------------------------------------
// Date Period Constants (shared filters drawer)
// ----------------------------------------------------------------------

/**
 * Date filter period presets used by the shared dashboard filters drawer.
 * `CUSTOM` reveals the start/end date pickers; the other presets resolve to a
 * concrete date range via `getPeriodRange` (see `src/components/dashboard/utils.ts`).
 */
export const DATE_PERIODS = {
  ALL_TIME: 'all_time',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
} as const;

/** A selected date period, or `''` for "no date filter". */
export type DatePeriod = (typeof DATE_PERIODS)[keyof typeof DATE_PERIODS] | '';
