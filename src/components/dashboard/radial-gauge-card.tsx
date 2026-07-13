import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';

import { WidgetCard } from './widget-card';

import type { RadialGaugeCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Semicircle radial gauge widget (e.g. "Successful auctions" 77.9%). Shows a big
 * centered percentage with a label underneath. An optional `children` slot
 * renders extra content below the gauge (stat rows, a footer, …), so it can act
 * as the header of a richer summary card.
 */
export function RadialGaugeCard({
  title,
  headerAction,
  value,
  valueLabel,
  color,
  children,
  loading,
  empty,
  emptyTitle,
  emptyDescription,
  sx,
}: RadialGaugeCardProps) {
  const theme = useTheme();

  const gaugeColor = color ?? theme.palette.success.main;

  const chartOptions = useChart({
    colors: [gaugeColor],
    stroke: { lineCap: 'round' },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '54%' },
        track: { strokeWidth: '40%', margin: 6 },
        dataLabels: {
          name: {
            offsetY: 8,
            fontSize: theme.typography.body2.fontSize as string,
            color: theme.vars.palette.text.secondary,
          },
          value: {
            offsetY: -32,
            fontSize: theme.typography.h3.fontSize as string,
            fontWeight: theme.typography.h3.fontWeight,
            color: theme.vars.palette.text.primary,
            formatter: (val: number) => `${val}%`,
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
        <Chart
          type="radialBar"
          series={[value]}
          options={chartOptions}
          sx={{ mx: 'auto', width: 360, height: 300, mt: -1, mb: -3 }}
        />

        {children && <Box sx={{ mt: 2 }}>{children}</Box>}
      </Box>
    </WidgetCard>
  );
}
