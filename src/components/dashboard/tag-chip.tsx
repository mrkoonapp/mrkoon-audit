import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';

import { tagChipColors } from 'src/theme/theme-config';

// ----------------------------------------------------------------------

export type TagChipProps = {
  label: ReactNode;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
};

/**
 * Pill-shaped category tag (icon + label) with the fixed dark background/border
 * defined in `tagChipColors`. Generic — used for the "tag" column in list
 * widgets (e.g. Participated Clients).
 */
export function TagChip({ label, icon, sx }: TagChipProps) {
  return (
    <Box
      sx={[
        {
          gap: 0.75,
          p: '10px',
          minWidth: 0,
          borderRadius: '40px',
          display: 'inline-flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          typography: 'caption',
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
          bgcolor: tagChipColors.bg,
          border: `solid 1px ${tagChipColors.border}`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {icon && (
        <Box sx={{ display: 'inline-flex', flexShrink: 0, '& > *': { width: 16, height: 16 } }}>
          {icon}
        </Box>
      )}

      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </Box>
    </Box>
  );
}
