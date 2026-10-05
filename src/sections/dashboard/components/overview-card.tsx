import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';

import { useTranslate } from 'src/locales';

import { WidgetCard, AccentTitle } from 'src/components/dashboard';

// ----------------------------------------------------------------------

type OverviewCardProps = {
  title: string;
  accent: string;
  /** Right side of the header (decorative icon, legend, …). */
  action?: ReactNode;
  loading?: boolean;
  empty?: boolean;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  bodySx?: SxProps<Theme>;
};

/**
 * `WidgetCard` with the overview header (accent pill + title) and the tighter
 * 16px padding used by the design. Loading / empty states come from WidgetCard.
 */
export function OverviewCard({
  title,
  accent,
  action,
  loading,
  empty,
  children,
  sx,
  bodySx,
}: OverviewCardProps) {
  const { t } = useTranslate('dashboard');

  const headerAction = action ? (
    <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 28 }}>{action}</Box>
  ) : undefined;

  return (
    <WidgetCard
      title={<AccentTitle title={title} accent={accent} />}
      headerAction={headerAction}
      loading={loading}
      empty={empty}
      emptyTitle={t('dashboard.shared.empty.title')}
      emptyDescription={t('dashboard.shared.empty.description')}
      sx={[
        {
          // Keep the header above decorative artwork (e.g. the truck).
          '& .MuiCardHeader-root': { p: 2, pb: 0, mb: 2, zIndex: 1, position: 'relative' },
          '& .MuiCardHeader-action': { alignSelf: 'center', m: 0 },
          '& .MuiCardHeader-content': { minWidth: 0 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      // Compact empty state so an empty widget doesn't stretch its whole grid row.
      emptySx={{ py: 1, minHeight: 0, '& img': { maxWidth: 64 } }}
      bodySx={[{ p: 2, pt: 0 }, ...(Array.isArray(bodySx) ? bodySx : [bodySx])]}
    >
      {children}
    </WidgetCard>
  );
}
