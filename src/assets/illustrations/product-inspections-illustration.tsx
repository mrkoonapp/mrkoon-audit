import type { SvgIconProps } from '@mui/material/SvgIcon';

import { memo } from 'react';

import SvgIcon from '@mui/material/SvgIcon';

// ----------------------------------------------------------------------

function ProductInspectionsIllustration({ sx, ...other }: SvgIconProps) {
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

      {/* Clipboard body */}
      <rect x="58" y="52" width="72" height="100" rx="8" fill="#FFFFFF" />
      <rect x="62" y="56" width="64" height="92" rx="6" fill="#FFFFFF" />

      {/* Clipboard border */}
      <rect
        x="58"
        y="52"
        width="72"
        height="100"
        rx="8"
        fill="none"
        stroke="var(--primary-main)"
        strokeWidth="2.5"
      />

      {/* Clipboard top clip */}
      <rect x="82" y="44" width="24" height="16" rx="4" fill="var(--primary-dark)" />
      <rect x="86" y="48" width="16" height="8" rx="3" fill="var(--primary-lighter)" />

      {/* Checklist item 1 - checked */}
      <rect x="70" y="72" width="16" height="16" rx="4" fill="var(--primary-main)" />
      <path
        d="M74 80l3 3 5-6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="92" y="76" width="28" height="4" rx="2" fill="#C4CDD5" />

      {/* Checklist item 2 - checked */}
      <rect x="70" y="96" width="16" height="16" rx="4" fill="var(--primary-main)" />
      <path
        d="M74 104l3 3 5-6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="92" y="100" width="24" height="4" rx="2" fill="#C4CDD5" />

      {/* Checklist item 3 - unchecked */}
      <rect
        x="70"
        y="120"
        width="16"
        height="16"
        rx="4"
        fill="none"
        stroke="var(--primary-light)"
        strokeWidth="2"
      />
      <rect x="92" y="124" width="20" height="4" rx="2" fill="#DFE3E8" />

      {/* Magnifying glass */}
      <circle
        cx="140"
        cy="136"
        r="20"
        fill="var(--primary-lighter)"
        stroke="var(--primary-dark)"
        strokeWidth="4"
      />
      <circle cx="140" cy="136" r="14" fill="#FFFFFF" opacity="0.6" />

      {/* Magnifying glass handle */}
      <rect
        x="154"
        y="150"
        width="8"
        height="24"
        rx="4"
        fill="var(--primary-darker)"
        transform="rotate(-45 158 162)"
      />

      {/* Magnifying glass shine */}
      <path
        d="M132 128a12 12 0 016-4"
        fill="none"
        stroke="var(--primary-light)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Check mark inside magnifier */}
      <path
        d="M133 136l4 4 8-9"
        fill="none"
        stroke="var(--primary-main)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export default memo(ProductInspectionsIllustration);
