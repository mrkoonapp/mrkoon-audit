import type { Theme } from '@mui/material/styles';
import type { PaletteColorKey } from 'src/theme/core';

import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

/** Every Top Tag card shares one accent: a board of collapsed cards in a rainbow was loud. */
export const INSPECTION_TAG_ACCENT: PaletteColorKey = 'primary';

/**
 * The small details inside a Top Tag card each get their own colour. The in-inspection count
 * is the same amber as the «معاينة» status label on each row.
 */
export const INSPECTION_DETAIL_ACCENTS = {
  inInspection: 'warning',
  audience: 'info',
  // A product's pay requests, and the ones whose insurance is paid.
  inspections: 'info',
  insurances: 'success',
} as const satisfies Record<string, PaletteColorKey>;

/**
 * The summary cards' colours. Amber and red carry their usual meaning on the two stats they
 * mark: how many are waiting, and how many are overdue.
 */
export const INSPECTION_STAT_ACCENTS = {
  products: 'warning',
  tags: 'info',
  overdue: 'error',
  longest: 'primary',
  highest: 'secondary',
  total: 'success',
} as const satisfies Record<string, PaletteColorKey>;

/** A faint accent wash over the card's own surface, fading out by 60%. */
export const inspectionAccentTint = (theme: Theme, accent: PaletteColorKey) => {
  const channel = theme.vars.palette[accent].mainChannel;
  return `linear-gradient(135deg, ${varAlpha(channel, 0.1)} 0%, ${varAlpha(channel, 0)} 60%)`;
};
