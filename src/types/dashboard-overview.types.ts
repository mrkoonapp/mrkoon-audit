// ----------------------------------------------------------------------
// Dashboard overview (`/dashboard`) — API response + view model types
// ----------------------------------------------------------------------

/** Countries the overview splits its numbers by. */
export type OverviewCountry = 'EG' | 'SA';

export type CountrySplit = Record<OverviewCountry, number>;

export type TrendDirection = 'up' | 'down';

// ----------------------------------------------------------------------
// `GET audit/home/kpis` — only the fields the overview reads
// ----------------------------------------------------------------------

/**
 * One row of a `country_breakdown` array. The backend identifies the country by
 * `country_code` (3 / 4) and/or `country_id` (6 / 26), so both are optional.
 */
export interface IHomeKpiCountryRow {
  country_id?: number | string | null;
  country_code?: number | string | null;
  total_count?: number;
  new_count?: number;
  active_count?: number;
  active_new_count?: number;
  total_gmv?: number;
}

export interface IHomeKpiAuctionOutcome extends IHomeKpiCountryRow {
  status_id?: number;
  status?: number;
  products_count?: number;
}

export interface IHomeKpiUsers {
  total: number;
  active: number;
  registered_in_period: number;
  active_new_in_period: number;
  country_breakdown?: IHomeKpiCountryRow[];
}

export interface IHomeKpiTopTag {
  tag_id: number;
  name_ar: string | null;
  name_en: string | null;
  gmv: number;
}

export interface IHomeKpis {
  gmv?: number;
  total_money?: number;
  total_products?: number;
  new_products?: number;
  total_buyers?: number;
  active_buyers?: number;
  total_sellers?: number;
  active_sellers?: number;
  top_tags_gmv?: IHomeKpiTopTag[];
  advanced_total_money?: { total: number; country_breakdown?: IHomeKpiCountryRow[] };
  advanced_products?: {
    total: number;
    new_in_period: number;
    country_breakdown?: IHomeKpiCountryRow[];
  };
  advanced_buyers?: IHomeKpiUsers;
  advanced_sellers?: IHomeKpiUsers;
  advanced_auctions?: { outcomes?: IHomeKpiAuctionOutcome[] };
}

// ----------------------------------------------------------------------
// View model consumed by the overview widgets
// ----------------------------------------------------------------------

export interface IOverviewSummaryStat {
  total: number;
  /** Shown as "(Active: n)" next to the total, when present. */
  active?: number;
  split: CountrySplit;
}

export interface IOverviewUsers {
  active: number;
  registered: number;
  activeNew: number;
}

export interface IOverviewAuctions {
  /** Sold + ended + pending activation (same definition as the old KPI table). */
  done: number;
  sold: number;
  ended: number;
  pendingActivation: number;
}

export interface IOverviewCategory {
  id: number;
  name: string;
  gmv: number;
}

export interface IDashboardOverview {
  summary: {
    gmv: IOverviewSummaryStat;
    products: IOverviewSummaryStat;
    buyers: IOverviewSummaryStat;
    sellers: IOverviewSummaryStat;
  };
  productsChart: {
    totalProducts: CountrySplit;
    newProducts: CountrySplit;
    auctionsCreated: CountrySplit;
    auctionsCompleted: CountrySplit;
  };
  topCategories: IOverviewCategory[];
  buyers: IOverviewUsers;
  sellers: IOverviewUsers;
  auctions: IOverviewAuctions;
}
