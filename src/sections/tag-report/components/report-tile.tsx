import type { MetricValue } from 'src/api/tag-report';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { DeltaChip } from './delta-chip';

// ----------------------------------------------------------------------

type Props = {
  label: string;
  /** Formatted value; `null` while loading. */
  value: string | null;
  currency?: string;
  metric?: MetricValue;
  /** "vs 01 - 31 Aug 2026". */
  caption?: string;
  locale: string;
};

/**
 * A summary tile in the `StatCard` look. Local because `StatCard` has no
 * "new" or flat state for its trend.
 */
export function ReportTile({ label, value, currency, metric, caption, locale }: Props) {
  return (
    <Card sx={{ p: 3, height: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>
        {label}
      </Typography>

      {value === null ? (
        <Skeleton variant="text" sx={{ typography: 'h3', width: 0.6 }} />
      ) : (
        <Typography variant="h3" sx={{ fontVariantNumeric: 'tabular-nums' }}>
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
      )}

      {metric && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <DeltaChip value={metric} locale={locale} />
          {caption && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {caption}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
}
