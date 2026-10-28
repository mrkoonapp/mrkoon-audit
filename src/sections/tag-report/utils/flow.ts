import type { TagType, MetricKey, ReportPeriod } from 'src/api/tag-report';

import { COUNTRY_IDS } from 'src/utils/constants';

import type { ReportFilters } from '../types';

// ----------------------------------------------------------------------

/** Egypt; the country filter is always set. */
export const DEFAULT_COUNTRY_ID = Number(COUNTRY_IDS.EGYPT);

/** The scorecard's own default sort when a country is set. */
export const DEFAULT_METRIC: MetricKey = 'mrkoonRevenue';

/** Buyer interests live on Top Tags, so these are null for every child tag. */
export const TOP_ONLY_METRICS: MetricKey[] = ['interestedBuyers', 'buyersPerActive'];

export function isMetricDisabled(metric: MetricKey, isChild: boolean): boolean {
  return isChild && TOP_ONLY_METRICS.includes(metric);
}

export type ReportState = {
  filters: ReportFilters;
  /** The Top Tag being drilled into; `null` on the Top Tag view. */
  parentId: number | null;
  /** Always descending; the server sorts. */
  sort: MetricKey;
  trend: {
    /** `null` until the user picks a tag: the view then uses the first row. */
    tagId: number | null;
    /** A child tag has no buyer metrics. */
    isChild: boolean;
    metric: MetricKey;
    bucket: ReportPeriod;
  };
};

export type ReportAction =
  | { type: 'setPeriod'; period: ReportPeriod }
  | { type: 'setCountry'; countryId: number }
  | { type: 'setTagType'; tagType: TagType }
  | { type: 'openTopTag'; tagId: number }
  | { type: 'backToTopTags' }
  | { type: 'selectChild'; tagId: number }
  | { type: 'selectDirect' }
  | { type: 'setSort'; sort: MetricKey }
  | { type: 'setTrendMetric'; metric: MetricKey }
  | { type: 'setBucket'; bucket: ReportPeriod };

export const initialReportState: ReportState = {
  filters: { period: 'monthly', countryId: DEFAULT_COUNTRY_ID, type: 1 },
  parentId: null,
  sort: DEFAULT_METRIC,
  trend: { tagId: null, isChild: false, metric: DEFAULT_METRIC, bucket: 'monthly' },
};

export function reportReducer(state: ReportState, action: ReportAction): ReportState {
  switch (action.type) {
    case 'setPeriod':
      return { ...state, filters: { ...state.filters, period: action.period } };
    case 'setCountry':
      return { ...state, filters: { ...state.filters, countryId: action.countryId } };
    case 'setTagType':
      return {
        ...state,
        filters: { ...state.filters, type: action.tagType },
        parentId: null,
        trend: { ...state.trend, tagId: null, isChild: false },
      };
    case 'openTopTag':
      return {
        ...state,
        parentId: action.tagId,
        trend: { ...state.trend, tagId: action.tagId, isChild: false },
      };
    case 'backToTopTags':
      return {
        ...state,
        parentId: null,
        trend: { ...state.trend, tagId: state.parentId, isChild: false },
      };
    case 'selectChild': {
      const metric = isMetricDisabled(state.trend.metric, true)
        ? DEFAULT_METRIC
        : state.trend.metric;
      return { ...state, trend: { ...state.trend, tagId: action.tagId, isChild: true, metric } };
    }
    case 'selectDirect':
      return { ...state, trend: { ...state.trend, tagId: state.parentId, isChild: false } };
    case 'setSort':
      return { ...state, sort: action.sort };
    case 'setTrendMetric':
      return isMetricDisabled(action.metric, state.trend.isChild)
        ? state
        : { ...state, trend: { ...state.trend, metric: action.metric } };
    case 'setBucket':
      return { ...state, trend: { ...state.trend, bucket: action.bucket } };
    default:
      return state;
  }
}
