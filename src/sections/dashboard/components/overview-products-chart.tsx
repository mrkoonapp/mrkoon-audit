import type { IDashboardOverview } from 'src/types/dashboard-overview.types';

import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

import { OverviewCard } from './overview-card';
import { OVERVIEW_COLORS, OVERVIEW_ACCENTS } from '../constants';

// ----------------------------------------------------------------------

type OverviewProductsChartProps = {
  data?: IDashboardOverview['productsChart'];
  loading?: boolean;
};

const { EG, SA } = OVERVIEW_COLORS.productsChart;

export function OverviewProductsChart({ data, loading }: OverviewProductsChartProps) {
  const theme = useTheme();
  const { t } = useTranslate('dashboard');

  const groups = data
    ? [data.totalProducts, data.newProducts, data.auctionsCreated, data.auctionsCompleted]
    : [];

  // "No data" only when the response is missing — all-zero bars are real data.
  const isEmpty = !data;
  const isAllZero = !groups.some((group) => group.EG || group.SA);

  // Saudi first so its bar sits on the left of each pair, as in the design.
  const series = [
    { name: t('dashboard.dashboard.overview.saudiArabia'), data: groups.map((group) => group.SA) },
    { name: t('dashboard.dashboard.overview.egypt'), data: groups.map((group) => group.EG) },
  ];

  const chartOptions = useChart({
    colors: [SA.from, EG.from],
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        gradientToColors: [SA.to, EG.to],
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    plotOptions: {
      bar: { columnWidth: '62%', borderRadius: 10, borderRadiusApplication: 'end' },
    },
    grid: {
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      labels: { rotate: 0, trim: true, hideOverlappingLabels: false },
      categories: [
        t('dashboard.dashboard.overview.productsKpis.totalProducts'),
        t('dashboard.dashboard.overview.productsKpis.newProducts'),
        t('dashboard.dashboard.overview.productsKpis.auctionsCreated'),
        t('dashboard.dashboard.overview.productsKpis.auctionsCompleted'),
      ],
    },
    yaxis: {
      min: 0,
      // All zeros: ApexCharts would draw a 0–2 axis with 0.5 steps; use the design's 0 / 50 / 100.
      ...(isAllZero && { max: 100, tickAmount: 2 }),
      labels: { formatter: (value: number) => fNumber(Math.round(value)) },
    },
    legend: { show: false },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (value: number) => fNumber(value) },
    },
  });

  return (
    <OverviewCard
      title={t('dashboard.dashboard.overview.productsKpis.title')}
      accent={OVERVIEW_ACCENTS.products}
      loading={loading}
      empty={isEmpty}
      action={
        <ChartLegends
          labels={[
            t('dashboard.dashboard.overview.egypt'),
            t('dashboard.dashboard.overview.saudiArabia'),
          ]}
          colors={[EG.legend, SA.legend]}
          slotProps={{ dot: { sx: { borderRadius: 0.5 } } }}
          sx={{ gap: 2, display: { xs: 'none', sm: 'flex' } }}
        />
      }
    >
      <Chart
        type="bar"
        series={series}
        options={chartOptions}
        sx={{ height: 230, color: theme.vars.palette.text.secondary }}
      />
    </OverviewCard>
  );
}
