import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { WidgetCard } from './widget-card';

import type { ProgressListCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Ranked progress list widget (e.g. "Top 5 Categories"): each row shows a
 * label, a trailing value and a horizontal bar sized by `percent` (0–100).
 */
export function ProgressListCard({
  title,
  headerAction,
  items,
  loading,
  emptyTitle,
  emptyDescription,
  sx,
}: ProgressListCardProps) {
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map((item) => (
          <Box key={item.id}>
            <Box
              sx={{
                mb: 1,
                gap: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="subtitle2" noWrap>
                {item.label}
              </Typography>

              <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
                {item.value}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={Math.min(Math.max(item.percent, 0), 100)}
              color={item.color ?? 'primary'}
              sx={{ height: 8, borderRadius: 1, bgcolor: 'background.neutral' }}
            />
          </Box>
        ))}
      </Box>
    </WidgetCard>
  );
}
