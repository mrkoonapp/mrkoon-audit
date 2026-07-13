import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';

import { WidgetCard } from './widget-card';

import type { AvatarGridItem, AvatarGridCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Responsive avatar **grid** widget (e.g. "New Merchants"): the same avatar +
 * name/subtitle row as `ListWidgetCard`, but laid out in a multi-column grid
 * that stacks to a single column on mobile. Column count is configurable per
 * breakpoint. Copy is passed in — no translated strings here.
 */
export function AvatarGridCard({
  title,
  headerAction,
  countBadge,
  items,
  columns = { xs: 1, sm: 2, md: 3 },
  maxHeight,
  loading,
  emptyTitle,
  emptyDescription,
  sx,
}: AvatarGridCardProps) {
  const renderTitle =
    title && countBadge ? (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        {title}
        {countBadge}
      </Box>
    ) : (
      title
    );

  return (
    <WidgetCard
      title={renderTitle}
      headerAction={headerAction}
      loading={loading}
      empty={!loading && items.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      bodySx={{ p: 0 }}
      sx={sx}
    >
      <Scrollbar sx={{ maxHeight }}>
        <Box
          sx={{
            px: 3,
            pb: 3,
            display: 'grid',
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: {
              xs: `repeat(${columns.xs ?? 1}, 1fr)`,
              sm: `repeat(${columns.sm ?? 2}, 1fr)`,
              md: `repeat(${columns.md ?? 3}, 1fr)`,
            },
          }}
        >
          {items.map((item) => (
            <GridCell key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>
    </WidgetCard>
  );
}

// ----------------------------------------------------------------------

function GridCell({ item }: { item: AvatarGridItem }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
      <Avatar
        src={item.avatarUrl}
        alt={item.avatarAlt ?? item.primary}
        sx={{ width: 40, height: 40 }}
      >
        {item.primary.charAt(0)}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {item.primary}
        </Typography>

        {item.secondary && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap component="div">
            {item.secondary}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
