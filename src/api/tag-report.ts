import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------
// Types — Tag Investment Report (backend issue #3292)
// ----------------------------------------------------------------------

export type MetricKey =
  | 'listingsCreated'
  | 'activeSellers'
  | 'interestedBuyers'
  | 'buyersPerActive'
  | 'biddersPerListing'
  | 'sellThroughPct'
  | 'gmv'
  | 'mrkoonRevenue'
  | 'targetReachedPct';

/** 1 = Scrap, 3 = Stagnant. MrkoonPlus (2) is refused by the backend. */
export type TagType = 1 | 3;

/**
 * On the scorecard: the last complete period (`monthly` = last month).
 * On the trend: the bucket size.
 */
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Localized {
  ar: string;
  en: string;
}

/** `Y-m-d` strings, both ends included. */
export interface DateRange {
  from: string;
  to: string;
}

export interface ReportCountry {
  id: number;
  currency: Localized;
  currencyIcon: string | null;
}

export interface MetricValue {
  current: number | null;
  previous: number | null;
  /** Counts, ratios and money. */
  changePct?: number | null;
  /** `sellThroughPct` and `targetReachedPct`, in percentage points. */
  changePp?: number | null;
}

export interface ScorecardRow {
  /** `level` is the row's place in the report: 0 = Top Tag view, 1 = drill-down. */
  tag: { id: number; name: Localized; level: 0 | 1; isDirect: boolean };
  metrics: Record<MetricKey, MetricValue>;
}

export interface Scorecard {
  data: ScorecardRow[];
  meta: {
    period: DateRange;
    previousPeriod: DateRange;
    country: ReportCountry | null;
    currentPage: number;
    perPage: number;
    total: number;
  };
}

export interface TrendPoint {
  label: string;
  from: string;
  to: string;
  value: number | null;
}

export interface Trend {
  data: TrendPoint[];
  meta: {
    /** `level` here is the tag's real depth in the tree. */
    tag: { id: number; name: Localized; level: 0 | 1 | 2 };
    metric: MetricKey;
    period: ReportPeriod;
    range: DateRange;
    country: ReportCountry | null;
  };
}

/** Query params exactly as the backend reads them (snake_case). */
export interface ScorecardParams {
  period: ReportPeriod;
  country_id: number;
  type: TagType;
  per_page: number;
  parent_id?: number;
  sort?: MetricKey;
}

export interface TrendParams {
  tag_id: number;
  metric: MetricKey;
  period: ReportPeriod;
  country_id: number;
  type: TagType;
}

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

/**
 * The server caches each result for one hour, so keep the data fresh for as
 * long and never refetch on focus. `keepPreviousData` keeps the old rows on
 * screen (dimmed by the view) while a new filter loads.
 */
const STALE_TIME = 60 * 60 * 1000;

export function useGetTagScorecard(params: ScorecardParams) {
  return useQuery({
    queryKey: queryKeys.audit.tags.scorecard(params),
    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get<{ data: Scorecard }>(
        endpoints.audit.tags.scorecard,
        {
          params,
          signal,
        }
      );
      return response.data.data;
    },
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

/** Pass `null` while no tag is chosen yet; the query waits. */
export function useGetTagTrend(params: TrendParams | null) {
  return useQuery({
    queryKey: queryKeys.audit.tags.trend(params),
    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get<{ data: Trend }>(endpoints.audit.tags.trend, {
        params,
        signal,
      });
      return response.data.data;
    },
    enabled: params !== null,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
}
