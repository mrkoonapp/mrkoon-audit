import { Fragment } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';

import { WidgetCard } from './widget-card';

import type { MetricListItem, MetricListCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Ranked list where each row carries one or more inline metrics (icon + value)
 * on the right, separated by a dot — e.g. "Top 5 sellers" (amount • quantity).
 * Fully generic: labels, icons, values and the header `action` ("View all") are
 * all passed in, so it can back any ranked list on any page.
 */
export function MetricListCard({
  title,
  action,
  items,
  maxHeight = 400,
  loading,
  emptyTitle,
  emptyDescription,
  sx,
}: MetricListCardProps) {
  return (
    <WidgetCard
      title={title}
      headerAction={action}
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
            <MetricRow key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>
    </WidgetCard>
  );
}

// ----------------------------------------------------------------------

function MetricRow({ item }: { item: MetricListItem }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        src={item.avatarUrl}
        alt={item.avatarAlt ?? item.primary}
        sx={{ width: 44, height: 44 }}
      >
        {item.primary.charAt(0)}
      </Avatar>

      <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {item.primary}
        </Typography>

        {item.secondary && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {item.secondary}
          </Typography>
        )}
      </Box>

      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {item.metrics.map((metric, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <Box
                sx={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  bgcolor: 'text.disabled',
                }}
              />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {metric.icon && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    color: 'text.disabled',
                    '& > *': { width: 20, height: 20 },
                  }}
                >
                  {metric.icon}
                </Box>
              )}

              <Typography variant="subtitle2" component="span" noWrap>
                {metric.value}
              </Typography>
            </Box>
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}
