import type { TagAnalyticsAuction } from 'src/api/tag-analytics';

import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import { TableWidgetCard } from 'src/components/dashboard';

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
  { id: 'start_price', label: 'Start Price', width: 160, align: 'right' as const },
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
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {auction.auction_code}
        </Typography>
      ),
      auction_date: (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {auction.auction_date}
        </Typography>
      ),
      start_price: (
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {fNumber(auction.start_price)} <Typography component="span" variant="caption" sx={{ color: 'text.disabled', fontWeight: 400 }}>{currency}</Typography>
        </Typography>
      ),
      highest_price: (
        <Typography variant="subtitle2" sx={{ color: '#BF8654', fontWeight: 700 }}>
          {fNumber(auction.highest_price)} <Typography component="span" variant="caption" sx={{ color: 'text.disabled', fontWeight: 400 }}>{currency}</Typography>
        </Typography>
      ),
    },
  }));

  return (
    <TableWidgetCard
      title="Auction Details"
      columns={COLUMNS}
      rows={rows}
      loading={loading}
    />
  );
}
