import type { DashboardFilters } from 'src/components/dashboard';

import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';

import { useTranslate } from 'src/locales';
import { getLocalizedText } from 'src/utils/format-string';
import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface HomeKpiResponse {
  gmv: number;
  total_sellers: number;
  active_sellers: number;
  total_inspections: {
    total: number;
    offline: number;
    online: number;
  };
  total_buyers: number;
  active_buyers: number;
  total_products: number;
  total_auctions: number;
  all_clients_count?: number;
  new_clients: {
    id: number;
    name: string;
    image: string | null;
    joined_at: string;
    phone?: string | null;
  }[];
}

export interface TransactionsChartItem {
  period_key: string;
  title_ar: string;
  title_en: string;
  amount: number;
  count: number;
}

export interface TransactionsChartResponse {
  labels: string[];
  amounts: number[];
  counts: number[];
  breakdown?: TransactionsChartItem[];
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

  if (filters.period && filters.period !== 'custom') {
    params.period = filters.period;
  }

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
  const { currentLang } = useTranslate();
  const queryParams = buildQueryParams(filters);

  // 1. Fetch KPIs
  const kpisQuery = useQuery({
    queryKey: queryKeys.audit.home.kpis(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: HomeKpiResponse }>(
        endpoints.audit.home.kpis,
        {
          params: queryParams,
        }
      );
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
            // { id: 'gmv', labelKey: 'gmv', value: kpis.gmv },
            {
              id: 'products',
              labelKey: 'totalProducts',
              value: kpis.total_products,
              auctionsValue: kpis.total_auctions,
            },
            {
              id: 'sellers',
              labelKey: 'totalSellers',
              value: kpis.total_sellers,
              activeValue: kpis.active_sellers,
            },
            {
              id: 'inspections',
              labelKey: 'totalInspections',
              value: kpis.total_inspections.total,
              offlineValue: kpis.total_inspections.offline,
              onlineValue: kpis.total_inspections.online,
            },
            {
              id: 'buyers',
              labelKey: 'totalBuyers',
              value: kpis.total_buyers,
              activeValue: kpis.active_buyers,
            },
          ],
          successRate: {
            successful: successRate.successful_count,
            failed: successRate.failed_count,
            rate: successRate.rate,
          },
          transactions: {
            categories: chart.breakdown
              ? chart.breakdown.map((item) => (currentLang.value === 'ar' ? item.title_ar : item.title_en))
              : chart.labels,
            series: chart.amounts,
            totalAmount: totals.total_money,
            totalCount: totals.total_count,
            currency: 'EGP',
          },
          newClients: {
            total: kpis.all_clients_count ?? kpis.new_clients.length,
            items: kpis.new_clients.map((c) => ({
              id: String(c.id),
              name: c.name,
              category: '', // category not present in home/kpis client object
              avatarUrl: c.image || undefined,
              joinedAt: c.joined_at,
              phone: c.phone || undefined,
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

// ----------------------------------------------------------------------
// Standalone API Functions & Hooks - Auctions Screen
// ----------------------------------------------------------------------

export interface AuctionKpiResponse {
  total_auctions: number;
  successful_auctions: number;
  success_rate: number;
  gmv: number;
  our_percentage: number;
  categories_count: number;
  clients_count: number;
  total_bidders: number;
  avg_bidders_per_auction: number;
  total_bids: number;
  avg_bids_per_auction: number;
}

export interface AuctionCategoryResponse {
  id: number;
  name: string;
  auction_count: number;
}

export interface ParticipatedClientItem {
  id: number;
  name: string;
  image: string | null;
  category: string | null;
  joined_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface AuctionListItemResponse {
  id: number;
  name: string;
  image: string | null;
  category: string | null;
  start_price: number;
  highest_price: number;
  status: 'completed' | 'active' | 'declined';
  bidders_count: number;
  created_at: string;
}

export function useGetAuctionsDashboardData(filters: DashboardFilters, lang: string = 'en') {
  const queryParams = buildQueryParams(filters);

  // 1. KPIs
  const kpisQuery = useQuery({
    queryKey: queryKeys.audit.auctions.kpis(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: AuctionKpiResponse }>(
        endpoints.audit.auctions.kpis,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  // 2. Auctions by Category
  const byCategoryQuery = useQuery({
    queryKey: queryKeys.audit.auctions.byCategory(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: AuctionCategoryResponse[] }>(
        endpoints.audit.auctions.byCategory,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  // 3. Participated Clients (top 5 for home view)
  const participatedClientsQuery = useQuery({
    queryKey: queryKeys.audit.auctions.participatedClients(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: PaginatedResponse<ParticipatedClientItem> }>(
        endpoints.audit.auctions.participatedClients,
        { params: { ...queryParams, per_page: 5 } }
      );
      return response.data.data;
    },
  });

  const isLoading = kpisQuery.isLoading || byCategoryQuery.isLoading || participatedClientsQuery.isLoading;
  const isError = kpisQuery.isError || byCategoryQuery.isError || participatedClientsQuery.isError;

  const kpis = kpisQuery.data;
  const byCategory = byCategoryQuery.data;
  const participatedClients = participatedClientsQuery.data;

  const data = kpis && byCategory && participatedClients
    ? {
        stats: [
          {
            id: 'done',
            labelKey: 'totalAuctionsDone',
            value: kpis.successful_auctions ?? kpis.total_auctions,
            format: 'number' as const,
            direction: 'up' as const,
          },
          {
            id: 'gmv',
            labelKey: 'gmv',
            value: kpis.gmv,
            format: 'currency' as const,
            currency: ' EGP',
            direction: 'up' as const,
          },
          {
            id: 'pct',
            labelKey: 'ourPercentage',
            value: kpis.our_percentage,
            format: 'percent' as const,
            direction: 'up' as const,
          },
          {
            id: 'bids',
            labelKey: 'totalBids',
            value: kpis.total_bids,
            format: 'number' as const,
            direction: 'up' as const,
          },
        ],
        byCategory: {
          percent: kpis.success_rate,
          items: byCategory.map((c) => ({
            name: getLocalizedText(c.name, lang),
            value: c.auction_count,
          })),
        },
        participatedClients: {
          total: participatedClients.total,
          items: participatedClients.data.map((c) => ({
            id: String(c.id),
            name: getLocalizedText(c.name, lang),
            category: getLocalizedText(c.category, lang),
            avatarUrl: c.image || undefined,
            joinedAt: c.joined_at,
            chipLabel: 'Participated',
            chipIcon: 'eva:checkmark-circle-2-fill',
          })),
        },
        summary: {
          successRate: kpis.success_rate,
          totalBidders: kpis.total_bidders,
          averageBidders: kpis.avg_bidders_per_auction,
          auctionsDone: kpis.successful_auctions,
          auctionsTotal: kpis.total_auctions,
        },
      }
    : null;

  return {
    data,
    isLoading,
    isError,
    refetch: () => {
      kpisQuery.refetch();
      byCategoryQuery.refetch();
      participatedClientsQuery.refetch();
    },
  };
}

export function useGetAuctionsList(filters: DashboardFilters, page = 1, perPage = 15, search = '') {
  const queryParams = {
    ...buildQueryParams(filters),
    page,
    per_page: perPage,
    ...(search ? { search } : {}),
  };

  return useQuery({
    queryKey: queryKeys.audit.auctions.list(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: PaginatedResponse<AuctionListItemResponse> }>(
        endpoints.audit.auctions.list,
        { params: queryParams }
      );
      return response.data.data;
    },
  });
}

// ----------------------------------------------------------------------
// Data Room Comparison
// ----------------------------------------------------------------------

export interface DataRoomCompareFilters {
  type: string;
  group_by?: string;
  period?: string;
  country_id?: string | number;
  date_from?: string;
  date_to?: string;
}

export interface DataRoomCompareCountry {
  id: number;
  name: { en: string; ar: string } | string;
  country_code: string;
  val1: number[];
  val2: number[];
}

export interface DataRoomCompareResponse {
  labels: string[];
  label_map: Record<string, { en: string; ar: string } | string>;
  countries: DataRoomCompareCountry[];
}

export function useGetDataRoomCompare(filters: DataRoomCompareFilters) {
  return useQuery({
    queryKey: queryKeys.audit.home.compare(filters),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: DataRoomCompareResponse }>(
        endpoints.audit.home.compare,
        {
          params: filters,
        }
      );
      return response.data.data;
    },
  });
}

// ----------------------------------------------------------------------
// Standalone API Functions & Hooks - Inspections Screen
// ----------------------------------------------------------------------

export interface InspectionKpiResponse {
  total_inspections: number;
  categories_covered_pct: number;
  clients_served: number;
}

export interface InspectionCategoryResponse {
  id: number;
  name: string;
  inspection_count: number;
}

export interface InspectionPaymentMethodResponse {
  id: number;
  name: string;
  icon_key: string;
  count: number;
}

export interface InspectionListItemResponse {
  product_id: number;
  product_name: string;
  product_image: string | null;
  category: string;
  bidders_count: number;
  total_earning: number;
  inspections_count: number;
  date: string;
}

export function useGetInspectionsDashboardData(filters: DashboardFilters, lang: string = 'en') {
  const queryParams = buildQueryParams(filters);

  // 1. KPIs
  const kpisQuery = useQuery({
    queryKey: queryKeys.audit.inspections.kpis(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: InspectionKpiResponse }>(
        endpoints.audit.inspections.kpis,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  // 2. By Category
  const byCategoryQuery = useQuery({
    queryKey: queryKeys.audit.inspections.byCategory(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: InspectionCategoryResponse[] }>(
        endpoints.audit.inspections.byCategory,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  // 3. By Payment Method
  const paymentMethodQuery = useQuery({
    queryKey: queryKeys.audit.inspections.byPaymentMethod(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: InspectionPaymentMethodResponse[] }>(
        endpoints.audit.inspections.byPaymentMethod,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  // 4. Latest Inspections / List
  const listQuery = useQuery({
    queryKey: queryKeys.audit.inspections.list(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: PaginatedResponse<InspectionListItemResponse> }>(
        endpoints.audit.inspections.list,
        { params: { ...queryParams, per_page: 5 } }
      );
      return response.data.data;
    },
  });

  const isLoading =
    kpisQuery.isLoading ||
    byCategoryQuery.isLoading ||
    paymentMethodQuery.isLoading ||
    listQuery.isLoading;

  const isError =
    kpisQuery.isError ||
    byCategoryQuery.isError ||
    paymentMethodQuery.isError ||
    listQuery.isError;

  const kpis = kpisQuery.data;
  const byCategory = byCategoryQuery.data;
  const paymentMethod = paymentMethodQuery.data;
  const list = listQuery.data;

  const data = kpis && byCategory && paymentMethod && list
    ? {
        stats: [
          {
            id: 'inspections',
            labelKey: 'totalInspections',
            value: kpis.total_inspections,
            format: 'number' as const,
            trend: 5.2,
          },
          {
            id: 'categories',
            labelKey: 'categoriesCovered',
            value: kpis.categories_covered_pct,
            format: 'percent' as const,
            trend: 2.1,
          },
          {
            id: 'clients',
            labelKey: 'clientsServed',
            value: kpis.clients_served,
            format: 'number' as const,
            trend: 8.4,
          },
        ],
        byCategory: {
          items: byCategory.map((c) => ({
            name: getLocalizedText(c.name, lang),
            value: c.inspection_count,
          })),
        },
        paymentMethods: {
          items: paymentMethod.map((pm) => ({
            id: String(pm.id),
            name: getLocalizedText(pm.name, lang),
            count: pm.count,
            icon: pm.icon_key || 'eva:credit-card-fill',
            color: 'primary' as const,
          })),
        },
        latestInspections: list.data.map((item) => ({
          id: String(item.product_id),
          product: getLocalizedText(item.product_name, lang),
          imageUrl: item.product_image || undefined,
          description: `${item.bidders_count} bidders`,
          category: getLocalizedText(item.category, lang),
          categoryIcon: 'eva:pricetags-fill',
          successful: item.inspections_count,
          totalEarning: item.total_earning,
          currency: 'EGP',
          trend: 0,
          trendColor: 'success' as const,
        })),
      }
    : null;

  return {
    data,
    isLoading,
    isError,
    refetch: () => {
      kpisQuery.refetch();
      byCategoryQuery.refetch();
      paymentMethodQuery.refetch();
      listQuery.refetch();
    },
  };
}

// ----------------------------------------------------------------------
// Standalone API Functions & Hooks - Sales Screen
// ----------------------------------------------------------------------

export interface SalesKpiResponse {
  calls_count: number;
  products_count: number;
  auctions_count: number;
}

export interface SalesMerchantUpdatesResponse {
  reactivated_count: number;
  paid_insurance_count: number;
  avg_per_auction: number;
}

export interface MerchantItemResponse {
  id: number;
  name: string;
  image: string | null;
  category: string | null;
  joined_at: string;
}

export interface TopMerchantResponse {
  id: number;
  name: string;
  image: string | null;
  category: string | null;
  joined_at: string;
  auction_count: number;
}

export interface TopSuccessMerchantResponse {
  id: number;
  name: string;
  gmv: number;
  auction_count: number;
}

export function useGetSalesDashboardData(filters: DashboardFilters, lang: string = 'en') {
  const queryParams = buildQueryParams(filters);

  // 1. KPIs
  const kpisQuery = useQuery({
    queryKey: queryKeys.audit.sales.kpis(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: SalesKpiResponse }>(
        endpoints.audit.sales.kpis,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  // 2. Merchant Updates
  const updatesQuery = useQuery({
    queryKey: queryKeys.audit.sales.merchantUpdates(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: SalesMerchantUpdatesResponse }>(
        endpoints.audit.sales.merchantUpdates,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  // 3. New Merchants
  const newMerchantsQuery = useQuery({
    queryKey: queryKeys.audit.sales.newMerchants(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: PaginatedResponse<MerchantItemResponse> }>(
        endpoints.audit.sales.newMerchants,
        { params: { ...queryParams, per_page: 8 } }
      );
      return response.data.data;
    },
  });

  // 4. Top Merchants
  const topMerchantsQuery = useQuery({
    queryKey: queryKeys.audit.sales.topMerchants(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: TopMerchantResponse[] }>(
        endpoints.audit.sales.topMerchants,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  // 5. Top Success
  const topSuccessQuery = useQuery({
    queryKey: queryKeys.audit.sales.topSuccess(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: TopSuccessMerchantResponse[] }>(
        endpoints.audit.sales.topSuccess,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  const isLoading =
    kpisQuery.isLoading ||
    updatesQuery.isLoading ||
    newMerchantsQuery.isLoading ||
    topMerchantsQuery.isLoading ||
    topSuccessQuery.isLoading;

  const isError =
    kpisQuery.isError ||
    updatesQuery.isError ||
    newMerchantsQuery.isError ||
    topMerchantsQuery.isError ||
    topSuccessQuery.isError;

  const kpis = kpisQuery.data;
  const updates = updatesQuery.data;
  const newMerchants = newMerchantsQuery.data;
  const topMerchants = topMerchantsQuery.data;
  const topSuccess = topSuccessQuery.data;

  const data = kpis && updates && newMerchants && topMerchants && topSuccess
    ? {
        stats: [
          {
            id: 'calls',
            labelKey: 'salesCalls',
            value: kpis.calls_count,
            unitKey: 'calls',
            icon: 'eva:phone-call-fill',
          },
          {
            id: 'products',
            labelKey: 'productsReceived',
            value: kpis.products_count,
            unitKey: 'products',
            action: true,
          },
          {
            id: 'auctions',
            labelKey: 'salesAuctions',
            value: kpis.auctions_count,
            unitKey: 'auctions',
            action: true,
          },
        ],
        newMerchants: {
          total: newMerchants.total,
          items: newMerchants.data.map((m) => ({
            id: String(m.id),
            name: getLocalizedText(m.name, lang),
            avatarUrl: m.image || undefined,
            joinedAt: m.joined_at,
          })),
        },
        merchantsUpdates: [
          {
            id: 'reactivated',
            labelKey: 'reactivatedMerchants',
            value: updates.reactivated_count,
            color: 'success' as const,
          },
          {
            id: 'paid',
            labelKey: 'paidInsuranceDeposit',
            value: updates.paid_insurance_count,
            color: 'info' as const,
          },
          {
            id: 'average',
            labelKey: 'averagePerAuction',
            value: updates.avg_per_auction,
            color: 'warning' as const,
          },
        ],
        topSuccess: topSuccess.map((s) => ({
          id: String(s.id),
          name: getLocalizedText(s.name, lang),
          value: s.gmv,
          percent: s.auction_count > 0 ? Math.min(100, s.auction_count * 10) : 0,
          color: 'primary' as const,
        })),
        topMerchants: topMerchants.map((m) => ({
          id: String(m.id),
          name: getLocalizedText(m.name, lang),
          avatarUrl: m.image || undefined,
          category: getLocalizedText(m.category, lang),
          joinedAt: m.joined_at,
        })),
      }
    : null;

  return {
    data,
    isLoading,
    isError,
    refetch: () => {
      kpisQuery.refetch();
      updatesQuery.refetch();
      newMerchantsQuery.refetch();
      topMerchantsQuery.refetch();
      topSuccessQuery.refetch();
    },
  };
}

// ----------------------------------------------------------------------
// Standalone API Functions & Hooks - Operations Screen
// ----------------------------------------------------------------------

export interface OperationsKpiResponse {
  transaction_completion_rate: number;
  sla_compliant_count: number;
  sla_total: number;
  sla_compliance_pct: number;
  total_inspections: number;
  avg_inspections_per_auction: number;
}

export function useGetOperationsDashboardData(filters: DashboardFilters) {
  const queryParams = buildQueryParams(filters);

  const kpisQuery = useQuery({
    queryKey: queryKeys.audit.operations.kpis(queryParams),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: OperationsKpiResponse }>(
        endpoints.audit.operations.kpis,
        { params: queryParams }
      );
      return response.data.data;
    },
  });

  const isLoading = kpisQuery.isLoading;
  const isError = kpisQuery.isError;
  const kpis = kpisQuery.data;

  const data = kpis
    ? {
        stats: [
          {
            id: 'tx_rate',
            labelKey: 'completionRate',
            value: kpis.transaction_completion_rate,
            format: 'percent' as const,
            trend: 3.5,
            subtitleKey: 'fromPreviousPeriod',
            icon: 'eva:activity-fill',
            iconColor: 'success' as const,
          },
          {
            id: 'sla_pct',
            labelKey: 'slaCompliance',
            value: kpis.sla_compliance_pct,
            format: 'percent' as const,
            trend: -1.2,
            subtitleKey: 'fromPreviousPeriod',
            icon: 'eva:checkmark-circle-2-fill',
            iconColor: 'info' as const,
          },
          {
            id: 'total_inspections',
            labelKey: 'inspectionsCompleted',
            value: kpis.total_inspections,
            format: 'number' as const,
            trend: 12.0,
            subtitleKey: 'fromPreviousPeriod',
            icon: 'eva:file-text-fill',
            iconColor: 'warning' as const,
          },
          {
            id: 'avg_inspections',
            labelKey: 'avgPerAuction',
            value: kpis.avg_inspections_per_auction,
            format: 'number' as const,
            trend: 0.5,
            subtitleKey: 'fromPreviousPeriod',
            icon: 'eva:pie-chart-fill',
            iconColor: 'primary' as const,
          },
        ],
        slaBreakdown: [
          {
            labelKey: 'inspectionOnTime',
            value: kpis.sla_compliant_count,
            color: 'success.main',
          },
          {
            labelKey: 'delayedInspections',
            value: Math.max(0, kpis.sla_total - kpis.sla_compliant_count),
            color: 'warning.main',
          },
          {
            labelKey: 'failedInspections',
            value: 0,
            color: 'error.main',
          },
        ],
      }
    : null;

  return {
    data,
    isLoading,
    isError,
    refetch: kpisQuery.refetch,
  };
}


