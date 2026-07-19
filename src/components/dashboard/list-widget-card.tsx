import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';

import { WidgetCard } from './widget-card';

import type { ListWidgetItem, ListWidgetCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Generic avatar list widget. Powers both "New Clients" (avatar + name/subtitle
 * + joined date) and "Top sellers" (avatar + name/subtitle + price + qty badge)
 * purely by which optional item fields are provided.
 */
export function ListWidgetCard({
  title,
  headerAction,
  countBadge,
  items,
  maxHeight = 360,
  loading,
  emptyTitle,
  emptyDescription,
  sx,
}: ListWidgetCardProps) {
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
        <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {items.map((item) => (
            <ListRow key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>
    </WidgetCard>
  );
}

// ----------------------------------------------------------------------

function ListRow({ item }: { item: ListWidgetItem }) {
  console.log('item.secondary', item);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {item.avatar ?? (
        <Avatar
          src={item.avatarUrl}
          alt={item.avatarAlt ?? item.primary ?? ''}
          sx={{ width: 40, height: 40 }}
        >
          {(item.primary || '').charAt(0)}
        </Avatar>
      )}

      <Box sx={{ flex: item.center ? '1 1 0' : '1 1 auto', minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {item.primary}
        </Typography>

        {item.secondary && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {item.secondary}
          </Typography>
        )}
      </Box>

      {item.center && (
        <Box
          sx={{
            flex: '1 1 0',
            minWidth: 0,
            display: { xs: 'none', sm: 'flex' },
            justifyContent: 'center',
          }}
        >
          {item.center}
        </Box>
      )}

      {(item.trailingPrimary || item.trailingSecondary || item.badge) && (
        <Box
          sx={{
            gap: 0.5,
            flex: item.center ? '1 1 0' : '0 0 auto',
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'column',
          }}
        >
          {item.trailingPrimary && (
            <Typography variant="subtitle2" component="div" noWrap>
              {item.trailingPrimary}
            </Typography>
          )}

          {item.trailingSecondary && (
            <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }} noWrap>
              {item.trailingSecondary}
            </Typography>
          )}

          {item.badge}
        </Box>
      )}
    </Box>
  );
}
