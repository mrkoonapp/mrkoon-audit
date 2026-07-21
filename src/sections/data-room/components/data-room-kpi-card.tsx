import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import type { DataRoomKpi } from '../data';

// ----------------------------------------------------------------------

interface Props {
  kpi: DataRoomKpi;
}

export function DataRoomKpiCard({ kpi }: Props) {
  const theme = useTheme();

  const isUp = kpi.trend.direction === 'up';
  const trendColor = isUp ? 'success.main' : 'error.main';
  const trendBg = isUp ? 'rgba(46, 182, 125, 0.12)' : 'rgba(239, 83, 80, 0.12)';

  return (
    <Card
      sx={{
        p: 3,
        bgcolor: theme.palette.mode === 'dark' ? '#11161D' : 'background.paper',
        border: `1px solid ${theme.palette.mode === 'dark' ? '#1D2633' : theme.palette.divider}`,
        borderRadius: 2.5,
        boxShadow: theme.customShadows?.card,
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* KPI Title & Trend Badge */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: '600' }}>
          {kpi.label}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.25}
          sx={{
            py: 0.5,
            px: 1,
            borderRadius: 1,
            bgcolor: trendBg,
            color: trendColor,
            fontSize: '11px',
            fontWeight: 'bold',
          }}
        >
          <Iconify
            icon={isUp ? ('eva:diagonal-arrow-right-up-fill' as any) : ('eva:diagonal-arrow-right-down-fill' as any)}
            width={12}
          />
        </Stack>
      </Stack>

      {/* Big Metric Value */}
      <Typography variant="h3" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
        {kpi.value}
      </Typography>

      {/* Distribution Footer Row */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#E05665' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '500' }}>
            EG{' '}
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold', ml: 0.25 }}>
              {kpi.distribution.eg}
            </Box>
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2EB67D' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '500' }}>
            SA{' '}
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold', ml: 0.25 }}>
              {kpi.distribution.sa}
            </Box>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
