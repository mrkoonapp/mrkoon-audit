import type { UseQueryResult } from '@tanstack/react-query';
import type { DashboardFilters } from 'src/components/dashboard';
import type { IHomeKpis } from 'src/types/dashboard-overview.types';

import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';
import { HOME_KPI_COUNTRY_CODES } from 'src/utils/constants';

import { get } from 'src/lib/axios';
import { buildQueryParams } from 'src/lib/api-helpers';

import { buildQueryParams as buildFilterParams } from './audit';

// ----------------------------------------------------------------------

/** Maps the shared dashboard filters to the params home KPIs endpoints expect. */
export function toHomeKpiParams(filters: DashboardFilters): Record<string, unknown> {
  const params = buildFilterParams(filters);

  if (!params.country_id) return params;

  return {
    ...params,
    country_id: params.country_id,
    country_code: HOME_KPI_COUNTRY_CODES[String(params.country_id)] ?? params.country_id,
  };
}

/**
 * Maps dashboard filters for all-time totals/summary metrics.
 * Intentionally ignores date_from/date_to/period so total numbers
 * aren't re-fetched when switching time frames.
 */
export function toHomeKpiTotalsParams(filters: DashboardFilters): Record<string, unknown> {
  const params: Record<string, unknown> = {};

  if (filters.country) {
    params.country_id = filters.country;
    params.country_code = HOME_KPI_COUNTRY_CODES[String(filters.country)] ?? filters.country;
  }

  return params;
}

async function fetchKpiPart<T>(endpoint: string, params: Record<string, unknown>): Promise<T> {
  const queryParams = buildQueryParams(params);
  const response = await get<{ data: T }>(`${endpoint}${queryParams}`);
  return response.data.data;
}

// ----------------------------------------------------------------------
// Individual KPI Queries
// ----------------------------------------------------------------------

