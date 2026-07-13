import type { SvgIconProps } from '@mui/material/SvgIcon';

import { memo } from 'react';

import SvgIcon from '@mui/material/SvgIcon';

// ----------------------------------------------------------------------

function ProductDurationIllustration({ sx, ...other }: SvgIconProps) {
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

      {/* Clock body */}
      <circle cx="100" cy="104" r="52" fill="#FFFFFF" />
      <circle cx="100" cy="104" r="48" fill="var(--primary-lighter)" />
      <circle cx="100" cy="104" r="44" fill="#FFFFFF" />

      {/* Clock rim */}
      <circle cx="100" cy="104" r="46" fill="none" stroke="var(--primary-main)" strokeWidth="3" />

      {/* Hour markers */}
      <rect x="98" y="62" width="4" height="10" rx="2" fill="var(--primary-dark)" />
      <rect x="98" y="136" width="4" height="10" rx="2" fill="var(--primary-dark)" />
      <rect x="140" y="102" width="10" height="4" rx="2" fill="var(--primary-dark)" />
      <rect x="50" y="102" width="10" height="4" rx="2" fill="var(--primary-dark)" />

      {/* Small markers */}
      <circle cx="121" cy="70" r="2.5" fill="var(--primary-light)" />
      <circle cx="134" cy="83" r="2.5" fill="var(--primary-light)" />
      <circle cx="134" cy="125" r="2.5" fill="var(--primary-light)" />
      <circle cx="121" cy="138" r="2.5" fill="var(--primary-light)" />
      <circle cx="79" cy="138" r="2.5" fill="var(--primary-light)" />
      <circle cx="66" cy="125" r="2.5" fill="var(--primary-light)" />
      <circle cx="66" cy="83" r="2.5" fill="var(--primary-light)" />
      <circle cx="79" cy="70" r="2.5" fill="var(--primary-light)" />

      {/* Hour hand */}
      <rect
        x="97.5"
        y="80"
        width="5"
        height="28"
        rx="2.5"
        fill="var(--primary-darker)"
        transform="rotate(30 100 104)"
      />

      {/* Minute hand */}
      <rect
        x="98"
        y="70"
        width="4"
        height="36"
        rx="2"
        fill="var(--primary-dark)"
        transform="rotate(-45 100 104)"
      />

      {/* Center dot */}
      <circle cx="100" cy="104" r="4" fill="var(--primary-darker)" />
      <circle cx="100" cy="104" r="2" fill="#FFFFFF" />

      {/* Top crown */}
      <rect x="95" y="44" width="10" height="14" rx="5" fill="var(--primary-dark)" />

      {/* Clock bells */}
      <circle cx="72" cy="58" r="10" fill="var(--primary-main)" />
      <circle cx="128" cy="58" r="10" fill="var(--primary-main)" />
      <circle cx="72" cy="58" r="7" fill="var(--primary-dark)" />
      <circle cx="128" cy="58" r="7" fill="var(--primary-dark)" />

      {/* Bell connectors */}
      <rect
        x="76"
        y="62"
        width="3"
        height="10"
        rx="1.5"
        fill="var(--primary-dark)"
        transform="rotate(-30 77.5 67)"
      />
      <rect
        x="121"
        y="62"
        width="3"
        height="10"
        rx="1.5"
        fill="var(--primary-dark)"
        transform="rotate(30 122.5 67)"
      />
    </SvgIcon>
  );
}

export default memo(ProductDurationIllustration);
