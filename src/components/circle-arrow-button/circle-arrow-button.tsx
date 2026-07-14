import type { IconifyName } from 'src/components/iconify';
import type { IconButtonProps } from '@mui/material/IconButton';

import { varAlpha } from 'minimal-shared/utils';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type CircleArrowButtonProps = IconButtonProps & {
  /** Iconify icon name. Defaults to a right-pointing arrow. */
  icon?: IconifyName;
};

/**
 * Circular icon button with a directional arrow, used as a "next / view / go"
 * affordance on dashboard cards. Background is a subtle translucent grey
 * (`#919EAB33`) that reads well on both light and dark surfaces.
 */
export function CircleArrowButton({
  icon = 'eva:arrow-forward-fill',
  sx,
  ...other
}: CircleArrowButtonProps) {
  return (
    <IconButton
      sx={[
        (theme) => ({
          color: 'text.primary',
          bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.2),
          '&:hover': {
            bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.32),
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify icon={icon} />
    </IconButton>
  );
}
