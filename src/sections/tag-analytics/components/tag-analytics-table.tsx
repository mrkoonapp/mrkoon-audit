import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import { TableWidgetCard } from 'src/components/dashboard';

import type { TagAnalyticsAuction } from 'src/api/tag-analytics';

// ----------------------------------------------------------------------

interface Props {
  auctions: TagAnalyticsAuction[];
  loading?: boolean;
  currency: string;
}

const COLUMNS = [
  { id: 'index', label: '#', width: 48, align: 'center' as const },
  { id: 'auction_code', label: 'Auction Code', width: 140 },
  { id: 'auction_date', label: 'Date', width: 130, hideOnMobile: true },
  { id: 'start_price', label: 'Start Price', width: 160, align: 'right' as const, hideOnMobile: true },
  { id: 'highest_price', label: 'Highest Price', width: 160, align: 'right' as const },
];

export function TagAnalyticsTable({ auctions, loading, currency }: Props) {
  const rows = auctions.map((auction, index) => ({
    id: `${auction.auction_code}-${index}`,
    cells: {
      index: (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {index + 1}
        </Typography>
      ),
      auction_code: (
        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
          {auction.auction_code}
        </Typography>
      ),
      auction_date: (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {auction.auction_date}
        </Typography>
      ),
      start_price: (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {fNumber(auction.start_price)}{' '}
          <Typography component="span" variant="caption" sx={{ color: 'text.disabled' }}>
            {currency}
          </Typography>
        </Typography>
      ),
      highest_price: (
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#BF8654' }}>
          {fNumber(auction.highest_price)}{' '}
          <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
            {currency}
          </Typography>
        </Typography>
      ),
    },
  }));

  return (
    <TableWidgetCard
      title="Auction Details"
      columns={COLUMNS}
      rows={rows}
      minWidth={580}
      loading={loading}
      emptyTitle="No Auctions"
      emptyDescription="Select a tag or tag group and a date range to see auction results."
    />
  );
}
