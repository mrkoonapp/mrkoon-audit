import type { IOverviewPayRequests } from 'src/types/dashboard-overview.types';

import Box from '@mui/material/Box';

import { fNumber, fPercent } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { ChartLegends } from 'src/components/chart';
import { RoundedDonutChart } from 'src/components/dashboard';

import { DUMMY_PAY_REQUESTS } from '../data';
import { OverviewCard } from './overview-card';
import { OVERVIEW_COLORS, OVERVIEW_ACCENTS } from '../constants';

// ----------------------------------------------------------------------

type OverviewPayRequestsCardProps = {
  payRequests?: IOverviewPayRequests;
  loading?: boolean;
};

/** Pay Requests donut: created by buyers (users) vs admins. */
export function OverviewPayRequestsCard({ payRequests, loading }: OverviewPayRequestsCardProps) {
  const { t } = useTranslate('dashboard');

  const createdByBuyers = payRequests?.createdByBuyers ?? DUMMY_PAY_REQUESTS.createdByBuyers;
  const createdByAdmins = payRequests?.createdByAdmins ?? DUMMY_PAY_REQUESTS.createdByAdmins;

  const slices = [
    {
      label: t('dashboard.dashboard.overview.payRequests.createdByBuyers'),
      value: createdByBuyers,
      color: OVERVIEW_COLORS.payRequests.byBuyers,
    },
    {
      label: t('dashboard.dashboard.overview.payRequests.createdByAdmins'),
      value: createdByAdmins,
      color: OVERVIEW_COLORS.payRequests.byAdmins,
    },
  ];

  return (
    <OverviewCard
      title={t('dashboard.dashboard.overview.payRequests.title')}
      accent={OVERVIEW_ACCENTS.payRequests}
      loading={loading}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          gap: 1,
          display: 'flex',
          borderRadius: 2,
          alignItems: 'center',
          flexDirection: 'column',
          bgcolor: 'background.neutral',
        }}
      >
        <RoundedDonutChart
          slices={slices}
          formatValue={(value) => fNumber(value)}
          formatPercent={(percent) =>
            fPercent(percent, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
        />

        <ChartLegends
          labels={slices.map((slice) => slice.label)}
          colors={slices.map((slice) => slice.color)}
          slotProps={{
            dot: { sx: { width: 6, height: 6 } },
            label: { sx: { typography: 'caption', color: 'text.secondary' } },
          }}
          sx={{ gap: 2, justifyContent: 'center' }}
        />
      </Box>
    </OverviewCard>
  );
}
