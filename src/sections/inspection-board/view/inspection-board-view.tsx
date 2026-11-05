import type {
  InspectionBoardSort,
  InspectionBoardParams,
  InspectionProductType,
} from 'src/api/inspection-board';

import { useDebounce } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme, type Theme } from '@mui/material/styles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getLocalizedText } from 'src/utils/format-string';

import { useTranslate } from 'src/locales';
import { useAppSelector } from 'src/store';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetInspectionBoard } from 'src/api/inspection-board';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CircleArrowButton } from 'src/components/circle-arrow-button';

import { InspectionTagCard } from '../components/inspection-tag-card';
import { INSPECTION_TAG_ACCENT } from '../components/inspection-accents';
import { InspectionBoardSummary } from '../components/inspection-board-summary';
import { InspectionBoardSkeleton } from '../components/inspection-board-skeleton';
import {
  INSPECTION_BOARD_SORT,
  findHighestTargetProduct,
  findLongestWaitingProduct,
  type InspectionSpotlightProduct,
} from '../utils/inspection-board';

// ----------------------------------------------------------------------

/** How long a spotlight's product stays highlighted after its tile is clicked. */
const HIGHLIGHT_MS = 8000;

type Spotlight = 'longest' | 'highest';

/** The order that puts each summary spotlight's product first in a card. */
const SPOTLIGHT_SORT: Record<Spotlight, InspectionBoardSort> = {
  longest: INSPECTION_BOARD_SORT.LONGEST_WAIT,
  highest: INSPECTION_BOARD_SORT.HIGHEST_TARGET_VALUE,
};

const SORT_OPTIONS: { value: InspectionBoardSort; key: string }[] = [
  { value: INSPECTION_BOARD_SORT.LONGEST_WAIT, key: 'longestWait' },
  { value: INSPECTION_BOARD_SORT.HIGHEST_TARGET_VALUE, key: 'highestTarget' },
];

/** Product types, as `type` on the board: 2 = Scrap, 1 = Stagnant. */
const PRODUCT_TYPES: { value: InspectionProductType; key: 'scraps' | 'stagnant' }[] = [
  { value: 2, key: 'scraps' },
  { value: 1, key: 'stagnant' },
];

/**
 * The admin dashboard's Inspection products board, read-only: every product in inspection,
 * grouped by its Top Tags, with how long each has waited. The counts are the whole audience,
 * never one sales agent's buyers. The country is the signed-in admin's, sent as the `Country`
 * header like every request.
 */
