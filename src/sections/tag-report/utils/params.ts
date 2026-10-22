import type { MetricKey, TrendParams, ReportPeriod, ScorecardParams } from 'src/api/tag-report';

import type { ReportFilters } from '../types';

// ----------------------------------------------------------------------

/** One level of the tag tree always fits on one page. */
const PER_PAGE = 100;

export type ScorecardView = {
  /** The Top Tag being drilled into; `null` on the Top Tag view. */
  parentId?: number | null;
  sort?: MetricKey;
};

export function buildScorecardParams(
  filters: ReportFilters,
  view: ScorecardView = {}
): ScorecardParams {
  const params: ScorecardParams = {
    period: filters.period,
    country_id: filters.countryId,
    type: filters.type,
    per_page: PER_PAGE,
  };

  if (view.parentId != null) params.parent_id = view.parentId;
  if (view.sort) params.sort = view.sort;

  return params;
}

export type TrendView = {
  tagId: number;
  metric: MetricKey;
  /** Bucket size. No dates are sent, so the server returns the last 12 complete buckets. */
  bucket: ReportPeriod;
};

export function buildTrendParams(filters: ReportFilters, view: TrendView): TrendParams {
  return {
    tag_id: view.tagId,
    metric: view.metric,
    period: view.bucket,
    country_id: filters.countryId,
    type: filters.type,
  };
}
