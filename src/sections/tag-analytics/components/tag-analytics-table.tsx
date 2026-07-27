import type { TagAnalyticsAuction } from 'src/api/tag-analytics';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState, useMemo } from 'react';

import { fNumber } from 'src/utils/format-number';

import { TableWidgetCard } from 'src/components/dashboard';
import { TablePaginationCustom } from 'src/components/table';

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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedAuctions = useMemo(() => {
    const start = page * rowsPerPage;
    return auctions.slice(start, start + rowsPerPage);
  }, [auctions, page, rowsPerPage]);

  const rows = paginatedAuctions.map((auction, index) => {
    const globalIndex = page * rowsPerPage + index + 1;
    return {
      id: `${auction.auction_code}-${index}`,
      cells: {
        index: (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {globalIndex}
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
    };
  });

  return (
    <Card
      sx={{
        p: 3,
        bgcolor: isDark ? '#11161D' : 'background.paper',
        border: `1px solid ${isDark ? '#1D2633' : theme.palette.divider}`,
        borderRadius: 2.5,
        boxShadow: theme.customShadows?.card,
      }}
    >
      <TableWidgetCard
        title="Auction Details"
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        sx={{ border: 'none', p: 0, boxShadow: 'none' }}
      />
      {!loading && auctions.length > 0 && (
        <TablePaginationCustom
          count={auctions.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ borderTop: `1px solid ${theme.palette.divider}`, mt: 1 }}
        />
      )}
    </Card>
  );
}
