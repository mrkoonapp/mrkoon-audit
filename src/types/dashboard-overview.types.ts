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
  with_transactions?: number;
  total_with_transactions?: number;
  country_breakdown?: IHomeKpiCountryRow[];
}

export interface IHomeKpiEntityWithTransactions {
  total?: number;
  in_period?: number;
  active?: number;
  total_active?: number;
  registered_in_period?: number;
  active_new_in_period?: number;
  with_transactions?: number;
  total_with_transactions?: number;
  country_breakdown?: Array<
    IHomeKpiCountryRow & {
      country_name?: { en: string; ar: string } | string;
      in_period_count?: number;
      registered_in_period?: number;
      active_new_in_period?: number;
      with_transactions_count?: number;
      total_with_transactions_count?: number;
    }
  >;
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
  companies_with_transactions?: IHomeKpiEntityWithTransactions;
  buyers_with_transactions?: IHomeKpiEntityWithTransactions;
  pay_requests?: IHomeKpiPayRequests;
  total_inspections?: {
    total: number;
    offline: number;
    online: number;
  };
  total_bids?: number;
  total_bidders?: number;
  total_auctions?: number;
  all_clients_count?: number;
  new_clients?: Array<{
    id: number | string;
    name: string;
    image?: string | null;
    joined_at: string;
    phone?: string | null;
  }>;
  avg_time_to_start_auction?: {
    avg_seconds?: number;
    avg_hours?: number;
    avg_days?: number;
    total_auctions_measured?: number;
    country_breakdown?: any[];
  };
  avg_auction_start_time_hours?: number;
}

export interface IHomeKpiPayRequests {
  total: number;
  created_by_user: number;
  created_by_admin: number;
  user_percentage?: number;
  admin_percentage?: number;
  country_breakdown?: Array<{
    country_id?: number | string | null;
    country_code?: number | string | null;
    country_name?: { en: string; ar: string } | string;
    total_count?: number;
    user_count?: number;
    admin_count?: number;
    user_percentage?: number;
    admin_percentage?: number;
  }>;
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
  madeTransactions?: number;
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

export interface IOverviewTransactions {
  sellers: {
    total: number;
    series: number[];
  };
  buyers: {
    total: number;
    series: number[];
  };
}

export interface IOverviewPayRequests {
  createdByBuyers: number;
  createdByAdmins: number;
  total: number;
  userPercentage?: number;
  adminPercentage?: number;
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
  payRequests: IOverviewPayRequests;
  transactions: IOverviewTransactions;
}
