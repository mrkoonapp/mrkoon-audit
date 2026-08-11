import type { DashboardFilters } from 'src/components/dashboard';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { DATE_PERIODS } from 'src/utils/constants';
import { getLocalizedText } from 'src/utils/format-string';

import { buildQueryParams } from 'src/api/audit';
import {
  useGetTagsList,
  useGetTagGroupsList,
  useGetTagsSuccessRate,
  useGetTagAnalyticsReport,
} from 'src/api/tag-analytics';

import {
  countActiveFilters,
  defaultDashboardFilters,
} from 'src/components/dashboard';

// ----------------------------------------------------------------------

export type TagMode = 'tag' | 'tags_group';

// Default filters: all time period selected out of the box
const initialTagAnalyticsFilters: DashboardFilters = {
  ...defaultDashboardFilters,
};

export function useTagAnalytics() {
  // ── Tag selector state — null by default until user selects ────────
  const [tagMode, setTagMode] = useState<TagMode>('tag');
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [selectedTagGroupId, setSelectedTagGroupId] = useState<number | null>(null);

  // ── Search query states for Autocomplete dropdowns ─────────────────
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  // ── Search & filters drawer ──────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } = useCustomFilter<DashboardFilters>(
    initialTagAnalyticsFilters
  );

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  // ── Derive date params from filters ──────────────────────────────────
  const baseParams = useMemo(() => buildQueryParams(filters), [filters]);

  // ── Dropdown options fetched via API ─────────────────────────────────
  const tagsQuery = useGetTagsList(tagSearchQuery);
  const tagGroupsQuery = useGetTagGroupsList(groupSearchQuery);

  const tagsList = useMemo(() => tagsQuery.data ?? [], [tagsQuery.data]);
  const tagGroupsList = useMemo(() => tagGroupsQuery.data ?? [], [tagGroupsQuery.data]);

  // ── Selected option object & name resolution ─────────────────────────
  const selectedTag = useMemo(
    () => tagsList.find((item) => item.id === selectedTagId) ?? null,
    [tagsList, selectedTagId]
  );

  const selectedTagGroup = useMemo(
    () => tagGroupsList.find((g) => g.id === selectedTagGroupId) ?? null,
    [tagGroupsList, selectedTagGroupId]
  );

  const selectedOptionName = useMemo(() => {
    if (tagMode === 'tag' && selectedTag) {
      return typeof selectedTag.name === 'string'
        ? selectedTag.name
        : getLocalizedText(selectedTag.name as any, 'en');
    }
    if (tagMode === 'tags_group' && selectedTagGroup) {
      return typeof selectedTagGroup.name === 'string'
        ? selectedTagGroup.name
        : getLocalizedText(selectedTagGroup.name as any, 'en');
    }
    return null;
  }, [tagMode, selectedTag, selectedTagGroup]);

  // ── Determine whether a valid selection exists ────────────────────────
  const hasSelection = useMemo(() => {
    if (tagMode === 'tag') return selectedTagId !== null;
    return selectedTagGroupId !== null;
  }, [tagMode, selectedTagId, selectedTagGroupId]);

  // ── Fetch report (Actual API call — only enabled when user picks a tag) ──
  const reportFilters = useMemo(
    () => ({
      tag_mode: tagMode,
      tag_id: tagMode === 'tag' ? (selectedTagId ?? undefined) : undefined,
      tags_group_id: tagMode === 'tags_group' ? (selectedTagGroupId ?? undefined) : undefined,
      period: filters.period || DATE_PERIODS.ALL_TIME,
      date_from: baseParams.date_from,
      date_to: baseParams.date_to,
      country_id: baseParams.country_id,
    }),
    [tagMode, selectedTagId, selectedTagGroupId, filters.period, baseParams]
  );

  const reportQuery = useGetTagAnalyticsReport(reportFilters, hasSelection);
  const reportData = reportQuery.data;

  // ── Fetch tags success rate standalone report ──
  const tagsSuccessRateFilters = useMemo(
    () => ({
      tag_mode: tagMode,
      group_by: tagMode,
      tag_id: tagMode === 'tag' ? (selectedTagId ?? undefined) : undefined,
      tags_group_id: tagMode === 'tags_group' ? (selectedTagGroupId ?? undefined) : undefined,
      period: filters.period || DATE_PERIODS.ALL_TIME,
      date_from: baseParams.date_from,
      date_to: baseParams.date_to,
      country_id: baseParams.country_id,
    }),
    [tagMode, selectedTagId, selectedTagGroupId, filters.period, baseParams]
  );

  const tagsSuccessRateQuery = useGetTagsSuccessRate(tagsSuccessRateFilters, true);

  // ── Period breakdown segments from summary ────────────────────────────
  const periodBreakdownSegments = useMemo(() => {
    const rawList = reportData?.summary?.period_breakdown ?? [];
    return rawList.map((item) => ({
      label: item.title_en || item.title || item.period_key,
      count: item.count,
    }));
  }, [reportData]);

  // ── Computed aggregates from summary ─────────────────────────────────
  const totalAuctions = reportData?.summary?.total_auctions ?? 0;
  const highestPrice = reportData?.summary?.highest_price ?? 0;
  const lowestPrice = reportData?.summary?.lowest_price ?? 0;
  const currency = reportData?.auctions?.[0]?.currency ?? 'EGP';

  // ── Text summary of active filter for toolbar display ───────────────
  const activeFilterText = useMemo(() => {
    if (
      filters.period === 'custom' ||
      (!filters.period && (filters.startDate || filters.endDate))
    ) {
      if (filters.startDate && filters.endDate) {
        return `${dayjs(filters.startDate).format('D/M/YYYY')} - ${dayjs(filters.endDate).format('D/M/YYYY')}`;
      }
      if (filters.startDate) return `From ${dayjs(filters.startDate).format('D/M/YYYY')}`;
      if (filters.endDate) return `Until ${dayjs(filters.endDate).format('D/M/YYYY')}`;
    }

    const map: Record<string, string> = {
      weekly: 'Last Week',
      monthly: 'Last Month',
      quarterly: 'Last Quarter',
      yearly: 'Last Year',
    };

    return map[filters.period] ?? (filters.period ? filters.period : 'Last Quarter');
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
    return rows.filter((a) => String(a.auction_code).toLowerCase().includes(q));
  }, [reportData, search]);

  // ── Tags success rate rows — apply search filter ──────────────────────
  const successRateRows = useMemo(() => {
    const rows = tagsSuccessRateQuery.data ?? [];
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((item) => {
      const nameStr =
        typeof item.name === 'string' ? item.name : `${item.name?.en ?? ''} ${item.name?.ar ?? ''}`;
      return nameStr.toLowerCase().includes(q) || String(item.id).includes(q);
    });
  }, [tagsSuccessRateQuery.data, search]);

  return {
    // tag selector
    tagMode,
    setTagMode,
    selectedTagId,
    setSelectedTagId,
    selectedTagGroupId,
    setSelectedTagGroupId,
    tagSearchQuery,
    setTagSearchQuery,
    groupSearchQuery,
    setGroupSearchQuery,
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
    selectedOptionName,
    // aggregates
    totalAuctions,
    highestPrice,
    lowestPrice,
    currency,
    periodLabel,
    granularityLabel,
    // breakdown segments
    periodBreakdownSegments,
    // tables
    auctionRows,
    tagsSuccessRate: successRateRows,
    tagsSuccessRateLoading: tagsSuccessRateQuery.isLoading,
    // dropdown options
    tags: tagsList,
    tagGroups: tagGroupsList,
    tagsLoading: tagsQuery.isLoading,
    tagGroupsLoading: tagGroupsQuery.isLoading,
  };
}
