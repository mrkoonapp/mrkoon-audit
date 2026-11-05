import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { keyframes } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/** The admin dashboard's VIP badge gold, so a VIP count reads the same in both apps. */
const VIP_GOLD = {
  light: '#FFF3C4',
  main: '#E8B833',
  dark: '#A8740A',
  text: '#5A3B00',
};

// In Arabic the RTL plugin mirrors both the overlay's `left` and these translateX values, so
// it sweeps the other way by itself.
const shine = keyframes`
  0%, 70% { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(220%) skewX(-20deg); }
`;

/**
 * Set as `backgroundImage`: the RTL plugin reads the first percentage after a `background:`
 * shorthand as a position and mirrors it, which scrambles the colour stops.
 */
const VIP_GOLD_GRADIENT = `linear-gradient(135deg, ${VIP_GOLD.light} 0%, ${VIP_GOLD.main} 45%, ${VIP_GOLD.dark} 100%)`;

interface InspectionVipCountProps {
  /** How many of the tag's interested users are VIP. */
  vip: number;
  /** All the tag's interested users, for the tooltip. */
  total: number;
}

/**
 * How many of a tag's interested users are VIP: a gold crown pill with the count in it.
 * Without any VIP it stays a quiet grey outline, so gold always means "there are some".
 */
export const InspectionVipCount = ({ vip, total }: InspectionVipCountProps) => {
  const { t } = useTranslate('dashboard');
  const hasVip = vip > 0;

  return (
    <Tooltip
      arrow
      title={t('dashboard.inspectionBoard.tag.vipTooltip', {
        vip: fNumber(vip),
        total: fNumber(total),
      })}
    >
      <Box
        component="span"
        sx={(theme) => ({
          position: 'relative',
          overflow: 'hidden',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          height: 22,
          flexShrink: 0,
          borderRadius: 999,
          fontSize: 11.5,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: 0.4,
          whiteSpace: 'nowrap',
          ...(hasVip
            ? {
                color: VIP_GOLD.text,
                backgroundImage: VIP_GOLD_GRADIENT,
                boxShadow: `0 0 0 1px ${VIP_GOLD.dark}40, 0 2px 8px ${VIP_GOLD.main}66`,
                '&::after': {
                  content: "''",
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '40%',
                  height: '100%',
                  backgroundImage:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)',
                  animation: `${shine} 3.5s ease-in-out infinite`,
                  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                },
              }
            : {
                color: 'text.disabled',
                border: `1px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
              }),
        })}
      >
        <Iconify icon="mdi:crown" width={13} />
        {t('dashboard.inspectionBoard.tag.vipCount', { vip: fNumber(vip) })}
      </Box>
    </Tooltip>
  );
};
