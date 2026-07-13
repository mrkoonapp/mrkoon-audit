import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import type { StatCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Compact KPI card: a label, a large value and an optional signed trend
 * ("+12% last 7 days"). The trend sign drives the arrow direction and color.
 * All copy is passed in — the widget renders no translated strings itself.
 */
export function StatCard({ label, value, trend, icon, sx }: StatCardProps) {
  const isPositive = (trend?.value ?? 0) >= 0;
  const trendColor = isPositive ? 'success.main' : 'error.main';

  return (
    <Card
      sx={[
        { p: 3, height: 1, display: 'flex', flexDirection: 'column', gap: 1.5 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>

        {icon && <Box sx={{ color: 'text.disabled', display: 'inline-flex' }}>{icon}</Box>}
      </Box>

      <Typography variant="h3">{value}</Typography>

      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
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
              width={16}
              icon={isPositive ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ color: trendColor }}>
            {isPositive ? '+' : ''}
            {fPercent(trend.value)}
          </Typography>

          {trend.caption && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {trend.caption}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
}
