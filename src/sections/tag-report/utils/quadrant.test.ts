import type { MetricKey, MetricValue, ScorecardRow } from 'src/api/tag-report';

import { it, expect, describe } from 'vitest';

import { classifyQuadrants } from './quadrant';

// ----------------------------------------------------------------------

function tag(id: number, buyersPerActive: number | null, sellThroughPct: number | null) {
  const v = (current: number | null): MetricValue => ({ current, previous: null });
  return {
    tag: { id, name: { ar: '', en: `Tag ${id}` }, level: 0, isDirect: false },
    metrics: {
      buyersPerActive: v(buyersPerActive),
      sellThroughPct: v(sellThroughPct),
    } as Record<MetricKey, MetricValue>,
  } satisfies ScorecardRow;
}

describe('classifyQuadrants', () => {
  const rows = [
    tag(1, 8, 80), // many buyers, sells well
    tag(2, 2, 40), // few buyers, sells badly
    tag(3, 5, 60), // on both medians
    tag(4, 9, 30), // many buyers, sells badly
    tag(5, 1, 90), // few buyers, sells well
    tag(6, null, 70), // cannot be plotted
  ];

  it('draws the medians from the tags that can be plotted', () => {
    expect(classifyQuadrants(rows).medians).toEqual({ buyersPerActive: 5, sellThroughPct: 60 });
  });

  it('says a tag needs sellers when it is above both medians, and buyers when below both', () => {
    const { quadrantOf } = classifyQuadrants(rows);

    expect(quadrantOf(1)).toBe('needsSellers');
    expect(quadrantOf(2)).toBe('needsBuyers');
  });

  it('gives no quadrant to a tag on a median, in a mixed corner, or off the map', () => {
    const { quadrantOf, points } = classifyQuadrants(rows);

    expect(quadrantOf(3)).toBeNull();
    expect(quadrantOf(4)).toBeNull();
    expect(quadrantOf(5)).toBeNull();
    expect(quadrantOf(6)).toBeNull();
    expect(points.map((p) => p.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('takes the mean of the two middle values when the count is even', () => {
    const even = [tag(1, 2, 40), tag(2, 4, 60), tag(3, 6, 70), tag(4, 10, 90)];

    expect(classifyQuadrants(even).medians).toEqual({ buyersPerActive: 5, sellThroughPct: 65 });
  });

  it('has no medians when no tag can be plotted', () => {
    const { medians, quadrantOf } = classifyQuadrants([tag(1, null, null)]);

    expect(medians).toBeNull();
    expect(quadrantOf(1)).toBeNull();
  });
});
