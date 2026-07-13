import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { IconStatRow, RadialGaugeCard } from 'src/components/dashboard';

import type { AuctionsData } from '../data';

// ----------------------------------------------------------------------

type Props = {
  summary: AuctionsData['summary'];
  onViewAuctions?: () => void;
};

/**
 * Auctions "success rate" summary card: a semicircle gauge over two bidder stat
 * rows and an "Auctions X / Y" footer. Composes the generic `RadialGaugeCard`
 * and `IconStatRow` building blocks; owns only the auctions-specific labels.
 */
export function AuctionsSummaryCard({ summary, onViewAuctions }: Props) {
  const { t } = useTranslate('dashboard');

  const bidderUnit = t('dashboard.auctions.bidderUnit');

  const renderValue = (value: number) => (
    <>
      {fNumber(value)}{' '}
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {bidderUnit}
      </Box>
    </>
  );

  return (
    <RadialGaugeCard
      value={summary.successRate}
      valueLabel={t('dashboard.auctions.successfulAuctions')}
    >
      <Stack spacing={2.5}>
        <IconStatRow
          icon={<Iconify icon="solar:users-group-rounded-bold" />}
          iconColor="warning"
          label={t('dashboard.auctions.totalBidders')}
          value={renderValue(summary.totalBidders)}
        />

        <IconStatRow
          icon={<Iconify icon="solar:users-group-rounded-bold-duotone" />}
          iconColor="secondary"
          label={t('dashboard.auctions.averageBidders')}
          value={renderValue(summary.averageBidders)}
        />

        <IconStatRow
          divider
          reverse
          label={t('dashboard.auctions.auctions')}
          value={`${fNumber(summary.auctionsDone)} / ${fNumber(summary.auctionsTotal)}`}
          action={
            <IconButton
              onClick={onViewAuctions}
              sx={{
                color: 'background.paper',
                bgcolor: 'text.primary',
                '&:hover': { bgcolor: 'text.secondary' },
              }}
            >
              <Iconify icon="eva:arrow-forward-fill" />
            </IconButton>
          }
        />
      </Stack>
    </RadialGaugeCard>
  );
}
