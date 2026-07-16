import type { DashboardFilters } from 'src/components/dashboard';

import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface HomeKpiResponse {
  gmv: number;
  total_sellers: number;
  total_inspections: {
    total: number;
    offline: number;
    online: number;
  };
  total_bidders: number;
  all_clients_count: number;
  new_clients: {
    id: number;
    name: string;
    image: string | null;
    joined_at: string;
  }[];
}

export interface TransactionsChartResponse {
  labels: string[];
  amounts: number[];
  counts: number[];
}

export interface TransactionTotalsResponse {
  total_money: number;
  total_count: number;
}

export interface TopSellerResponse {
  id: number;
  name: string;
  image: string | null;
  category: string | null;
  gmv: number;
  auction_count: number;
}

export interface TopCategoryResponse {
  id: number;
  name: string;
  product_count: number;
  bar_percent: number;
}

export interface SuccessRateResponse {
  rate: number;
  successful_count: number;
  failed_count: number;
  total: number;
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

export function buildQueryParams(filters: DashboardFilters) {
  const params: Record<string, any> = {};

  if (filters.startDate) {
    params.date_from = dayjs(filters.startDate).format('YYYY-MM-DD');
  }
  if (filters.endDate) {
    params.date_to = dayjs(filters.endDate).format('YYYY-MM-DD');
  }
  if (filters.country) {
    params.country_id = filters.country;
  }

  return params;
}

// ----------------------------------------------------------------------
// Standalone API Functions & Hooks
// ----------------------------------------------------------------------

export function useGetHomeDashboardData(filters: DashboardFilters) {
  const queryParams = buildQueryParams(filters);

  // 1. Fetch KPIs
  const kpisQuery = useQuery({
    queryKey: queryKeys.audit.home.kpis(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: HomeKpiResponse }>(endpoints.audit.home.kpis, {
        params: queryParams,
      });
      return response.data.data;
    },
  });

  // 2. Fetch Transactions Chart
  const chartQuery = useQuery({
    queryKey: queryKeys.audit.home.transactionsChart(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: TransactionsChartResponse }>(
        endpoints.audit.home.transactionsChart,
        {
          params: queryParams,
        }
      );
      return response.data.data;
    },
  });

  // 3. Fetch Transaction Totals
  const totalsQuery = useQuery({
    queryKey: queryKeys.audit.home.transactionTotals(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: TransactionTotalsResponse }>(
        endpoints.audit.home.transactionTotals,
        {
          params: queryParams,
        }
      );
      return response.data.data;
    },
  });

  // 4. Fetch Top Sellers
  const topSellersQuery = useQuery({
    queryKey: queryKeys.audit.home.topSellers(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: TopSellerResponse[] }>(
        endpoints.audit.home.topSellers,
        {
          params: queryParams,
        }
      );
      return response.data.data;
    },
  });

  // 5. Fetch Top Categories
  const topCategoriesQuery = useQuery({
    queryKey: queryKeys.audit.home.topCategories(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: TopCategoryResponse[] }>(
        endpoints.audit.home.topCategories,
        {
          params: queryParams,
        }
      );
      return response.data.data;
    },
  });

  // 6. Fetch Success Rate
  const successRateQuery = useQuery({
    queryKey: queryKeys.audit.home.successRate(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: SuccessRateResponse }>(
        endpoints.audit.home.successRate,
        {
          params: queryParams,
        }
      );
      return response.data.data;
    },
  });

  const isLoading =
    kpisQuery.isLoading ||
    chartQuery.isLoading ||
    totalsQuery.isLoading ||
    topSellersQuery.isLoading ||
    topCategoriesQuery.isLoading ||
    successRateQuery.isLoading;

  const isError =
    kpisQuery.isError ||
    chartQuery.isError ||
    totalsQuery.isError ||
    topSellersQuery.isError ||
    topCategoriesQuery.isError ||
    successRateQuery.isError;

  const kpis = kpisQuery.data;
  const chart = chartQuery.data;
  const totals = totalsQuery.data;
  const topSellers = topSellersQuery.data;
  const topCategories = topCategoriesQuery.data;
  const successRate = successRateQuery.data;

  // Compile into the shape expected by DashboardView
  const data =
    kpis && chart && totals && topSellers && topCategories && successRate
      ? {
          stats: [
            { id: 'gmv', labelKey: 'gmv', value: kpis.gmv },
            { id: 'sellers', labelKey: 'totalSellers', value: kpis.total_sellers },
            { id: 'inspections', labelKey: 'totalInspections', value: kpis.total_inspections.total },
            { id: 'bidders', labelKey: 'totalBidders', value: kpis.total_bidders },
          ],
          successRate: {
            successful: successRate.successful_count,
            failed: successRate.failed_count,
            rate: successRate.rate,
          },
          transactions: {
            categories: chart.labels,
            series: chart.amounts,
            totalAmount: totals.total_money,
            totalCount: totals.total_count,
            currency: 'EGP',
          },
          newClients: {
            total: kpis.all_clients_count,
            items: kpis.new_clients.map((c) => ({
              id: String(c.id),
              name: c.name,
              category: '', // category not present in home/kpis client object
              avatarUrl: c.image || undefined,
              joinedAt: c.joined_at,
            })),
          },
          topSellers: topSellers.map((s) => ({
            id: String(s.id),
            name: s.name,
            category: s.category || '',
            avatarUrl: s.image || undefined,
            amount: s.gmv,
            currency: 'EGP',
            quantity: s.auction_count,
          })),
          topCategories: topCategories.map((c) => ({
            id: String(c.id),
            name: c.name,
            value: c.product_count,
            percent: c.bar_percent,
          })),
        }
      : null;

  return {
    data,
    isLoading,
    isError,
    refetch: () => {
      kpisQuery.refetch();
      chartQuery.refetch();
      totalsQuery.refetch();
      topSellersQuery.refetch();
      topCategoriesQuery.refetch();
      successRateQuery.refetch();
    },
  };
}