export function useGetHomeKpisTotals(filters: DashboardFilters) {
  const params = toHomeKpiTotalsParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisTotals(params),
    queryFn: () =>
      fetchKpiPart<
        Pick<
          IHomeKpis,
          | 'gmv'
          | 'total_money'
          | 'advanced_total_money'
          | 'total_products'
          | 'advanced_products'
          | 'total_buyers'
          | 'active_buyers'
          | 'advanced_buyers'
          | 'total_sellers'
          | 'active_sellers'
          | 'advanced_sellers'
        >
      >(endpoints.audit.home.kpisParts.totals, params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetHomeKpisGeneral(
  filters: DashboardFilters,
  options?: { enabled?: boolean }
) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisGeneral(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'total_inspections' | 'total_bids' | 'total_bidders' | 'new_clients'>>(
        endpoints.audit.home.kpisParts.general,
        params
      ),
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useGetHomeKpisSellers(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisSellers(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'total_sellers' | 'active_sellers' | 'advanced_sellers'>>(
        endpoints.audit.home.kpisParts.sellers,
        params
      ),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetHomeKpisBuyers(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisBuyers(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'total_buyers' | 'active_buyers' | 'advanced_buyers'>>(
        endpoints.audit.home.kpisParts.buyers,
        params
      ),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetHomeKpisProducts(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisProducts(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'total_products' | 'new_products' | 'advanced_products'>>(
        endpoints.audit.home.kpisParts.products,
        params
      ),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetHomeKpisAuctions(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisAuctions(params),
    queryFn: () =>
      fetchKpiPart<
        Pick<IHomeKpis, 'advanced_auctions' | 'avg_time_to_start_auction' | 'avg_auction_start_time_hours'>
      >(endpoints.audit.home.kpisParts.auctions, params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetHomeKpisTotalMoney(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisTotalMoney(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'gmv' | 'total_money' | 'advanced_total_money'>>(
        endpoints.audit.home.kpisParts.totalMoney,
        params
      ),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetHomeKpisTopTags(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisTopTags(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'top_tags_gmv'>>(
        endpoints.audit.home.kpisParts.topTags,
        params
      ),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetHomeKpisPayRequests(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisPayRequests(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'pay_requests'>>(
        endpoints.audit.home.kpisParts.payRequests,
        params
      ),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetHomeKpisCompaniesWithTransactions(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisCompaniesWithTransactions(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'companies_with_transactions'>>(
        endpoints.audit.home.kpisParts.companiesWithTransactions,
        params
      ),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetHomeKpisBuyersWithTransactions(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisBuyersWithTransactions(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'buyers_with_transactions'>>(
        endpoints.audit.home.kpisParts.buyersWithTransactions,
        params
      ),
    staleTime: 5 * 60 * 1000,
  });
}

// ----------------------------------------------------------------------
// Composite Home KPIs Hook
// ----------------------------------------------------------------------

/**
 * Executes separate queries prefixed with home/kpis concurrently over HTTP
 * and merges their responses into the consolidated IHomeKpis model.
 *
 * Totals for the first section (Total Products, Total Buyers, Total Sellers, GMV)
 * only depend on country and are NOT re-requested when changing time frames.
 *
 * General KPIs (inspections, bids, bidders, new clients) are excluded by default
 * unless explicitly requested via `options.includeGeneral: true` (e.g. for Data Room).
 */
export function useGetHomeKpis(
  filters: DashboardFilters,
  options?: { includeGeneral?: boolean }
) {
  const totalsQuery = useGetHomeKpisTotals(filters);
  const generalQuery = useGetHomeKpisGeneral(filters, { enabled: !!options?.includeGeneral });
  const sellersQuery = useGetHomeKpisSellers(filters);
  const buyersQuery = useGetHomeKpisBuyers(filters);
  const productsQuery = useGetHomeKpisProducts(filters);
  const auctionsQuery = useGetHomeKpisAuctions(filters);
  const totalMoneyQuery = useGetHomeKpisTotalMoney(filters);
  const topTagsQuery = useGetHomeKpisTopTags(filters);
  const payRequestsQuery = useGetHomeKpisPayRequests(filters);
  const companiesWithTxQuery = useGetHomeKpisCompaniesWithTransactions(filters);
  const buyersWithTxQuery = useGetHomeKpisBuyersWithTransactions(filters);

  const queries = useMemo(() => {
    const list: UseQueryResult<any, any>[] = [
      totalsQuery,
      sellersQuery,
      buyersQuery,
      productsQuery,
      auctionsQuery,
      totalMoneyQuery,
      topTagsQuery,
      payRequestsQuery,
      companiesWithTxQuery,
      buyersWithTxQuery,
    ];
    if (options?.includeGeneral) {
      list.unshift(generalQuery);
    }
    return list;
  }, [
    totalsQuery,
    sellersQuery,
    buyersQuery,
    productsQuery,
    auctionsQuery,
    totalMoneyQuery,
    topTagsQuery,
    payRequestsQuery,
    companiesWithTxQuery,
    buyersWithTxQuery,
    options?.includeGeneral,
    generalQuery,
  ]);

  const isLoading = queries.some((q) => q.isLoading);
  const isTotalsLoading = totalsQuery.isLoading;
  const isError = queries.some((q) => q.isError);

  const hasAnyData = queries.some((q) => q.data !== undefined);

  const data = useMemo<IHomeKpis | undefined>(() => {
    if (!hasAnyData) return undefined;
    return {
      ...(totalsQuery.data ?? {}),
      ...(generalQuery.data ?? {}),
      ...(sellersQuery.data ?? {}),
      ...(buyersQuery.data ?? {}),
      ...(productsQuery.data ?? {}),
      ...(auctionsQuery.data ?? {}),
      ...(totalMoneyQuery.data ?? {}),
      ...(topTagsQuery.data ?? {}),
      ...(payRequestsQuery.data ?? {}),
      ...(companiesWithTxQuery.data ?? {}),
      ...(buyersWithTxQuery.data ?? {}),
    };
  }, [
    hasAnyData,
    totalsQuery.data,
    generalQuery.data,
    sellersQuery.data,
    buyersQuery.data,
    productsQuery.data,
    auctionsQuery.data,
    totalMoneyQuery.data,
    topTagsQuery.data,
    payRequestsQuery.data,
    companiesWithTxQuery.data,
    buyersWithTxQuery.data,
  ]);

  const refetch = useCallback(async () => {
    await Promise.all(queries.map((q) => q.refetch()));
  }, [queries]);

  return {
    data,
    isLoading,
    isTotalsLoading,
    isError,
    refetch,
    queries: {
      totals: totalsQuery,
      general: generalQuery,
      sellers: sellersQuery,
      buyers: buyersQuery,
      products: productsQuery,
      auctions: auctionsQuery,
      totalMoney: totalMoneyQuery,
      topTags: topTagsQuery,
      payRequests: payRequestsQuery,
      companiesWithTransactions: companiesWithTxQuery,
      buyersWithTransactions: buyersWithTxQuery,
    },
  };
}