export function InspectionBoardView() {
  const router = useRouter();
  const theme = useTheme();
  const { t, currentLang } = useTranslate('dashboard');
  const tr = (key: string) => t(`dashboard.inspectionBoard.${key}`);

  const country = useAppSelector((state) => state.user.country);
  const currency = getLocalizedText(country?.currency_name, currentLang.value) || undefined;

  const [type, setType] = useState<InspectionProductType>(2);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [sort, setSort] = useState<InspectionBoardSort>(INSPECTION_BOARD_SORT.LONGEST_WAIT);

  // `sort` goes to the board and to every card's "load more", so a card's later pages
  // continue in its order.
  const params = useMemo<InspectionBoardParams>(
    () => ({ type, sort, search_text: debouncedSearch.trim() }),
    [type, sort, debouncedSearch]
  );

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } =
    useGetInspectionBoard(params);

  const tags = useMemo(() => data?.tags ?? [], [data]);

  // Two columns from xl up, one below.
  const columnCount = useMediaQuery((t2: Theme) => t2.breakpoints.up('xl')) ? 2 : 1;
  const tagColumns = useMemo(
    () =>
      Array.from({ length: columnCount }, (_, column) =>
        tags.filter((_tag, index) => index % columnCount === column)
      ),
    [tags, columnCount]
  );

  // Cards start collapsed; the board holds which are open so a spotlight can open one.
  const [expandedTagIds, setExpandedTagIds] = useState<Set<number>>(() => new Set());

  const toggleTag = useCallback((tagId: number) => {
    setExpandedTagIds((previous) => {
      const next = new Set(previous);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  }, []);

  // The products the two summary spotlights point at, when they are on a loaded page.
  const longest = useMemo(
    () => findLongestWaitingProduct(tags, data?.summary?.longest_elapsed_seconds),
    [tags, data?.summary?.longest_elapsed_seconds]
  );
  const highest = useMemo(
    () => findHighestTargetProduct(tags, data?.summary?.highest_target_value),
    [tags, data?.summary?.highest_target_value]
  );

  const [highlight, setHighlight] = useState<{
    tagId: number;
    productId: number;
    token: number;
  } | null>(null);

  useEffect(() => {
    if (!highlight) return undefined;
    const timer = setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlight]);

  const spotlightProduct = useCallback((target: InspectionSpotlightProduct) => {
    setExpandedTagIds((previous) => new Set(previous).add(target.tagId));
    // A fresh token each time, so a second click scrolls to it again.
    setHighlight({ tagId: target.tagId, productId: target.productId, token: Date.now() });
  }, []);

  // Set while the board re-sorts so a spotlight's product comes into a loaded page.
  const [pendingSpotlight, setPendingSpotlight] = useState<Spotlight | null>(null);

  /**
   * Opens the card holding a spotlight's product and highlights it. When the product sits on a
   * page not loaded yet, the board is sorted by that figure, which puts it first in a card, and
   * it is highlighted on arrival.
   */
  const handleShow = useCallback(
    (spotlight: Spotlight) => {
      const target = spotlight === 'longest' ? longest : highest;
      if (target) {
        spotlightProduct(target);
        return;
      }
      setSort(SPOTLIGHT_SORT[spotlight]);
      setPendingSpotlight(spotlight);
    },
    [longest, highest, spotlightProduct]
  );

  useEffect(() => {
    // Wait for the re-sorted board itself, not the previous one kept on screen meanwhile.
    if (!pendingSpotlight || !data || isPlaceholderData) return;
    const target = pendingSpotlight === 'longest' ? longest : highest;
    if (target) spotlightProduct(target);
    setPendingSpotlight(null);
  }, [pendingSpotlight, data, isPlaceholderData, longest, highest, spotlightProduct]);

  const renderContent = () => {
    if (isPending) return <InspectionBoardSkeleton />;

    if (isError) {
      return (
        <EmptyContent
          filled
          title={tr('error')}
          sx={{ py: 10 }}
          action={
            <IconButton color="primary" onClick={() => refetch()} sx={{ mt: 2 }}>
              <Iconify icon="solar:restart-bold" />
            </IconButton>
          }
        />
      );
    }

    return (
      <Stack spacing={3} sx={{ opacity: isPlaceholderData ? 0.5 : 1, transition: 'opacity .2s' }}>
        {data?.summary && (
          <InspectionBoardSummary
            summary={data.summary}
            currency={currency}
            onShowLongest={
              data.summary.longest_elapsed_seconds != null ? () => handleShow('longest') : undefined
            }
            onShowHighest={
              data.summary.highest_target_value != null ? () => handleShow('highest') : undefined
            }
          />
        )}

        {tags.length ? (
          // Independent columns, cards dealt across them in order. Opening a card only pushes
          // down the cards under it in its own column.
          <Stack direction="row" spacing={3} alignItems="flex-start">
            {tagColumns.map((column, columnIndex) => (
              <Stack key={columnIndex} spacing={3} sx={{ flex: 1, minWidth: 0 }}>
                {column.map((tag) => (
                  <InspectionTagCard
                    // Keyed by the filters too: a new search, type or sort starts each card back
                    // at its first page instead of carrying "load more" over to a different list.
                    key={`${tag.id}-${params.type}-${params.search_text}-${params.sort}`}
                    tag={tag}
                    accent={INSPECTION_TAG_ACCENT}
                    params={params}
                    currency={currency}
                    expanded={expandedTagIds.has(tag.id)}
                    onToggle={() => toggleTag(tag.id)}
                    highlight={
                      highlight?.tagId === tag.id
                        ? { productId: highlight.productId, token: highlight.token }
                        : undefined
                    }
                  />
                ))}
              </Stack>
            ))}
          </Stack>
        ) : (
          <EmptyContent
            filled
            title={tr('empty.title')}
            description={tr('empty.description')}
            sx={{ py: 10 }}
          />
        )}
      </Stack>
    );
  };

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 5 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <CircleArrowButton
          icon="eva:arrow-ios-back-fill"
          onClick={() => router.push(paths.dashboard.root)}
          sx={{ border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}
        />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {tr('title')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {tr('subtitle')}
          </Typography>
        </Box>
      </Stack>

      <Card
        sx={{
          p: 2,
          mb: 3,
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <ToggleButtonGroup
          size="small"
          exclusive
          color="primary"
          value={type}
          onChange={(_event, value: InspectionProductType | null) => {
            // MUI hands back null when the active tab is clicked again; the board always has one.
            if (value !== null) setType(value);
          }}
        >
          {PRODUCT_TYPES.map((option) => (
            <ToggleButton key={option.value} value={option.value} sx={{ px: 2 }}>
              {tr(`type.${option.key}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' } }}
        >
          <TextField
            select
            size="small"
            label={tr('sort.label')}
            value={sort}
            onChange={(event) => setSort(Number(event.target.value) as InspectionBoardSort)}
            sx={{ minWidth: 200 }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {tr(`sort.${option.key}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={tr('search')}
            sx={{ flex: 1, minWidth: { md: 280 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Tooltip title={tr('refresh')}>
            <span>
              <IconButton onClick={() => refetch()} disabled={isFetching}>
                <Iconify
                  icon="solar:restart-bold"
                  sx={{
                    ...(isFetching && {
                      animation: 'inspection-board-spin 1s linear infinite',
                      '@keyframes inspection-board-spin': { to: { transform: 'rotate(360deg)' } },
                    }),
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Card>

      {renderContent()}
    </DashboardContent>
  );
}
