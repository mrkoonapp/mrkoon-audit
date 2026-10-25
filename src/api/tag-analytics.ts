import { useQuery } from '@tanstack/react-query';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';
import { DATE_PERIODS } from 'src/utils/constants';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface TagOption {
  id: number;
  name: string | { en: string; ar: string };
  name_ar?: string;
  name_en?: string;
}

export interface TagGroupOption {
  id: number;
  name: string | { en: string; ar: string };
  name_ar?: string;
  name_en?: string;
}

export interface TagAnalyticsPeriodBreakdownItem {
  period_key: string;
  title: string;
  title_ar: string;
  title_en: string;
  count: number;
}

export interface TagAnalyticsSummary {
  total_auctions: number;
  highest_price: number;
  lowest_price: number;
  period_breakdown: TagAnalyticsPeriodBreakdownItem[];
}

export interface TagAnalyticsAuction {
  auction_code: string | number;
  auction_date: string; // 'YYYY-MM-DD'
  start_price: number;
  highest_price: number;
  currency?: string;
}

export interface TagSuccessRateItem {
  id: number;
  name: string | { en: string; ar: string };
  period_key?: string;
  date_label?: string;
  title_ar?: string;
  title_en?: string;
  total_products: number;
  successful_auctions: number;
  failed_auctions: number;
  success_rate: number;
}

export interface TagAnalyticsReportResponse {
  summary: TagAnalyticsSummary;
  auctions: TagAnalyticsAuction[];
}

// ----------------------------------------------------------------------
// Request filters
// ----------------------------------------------------------------------

export interface TagAnalyticsFilters {
  tag_mode: 'tag' | 'tags_group';
  group_by?: 'tag' | 'tags_group' | string;
  tag_id?: number | string;
  tags_group_id?: number | string;
  period?: string;
  date_from?: string;
  date_to?: string;
  country_id?: string | number;
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

export function buildTagAnalyticsParams(filters: TagAnalyticsFilters) {
  const params: Record<string, any> = {};

  if (filters.tag_id) {
    params.tag_id = filters.tag_id;
  }
  if (filters.tags_group_id) {
    params.tags_group_id = filters.tags_group_id;
  }

  if (filters.group_by) {
    params.group_by = filters.group_by;
  } else if (filters.tag_mode) {
    params.group_by = filters.tag_mode;
  }

  if (filters.period === DATE_PERIODS.ALL_TIME) {
    params.period = 'custom';
  } else if (filters.period && filters.period !== 'custom') {
    params.period = filters.period;
  }
  if (filters.date_from) params.date_from = filters.date_from;
  if (filters.date_to) params.date_to = filters.date_to;
  if (filters.country_id) params.country_id = filters.country_id;

  return params;
}

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

/**
 * Fetches all available product tags for dropdown selection.
 * Maps to GET /apiAdmin/audit/tags
 */
export function useGetTagsList(search?: string) {
  const params: Record<string, any> = { limit: 1000, per_page: 1000 };
  if (search?.trim()) {
    params.search_text = search.trim();
    params.search = search.trim();
  }

  return useQuery({
    queryKey: queryKeys.audit.tags({ search }),
    queryFn: async () => {
      const response = await axiosInstance.get<any>(endpoints.audit.tags, { params });
      const resData = response.data?.data;
      if (Array.isArray(resData)) return resData as TagOption[];
      if (Array.isArray(resData?.data)) return resData.data as TagOption[];
      return [];
    },
  });
}

/**
 * Fetches all available tag groups for tag group selection.
 * Maps to GET /apiAdmin/audit/tag-groups
 */
export function useGetTagGroupsList(search?: string) {
  const params: Record<string, any> = { limit: 1000, per_page: 1000 };
  if (search?.trim()) {
    params.search_text = search.trim();
    params.search = search.trim();
  }

  return useQuery({
    queryKey: queryKeys.audit.tagGroups({ search }),
    queryFn: async () => {
      const response = await axiosInstance.get<any>(endpoints.audit.tagGroups, { params });
      const resData = response.data?.data;
      if (Array.isArray(resData)) return resData as TagGroupOption[];
      if (Array.isArray(resData?.data)) return resData.data as TagGroupOption[];
      return [];
    },
  });
}

/**
 * Fetches the tag analytics report.
 * Maps to:
 *   GET /apiAdmin/audit/auctions/report-by-tag?tag_id=3&period=monthly
 *   GET /apiAdmin/audit/auctions/report-by-tag?tags_group_id=1&period=monthly&country_id=2
 */
export function useGetTagAnalyticsReport(filters: TagAnalyticsFilters, enabled: boolean = true) {
  const params = buildTagAnalyticsParams(filters);

  return useQuery({
    queryKey: queryKeys.audit.auctions.reportByTag(params),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: TagAnalyticsReportResponse }>(
        endpoints.audit.auctions.reportByTag,
        { params }
      );
      return response.data.data;
    },
    enabled,
  });
}

/**
 * Fetches tags success rate report.
 * Maps to GET /apiAdmin/audit/auctions/tags-success-rate
 */
export function useGetTagsSuccessRate(filters: TagAnalyticsFilters, enabled: boolean = true) {
  const params = buildTagAnalyticsParams(filters);

  return useQuery({
    queryKey: queryKeys.audit.auctions.tagsSuccessRate(params),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: TagSuccessRateItem[] }>(
        endpoints.audit.auctions.tagsSuccessRate,
        { params }
      );
      const resData = response.data?.data;
      if (Array.isArray(resData)) return resData;
      return [];
    },
    enabled,
  });
}
