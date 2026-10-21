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

async function fetchKpiPart<T>(endpoint: string, params: Record<string, unknown>): Promise<T> {
  const queryParams = buildQueryParams(params);
  const response = await get<{ data: T }>(`${endpoint}${queryParams}`);
  return response.data.data;
}

// ----------------------------------------------------------------------
// Individual KPI Queries
// ----------------------------------------------------------------------

export function useGetHomeKpisGeneral(filters: DashboardFilters) {
  const params = toHomeKpiParams(filters);
  return useQuery({
    queryKey: queryKeys.audit.home.kpisGeneral(params),
    queryFn: () =>
      fetchKpiPart<Pick<IHomeKpis, 'total_inspections' | 'total_bids' | 'total_bidders' | 'new_clients'>>(
        endpoints.audit.home.kpisParts.general,
        params
      ),
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
  });
}

// ----------------------------------------------------------------------
// Composite Home KPIs Hook
// ----------------------------------------------------------------------

/**
 * Executes separate queries prefixed with home/kpis concurrently over HTTP
 * and merges their responses into the consolidated IHomeKpis model.
 */
export function useGetHomeKpis(filters: DashboardFilters) {
  const generalQuery = useGetHomeKpisGeneral(filters);
  const sellersQuery = useGetHomeKpisSellers(filters);
  const buyersQuery = useGetHomeKpisBuyers(filters);
  const productsQuery = useGetHomeKpisProducts(filters);
  const auctionsQuery = useGetHomeKpisAuctions(filters);
  const totalMoneyQuery = useGetHomeKpisTotalMoney(filters);
  const topTagsQuery = useGetHomeKpisTopTags(filters);
  const payRequestsQuery = useGetHomeKpisPayRequests(filters);
  const companiesWithTxQuery = useGetHomeKpisCompaniesWithTransactions(filters);
  const buyersWithTxQuery = useGetHomeKpisBuyersWithTransactions(filters);

  const queries = useMemo(
    () => [
      generalQuery,
      sellersQuery,
      buyersQuery,
      productsQuery,
      auctionsQuery,
      totalMoneyQuery,
      topTagsQuery,
      payRequestsQuery,
      companiesWithTxQuery,
      buyersWithTxQuery,
    ],
    [
      generalQuery,
      sellersQuery,
      buyersQuery,
      productsQuery,
      auctionsQuery,
      totalMoneyQuery,
      topTagsQuery,
      payRequestsQuery,
      companiesWithTxQuery,
      buyersWithTxQuery,
    ]
  );

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const hasAnyData = queries.some((q) => q.data !== undefined);

  const data = useMemo<IHomeKpis | undefined>(() => {
    if (!hasAnyData) return undefined;
    return {
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
    isError,
    refetch,
    queries: {
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
