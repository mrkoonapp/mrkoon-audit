import type { MetricKey, MetricValue } from 'src/api/tag-report';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { MetricTip } from './metric-tip';
import { DeltaChip } from './delta-chip';

// ----------------------------------------------------------------------

type Props = {
  /** `null` while loading. */
  metricKey: MetricKey | null;
  label: string;
  /** Formatted value; `null` while loading. */
  value: string | null;
  currency?: string;
  metric?: MetricValue;
  /** "vs 01 - 31 Aug 2026". */
  caption?: string;
  /** "01 - 31 Aug 2026: 555K EGP". */
  previous?: string;
  locale: string;
};

/**
 * A summary tile in the `StatCard` look. Local because `StatCard` has no
 * "new" or flat state for its trend.
 */
export function ReportTile({
  metricKey,
  label,
  value,
  currency,
  metric,
  caption,
  previous,
  locale,
}: Props) {
  return (
    <Card sx={{ p: 3, height: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>
        {label}
      </Typography>

      {value === null || metricKey === null ? (
        <Skeleton variant="text" sx={{ typography: 'h3', width: 0.6 }} />
      ) : (
        <MetricTip metric={metricKey} previous={previous}>
          <Typography
            variant="h3"
            sx={{ fontVariantNumeric: 'tabular-nums', cursor: 'help', alignSelf: 'flex-start' }}
          >
            <bdi>{value}</bdi>
            {currency && (
              <Typography
                component="span"
                variant="subtitle2"
                sx={{ ml: 0.75, color: 'text.disabled' }}
              >
                {currency}
              </Typography>
            )}
          </Typography>
        </MetricTip>
      )}

      {metric && (
        <Box sx={{ display: 'grid', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <DeltaChip value={metric} locale={locale} />
            {caption && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {caption}
              </Typography>
            )}
          </Box>
          {previous && (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {previous}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
}
