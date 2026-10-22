import type { MetricKey, MetricValue, ScorecardRow } from 'src/api/tag-report';

// ----------------------------------------------------------------------

/**
 * The only metrics whose rows add up to a platform total: each listing and
 * each deal counts under one Top Tag. Sellers and buyers can sit under several
 * Top Tags, and rates cannot be added.
 */
export const TILE_METRICS = ['listingsCreated', 'gmv', 'mrkoonRevenue'] as const;

function sum(values: (number | null)[]): number | null {
  return values.some((v) => v === null)
    ? null
    : values.reduce<number>((total, v) => total + (v as number), 0);
}

/** A summary tile: the total of the Top Tag rows for one summable metric. */
export function sumTile(rows: ScorecardRow[], key: MetricKey): MetricValue {
  if (!(TILE_METRICS as readonly MetricKey[]).includes(key)) {
    throw new Error(`${key} cannot be summed across tags`);
  }

  const current = sum(rows.map((r) => r.metrics[key].current));
  const previous = sum(rows.map((r) => r.metrics[key].previous));

  const changePct =
    current === null || previous === null || previous === 0
      ? null
      : Math.round(((current - previous) / previous) * 1000) / 10;

  return { current, previous, changePct };
}
