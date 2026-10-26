import type { ScorecardRow } from 'src/api/tag-report';

// ----------------------------------------------------------------------

/**
 * `needsSellers`: buyers are waiting and stock sells, so the tag needs supply.
 * `needsBuyers`: stock is waiting and does not sell, so the tag needs demand.
 */
export type Quadrant = 'needsSellers' | 'needsBuyers';

export type MapPoint = { id: number; row: ScorecardRow; x: number; y: number };

export type QuadrantMap = {
  /** One point per tag with both values; x = buyers per active listing, y = sell-through. */
  points: MapPoint[];
  medians: { buyersPerActive: number; sellThroughPct: number } | null;
  quadrantOf: (tagId: number) => Quadrant | null;
};

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** The investment map: medians and the quadrant of each Top Tag. */
export function classifyQuadrants(rows: ScorecardRow[]): QuadrantMap {
  const points: MapPoint[] = [];
  rows.forEach((row) => {
    const x = row.metrics.buyersPerActive.current;
    const y = row.metrics.sellThroughPct.current;
    if (x !== null && y !== null) points.push({ id: row.tag.id, row, x, y });
  });

  if (!points.length) return { points, medians: null, quadrantOf: () => null };

  const medX = median(points.map((p) => p.x));
  const medY = median(points.map((p) => p.y));

  const quadrants = new Map<number, Quadrant>();
  points.forEach((p) => {
    if (p.x > medX && p.y > medY) quadrants.set(p.id, 'needsSellers');
    else if (p.x < medX && p.y < medY) quadrants.set(p.id, 'needsBuyers');
  });

  return {
    points,
    medians: { buyersPerActive: medX, sellThroughPct: medY },
    quadrantOf: (tagId) => quadrants.get(tagId) ?? null,
  };
}
