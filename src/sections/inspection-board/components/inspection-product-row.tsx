import type { PaletteColorKey } from 'src/theme/core';
import type { IconifyName } from 'src/components/iconify';
import type { InspectionBoardProduct } from 'src/api/inspection-board';

import { useRef, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { keyframes } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';
import { fTruncate, getLocalizedText } from 'src/utils/format-string';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { InspectionWait } from './inspection-wait';
import { INSPECTION_DETAIL_ACCENTS } from './inspection-accents';
import { fInspectionPrice, inspectionTargetTotal } from '../utils/inspection-board';

// ----------------------------------------------------------------------

/** Longer names are cut, and the full name shows on hover. */
const NAME_MAX_LENGTH = 40;

// A few soft pulses so the eye finds the row, then it settles into the highlight.
const spotlight = keyframes`
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
`;

/** How long after the card opens to scroll, so the row is measured at its final place. */
const SCROLL_AFTER_EXPAND_MS = 350;

/** A figure in the target lines, standing out from its label. */
const TargetAmount = ({ children }: { children: React.ReactNode }) => (
  <Box component="span" sx={{ color: 'text.primary', fontWeight: 'fontWeightSemiBold' }}>
    {children}
  </Box>
);

interface InspectionStatProps {
  icon: IconifyName;
  label: string;
  value: number;
  /** What the number counts, shown on hover. */
  info: string;
  color: PaletteColorKey;
}

/**
 * One of a product's counts: icon, name, figure and an info icon. Hovering the pill shows the
 * description. A zero stays grey, so colour only marks the counts that have something.
 */
const InspectionStat = ({ icon, label, value, info, color }: InspectionStatProps) => {
  const active = value > 0;

  return (
    <Tooltip arrow title={info}>
      <Box
        aria-label={`${label}: ${value}. ${info}`}
        sx={(theme) => {
          const channel = active
            ? theme.vars.palette[color].mainChannel
            : theme.vars.palette.grey['500Channel'];
          return {
            height: 28,
            px: 1,
            gap: 0.75,
            borderRadius: 1,
            alignItems: 'center',
            display: 'inline-flex',
            whiteSpace: 'nowrap',
            bgcolor: varAlpha(channel, 0.08),
            border: `1px solid ${varAlpha(channel, 0.16)}`,
          };
        }}
      >
        <Iconify
          icon={icon}
          width={16}
          sx={(theme) => ({
            flexShrink: 0,
            color: active ? `${color}.main` : 'text.disabled',
            ...(active && theme.applyStyles('dark', { color: `${color}.light` })),
          })}
        />
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          {label}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ lineHeight: 1, color: active ? 'text.primary' : 'text.disabled' }}
        >
          {fNumber(value)}
        </Typography>
        <Iconify
          icon="solar:info-circle-linear"
          width={14}
          sx={{ flexShrink: 0, color: 'text.disabled' }}
        />
      </Box>
    </Tooltip>
  );
};

interface InspectionProductRowProps {
  product: InspectionBoardProduct;
  accent: PaletteColorKey;
  currency?: string;
  /** Set while this row is highlighted; each new value scrolls it into view again. */
  highlightToken?: number;
}

export const InspectionProductRow = ({
  product,
  accent,
  currency = '',
  highlightToken,
}: InspectionProductRowProps) => {
  const { t, currentLang } = useTranslate('dashboard');
  const tr = (key: string) => t(`dashboard.inspectionBoard.product.${key}`);
  const rowRef = useRef<HTMLDivElement>(null);
  const highlighted = highlightToken != null;

  useEffect(() => {
    if (highlightToken == null) return undefined;
    const timer = setTimeout(
      () => rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      SCROLL_AFTER_EXPAND_MS
    );
    return () => clearTimeout(timer);
  }, [highlightToken]);

  const name = getLocalizedText(product.name, currentLang.value);
  const shortName = fTruncate(name, NAME_MAX_LENGTH);
  const targetPrice = fInspectionPrice(product.target_price, currency);
  const targetTotal = fInspectionPrice(inspectionTargetTotal(product), currency);

  return (
    <Box
      ref={rowRef}
      sx={(theme) => ({
        position: 'relative',
        px: { xs: 2, md: 3 },
        py: 2,
        gap: { xs: 1.5, md: 3 },
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.2fr) minmax(0, 1fr)' },
        transition: theme.transitions.create('background-color'),
        '&:not(:last-of-type)': {
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
        },
        '&:hover': {
          bgcolor: varAlpha(theme.vars.palette[accent].mainChannel, 0.04),
        },
        ...(highlighted && {
          bgcolor: varAlpha(theme.vars.palette[accent].mainChannel, 0.12),
          '&::after': {
            content: '""',
            inset: 0,
            pointerEvents: 'none',
            position: 'absolute',
            border: `2px solid ${theme.vars.palette[accent].main}`,
            animation: `${spotlight} 1s ease-in-out 3`,
          },
        }),
      })}
    >
      <Stack spacing={1.25} sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
          <Avatar
            variant="rounded"
            src={product.logo ?? undefined}
            alt={name}
            sx={(theme) => ({
              width: 52,
              height: 52,
              borderRadius: 1.5,
              bgcolor: varAlpha(theme.vars.palette[accent].mainChannel, 0.12),
              color: `${accent}.main`,
              border: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            })}
          >
            <Iconify icon="solar:box-bold-duotone" width={26} />
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            {/* An empty title keeps the tooltip off for a name that was not cut. */}
            <Tooltip arrow title={shortName !== name ? name : ''}>
              <Typography noWrap variant="subtitle1">
                {shortName}
              </Typography>
            </Tooltip>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              #{product.id}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
          <InspectionStat
            icon="solar:clipboard-list-bold-duotone"
            label={tr('inspections')}
            value={product.pay_requests_count ?? 0}
            info={tr('inspectionsInfo')}
            color={INSPECTION_DETAIL_ACCENTS.inspections}
          />
          <InspectionStat
            icon="solar:shield-check-bold-duotone"
            label={tr('insurances')}
            value={product.pay_requests_paid_count ?? 0}
            info={tr('insurancesInfo')}
            color={INSPECTION_DETAIL_ACCENTS.insurances}
          />
        </Stack>
      </Stack>

      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Box>
          <Label color="warning" variant="soft" startIcon={<Iconify icon="solar:eye-scan-bold" />}>
            {getLocalizedText(product.status?.name, currentLang.value) || tr('status')}
          </Label>
        </Box>
        <InspectionWait elapsedSeconds={product.inspection_elapsed_seconds} />
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Iconify
              icon="solar:tag-price-bold-duotone"
              width={18}
              sx={{ flexShrink: 0, color: 'text.disabled' }}
            />
            <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
              {targetPrice ? (
                <>
                  {tr('target')}: <TargetAmount>{targetPrice}</TargetAmount> {tr('perUnit')}
                </>
              ) : (
                tr('noTarget')
              )}
            </Typography>
          </Stack>
          {/* The total, lined up under the price above (past the 18px icon and its gap). */}
          {targetTotal && (
            <Tooltip
              arrow
              title={`${targetPrice} × ${Number(product.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            >
              <Typography
                variant="body2"
                noWrap
                sx={{ pl: 3, width: 'fit-content', maxWidth: 1, color: 'text.secondary' }}
              >
                {tr('total')}: <TargetAmount>{targetTotal}</TargetAmount>
              </Typography>
            </Tooltip>
          )}
        </Box>
      </Stack>
    </Box>
  );
};
