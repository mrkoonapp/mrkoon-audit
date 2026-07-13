import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { WidgetCard } from './widget-card';

import type { StatListItem, StatListCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Vertical list of labeled stats (e.g. "Merchants Updates"): each row is a small
 * colored dot + muted label with the bold value underneath. Generic summary
 * panel — copy is passed in, no translated strings here.
 */
export function StatListCard({
  title,
  headerAction,
  items,
  loading,
  emptyTitle,
  emptyDescription,
  sx,
}: StatListCardProps) {
  return (
    <WidgetCard
      title={title}
      headerAction={headerAction}
      loading={loading}
      empty={!loading && items.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      sx={sx}
    >
      <Stack spacing={2.5}>
        {items.map((item) => (
          <StatRow key={item.id} item={item} />
        ))}
      </Stack>
    </WidgetCard>
  );
}

// ----------------------------------------------------------------------

function StatRow({ item }: { item: StatListItem }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: `${item.color ?? 'primary'}.main`,
          }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
          {item.label}
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mt: 0.5 }}>
        {item.value}
      </Typography>
    </Box>
  );
}
