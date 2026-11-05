import type { Theme } from '@mui/material/styles';
import type { ResponsiveStyleValue } from '@mui/system';

import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

/**
 * A card's product list: capped at `maxHeight`, with a slim rounded thumb that fills out
 * under the pointer.
 *
 * Pass the result to `Scrollbar` as a plain object, never wrapped in a theme callback.
 */
export const inspectionScrollSx = (
  theme: Theme,
  maxHeight: ResponsiveStyleValue<number | string>
) => {
  const thumb = theme.vars.palette.grey['500Channel'];

  return {
    maxHeight,
    '& .simplebar-track.simplebar-vertical': { width: 12, my: 1 },
    '& .simplebar-scrollbar:before': {
      top: 2,
      bottom: 2,
      left: 4,
      right: 4,
      opacity: 1,
      borderRadius: 8,
      backgroundImage: `linear-gradient(180deg, ${varAlpha(thumb, 0.48)}, ${varAlpha(thumb, 0.24)})`,
      boxShadow: `0 0 0 1px ${varAlpha(thumb, 0.08)}`,
      transition: theme.transitions.create(['left', 'right'], {
        duration: theme.transitions.duration.shorter,
      }),
    },
    '& .simplebar-track.simplebar-vertical:hover .simplebar-scrollbar:before, & .simplebar-dragging .simplebar-scrollbar:before':
      {
        left: 2.5,
        right: 2.5,
        backgroundImage: `linear-gradient(180deg, ${varAlpha(thumb, 0.72)}, ${varAlpha(thumb, 0.48)})`,
      },
  };
};
