import type { IOverviewAuctions } from 'src/types/dashboard-overview.types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Pie3dChart } from 'src/components/dashboard';

import { OverviewCard } from './overview-card';
import { OVERVIEW_COLORS, OVERVIEW_ACCENTS, AUCTIONS_PIE_SHOW_DONE_SLICE } from '../constants';

// ----------------------------------------------------------------------

type OverviewAuctionsCardProps = {
  auctions?: IOverviewAuctions;
  loading?: boolean;
};

/** Legend order of the design. `inPie` = drawn as a slice of the 3D pie. */
const ROWS = [
  { key: 'done', color: OVERVIEW_COLORS.auctions.done, inPie: AUCTIONS_PIE_SHOW_DONE_SLICE },
  { key: 'ended', color: OVERVIEW_COLORS.auctions.ended, inPie: true },
  { key: 'sold', color: OVERVIEW_COLORS.auctions.sold, inPie: true },
  {
    key: 'pendingActivation',
    color: OVERVIEW_COLORS.auctions.pendingActivation,
    inPie: true,
  },
] as const;

/** Auction outcomes: 3D pie + legend with counts (see AUCTIONS_PIE_SHOW_DONE_SLICE). */
export function OverviewAuctionsCard({ auctions, loading }: OverviewAuctionsCardProps) {
  const { t } = useTranslate('dashboard');

  const rows = ROWS.map((row) => ({
    ...row,
    label: t(`dashboard.dashboard.overview.auctions.${row.key}`),
    value: auctions?.[row.key] ?? 0,
  }));

  return (
    <OverviewCard
      title={t('dashboard.dashboard.overview.auctions.title')}
      accent={OVERVIEW_ACCENTS.auctions}
      loading={loading}
      empty={!auctions}
    >
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row', md: 'column', lg: 'row' },
        }}
      >
        <Pie3dChart
          slices={rows.filter((row) => row.inPie)}
          formatValue={(value) => fNumber(value)}
        />

        <Box sx={{ gap: 0.5, width: 1, maxWidth: 190, display: 'flex', flexDirection: 'column' }}>
          {rows.map((row) => (
            <Box
              key={row.key}
              sx={{
                py: 0.5,
                gap: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ gap: 0.5, minWidth: 0, display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    flexShrink: 0,
                    borderRadius: '50%',
                    bgcolor: row.color,
                    // Done is a total, not a slice, unless the switch says otherwise.
                    visibility: row.inPie ? 'visible' : 'hidden',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    ...(!row.inPie && { fontWeight: 600, color: 'text.primary' }),
                  }}
                >
                  {row.label}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {fNumber(row.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </OverviewCard>
  );
}
