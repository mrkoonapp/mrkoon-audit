import Box from '@mui/material/Box';

import { fNumber, fPercent } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

import { DUMMY_PAY_REQUESTS } from '../data';
import { OverviewCard } from './overview-card';
import { OVERVIEW_COLORS, OVERVIEW_ACCENTS } from '../constants';

// ----------------------------------------------------------------------

const COLORS = [OVERVIEW_COLORS.payRequests.byBuyers, OVERVIEW_COLORS.payRequests.byAdmins];

/** ⚠️ Fed by `DUMMY_PAY_REQUESTS` — no endpoint reports pay-request creators yet. */
export function OverviewPayRequestsCard() {
  const { t } = useTranslate('dashboard');

  const series = [DUMMY_PAY_REQUESTS.createdByBuyers, DUMMY_PAY_REQUESTS.createdByAdmins];
  const total = series.reduce((acc, value) => acc + value, 0);

  const labels = [
    t('dashboard.dashboard.overview.payRequests.createdByBuyers'),
    t('dashboard.dashboard.overview.payRequests.createdByAdmins'),
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: COLORS,
    labels,
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (value: number) => fNumber(value) } },
    plotOptions: { pie: { donut: { size: '58%', labels: { show: false } } } },
  });

  return (
    <OverviewCard
      title={t('dashboard.dashboard.overview.payRequests.title')}
      accent={OVERVIEW_ACCENTS.payRequests}
    >
      <Box
        sx={{
          p: 2,
          gap: 2,
          height: 1,
          display: 'flex',
          borderRadius: 2,
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'background.neutral',
        }}
      >
        <Chart
          type="donut"
          series={series}
          options={chartOptions}
          sx={{ width: 120, height: 120 }}
        />

        <ChartLegends
          labels={labels}
          colors={COLORS}
          values={series.map((value) => `${fPercent((value / total) * 100)} · ${fNumber(value)}`)}
          slotProps={{
            value: {
              // ItemValue spreads the responsive h6 styles, so pin the size per breakpoint.
              sx: {
                mt: 0.5,
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: { xs: 12, sm: 12, md: 12, lg: 12 },
              },
            },
          }}
          sx={{ gap: 2, justifyContent: 'center' }}
        />
      </Box>
    </OverviewCard>
  );
}
