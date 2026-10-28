import type { MetricKey, ReportPeriod } from 'src/api/tag-report';

import { useMemo, useEffect, useReducer } from 'react';

import { useTranslate } from 'src/locales';
import { useGetCountries } from 'src/api/countries';
import { useGetTagTrend, useGetTagScorecard } from 'src/api/tag-report';

import { classifyQuadrants } from '../utils/quadrant';
import { sumTile, TILE_METRICS } from '../utils/tiles';
import { reportReducer, initialReportState } from '../utils/flow';
import { buildTrendParams, buildScorecardParams } from '../utils/params';

// ----------------------------------------------------------------------

export const REPORT_PERIODS: ReportPeriod[] = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

/**
 * The whole screen's state and data. The reducer in `utils/flow` holds the
 * request-flow rules; this hook only connects it to the two endpoints.
 */
export function useTagReport() {
  const { currentLang } = useTranslate();
  const [state, dispatch] = useReducer(reportReducer, initialReportState);

  const { filters, parentId, sort, trend } = state;
  const { data: countries } = useGetCountries();

  // Ensure current countryId matches an existing country from the backend once loaded
  useEffect(() => {
    if (countries && countries.length > 0) {
      const match = countries.find((c) => c.id === filters.countryId);
      if (!match) {
        const egypt = countries.find((c) => c.country_code === '+2' || c.global_code === 'EG');
        const nextId = egypt ? egypt.id : countries[0].id;
        dispatch({ type: 'setCountry', countryId: nextId });
      }
    }
  }, [countries, filters.countryId]);

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
  };
}
