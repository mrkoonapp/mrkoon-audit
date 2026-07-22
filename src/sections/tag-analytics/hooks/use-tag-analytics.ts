import type { DashboardFilters } from 'src/components/dashboard';

import dayjs from 'dayjs';
import { useMemo, useState, useEffect } from 'react';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { DATE_PERIODS } from 'src/utils/constants';

import { buildQueryParams } from 'src/api/audit';
import {
  useGetTagsList,
  useGetTagGroupsList,
  useGetTagAnalyticsReport,
} from 'src/api/tag-analytics';
import {
  getPeriodRange,
  countActiveFilters,
  defaultDashboardFilters,
} from 'src/components/dashboard';

import { mockTags, mockTagGroups, mockWoodReportData } from '../data';

// ----------------------------------------------------------------------

export type TagMode = 'tag' | 'tags_group';

// Default filters: quarterly period selected out of the box
const initialTagAnalyticsFilters: DashboardFilters = {
  ...defaultDashboardFilters,
  period: DATE_PERIODS.QUARTERLY,
  ...getPeriodRange(DATE_PERIODS.QUARTERLY),
};

export function useTagAnalytics() {
  // ── Tag selector state ──────────────────────────────────────────────
  const [tagMode, setTagMode] = useState<TagMode>('tag');
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [selectedTagGroupId, setSelectedTagGroupId] = useState<number | null>(null);

  // ── Search & filters drawer ──────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(initialTagAnalyticsFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  // ── Derive date params from filters ──────────────────────────────────
  const baseParams = useMemo(() => buildQueryParams(filters), [filters]);

  // ── Dropdown options fetched via API ─────────────────────────────────
  const tagsQuery = useGetTagsList();
  const tagGroupsQuery = useGetTagGroupsList();

  const tagsList = tagsQuery.data && tagsQuery.data.length > 0 ? tagsQuery.data : mockTags;
  const tagGroupsList = tagGroupsQuery.data && tagGroupsQuery.data.length > 0 ? tagGroupsQuery.data : mockTagGroups;

  // Auto-select first tag or tag group once loaded if none is selected
  useEffect(() => {
    if (tagMode === 'tag' && selectedTagId === null && tagsList.length > 0) {
      setSelectedTagId(tagsList[0].id);
    } else if (tagMode === 'tags_group' && selectedTagGroupId === null && tagGroupsList.length > 0) {
      setSelectedTagGroupId(tagGroupsList[0].id);
    }
  }, [tagMode, selectedTagId, selectedTagGroupId, tagsList, tagGroupsList]);

  // ── Determine whether a valid selection exists ────────────────────────
  const hasSelection = useMemo(() => {
    if (tagMode === 'tag') return selectedTagId !== null;
    return selectedTagGroupId !== null;
  }, [tagMode, selectedTagId, selectedTagGroupId]);

  // ── Fetch report (Actual API call) ───────────────────────────────────
  const reportFilters = useMemo(() => ({
    tag_mode: tagMode,
    tag_id: tagMode === 'tag' ? (selectedTagId ?? undefined) : undefined,
    tags_group_id: tagMode === 'tags_group' ? (selectedTagGroupId ?? undefined) : undefined,
    period: filters.period || 'quarterly',
    date_from: baseParams.date_from,
    date_to: baseParams.date_to,
    country_id: baseParams.country_id,
  }), [tagMode, selectedTagId, selectedTagGroupId, filters.period, baseParams]);

  const reportQuery = useGetTagAnalyticsReport(reportFilters, hasSelection);
  const reportData = reportQuery.data || mockWoodReportData;

  // ── Period breakdown segments from summary ────────────────────────────
  const periodBreakdownSegments = useMemo(() => {
    const rawList = reportData?.summary?.period_breakdown ?? [];
    return rawList.map((item) => ({
      label: item.title_en || item.title || item.period_key,
      count: item.count,
    }));
  }, [reportData]);

  // ── Computed aggregates from summary ─────────────────────────────────
  const totalAuctions = useMemo(() => {
    const rawTotal = reportData?.summary?.total_auctions ?? 0;
    const breakdownSum = periodBreakdownSegments.reduce((sum, item) => sum + item.count, 0);
    return Math.max(rawTotal, breakdownSum);
  }, [reportData, periodBreakdownSegments]);

  const highestPrice = reportData?.summary?.highest_price ?? 0;
  const lowestPrice = reportData?.summary?.lowest_price ?? 0;
  const currency = reportData?.auctions?.[0]?.currency ?? 'EGP';

  // ── Text summary of active filter for toolbar display ───────────────
  const activeFilterText = useMemo(() => {
    if (filters.period === 'custom' || (!filters.period && (filters.startDate || filters.endDate))) {
      if (filters.startDate && filters.endDate) {
        return `${dayjs(filters.startDate).format('D/M/YYYY')} - ${dayjs(filters.endDate).format('D/M/YYYY')}`;
      }
      if (filters.startDate) return `From ${dayjs(filters.startDate).format('D/M/YYYY')}`;
      if (filters.endDate) return `Until ${dayjs(filters.endDate).format('D/M/YYYY')}`;
    }

    const map: Record<string, string> = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly',
    };

    return map[filters.period] ?? (filters.period ? filters.period : 'Quarterly');
  }, [filters]);

  // ── Period label for display ─────────────────────────────────────────
  const periodLabel = useMemo(() => {
    if (filters.startDate && filters.endDate) {
      return `${dayjs(filters.startDate).format('DD MMM YYYY')} – ${dayjs(filters.endDate).format('DD MMM YYYY')}`;
    }
    const map: Record<string, string> = {
      weekly: 'Last 7 Days',
      monthly: 'Last Month',
      quarterly: 'Last 3 Months',
      yearly: 'Last Year',
    };
    return map[filters.period] ?? 'Last 3 Months';
  }, [filters]);

  // Granularity label (Week / Month / Year)
  const granularityLabel = useMemo(() => {
    if (!baseParams.date_from || !baseParams.date_to) return 'Month';
    const diffDays = dayjs(baseParams.date_to).diff(dayjs(baseParams.date_from), 'day');
    if (diffDays <= 14) return 'Week';
    if (diffDays <= 365) return 'Month';
    return 'Year';
  }, [baseParams.date_from, baseParams.date_to]);

  // ── Auctions table rows — apply search filter ─────────────────────────
  const auctionRows = useMemo(() => {
    const rows = reportData?.auctions ?? [];
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (a) => String(a.auction_code).toLowerCase().includes(q)
    );
  }, [reportData, search]);

  return {
    // tag selector
    tagMode,
    setTagMode,
    selectedTagId,
    setSelectedTagId,
    selectedTagGroupId,
    setSelectedTagGroupId,
    // filter drawer
    filters,
    filtersOpen,
    setFiltersOpen,
    setFiltersHandler,
    clearFilters,
    activeFilterCount,
    activeFilterText,
    // search
    search,
    setSearch,
    // data states
    isLoading: reportQuery.isLoading,
    hasSelection,
    // aggregates
    totalAuctions,
    highestPrice,
    lowestPrice,
    currency,
    periodLabel,
    granularityLabel,
    // breakdown segments
    periodBreakdownSegments,
    // table
    auctionRows,
    // dropdown options
    tags: tagsList,
    tagGroups: tagGroupsList,
    tagsLoading: tagsQuery.isLoading,
    tagGroupsLoading: tagGroupsQuery.isLoading,
  };
}
