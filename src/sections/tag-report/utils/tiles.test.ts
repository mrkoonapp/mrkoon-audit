import type { MetricKey, MetricValue, ScorecardRow } from 'src/api/tag-report';

import { it, expect, describe } from 'vitest';

import { sumTile } from './tiles';

// ----------------------------------------------------------------------

function row(id: number, metrics: Partial<Record<MetricKey, MetricValue>>): ScorecardRow {
  return {
    tag: { id, name: { ar: '', en: `Tag ${id}` }, level: 0, isDirect: false },
    metrics: metrics as Record<MetricKey, MetricValue>,
  };
}

describe('sumTile', () => {
  it('adds the current and previous values of all rows and computes the change', () => {
    const rows = [
      row(1, { listingsCreated: { current: 412, previous: 379, changePct: 8.7 } }),
      row(2, { listingsCreated: { current: 100, previous: 121, changePct: -17.4 } }),
    ];

    expect(sumTile(rows, 'listingsCreated')).toEqual({
      current: 512,
      previous: 500,
      changePct: 2.4,
    });
  });

  it('has no percent change when the previous total is zero, so the badge says "new"', () => {
    const rows = [row(1, { gmv: { current: 9000, previous: 0, changePct: null } })];

    expect(sumTile(rows, 'gmv')).toEqual({ current: 9000, previous: 0, changePct: null });
  });

  it('cannot be measured when any row cannot be measured', () => {
    const rows = [
      row(1, { gmv: { current: 9000, previous: 8000, changePct: 12.5 } }),
      row(2, { gmv: { current: null, previous: null, changePct: null } }),
    ];

    expect(sumTile(rows, 'gmv')).toEqual({ current: null, previous: null, changePct: null });
  });

  it('refuses metrics that cannot be summed across tags', () => {
    expect(() => sumTile([], 'activeSellers')).toThrow();
    expect(() => sumTile([], 'sellThroughPct')).toThrow();
  });
});
