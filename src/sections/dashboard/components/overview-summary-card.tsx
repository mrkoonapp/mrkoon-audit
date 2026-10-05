import type {
  CountrySplit,
  TrendDirection,
  OverviewCountry,
} from 'src/types/dashboard-overview.types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { OVERVIEW_ASSETS, OVERVIEW_COLORS } from '../constants';

// ----------------------------------------------------------------------

type OverviewSummaryCardProps = {
  label: string;
  total: number;
  /** Small gray text right after the total (e.g. "EGP", "(Active: 7,219)"). */
  suffix?: string;
  split: CountrySplit;
  trend: TrendDirection;
  loading?: boolean;
};

const COUNTRIES: OverviewCountry[] = ['EG', 'SA'];

export function OverviewSummaryCard({
  label,
  total,
  suffix,
  split,
  trend,
  loading,
}: OverviewSummaryCardProps) {
  const { t } = useTranslate('dashboard');

  const isUp = trend === 'up';

  const trendBadge = (
    <Box
      sx={{
        width: 32,
        height: 32,
        flexShrink: 0,
        display: 'flex',
        borderRadius: 1,
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: OVERVIEW_COLORS.trend[trend],
      }}
    >
      <Box
        component="img"
        alt=""
        src={isUp ? OVERVIEW_ASSETS.trendUp : OVERVIEW_ASSETS.trendDown}
        sx={{ width: 16, height: 16, ...(!isUp && { transform: 'rotate(180deg)' }) }}
      />
    </Box>
  );

  return (
    <Card sx={{ p: 3, height: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {label}
        </Typography>

        <Box
          sx={{
            pt: 1.5,
            pb: 1,
            gap: 0.5,
            display: 'flex',
            alignItems: 'baseline',
            flexWrap: 'wrap',
          }}
        >
          {loading ? (
            <Skeleton variant="text" sx={{ width: 120, typography: 'h4' }} />
          ) : (
            <>
              <Typography variant="h4" component="span">
                {fNumber(total)}
              </Typography>
              {suffix && (
                <Typography variant="caption" component="span" sx={{ color: 'text.secondary' }}>
                  {suffix}
                </Typography>
              )}
            </>
          )}
        </Box>

        <Box sx={{ columnGap: 4, rowGap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
          {COUNTRIES.map((country) => (
            <Box key={country} sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: OVERVIEW_COLORS.country[country],
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t(`dashboard.dashboard.overview.countryCodes.${country}`)}&nbsp;&nbsp;
                {loading ? '-' : fShortenNumber(split[country])}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {trendBadge}
    </Card>
  );
}
