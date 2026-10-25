import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface BreakdownItem {
  label: string;
  count: number;
  highest: number;
  lowest: number;
}

interface Props {
  granularityLabel: string;
  breakdown: BreakdownItem[];
}

export function TagAnalyticsBreakdownChart({ granularityLabel, breakdown }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const categories = breakdown.map((b) => b.label);
  const series = [{ name: 'Auctions', data: breakdown.map((b) => b.count) }];

  const chartOptions = useChart({
    colors: ['#BF8654'],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
      curve: 'smooth' as any,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 6,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontSize: '11px',
          fontWeight: 500,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      forceNiceScale: true,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontSize: '11px',
        },
        formatter: (v: number) => Math.round(v).toString(),
      },
    },
    grid: {
      strokeDashArray: 3,
      borderColor: isDark ? '#1C2430' : '#E5E8EB',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    fill: {
      type: 'solid',
      opacity: 0.85,
    },
    tooltip: {
      shared: false,
      intersect: true,
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (v: number) => `${v} auctions`,
      },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '11px', fontWeight: '600', colors: ['#fff'] },
      formatter: (v: number) => (v > 0 ? v.toString() : ''),
      dropShadow: { enabled: false },
    },
  });

  return (
    <Card
      sx={{
        p: 3,
        bgcolor: isDark ? '#11161D' : 'background.paper',
        border: `1px solid ${isDark ? '#1D2633' : theme.palette.divider}`,
        borderRadius: 2.5,
        boxShadow: theme.customShadows?.card,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ width: 4, height: 24, borderRadius: '4px', bgcolor: '#BF8654' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Auctions by {granularityLabel}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Number of auctions per {granularityLabel.toLowerCase()}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Box sx={{ height: 280 }}>
        {breakdown.length > 0 ? (
          <Chart type="bar" series={series} options={chartOptions} sx={{ height: 260 }} />
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: 1, color: 'text.disabled' }}
          >
            <Typography variant="body2">No data for selected period</Typography>
          </Stack>
        )}
      </Box>
    </Card>
  );
}
