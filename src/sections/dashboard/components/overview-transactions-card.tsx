import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Chart, useChart } from 'src/components/chart';

import { OverviewCard } from './overview-card';
import { DUMMY_TRANSACTION_REQUESTS } from '../data';
import {
  OVERVIEW_ASSETS,
  OVERVIEW_COLORS,
  OVERVIEW_ACCENTS,
  TRUCK_MIN_CARD_WIDTH,
} from '../constants';

// ----------------------------------------------------------------------

type RequestTileProps = {
  label: string;
  caption: string;
  total: number;
  series: number[];
  color: string;
};

function RequestTile({ label, caption, total, series, color }: RequestTileProps) {
  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: [color],
    stroke: { width: 2.5, curve: 'smooth' },
    fill: { type: 'solid', opacity: 0 },
    tooltip: { enabled: false },
  });

  return (
    <Box
      sx={{
        p: 2,
        gap: 2,
        display: 'flex',
        borderRadius: 2,
        alignItems: 'center',
        bgcolor: 'background.neutral',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 6.5, height: 6.5, borderRadius: '50%', bgcolor: color }} />
          <Typography variant="body2">{label}</Typography>
        </Box>
        <Box sx={{ pl: 1.25, gap: 0.5, display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="h4" component="span">
            {fNumber(total)}
          </Typography>
          <Typography variant="caption" component="span" sx={{ color: 'text.secondary' }}>
            {caption}
          </Typography>
        </Box>
      </Box>

      <Chart
        type="area"
        series={[{ data: series }]}
        options={chartOptions}
        sx={{ width: 88, height: 58 }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

/** ⚠️ Fed by `DUMMY_TRANSACTION_REQUESTS` — no endpoint reports requests per side yet. */
export function OverviewTransactionsCard() {
  const { t } = useTranslate('dashboard');

  const caption = t('dashboard.dashboard.overview.transactions.requests');

  return (
    <OverviewCard
      title={t('dashboard.dashboard.overview.transactions.title')}
      accent={OVERVIEW_ACCENTS.transactions}
      sx={{ overflow: 'hidden', containerType: 'inline-size' }}
      bodySx={{ display: 'flex' }}
    >
      <Box
        sx={{
          gap: 2,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: 1,
          [`@container (min-width: ${TRUCK_MIN_CARD_WIDTH}px)`]: { width: 320 },
        }}
      >
        <RequestTile
          label={t('dashboard.dashboard.overview.transactions.sellers')}
          caption={caption}
          total={DUMMY_TRANSACTION_REQUESTS.sellers.total}
          series={DUMMY_TRANSACTION_REQUESTS.sellers.series}
          color={OVERVIEW_COLORS.transactions.sellers}
        />
        <RequestTile
          label={t('dashboard.dashboard.overview.transactions.buyers')}
          caption={caption}
          total={DUMMY_TRANSACTION_REQUESTS.buyers.total}
          series={DUMMY_TRANSACTION_REQUESTS.buyers.series}
          color={OVERVIEW_COLORS.transactions.buyers}
        />
      </Box>

      {/*
       * Decorative truck, placed against the card (not the body) with the
       * design's offsets: a 420×237 frame at top 21 that bleeds past the right
       * edge, its ground shadow, the cropped truck photo and the logo overlay.
       * Only shown when the card itself is wide enough for tiles + truck.
       */}
      <Box
        sx={{
          top: 21,
          right: -89,
          width: 420,
          height: 237,
          position: 'absolute',
          pointerEvents: 'none',
          display: 'none',
          [`@container (min-width: ${TRUCK_MIN_CARD_WIDTH}px)`]: { display: 'block' },
        }}
      >
        <Box
          component="img"
          alt=""
          src={OVERVIEW_ASSETS.truckShadow}
          sx={{ position: 'absolute', left: 137, top: 107, width: 320.234, height: 131.479 }}
        />
        <Box sx={{ inset: 0, overflow: 'hidden', position: 'absolute' }}>
          <Box
            component="img"
            alt=""
            src={OVERVIEW_ASSETS.truck}
            sx={{
              top: '-10.03%',
              left: '-11.24%',
              width: '125.85%',
              height: '125.44%',
              maxWidth: 'none',
              position: 'absolute',
            }}
          />
        </Box>
        <Box
          component="img"
          alt=""
          src={OVERVIEW_ASSETS.truckLogo}
          sx={{
            top: 95.29,
            left: 173.63,
            width: 48.864,
            height: 46.253,
            objectFit: 'cover',
            position: 'absolute',
          }}
        />
      </Box>
    </OverviewCard>
  );
}
