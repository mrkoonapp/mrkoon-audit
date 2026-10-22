import type { MetricKey, MetricValue, ScorecardRow } from 'src/api/tag-report';

import { it, expect, describe } from 'vitest';

import { splitInactive } from './rows';

// ----------------------------------------------------------------------

function row(id: number, listings: number, gmv: number | null, revenue: number | null) {
  const v = (current: number | null): MetricValue => ({ current, previous: 0 });
  return {
    tag: { id, name: { ar: '', en: `Tag ${id}` }, level: 0, isDirect: false },
    metrics: {
      listingsCreated: v(listings),
      gmv: v(gmv),
      mrkoonRevenue: v(revenue),
    } as Record<MetricKey, MetricValue>,
  } satisfies ScorecardRow;
}

describe('splitInactive', () => {
  it('moves tags with no listings and no money in the period to the inactive list, in order', () => {
    const rows = [row(1, 10, 500, 20), row(2, 0, 0, 0), row(3, 0, 900, 30), row(4, 0, 0, 0)];

    const { active, inactive } = splitInactive(rows);

    expect(active.map((r) => r.tag.id)).toEqual([1, 3]);
    expect(inactive.map((r) => r.tag.id)).toEqual([2, 4]);
  });

  it('keeps a tag with listings even when its money cannot be measured', () => {
    const { active } = splitInactive([row(1, 3, null, null)]);

    expect(active.map((r) => r.tag.id)).toEqual([1]);
  });
});
