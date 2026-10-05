import type { IOverviewAuctions } from 'src/types/dashboard-overview.types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Chart, useChart } from 'src/components/chart';

import { OverviewCard } from './overview-card';
import { OVERVIEW_COLORS, OVERVIEW_ACCENTS } from '../constants';

// ----------------------------------------------------------------------

type OverviewAuctionsCardProps = {
  auctions?: IOverviewAuctions;
  loading?: boolean;
};

const SLICES = [
  { key: 'ended', color: OVERVIEW_COLORS.auctions.ended },
  { key: 'sold', color: OVERVIEW_COLORS.auctions.sold },
  { key: 'pendingActivation', color: OVERVIEW_COLORS.auctions.pendingActivation },
] as const;

/**
 * Auction outcomes pie. "Done" is the sum of the three slices, so it is listed
 * as the total row of the legend instead of being drawn as its own slice.
 */
export function OverviewAuctionsCard({ auctions, loading }: OverviewAuctionsCardProps) {
  const { t } = useTranslate('dashboard');

  const labels = SLICES.map((slice) => t(`dashboard.dashboard.overview.auctions.${slice.key}`));
  const series = SLICES.map((slice) => auctions?.[slice.key] ?? 0);

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: SLICES.map((slice) => slice.color),
    labels,
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: (name) => name } },
    },
    plotOptions: { pie: { expandOnClick: false, donut: { labels: { show: false } } } },
  });

  const legendRow = (label: string, value: number, color?: string) => (
    <Box
      key={label}
      sx={{
        py: 0.5,
        gap: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ gap: 0.75, minWidth: 0, display: 'flex', alignItems: 'center' }}>
        {color && (
          <Box sx={{ width: 8, height: 8, flexShrink: 0, borderRadius: '50%', bgcolor: color }} />
        )}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            ...(!color && { fontWeight: 600, color: 'text.primary' }),
          }}
        >
          {label}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
        {fNumber(value)}
      </Typography>
    </Box>
  );

  return (
    <OverviewCard
      title={t('dashboard.dashboard.overview.auctions.title')}
      accent={OVERVIEW_ACCENTS.auctions}
      loading={loading}
      empty={!auctions?.done}
    >
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row', md: 'column', lg: 'row' },
        }}
      >
        <Chart type="pie" series={series} options={chartOptions} sx={{ width: 130, height: 130 }} />

        <Box sx={{ flex: 1, width: 1, minWidth: 0 }}>
          {legendRow(t('dashboard.dashboard.overview.auctions.done'), auctions?.done ?? 0)}
          {SLICES.map((slice, index) => legendRow(labels[index], series[index], slice.color))}
        </Box>
      </Box>
    </OverviewCard>
  );
}
