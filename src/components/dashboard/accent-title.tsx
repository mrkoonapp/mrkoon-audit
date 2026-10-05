import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { AccentTitleProps } from './types';

// ----------------------------------------------------------------------

/**
 * Widget title preceded by a small colored pill (the "accent" bar used by the
 * overview design). The accent is any CSS color, usually a translucent tint.
 */
export function AccentTitle({ title, accent, sx }: AccentTitleProps) {
  return (
    <Box
      sx={[{ gap: 1.5, display: 'flex', alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Box sx={{ width: 10, height: 28, flexShrink: 0, borderRadius: 1, bgcolor: accent }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }} noWrap>
        {title}
      </Typography>
    </Box>
  );
}
