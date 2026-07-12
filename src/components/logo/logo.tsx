import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

const MRKOON_GREEN = '#4ab969';

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {
  const theme = useTheme();

  const TEXT_PRIMARY = theme.vars.palette.text.primary;

  /*
    * OR using local (public folder)
    *
    const singleLogo = (
      <img
        alt="MRKOON logo"
        src={`${CONFIG.assetsDir}/logo/logo-single.svg`}
        width="100%"
        height="100%"
      />
    );

    const fullLogo = (
      <img
        alt="MRKOON logo"
        src={`${CONFIG.assetsDir}/logo/logo-full.svg`}
        width="100%"
        height="100%"
      />
    );
    *
    */

  const singleLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 623.62 566.93"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={MRKOON_GREEN}
        d="M503.76,283.47c-47.12,0-85.31,38.19-85.31,85.31s38.19,85.31,85.31,85.31,85.31-38.19,85.31-85.31-38.19-85.31-85.31-85.31ZM518.62,389.23h-29.72l-9.19-28.28,24.05-17.47,24.05,17.47-9.19,28.28Z"
      />
      <path
        fill={MRKOON_GREEN}
        d="M119.87,283.47c-47.12,0-85.32,38.19-85.32,85.31s38.2,85.31,85.32,85.31,85.31-38.19,85.31-85.31-38.19-85.31-85.31-85.31ZM148.25,397.15h-56.76v-56.75h56.76v56.75Z"
      />
      <path
        fill={MRKOON_GREEN}
        d="M215.85,112.84c-47.12,0-85.32,38.19-85.32,85.31s38.2,85.32,85.32,85.32,85.31-38.2,85.31-85.32-38.19-85.31-85.31-85.31ZM237.39,242.73h-43.09l-26.86-33.68,9.58-42.01,38.82-18.69,38.82,18.69,9.58,42.01-26.86,33.68Z"
      />
      <path
        fill={MRKOON_GREEN}
        d="M407.79,112.84c-47.12,0-85.31,38.19-85.31,85.31s38.19,85.32,85.31,85.32,85.31-38.2,85.31-85.32-38.19-85.31-85.31-85.31ZM424.1,226.4h-32.61l-16.32-28.25,16.32-28.25h32.61l16.32,28.25-16.32,28.25Z"
      />
      <circle fill={MRKOON_GREEN} cx="311.82" cy="368.77" r="85.31" />
    </svg>
  );

  const fullLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1842.52 566.93"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <g>
          <path
            fill={TEXT_PRIMARY}
            d="M878.3,352.34l-.21-87.74-43.03,72.28h-15.25l-42.82-70.4v85.85h-31.75v-146.22h27.99l54.73,90.87,53.9-90.87h27.78l.42,146.22h-31.75Z"
          />
          <path
            fill={TEXT_PRIMARY}
            d="M1037.9,352.34l-28.2-40.73h-31.13v40.73h-33.84v-146.22h63.3c39.06,0,63.5,20.26,63.5,53.06,0,21.93-11.07,38.02-30.08,46.16l32.8,47h-36.35ZM1006.14,233.69h-27.57v50.97h27.57c20.68,0,31.13-9.61,31.13-25.48s-10.45-25.49-31.13-25.49Z"
          />
          <path
            fill={TEXT_PRIMARY}
            d="M1151.52,294.9l-19.64,20.47v36.97h-33.63v-146.22h33.63v68.31l64.76-68.31h37.6l-60.58,65.17,64.13,81.05h-39.48l-46.79-57.45Z"
          />
          <path
            fill={TEXT_PRIMARY}
            d="M1734.27,206.12v146.22h-27.78l-72.9-88.78v88.78h-33.43v-146.22h27.99l72.69,88.78v-88.78h33.43Z"
          />
        </g>
        <path
          fill={TEXT_PRIMARY}
          d="M1318.16,234.44c24.89,0,45.13,20.25,45.13,45.13s-20.25,45.13-45.13,45.13-45.13-20.25-45.13-45.13,20.25-45.13,45.13-45.13M1318.16,199.37c-44.29,0-80.2,35.91-80.2,80.2s35.91,80.2,80.2,80.2,80.2-35.91,80.2-80.2-35.91-80.2-80.2-80.2h0Z"
        />
        <path
          fill={TEXT_PRIMARY}
          d="M1495.3,234.44c24.89,0,45.13,20.25,45.13,45.13s-20.25,45.13-45.13,45.13-45.13-20.25-45.13-45.13,20.25-45.13,45.13-45.13M1495.3,199.37c-44.29,0-80.2,35.91-80.2,80.2s35.91,80.2,80.2,80.2,80.2-35.91,80.2-80.2-35.91-80.2-80.2-80.2h0Z"
        />
      </g>
      <g>
        <path
          fill={MRKOON_GREEN}
          d="M577.46,283.47c-47.12,0-85.31,38.19-85.31,85.31s38.19,85.31,85.31,85.31,85.31-38.19,85.31-85.31-38.19-85.31-85.31-85.31ZM592.32,389.23h-29.72l-9.19-28.28,24.05-17.47,24.05,17.47-9.19,28.28Z"
        />
        <path
          fill={MRKOON_GREEN}
          d="M193.57,283.47c-47.12,0-85.32,38.19-85.32,85.31s38.2,85.31,85.32,85.31,85.31-38.19,85.31-85.31-38.19-85.31-85.31-85.31ZM221.94,397.15h-56.76v-56.75h56.76v56.75Z"
        />
        <path
          fill={MRKOON_GREEN}
          d="M289.54,112.84c-47.12,0-85.32,38.19-85.32,85.31s38.2,85.32,85.32,85.32,85.31-38.2,85.31-85.32-38.19-85.31-85.31-85.31ZM311.08,242.73h-43.09l-26.86-33.68,9.58-42.01,38.82-18.69,38.82,18.69,9.58,42.01-26.86,33.68Z"
        />
        <path
          fill={MRKOON_GREEN}
          d="M481.49,112.84c-47.12,0-85.31,38.19-85.31,85.31s38.19,85.32,85.31,85.32,85.31-38.2,85.31-85.32-38.19-85.31-85.31-85.31ZM497.79,226.4h-32.61l-16.32-28.25,16.32-28.25h32.61l16.32,28.25-16.32,28.25Z"
        />
        <circle fill={MRKOON_GREEN} cx="385.51" cy="368.77" r="85.31" />
      </g>
    </svg>
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 40,
          height: 40,
          ...(!isSingle && { width: 120, height: 36 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
