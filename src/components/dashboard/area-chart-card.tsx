import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

import { WidgetCard } from './widget-card';

import type { AreaChartCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Area / line chart widget (e.g. "All transactions"). Accepts one or more
 * series and shared x-axis categories. An optional `sideSlot` renders content
 * next to the chart (e.g. summary tiles); otherwise the chart fills the card.
 */
export function AreaChartCard({
  title,
  headerAction,
  categories,
  series,
  colors,
  height = 320,
  sideSlot,
  loading,
  empty,
  emptyTitle,
  emptyDescription,
  sx,
}: AreaChartCardProps) {
  const theme = useTheme();

  const chartColors = colors ?? [theme.palette.primary.main, theme.palette.warning.main];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
    tooltip: { y: { formatter: (value: number) => fNumber(value) } },
    legend: { show: series.length > 1 },
  });

  return (
    <WidgetCard
      title={title}
      headerAction={headerAction}
      loading={loading}
      empty={empty}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      sx={sx}
    >
      <Box
        sx={{
          gap: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: sideSlot ? 'row' : 'column' },
        }}
      >
        <Chart
          type="area"
          series={series}
          options={chartOptions}
          sx={{ flex: '1 1 auto', height }}
        />

        {sideSlot && <Box sx={{ width: { xs: 1, md: 240 }, flexShrink: 0 }}>{sideSlot}</Box>}
      </Box>
    </WidgetCard>
  );
}
