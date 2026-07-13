import type { SvgIconProps } from '@mui/material/SvgIcon';

import { memo } from 'react';

import SvgIcon from '@mui/material/SvgIcon';

// ----------------------------------------------------------------------

function ProductBidsIllustration({ sx, ...other }: SvgIconProps) {
  return (
    <SvgIcon
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      sx={[
        (theme) => ({
          '--primary-lighter': theme.vars.palette.primary.lighter,
          '--primary-light': theme.vars.palette.primary.light,
          '--primary-main': theme.vars.palette.primary.main,
          '--primary-dark': theme.vars.palette.primary.dark,
          '--primary-darker': theme.vars.palette.primary.darker,
          width: 120,
          maxWidth: 1,
          flexShrink: 0,
          height: 'auto',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Shadow circle */}
      <circle cx="100" cy="100" r="72" fill="#919EAB" fillOpacity="0.24" />

      {/* Background circle */}
      <circle cx="100" cy="100" r="68" fill="var(--primary-lighter)" />

      {/* Base/sound block */}
      <rect x="58" y="140" width="84" height="16" rx="4" fill="var(--primary-dark)" />
      <rect x="62" y="140" width="76" height="12" rx="3" fill="var(--primary-main)" />

      {/* Gavel handle */}
      <rect
        x="60"
        y="56"
        width="12"
        height="72"
        rx="6"
        fill="var(--primary-dark)"
        transform="rotate(-35 66 92)"
      />

      {/* Gavel handle highlight */}
      <rect
        x="63"
        y="60"
        width="6"
        height="64"
        rx="3"
        fill="var(--primary-main)"
        transform="rotate(-35 66 92)"
      />

      {/* Gavel head */}
      <rect
        x="50"
        y="50"
        width="52"
        height="22"
        rx="6"
        fill="var(--primary-darker)"
        transform="rotate(-35 76 61)"
      />

      {/* Gavel head highlight */}
      <rect
        x="54"
        y="54"
        width="44"
        height="14"
        rx="4"
        fill="var(--primary-dark)"
        transform="rotate(-35 76 61)"
      />

      {/* Gavel head bands */}
      <rect
        x="56"
        y="50"
        width="4"
        height="22"
        rx="2"
        fill="var(--primary-darker)"
        transform="rotate(-35 58 61)"
      />
      <rect
        x="92"
        y="50"
        width="4"
        height="22"
        rx="2"
        fill="var(--primary-darker)"
        transform="rotate(-35 94 61)"
      />

      {/* Impact lines */}
      <rect
        x="108"
        y="126"
        width="18"
        height="3"
        rx="1.5"
        fill="var(--primary-main)"
        opacity="0.6"
      />
      <rect
        x="114"
        y="120"
        width="14"
        height="3"
        rx="1.5"
        fill="var(--primary-main)"
        opacity="0.4"
      />
      <rect
        x="118"
        y="114"
        width="10"
        height="3"
        rx="1.5"
        fill="var(--primary-main)"
        opacity="0.3"
      />

      {/* Dollar signs decoration */}
      <text
        x="142"
        y="90"
        fill="var(--primary-main)"
        fontSize="18"
        fontWeight="bold"
        fontFamily="sans-serif"
        opacity="0.5"
      >
        $
      </text>
      <text
        x="150"
        y="106"
        fill="var(--primary-main)"
        fontSize="14"
        fontWeight="bold"
        fontFamily="sans-serif"
        opacity="0.35"
      >
        $
      </text>
      <text
        x="136"
        y="74"
        fill="var(--primary-main)"
        fontSize="12"
        fontWeight="bold"
        fontFamily="sans-serif"
        opacity="0.3"
      >
        $
      </text>
    </SvgIcon>
  );
}

export default memo(ProductBidsIllustration);
