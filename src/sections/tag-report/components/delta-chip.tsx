import type { MetricValue } from 'src/api/tag-report';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { useTranslate } from 'src/locales';

import { delta } from '../utils/delta';

// ----------------------------------------------------------------------

/** Green and red mean the change between periods and nothing else. */
const PALETTE = {
  up: 'success',
  down: 'error',
  new: 'info',
} as const;

type Props = {
  value: MetricValue;
  locale: string;
  /** `pill` for tiles, `text` under a table value. */
  variant?: 'pill' | 'text';
};

export function DeltaChip({ value, locale, variant = 'pill' }: Props) {
  const { t } = useTranslate('dashboard');
  const d = delta(value, locale);

  // Under a table value, a change that cannot be measured is just left out.
  if (variant === 'text' && d.kind === 'none') return null;

  const text = d.kind === 'new' ? t('dashboard.tagReport.delta.new') : 'text' in d ? d.text : '—';
  const color = d.kind in PALETTE ? PALETTE[d.kind as keyof typeof PALETTE] : null;

  return (
    <Box
      component="bdi"
      sx={[
        (theme) => ({
          typography: 'caption',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
          color: color ? theme.vars.palette[color].main : theme.vars.palette.text.disabled,
        }),
        variant === 'pill' &&
          ((theme) => ({
            px: 0.875,
            py: 0.125,
            borderRadius: 999,
            display: 'inline-flex',
            bgcolor: varAlpha(
              color ? theme.vars.palette[color].mainChannel : theme.vars.palette.grey['500Channel'],
              0.16
            ),
          })),
        variant === 'text' && { display: 'block' },
      ]}
    >
      {text}
    </Box>
  );
}
