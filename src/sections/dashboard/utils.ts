import type { DashboardFilters } from 'src/components/dashboard';
import type {
  IHomeKpis,
  CountrySplit,
  OverviewCountry,
  IHomeKpiCountryRow,
  IDashboardOverview,
  IHomeKpiAuctionOutcome,
} from 'src/types/dashboard-overview.types';

import { COUNTRY_IDS, DATE_PERIODS } from 'src/utils/constants';

import { getPeriodOptions, defaultDashboardFilters } from 'src/components/dashboard';

import { DUMMY_PAY_REQUESTS, DUMMY_TRANSACTION_REQUESTS } from './data';
import { AUCTION_OUTCOME_STATUS, DEFAULT_SAR_TO_EGP_RATE, OVERVIEW_COUNTRY_MATCHERS } from './constants';

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



// ----------------------------------------------------------------------

/**
 * Maps the raw `audit/home/kpis` response to the overview widgets' view model.
 * "Auctions done" = ended (18) + sold (68), "Auctions succeeded" = sold (68).
 * When countryFilter is set, metrics reflect the selected country.
 */
export function buildDashboardOverview(
  kpis: IHomeKpis,
  lang: string,
  countryFilter?: string,
  sarToEgpRate: number = DEFAULT_SAR_TO_EGP_RATE
): IDashboardOverview {
  const targetCountry: OverviewCountry | null =
    countryFilter === COUNTRY_IDS.EGYPT || countryFilter === '6' || countryFilter === '3'
      ? 'EG'
      : countryFilter === COUNTRY_IDS.SAUDI_ARABIA ||
          countryFilter === '24' ||
          countryFilter === '26' ||
          countryFilter === '4'
        ? 'SA'
        : null;

  const productRows = kpis.advanced_products?.country_breakdown;
  const isArabic = lang.startsWith('ar');

  const splitGmv = splitBy(kpis.advanced_total_money?.country_breakdown, (row) => row.total_gmv);
  const splitProducts = splitBy(productRows, (row) => row.total_count);
  const splitNewProducts = splitBy(productRows, (row) => row.new_count);
  const splitBuyers = splitBy(kpis.advanced_buyers?.country_breakdown, (row) => row.total_count);
  const splitSellers = splitBy(kpis.advanced_sellers?.country_breakdown, (row) => row.total_count);
  const splitActiveBuyers = splitBy(kpis.advanced_buyers?.country_breakdown, (row) => row.active_count);
  const splitActiveSellers = splitBy(kpis.advanced_sellers?.country_breakdown, (row) => row.active_count);

  const buyersPeriodBreakdown = kpis.buyers_with_transactions?.country_breakdown;
  const sellersPeriodBreakdown = kpis.companies_with_transactions?.country_breakdown;

  const splitPeriodActiveBuyers = splitBy(buyersPeriodBreakdown, (row) => row.active_count);
  const splitPeriodActiveSellers = splitBy(sellersPeriodBreakdown, (row) => row.active_count);
  const splitRegisteredBuyers = splitBy(
    buyersPeriodBreakdown,
    (row: any) => row.registered_in_period ?? row.new_count
  );
  const splitRegisteredSellers = splitBy(
    sellersPeriodBreakdown,
    (row: any) => row.registered_in_period ?? row.new_count
  );
  const splitActiveNewBuyers = splitBy(
    buyersPeriodBreakdown,
    (row: any) => row.active_new_in_period ?? row.active_new_count
  );
  const splitActiveNewSellers = splitBy(
    sellersPeriodBreakdown,
    (row: any) => row.active_new_in_period ?? row.active_new_count
  );

  const outcomes = kpis.advanced_auctions?.outcomes ?? [];
  const relevantOutcomes = targetCountry
    ? outcomes.filter((o) => getRowCountry(o) === targetCountry)
    : outcomes;

  const { NEW_WAITING_ACTIVATION, ACTIVE, NOT_ACTIVE, ENDED, INSPECTION, SOLD } =
    AUCTION_OUTCOME_STATUS;
  const auctions = {
    active: sumOutcomes(relevantOutcomes, ACTIVE),
    inspection: sumOutcomes(relevantOutcomes, INSPECTION),
    ended: sumOutcomes(relevantOutcomes, ENDED),
    sold: sumOutcomes(relevantOutcomes, SOLD),
    newWaitingActivation: sumOutcomes(relevantOutcomes, NEW_WAITING_ACTIVATION),
    notActive: sumOutcomes(relevantOutcomes, NOT_ACTIVE),
  };

  // With a country selected, the other country's bars are 0.
  const onlyTarget = (split: CountrySplit): CountrySplit =>
    targetCountry
      ? { EG: targetCountry === 'EG' ? split.EG : 0, SA: targetCountry === 'SA' ? split.SA : 0 }
      : split;

  const saGmvInEgp = splitGmv.SA * sarToEgpRate;
  const combinedGmvTotal = splitGmv.EG + saGmvInEgp;

  const gmvTotal =
    targetCountry === 'EG'
      ? (splitGmv.EG > 0 ? splitGmv.EG : (kpis.advanced_total_money?.total ?? kpis.gmv ?? kpis.total_money ?? 0))
      : targetCountry === 'SA'
        ? (splitGmv.SA > 0 ? splitGmv.SA : (kpis.advanced_total_money?.total ?? kpis.gmv ?? kpis.total_money ?? 0))
        : (splitGmv.EG > 0 || splitGmv.SA > 0
            ? combinedGmvTotal
            : (kpis.advanced_total_money?.total ?? kpis.gmv ?? kpis.total_money ?? 0));

  const productsTotal =
    targetCountry && splitProducts[targetCountry] > 0
      ? splitProducts[targetCountry]
      : (kpis.advanced_products?.total ?? kpis.total_products ?? 0);

  const buyersTotal =
    targetCountry && splitBuyers[targetCountry] > 0
      ? splitBuyers[targetCountry]
      : (kpis.advanced_buyers?.total ?? kpis.total_buyers ?? 0);

  const buyersActive =
    targetCountry && splitActiveBuyers[targetCountry] > 0
      ? splitActiveBuyers[targetCountry]
      : (kpis.advanced_buyers?.active ?? kpis.active_buyers ?? 0);

  const sellersTotal =
    targetCountry && splitSellers[targetCountry] > 0
      ? splitSellers[targetCountry]
      : (kpis.advanced_sellers?.total ?? kpis.total_sellers ?? 0);

  const sellersActive =
    targetCountry && splitActiveSellers[targetCountry] > 0
      ? splitActiveSellers[targetCountry]
      : (kpis.advanced_sellers?.active ?? kpis.active_sellers ?? 0);

  const companyRow = targetCountry
    ? kpis.companies_with_transactions?.country_breakdown?.find((r) => getRowCountry(r as any) === targetCountry)
    : null;
  const buyerRow = targetCountry
    ? kpis.buyers_with_transactions?.country_breakdown?.find((r) => getRowCountry(r as any) === targetCountry)
    : null;

  const txSellersTotal = targetCountry
    ? (companyRow?.in_period_count ?? companyRow?.with_transactions_count ?? 0)
    : (kpis.companies_with_transactions?.in_period ??
      kpis.companies_with_transactions?.with_transactions ??
      0);

  const txBuyersTotal = targetCountry
    ? (buyerRow?.in_period_count ?? buyerRow?.with_transactions_count ?? 0)
    : (kpis.buyers_with_transactions?.in_period ??
      kpis.buyers_with_transactions?.with_transactions ??
      0);

  const buyersVm = {
    active: targetCountry
      ? (buyerRow?.active_count ?? splitPeriodActiveBuyers[targetCountry] ?? splitActiveBuyers[targetCountry] ?? 0)
      : (kpis.buyers_with_transactions?.active ??
        kpis.buyers_with_transactions?.total_active ??
        kpis.advanced_buyers?.active ??
        0),
    registered: targetCountry
      ? (buyerRow?.registered_in_period ?? buyerRow?.new_count ?? splitRegisteredBuyers[targetCountry] ?? 0)
      : (kpis.buyers_with_transactions?.registered_in_period ?? 0),
    activeNew: targetCountry
      ? (buyerRow?.active_new_in_period ?? buyerRow?.active_new_count ?? splitActiveNewBuyers[targetCountry] ?? 0)
      : (kpis.buyers_with_transactions?.active_new_in_period ?? 0),
    madeTransactions: txBuyersTotal,
  };

  const sellersVm = {
    active: targetCountry
      ? (companyRow?.active_count ?? splitPeriodActiveSellers[targetCountry] ?? splitActiveSellers[targetCountry] ?? 0)
      : (kpis.companies_with_transactions?.active ??
        kpis.companies_with_transactions?.total_active ??
        kpis.advanced_sellers?.active ??
        0),
    registered: targetCountry
      ? (companyRow?.registered_in_period ?? companyRow?.new_count ?? splitRegisteredSellers[targetCountry] ?? 0)
      : (kpis.companies_with_transactions?.registered_in_period ?? 0),
    activeNew: targetCountry
      ? (companyRow?.active_new_in_period ?? companyRow?.active_new_count ?? splitActiveNewSellers[targetCountry] ?? 0)
      : (kpis.companies_with_transactions?.active_new_in_period ?? 0),
    madeTransactions: txSellersTotal,
  };

  const countryPayRow = targetCountry
    ? kpis.pay_requests?.country_breakdown?.find((r) => getRowCountry(r as any) === targetCountry)
    : null;

  const payCreatedByBuyers =
    countryPayRow?.user_count ?? kpis.pay_requests?.created_by_user ?? DUMMY_PAY_REQUESTS.createdByBuyers;
  const payCreatedByAdmins =
    countryPayRow?.admin_count ?? kpis.pay_requests?.created_by_admin ?? DUMMY_PAY_REQUESTS.createdByAdmins;
  const payTotal =
    countryPayRow?.total_count ??
    kpis.pay_requests?.total ??
    (payCreatedByBuyers + payCreatedByAdmins);

  return {
    summary: {
      gmv: {
        total: gmvTotal,
        split: splitGmv,
      },
      products: {
        total: productsTotal,
        split: splitProducts,
      },
      buyers: {
        total: buyersTotal,
        active: buyersActive,
        split: splitBuyers,
      },
      sellers: {
        total: sellersTotal,
        active: sellersActive,
        split: splitSellers,
      },
    },
    productsChart: {
      totalProducts: onlyTarget(splitProducts),
      products: onlyTarget(splitNewProducts),
      auctionsDone: onlyTarget(
        sumSplits(splitOutcomes(outcomes, ENDED), splitOutcomes(outcomes, SOLD))
      ),
      auctionsSucceeded: onlyTarget(splitOutcomes(outcomes, SOLD)),
    },
    topCategories: (kpis.top_tags_gmv ?? []).slice(0, 3).map((tag) => ({
      id: tag.tag_id,
      name: (isArabic ? tag.name_ar || tag.name_en : tag.name_en || tag.name_ar) ?? '',
      gmv: tag.gmv,
    })),
    buyers: buyersVm,
    sellers: sellersVm,
    auctions: {
      total: Object.values(auctions).reduce((acc, value) => acc + value, 0),
      ...auctions,
    },
    payRequests: {
      createdByBuyers: payCreatedByBuyers,
      createdByAdmins: payCreatedByAdmins,
      total: payTotal,
      userPercentage: countryPayRow?.user_percentage ?? kpis.pay_requests?.user_percentage,
      adminPercentage: countryPayRow?.admin_percentage ?? kpis.pay_requests?.admin_percentage,
    },
    transactions: {
      sellers: {
        total: txSellersTotal,
        series: DUMMY_TRANSACTION_REQUESTS.sellers.series,
      },
      buyers: {
        total: txBuyersTotal,
        series: DUMMY_TRANSACTION_REQUESTS.buyers.series,
      },
    },
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
