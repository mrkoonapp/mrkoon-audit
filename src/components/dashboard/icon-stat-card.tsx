import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import type { IconStatCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Richer KPI card: a label, a big value with an optional inline trend chip
 * (arrow + signed "%"), a muted subtitle, and a tinted circular icon badge in
 * the top-right corner. Used by the Operations page KPIs. All copy is passed in.
 */
export function IconStatCard({
  label,
  value,
  trend,
  subtitle,
  icon,
  iconColor = 'primary',
  onClick,
  sx,
}: IconStatCardProps) {
  const hasTrend = trend !== undefined;
  const isPositive = (trend ?? 0) >= 0;
  const trendColor = isPositive ? 'success.main' : 'error.main';

  return (
    <Card
      onClick={onClick}
      sx={[
        { p: 3, height: 1, display: 'flex', alignItems: 'flex-start', gap: 2 },
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
      <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>
          {label}
        </Typography>

        <Box sx={{ mt: 1, display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="h3">{value}</Typography>

          {hasTrend && (
            <Box
              sx={{
                gap: 0.25,
                display: 'inline-flex',
                alignItems: 'center',
                color: trendColor,
                typography: 'caption',
                fontWeight: 'fontWeightSemiBold',
              }}
            >
              <Iconify
                width={14}
                icon={isPositive ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
              />
              {isPositive ? '+' : ''}
              {fPercent(trend)}
            </Box>
          )}
        </Box>

        {subtitle && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.disabled' }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {icon && (
        <Avatar
          sx={{
            width: 40,
            height: 40,
            color: `${iconColor}.main`,
            bgcolor: (theme) => varAlpha(theme.vars.palette[iconColor].mainChannel, 0.16),
          }}
        >
          {icon}
        </Avatar>
      )}
    </Card>
  );
}
