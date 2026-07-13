import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import type { IconStatRowProps } from './types';

// ----------------------------------------------------------------------

/**
 * A single "icon + value + label" row. Generic building block for summary
 * panels: an optional tinted icon avatar, a bold value and a muted label
 * (order flips with `reverse`), plus an optional trailing `action` and a
 * dashed top `divider`. Copy is passed in — no translated strings here.
 */
export function IconStatRow({
  icon,
  iconColor = 'primary',
  label,
  value,
  reverse,
  action,
  divider,
  sx,
}: IconStatRowProps) {
  return (
    <Box sx={sx}>
      {divider && <Divider sx={{ mb: 2.5, borderStyle: 'dashed' }} />}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon && (
          <Avatar
            variant="rounded"
            sx={{
              width: 40,
              height: 40,
              color: `${iconColor}.main`,
              bgcolor: (theme) => varAlpha(theme.vars.palette[iconColor].mainChannel, 0.16),
            }}
          >
            {icon}
          </Avatar>
        )}

        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
          {reverse ? (
            <>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {label}
              </Typography>
              <Typography variant="subtitle1">{value}</Typography>
            </>
          ) : (
            <>
              <Typography variant="subtitle1">{value}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {label}
              </Typography>
            </>
          )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>
    </Box>
  );
}
