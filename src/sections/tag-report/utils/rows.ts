import type { ScorecardRow } from 'src/api/tag-report';

// ----------------------------------------------------------------------

const isActive = (row: ScorecardRow) =>
  (row.metrics.listingsCreated.current ?? 0) > 0 ||
  (row.metrics.gmv.current ?? 0) > 0 ||
  (row.metrics.mrkoonRevenue.current ?? 0) > 0;

/** Tags with no listings and no money in the period are hidden by default. */
export function splitInactive(rows: ScorecardRow[]) {
  return { active: rows.filter(isActive), inactive: rows.filter((row) => !isActive(row)) };
}
