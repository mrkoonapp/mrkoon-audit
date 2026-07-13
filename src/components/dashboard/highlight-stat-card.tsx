import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import type { HighlightStatCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Accent KPI card (the gold / green tiles in the overview). Either paint an
 * explicit fixed background + border (`bgColor` / `borderColor`) or fall back to
 * a soft tint derived from the `color` palette key. Decorated with a `pattern`
 * image cropped into the bottom-right corner, or an `icon` watermark up top.
 * Label + value are passed in.
 */
export function HighlightStatCard({
  label,
  value,
  color = 'warning',
  bgColor,
  borderColor,
  textColor,
  pattern,
  icon,
  sx,
}: HighlightStatCardProps) {
  const hasFixedBg = Boolean(bgColor);

  return (
    <Card
      sx={[
        (theme) => ({
          p: 3,
          height: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'center',
          ...(borderColor && { border: `solid 1px ${borderColor}` }),
          ...(hasFixedBg
            ? {
                bgcolor: bgColor,
                color: textColor ?? theme.vars.palette[color].lighter,
              }
            : {
                color: theme.vars.palette[color].darker,
                bgcolor: varAlpha(theme.vars.palette[color].mainChannel, 0.12),
                ...theme.applyStyles('dark', {
                  color: theme.vars.palette[color].lighter,
                  bgcolor: varAlpha(theme.vars.palette[color].mainChannel, 0.2),
                }),
              }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {pattern ? (
        <Box
          component="img"
          src={pattern}
          alt=""
          aria-hidden
          sx={{
            width: 150,
            height: 150,
            right: -24,
            bottom: -24,
            position: 'absolute',
            pointerEvents: 'none',
          }}
        />
      ) : (
        icon && (
          <Box
            sx={(theme) => ({
              top: -8,
              right: -8,
              position: 'absolute',
              color: varAlpha(theme.vars.palette[color].mainChannel, 0.24),
              '& > *': { width: 96, height: 96 },
            })}
          >
            {icon}
          </Box>
        )
      )}

      <Typography variant="subtitle2" sx={{ opacity: 0.8, position: 'relative' }}>
        {label}
      </Typography>

      <Typography variant="h3" sx={{ mt: 1, position: 'relative' }}>
        {value}
      </Typography>
    </Card>
  );
}
