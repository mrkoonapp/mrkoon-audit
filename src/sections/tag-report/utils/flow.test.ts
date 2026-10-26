import { it, expect, describe } from 'vitest';

import { reportReducer, isMetricDisabled, initialReportState } from './flow';

// ----------------------------------------------------------------------

const drilled = reportReducer(initialReportState, { type: 'openTopTag', tagId: 12 });

describe('reportReducer', () => {
  it('drops the drill-down when the tag type changes, because the old parent is of the other type', () => {
    const next = reportReducer(drilled, { type: 'setTagType', tagType: 3 });

    expect(next.filters.type).toBe(3);
    expect(next.parentId).toBeNull();
  });

  it('keeps the drill-down when the country or the period changes', () => {
    const byCountry = reportReducer(drilled, { type: 'setCountry', countryId: 26 });
    const byPeriod = reportReducer(drilled, { type: 'setPeriod', period: 'quarterly' });

    expect(byCountry.filters.countryId).toBe(26);
    expect(byCountry.parentId).toBe(12);
    expect(byPeriod.filters.period).toBe('quarterly');
    expect(byPeriod.parentId).toBe(12);
  });

  it('follows the first row until the user picks a tag', () => {
    expect(initialReportState.trend.tagId).toBeNull();
  });

  it('shows the trend of the Top Tag the user opens, then of the child the user clicks', () => {
    expect(drilled.trend).toMatchObject({ tagId: 12, isChild: false });

    const child = reportReducer(drilled, { type: 'selectChild', tagId: 31 });
    expect(child.trend).toMatchObject({ tagId: 31, isChild: true });
  });

  it('shows the Top Tag trend for the "(direct)" row, because the trend covers a whole subtree', () => {
    const child = reportReducer(drilled, { type: 'selectChild', tagId: 31 });
    const direct = reportReducer(child, { type: 'selectDirect' });

    expect(direct.trend).toMatchObject({ tagId: 12, isChild: false });
  });

  it('goes back to the first row when the tag type changes', () => {
    const next = reportReducer(drilled, { type: 'setTagType', tagType: 3 });

    expect(next.trend.tagId).toBeNull();
  });

  it('shows the Top Tag that was open when the user goes back to the Top Tag view', () => {
    const child = reportReducer(drilled, { type: 'selectChild', tagId: 31 });
    const back = reportReducer(child, { type: 'backToTopTags' });

    expect(back.parentId).toBeNull();
    expect(back.trend).toMatchObject({ tagId: 12, isChild: false });
  });

  it('disables the buyer metrics for a child tag, where every point is null', () => {
    expect(isMetricDisabled('interestedBuyers', true)).toBe(true);
    expect(isMetricDisabled('buyersPerActive', true)).toBe(true);
    expect(isMetricDisabled('mrkoonRevenue', true)).toBe(false);
    expect(isMetricDisabled('interestedBuyers', false)).toBe(false);
  });

  it('switches a buyer metric to the default when the user clicks a child tag', () => {
    const buyers = reportReducer(drilled, { type: 'setTrendMetric', metric: 'interestedBuyers' });
    const child = reportReducer(buyers, { type: 'selectChild', tagId: 31 });

    expect(buyers.trend.metric).toBe('interestedBuyers');
    expect(child.trend.metric).toBe('mrkoonRevenue');
  });

  it('ignores a buyer metric picked while a child tag is shown', () => {
    const child = reportReducer(drilled, { type: 'selectChild', tagId: 31 });
    const next = reportReducer(child, { type: 'setTrendMetric', metric: 'buyersPerActive' });

    expect(next.trend.metric).toBe('mrkoonRevenue');
  });

  it('sets the sort and the trend bucket', () => {
    const sorted = reportReducer(drilled, { type: 'setSort', sort: 'sellThroughPct' });
    const weekly = reportReducer(sorted, { type: 'setBucket', bucket: 'weekly' });

    expect(weekly.sort).toBe('sellThroughPct');
    expect(weekly.trend.bucket).toBe('weekly');
  });
});
