import type { ReactElement } from 'react';
import type { MetricKey } from 'src/api/tag-report';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type Props = {
  metric: MetricKey;
  /** Why the value is missing; replaces the change line. */
  nullReason?: boolean;
  /** "01 - 31 Aug 2026: 555K EGP". */
  previous?: string;
  children: ReactElement;
};

/** Explains what a number means: the metric, its definition and the previous value. */
export function MetricTip({ metric, nullReason, previous, children }: Props) {
  const { t } = useTranslate('dashboard');

  const title = (
    <Box sx={{ display: 'grid', gap: 0.5, maxWidth: 280 }}>
      <Box component="b">{t(`dashboard.tagReport.metrics.${metric}`)}</Box>
      <span>{t(`dashboard.tagReport.definitions.${metric}`)}</span>
      {nullReason ? (
        <Box component="span" sx={{ opacity: 0.72 }}>
          {t(`dashboard.tagReport.nullReasons.${metric}`)}
        </Box>
      ) : (
        previous && (
          <Box component="span" sx={{ opacity: 0.72 }}>
            {previous}
          </Box>
        )
      )}
    </Box>
  );

  return (
    <Tooltip title={title} arrow placement="top" enterDelay={300}>
      {children}
    </Tooltip>
  );
}
