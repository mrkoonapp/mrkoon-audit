import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import type { StatCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Compact KPI card. The optional `trend` renders in one of two ways:
 * - **Full** (`trend.value` set): an arrow + signed "%" + optional caption
 *   below the value ("+12% last 7 days").
 * - **Compact** (`trend.direction` only): a colored directional arrow badge in
 *   the header row, no text.
 * All copy is passed in — the widget renders no translated strings itself.
 */
export function StatCard({ label, value, trend, icon, onClick, sx }: StatCardProps) {
  const hasValue = trend?.value !== undefined;
  const isPositive = hasValue ? (trend?.value ?? 0) >= 0 : trend?.direction !== 'down';
  const trendColor = isPositive ? 'success.main' : 'error.main';

  const renderArrowBadge = (compact: boolean) => (
    <Box
      sx={{
        width: compact ? 32 : 24,
        height: compact ? 32 : 24,
        display: 'flex',
        borderRadius: '50%',
        alignItems: 'center',
        color: trendColor,
        justifyContent: 'center',
        bgcolor: (theme) =>
          varAlpha(
            isPositive
              ? theme.vars.palette.success.mainChannel
              : theme.vars.palette.error.mainChannel,
            0.16
          ),
      }}
    >
      <Iconify
        width={compact ? 18 : 16}
        icon={
          compact
            ? isPositive
              ? 'eva:diagonal-arrow-right-up-fill'
              : 'eva:diagonal-arrow-right-down-fill'
            : isPositive
              ? 'eva:trending-up-fill'
              : 'eva:trending-down-fill'
        }
      />
    </Box>
  );

  const isCompactTrend = !!trend && !hasValue;

  return (
    <Card
      onClick={onClick}
      sx={[
        { p: 3, height: 1, display: 'flex', flexDirection: 'column', gap: 1.5 },
        !!onClick && {
          cursor: 'pointer',
          transition: (theme) => theme.transitions.create(['box-shadow', 'transform']),
          '&:hover': {
            boxShadow: (theme) => theme.vars.customShadows.z16,
            transform: 'translateY(-2px)',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>
            {label}
          </Typography>

          <Typography variant="h3" sx={{ mt: 1 }}>
            {value}
          </Typography>
        </Box>

        {isCompactTrend
          ? renderArrowBadge(true)
          : icon && <Box sx={{ color: 'text.disabled', display: 'inline-flex' }}>{icon}</Box>}
      </Box>

      {hasValue && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {renderArrowBadge(false)}

          <Typography variant="subtitle2" sx={{ color: trendColor }}>
            {isPositive ? '+' : ''}
            {fPercent(trend?.value)}
          </Typography>

          {trend?.caption && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {trend.caption}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
}
