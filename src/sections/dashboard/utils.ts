import type { DashboardFilters } from 'src/components/dashboard';
import type {
  IHomeKpis,
  CountrySplit,
  IHomeKpiUsers,
  OverviewCountry,
  IHomeKpiCountryRow,
  IDashboardOverview,
  IHomeKpiAuctionOutcome,
} from 'src/types/dashboard-overview.types';

import { DATE_PERIODS } from 'src/utils/constants';

import { getPeriodOptions, defaultDashboardFilters } from 'src/components/dashboard';

import { AUCTION_OUTCOME_STATUS, OVERVIEW_COUNTRY_MATCHERS } from './constants';

// ----------------------------------------------------------------------

const EMPTY_SPLIT: CountrySplit = { EG: 0, SA: 0 };

/** Resolve which overview country a breakdown row belongs to (or `null`). */
export function getRowCountry(row: IHomeKpiCountryRow): OverviewCountry | null {
  const keys = [row.country_code, row.country_id]
    .filter((key) => key !== null && key !== undefined && key !== '')
    .map(String);

  const match = (Object.keys(OVERVIEW_COUNTRY_MATCHERS) as OverviewCountry[]).find((country) =>
    keys.some((key) => OVERVIEW_COUNTRY_MATCHERS[country].includes(key))
  );

  return match ?? null;
}

/** Sum a numeric field of a breakdown per overview country. */
function splitBy<T extends IHomeKpiCountryRow>(
  rows: T[] | undefined,
  pick: (row: T) => number | undefined
): CountrySplit {
  return (rows ?? []).reduce<CountrySplit>(
    (acc, row) => {
      const country = getRowCountry(row);
      if (country) acc[country] += pick(row) ?? 0;
      return acc;
    },
    { ...EMPTY_SPLIT }
  );
}

function sumSplits(...splits: CountrySplit[]): CountrySplit {
  return splits.reduce<CountrySplit>(
    (acc, split) => ({ EG: acc.EG + split.EG, SA: acc.SA + split.SA }),
    { ...EMPTY_SPLIT }
  );
}

function outcomeStatus(outcome: IHomeKpiAuctionOutcome) {
  return outcome.status_id ?? outcome.status;
}

function sumOutcomes(outcomes: IHomeKpiAuctionOutcome[], status?: number) {
  return outcomes
    .filter((outcome) => status === undefined || outcomeStatus(outcome) === status)
    .reduce((acc, outcome) => acc + (outcome.products_count ?? 0), 0);
}

function splitOutcomes(outcomes: IHomeKpiAuctionOutcome[], status?: number) {
  return splitBy(
    outcomes.filter((outcome) => status === undefined || outcomeStatus(outcome) === status),
    (outcome) => outcome.products_count
  );
}

function toUsers(users?: IHomeKpiUsers) {
  return {
    active: users?.active ?? 0,
    registered: users?.registered_in_period ?? 0,
    activeNew: users?.active_new_in_period ?? 0,
  };
}

// ----------------------------------------------------------------------

/**
 * Maps the raw `audit/home/kpis` response to the overview widgets' view model.
 * Definitions match the previous KPI table (e.g. "Auctions done" = sold +
 * ended + pending activation).
 */
export function buildDashboardOverview(kpis: IHomeKpis, lang: string): IDashboardOverview {
  const outcomes = kpis.advanced_auctions?.outcomes ?? [];
  const { SOLD, ENDED, PENDING_ACTIVATION } = AUCTION_OUTCOME_STATUS;

  const sold = sumOutcomes(outcomes, SOLD);
  const ended = sumOutcomes(outcomes, ENDED);
  const pendingActivation = sumOutcomes(outcomes, PENDING_ACTIVATION);

  const productRows = kpis.advanced_products?.country_breakdown;
  const isArabic = lang.startsWith('ar');

  return {
    summary: {
      gmv: {
        total: kpis.advanced_total_money?.total ?? kpis.gmv ?? kpis.total_money ?? 0,
        split: splitBy(kpis.advanced_total_money?.country_breakdown, (row) => row.total_gmv),
      },
      products: {
        total: kpis.advanced_products?.total ?? kpis.total_products ?? 0,
        split: splitBy(productRows, (row) => row.total_count),
      },
      buyers: {
        total: kpis.advanced_buyers?.total ?? kpis.total_buyers ?? 0,
        active: kpis.advanced_buyers?.active ?? kpis.active_buyers ?? 0,
        split: splitBy(kpis.advanced_buyers?.country_breakdown, (row) => row.total_count),
      },
      sellers: {
        total: kpis.advanced_sellers?.total ?? kpis.total_sellers ?? 0,
        active: kpis.advanced_sellers?.active ?? kpis.active_sellers ?? 0,
        split: splitBy(kpis.advanced_sellers?.country_breakdown, (row) => row.total_count),
      },
    },
    productsChart: {
      totalProducts: splitBy(productRows, (row) => row.total_count),
      newProducts: splitBy(productRows, (row) => row.new_count),
      auctionsCreated: splitOutcomes(outcomes),
      auctionsCompleted: sumSplits(
        splitOutcomes(outcomes, SOLD),
        splitOutcomes(outcomes, ENDED),
        splitOutcomes(outcomes, PENDING_ACTIVATION)
      ),
    },
    topCategories: (kpis.top_tags_gmv ?? []).slice(0, 3).map((tag) => ({
      id: tag.tag_id,
      name: (isArabic ? tag.name_ar || tag.name_en : tag.name_en || tag.name_ar) ?? '',
      gmv: tag.gmv,
    })),
    buyers: toUsers(kpis.advanced_buyers),
    sellers: toUsers(kpis.advanced_sellers),
    auctions: { done: sold + ended + pendingActivation, sold, ended, pendingActivation },
  };
}

/** Case-insensitive "does this widget title match the search box" check. */
export function matchesSearch(label: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  return !q || label.toLowerCase().includes(q);
}

/** The overview opens on the current quarter (the design's "Quarter · Q2 2026"). */
export function getOverviewDefaultFilters(): DashboardFilters {
  const [currentQuarter] = getPeriodOptions(DATE_PERIODS.QUARTERLY);

  return {
    ...defaultDashboardFilters,
    period: DATE_PERIODS.QUARTERLY,
    startDate: currentQuarter.startDate,
    endDate: currentQuarter.endDate,
  };
}
