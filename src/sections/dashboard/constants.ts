import type { OverviewCountry } from 'src/types/dashboard-overview.types';

import { COUNTRY_IDS, PRODUCT_STATUS } from 'src/utils/constants';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------
// Countries
// ----------------------------------------------------------------------

/**
 * Values that identify each country in a `country_breakdown` row — the backend
 * sends either the static `country_code` (3 / 4) or the country id (6 / 26).
 */
export const OVERVIEW_COUNTRY_MATCHERS: Record<OverviewCountry, string[]> = {
  EG: ['3', COUNTRY_IDS.EGYPT, 'EG'],
  SA: ['4', COUNTRY_IDS.SAUDI_ARABIA, 'SA'],
};

/** Header country tabs. `''` is the "All countries" sentinel of the filter. */
export const OVERVIEW_COUNTRY_TABS = [
  { value: '', labelKey: 'all', flag: null },
  { value: COUNTRY_IDS.EGYPT, labelKey: 'egypt', flag: 'EG' },
  { value: COUNTRY_IDS.SAUDI_ARABIA, labelKey: 'ksa', flag: 'SA' },
] as const;

// ----------------------------------------------------------------------
// Auction outcomes (`advanced_auctions.outcomes[].status_id`)
// ----------------------------------------------------------------------

export const AUCTION_OUTCOME_STATUS = {
  SOLD: Number(PRODUCT_STATUS.SOLD),
  ENDED: Number(PRODUCT_STATUS.AUCTION_DATE_ENDED),
  PENDING_ACTIVATION: Number(PRODUCT_STATUS.PREVIEW),
} as const;

// ----------------------------------------------------------------------
// Colors (from the Figma "Dashboard" frame)
// ----------------------------------------------------------------------

export const OVERVIEW_COLORS = {
  country: {
    EG: 'linear-gradient(180deg, #FB7185 0%, #95434F 100%)',
    SA: '#00A76F',
  },
  productsChart: {
    EG: { from: '#FB9A99', to: '#D8A7A7', legend: '#FB7185' },
    SA: { from: '#B2DF8A', to: '#BFDCA5', legend: '#B2DF8A' },
  },
  auctions: {
    sold: '#A6CEE3',
    ended: '#FB9A99',
    pendingActivation: '#D7D494',
  },
  payRequests: {
    byBuyers: '#FDBF6F',
    byAdmins: '#FFFF99',
  },
  transactions: {
    sellers: '#00D68E',
    buyers: '#D4CA53',
  },
  trend: {
    up: 'rgba(74, 185, 105, 0.12)',
    down: 'rgba(142, 26, 26, 0.24)',
  },
  userRows: {
    active: 'rgba(74, 185, 105, 0.12)',
    registered: 'rgba(209, 113, 112, 0.16)',
    activeNew: 'rgba(83, 145, 179, 0.15)',
  },
  sellersBars: ['#B0B883', '#F0949A', '#5391B3'],
} as const;

/** Colored pill on the left of every widget title. */
export const OVERVIEW_ACCENTS = {
  products: 'rgba(245, 158, 11, 0.3)',
  categories: 'rgba(251, 113, 133, 0.3)',
  buyers: 'rgba(11, 136, 245, 0.3)',
  sellers: 'rgba(11, 241, 245, 0.3)',
  auctions: 'rgba(74, 185, 105, 0.2)',
  payRequests: 'rgba(251, 113, 133, 0.3)',
  transactions: 'rgba(245, 158, 11, 0.3)',
} as const;

// ----------------------------------------------------------------------
// Static assets (exported from Figma)
// ----------------------------------------------------------------------

const ICONS_DIR = `${CONFIG.assetsDir}/assets/icons/dashboard-overview`;
const IMAGES_DIR = `${CONFIG.assetsDir}/assets/images/dashboard-overview`;

export const OVERVIEW_ASSETS = {
  trendUp: `${ICONS_DIR}/ic-trend-up.svg`,
  trendDown: `${ICONS_DIR}/ic-trend-down.svg`,
  coin: `${ICONS_DIR}/ic-coin.svg`,
  active: `${ICONS_DIR}/ic-active.svg`,
  registered: `${ICONS_DIR}/ic-registered.svg`,
  sparkles: `${ICONS_DIR}/ic-sparkles.svg`,
  truck: `${IMAGES_DIR}/truck.png`,
  truckLogo: `${IMAGES_DIR}/truck-logo.png`,
  truckShadow: `${IMAGES_DIR}/truck-shadow.svg`,
} as const;

/** Below this Transaction-card width the truck would cover the tiles, so it is hidden. */
export const TRUCK_MIN_CARD_WIDTH = 680;

/**
 * Layers of the decorative radial icon in the Buyers card header, positioned
 * exactly as in the design (27×27 box).
 */
export const BUYERS_RADIAL_LAYERS = [
  { src: `${ICONS_DIR}/radial-01.svg`, left: 6.28, top: 5.97, width: 15.044, height: 15.044 },
  { src: `${ICONS_DIR}/radial-03a.svg`, left: 3.45, top: 3.15, width: 20.692, height: 20.692 },
  { src: `${ICONS_DIR}/radial-03b.svg`, left: 6.35, top: 6.05, width: 14.888, height: 14.888 },
  { src: `${ICONS_DIR}/radial-03c.svg`, left: 0, top: 0, width: 27, height: 27 },
  { src: `${ICONS_DIR}/radial-04.svg`, left: 6.29, top: 5.97, width: 15.035, height: 15.044 },
  { src: `${ICONS_DIR}/radial-05.svg`, left: 6.89, top: 3.04, width: 17.366, height: 20.913 },
  { src: `${ICONS_DIR}/radial-06.svg`, left: 13.75, top: 0, width: 13.374, height: 25.234 },
] as const;
