import type { PaletteColorKey } from 'src/theme/core';
import type { InspectionBoardTag, InspectionBoardParams } from 'src/api/inspection-board';

import { useMemo, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';
import { getLocalizedText } from 'src/utils/format-string';

import { useTranslate } from 'src/locales';
import { useInspectionTagProducts } from 'src/api/inspection-board';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { InspectionVipCount } from './inspection-vip-count';
import { inspectionScrollSx } from './inspection-scrollbar';
import { InspectionProductRow } from './inspection-product-row';
import { inspectionAccentTint, INSPECTION_DETAIL_ACCENTS } from './inspection-accents';

// ----------------------------------------------------------------------

interface InspectionTagCardProps {
  tag: InspectionBoardTag;
  accent: PaletteColorKey;
  /** The board's search, branch and sort, so loaded pages match the first one. */
  params: InspectionBoardParams;
  currency?: string;
  /** Cards start collapsed to their header; the board owns this so it can open one. */
  expanded: boolean;
  onToggle: VoidFunction;
  /**
   * Spotlights one product: set to a new value each time, so asking again re-scrolls to it.
   * Undefined when nothing on this card is highlighted.
   */
  highlight?: { productId: number; token: number };
}

export const InspectionTagCard = ({
  tag,
  accent,
  params,
  currency,
  expanded,
  onToggle,
  highlight,
}: InspectionTagCardProps) => {
  const { t, currentLang } = useTranslate('dashboard');
  const tr = (key: string, options?: Record<string, unknown>) =>
    t(`dashboard.inspectionBoard.tag.${key}`, options);
  const name = getLocalizedText(tag.name, currentLang.value);
  // About four products tall; the rest scroll inside the card.
  const scrollSx = inspectionScrollSx(useTheme(), { xs: 420, md: 460 });

  // Page 1 came with the board; later pages load only once "load more" is pressed.
  const [loadingMore, setLoadingMore] = useState(false);
  const {
    data: morePages,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInspectionTagProducts({ ...params, tag_id: tag.id }, loadingMore);

  // Page 1 plus whatever "load more" brought. A product can shift pages between requests,
  // so ids are deduped.
  const rows = useMemo(() => {
    const seen = new Set<number>();
    return [tag.products, ...(morePages?.pages.map((page) => page.data) ?? [])]
      .flat()
      .filter((product) => {
        if (seen.has(product.id)) return false;
        seen.add(product.id);
        return true;
      });
  }, [tag.products, morePages]);

  // While page 2 is still on its way there is no `hasNextPage` yet; keep the button
  // (spinning) rather than let it blink out. Pressed again after a failed page 2, it retries.
  const hasMore = loadingMore
    ? !morePages || !!hasNextPage
    : tag.products_count > tag.products.length;

  const handleLoadMore = () => {
    if (loadingMore) fetchNextPage();
    else setLoadingMore(true);
  };

  return (
    <Card
      sx={(theme) => ({
        overflow: 'hidden',
        transition: theme.transitions.create('box-shadow'),
        '&:hover': { boxShadow: theme.vars.customShadows.z16 },
      })}
    >
      {/* The header is the toggle. */}
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
        sx={(theme) => ({
          cursor: 'pointer',
          userSelect: 'none',
          '&:focus-visible': {
            outline: `2px solid ${theme.vars.palette[accent].main}`,
            outlineOffset: -4,
          },
          px: { xs: 2, md: 3 },
          py: 2.5,
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundImage: inspectionAccentTint(theme, accent),
          // The divider between header and products, only while there are products below.
          ...(expanded && { borderBottom: `dashed 1px ${theme.vars.palette.divider}` }),
        })}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ flex: '1 1 220px', minWidth: 0 }}
        >
          <Avatar
            src={tag.icon ?? undefined}
            alt={name}
            sx={(theme) => ({
              width: 56,
              height: 56,
              fontWeight: 700,
              borderRadius: 2,
              color: 'text.secondary',
              boxShadow: theme.vars.customShadows.z8,
              bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
              '& img': { objectFit: 'contain', p: 0.75, bgcolor: 'common.white' },
            })}
          >
            {name?.charAt(0)}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              {name}
            </Typography>
            <Label
              color={INSPECTION_DETAIL_ACCENTS.inInspection}
              variant="soft"
              startIcon={<Iconify icon="solar:box-minimalistic-bold" />}
              sx={{ mt: 0.75 }}
            >
              {tr('products', { count: tag.products_count })}
            </Label>
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, justifyContent: 'space-between' }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={(theme) => ({
                width: 44,
                height: 44,
                display: 'flex',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                color: `${INSPECTION_DETAIL_ACCENTS.audience}.main`,
                bgcolor: varAlpha(
                  theme.vars.palette[INSPECTION_DETAIL_ACCENTS.audience].mainChannel,
                  0.12
                ),
              })}
            >
              <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />
            </Box>
            <Box>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography variant="h5" component="p" sx={{ lineHeight: 1.1 }}>
                  {fNumber(tag.interested_users_count)}
                </Typography>
                <InspectionVipCount vip={tag.vip_users_count} total={tag.interested_users_count} />
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {tr('interestedUsers')}
              </Typography>
            </Box>
          </Stack>

          <Iconify
            icon="eva:arrow-ios-downward-fill"
            width={24}
            sx={(theme) => ({
              flexShrink: 0,
              color: 'text.secondary',
              transition: theme.transitions.create('transform'),
              ...(expanded && { transform: 'rotate(180deg)' }),
            })}
          />
        </Stack>
      </Box>

      {/* Unmounted while collapsed. Products loaded with "load more" survive it. */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {/* A long list scrolls inside the card; "load more" stays outside, always in reach. */}
        <Scrollbar sx={scrollSx}>
          {rows.map((product) => (
            <InspectionProductRow
              key={product.id}
              product={product}
              accent={accent}
              currency={currency}
              highlightToken={highlight?.productId === product.id ? highlight.token : undefined}
            />
          ))}
        </Scrollbar>

        {hasMore && (
          <Box
            sx={{
              p: 1.5,
              display: 'flex',
              justifyContent: 'center',
              borderTop: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
            }}
          >
            <Button
              fullWidth
              color={accent}
              loading={isFetching}
              onClick={handleLoadMore}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              {tr('loadMore', { shown: fNumber(rows.length), total: fNumber(tag.products_count) })}
            </Button>
          </Box>
        )}
      </Collapse>
    </Card>
  );
};
