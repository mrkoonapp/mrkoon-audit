import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

import { WidgetCard } from './widget-card';

import type { DonutCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Donut chart widget (e.g. "Success rate"). The center shows a total value +
 * label; the legend lists each slice with an optional formatted value. Colors
 * default to the theme chart palette when not provided.
 */
export function DonutCard({
  title,
  headerAction,
  series,
  labels,
  colors,
  total,
  totalLabel,
  legendValues,
  loading,
  empty,
  emptyTitle,
  emptyDescription,
  sx,
}: DonutCardProps) {
  const theme = useTheme();

  const chartColors = colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.success.main,
  ];

  const computedTotal = total ?? fNumber(series.reduce((acc, value) => acc + value, 0));

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels,
    stroke: { width: 0 },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            value: { formatter: (value: string) => fNumber(value) },
            total: {
              ...(totalLabel && { label: totalLabel }),
              formatter: () => computedTotal,
            },
          },
        },
      },
    },
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
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: { xs: 'center', sm: 'space-around' },
        }}
      >
        <Chart
          type="donut"
          series={series}
          options={chartOptions}
          sx={{ width: 200, height: 200 }}
        />

        <ChartLegends
          labels={labels}
          colors={chartColors}
          values={legendValues}
          sx={{ flexDirection: 'column', gap: 2 }}
        />
      </Box>
    </WidgetCard>
  );
}
