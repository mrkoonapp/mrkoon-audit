import type { DashboardFilters } from 'src/components/dashboard';
import type { MetricKey, ReportPeriod } from 'src/api/tag-report';

import { useMemo, useState, useReducer } from 'react';

import { useTranslate } from 'src/locales';
import { useGetTagTrend, useGetTagScorecard } from 'src/api/tag-report';

import { classifyQuadrants } from '../utils/quadrant';
import { sumTile, TILE_METRICS } from '../utils/tiles';
import { buildTrendParams, buildScorecardParams } from '../utils/params';
import { reportReducer, initialReportState, DEFAULT_COUNTRY_ID } from '../utils/flow';

// ----------------------------------------------------------------------

export const REPORT_PERIODS: ReportPeriod[] = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

/**
 * The whole screen's state and data. The reducer in `utils/flow` holds the
 * request-flow rules; this hook only connects it to the two endpoints.
 */
export function useTagReport() {
  const { currentLang } = useTranslate();
  const [state, dispatch] = useReducer(reportReducer, initialReportState);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, parentId, sort, trend } = state;

  // The Top Tag rows feed the tiles and the map, also during a drill-down. With
  // no drill-down this is the same query as `scorecard`, so it is fetched once.
  const topParams = useMemo(() => buildScorecardParams(filters, { sort }), [filters, sort]);
  const viewParams = useMemo(
    () => buildScorecardParams(filters, { parentId, sort }),
    [filters, parentId, sort]
  );

  const topScorecard = useGetTagScorecard(topParams);
  const scorecard = useGetTagScorecard(viewParams);

  const topRows = useMemo(() => topScorecard.data?.data ?? [], [topScorecard.data]);

  const rows = useMemo(() => scorecard.data?.data ?? [], [scorecard.data]);
  const parentRow = parentId === null ? null : (topRows.find((r) => r.tag.id === parentId) ?? null);
  const quadrants = useMemo(() => classifyQuadrants(topRows), [topRows]);

  // Until the user picks a tag, the trend follows the first Top Tag.
  const trendTagId = trend.tagId ?? topRows[0]?.tag.id ?? null;
  const trendParams = useMemo(
    () =>
      trendTagId === null
        ? null
        : buildTrendParams(filters, {
            tagId: trendTagId,
            metric: trend.metric,
            bucket: trend.bucket,
          }),
    [filters, trendTagId, trend.metric, trend.bucket]
  );
  const trendQuery = useGetTagTrend(trendParams);

  const tiles = useMemo(
    () =>
      topRows.length
        ? TILE_METRICS.map((key) => ({ key: key as MetricKey, value: sumTile(topRows, key) }))
        : [],
    [topRows]
  );

  // The shared drawer works with `DashboardFilters`; dates are never sent.
  const drawerFilters: DashboardFilters = {
    period: filters.period,
    startDate: null,
    endDate: null,
    country: String(filters.countryId),
  };

  const applyDrawer = (next: DashboardFilters) => {
    if (next.period && next.period !== 'custom')
      dispatch({ type: 'setPeriod', period: next.period });
    if (next.country) dispatch({ type: 'setCountry', countryId: Number(next.country) });
  };

  const resetDrawer = () => {
    dispatch({ type: 'setPeriod', period: initialReportState.filters.period });
    dispatch({ type: 'setCountry', countryId: DEFAULT_COUNTRY_ID });
  };

  const activeFilterCount =
    Number(filters.period !== initialReportState.filters.period) +
    Number(filters.countryId !== DEFAULT_COUNTRY_ID);

  return {
    state,
    dispatch,
    lang: currentLang.value,
    numberLocale: currentLang.numberFormat.code,
    topScorecard,
    scorecard,
    topRows,
    rows,
    parentRow,
    quadrants,
    tiles,
    trendTagId,
    trendQuery,
    filtersOpen,
    setFiltersOpen,
    drawerFilters,
    applyDrawer,
    resetDrawer,
    activeFilterCount,
  };
}
