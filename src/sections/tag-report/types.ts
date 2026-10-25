import type { TagType, ReportPeriod } from 'src/api/tag-report';

// ----------------------------------------------------------------------

/** The page filters. They drive both the scorecard and the trend. */
export interface ReportFilters {
  period: ReportPeriod;
  countryId: number;
  type: TagType;
}
