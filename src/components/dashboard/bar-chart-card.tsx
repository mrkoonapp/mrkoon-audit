import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

import { WidgetCard } from './widget-card';

import type { BarChartCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Vertical bar chart widget (e.g. "Auctions by category"). Single-series with
 * one color per bar (`distributed`), values printed on top, and an optional
 * color-coded legend built from the categories. Colors default to the theme
 * chart palette (repeated as needed).
 */
export function BarChartCard({
  title,
  headerAction,
  categories,
  series,
  seriesName,
  colors,
  distributed = true,
  showValues = true,
  showLegend = true,
  height = 320,
  loading,
  empty,
  emptyTitle,
  emptyDescription,
  sx,
}: BarChartCardProps) {
  const theme = useTheme();

  const basePalette = colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.secondary.main,
    theme.palette.warning.dark,
    theme.palette.info.dark,
  ];

  // Ensure one color per bar when distributed.
  const chartColors = distributed
    ? categories.map((_, i) => basePalette[i % basePalette.length])
    : basePalette;

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { show: false },
    xaxis: { categories },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value) },
    },
    legend: { show: false },
    dataLabels: {
      enabled: showValues,
      offsetY: -18,
      formatter: (value: number) => fNumber(value),
      style: { colors: [theme.vars.palette.text.secondary], fontWeight: 600 },
    },
    plotOptions: {
      bar: { distributed, columnWidth: '55%', borderRadius: 4, dataLabels: { position: 'top' } },
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
      <Chart
        type="bar"
        series={[{ name: seriesName ?? '', data: series }]}
        options={chartOptions}
        sx={{ height }}
      />

      {showLegend && (
        <ChartLegends
          labels={categories}
          colors={chartColors}
          sx={{ mt: 2, justifyContent: 'center' }}
        />
      )}
    </WidgetCard>
  );
}
