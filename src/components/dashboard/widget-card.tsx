import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';

import { EmptyContent } from 'src/components/empty-content';

import type { WidgetCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Base shell for every dashboard widget: a `Card` with an optional header
 * (title / subheader / right action) and a body that renders `children`, a
 * loading spinner, or an empty state. Composed by the chart and list widgets so
 * headers, spacing, radius and states stay consistent across pages.
 */
export function WidgetCard({
  title,
  subheader,
  headerAction,
  children,
  loading,
  empty,
  emptyTitle,
  emptyDescription,
  sx,
  bodySx,
}: WidgetCardProps) {
  const renderBody = () => {
    if (loading) {
      return (
        <Box
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            minHeight: 160,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={32} />
        </Box>
      );
    }

    if (empty) {
      return (
        <EmptyContent
          title={emptyTitle}
          description={emptyDescription}
          sx={{ py: 5, minHeight: 160 }}
        />
      );
    }

    return children;
  };

  return (
    <Card
      sx={[
        { height: 1, display: 'flex', flexDirection: 'column' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {(title || headerAction) && (
        <CardHeader title={title} subheader={subheader} action={headerAction} sx={{ mb: 1 }} />
      )}

      <Box
        sx={[
          { p: 3, pt: title || headerAction ? 0 : 3, flex: '1 1 auto' },
          ...(Array.isArray(bodySx) ? bodySx : [bodySx]),
        ]}
      >
        {renderBody()}
      </Box>
    </Card>
  );
}
