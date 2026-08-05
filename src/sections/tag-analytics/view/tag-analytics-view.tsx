import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getLocalizedText } from 'src/utils/format-string';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { DashboardFiltersDrawer } from 'src/components/dashboard';
import { CircleArrowButton } from 'src/components/circle-arrow-button';

import { useTagAnalytics } from '../hooks/use-tag-analytics';
import {
  TagAnalyticsTable,
  TagAnalyticsPriceBox,
  TagAnalyticsHeroCards,
  TagAnalyticsSuccessRate,
} from '../components';

import type { TagMode } from '../hooks/use-tag-analytics';

// ----------------------------------------------------------------------

export function TagAnalyticsView() {
  const router = useRouter();
  const theme = useTheme();
  const { t, currentLang } = useTranslate('dashboard');

  const {
    tagMode,
    setTagMode,
    selectedTagId,
    setSelectedTagId,
    selectedTagGroupId,
    setSelectedTagGroupId,
    tagSearchQuery,
    setTagSearchQuery,
    groupSearchQuery,
    setGroupSearchQuery,
    filters,
    filtersOpen,
    setFiltersOpen,
    setFiltersHandler,
    clearFilters,
    activeFilterCount,
    activeFilterText,
    search,
    setSearch,
    isLoading,
    hasSelection,
    selectedOptionName,
    totalAuctions,
    highestPrice,
    lowestPrice,
    currency,
    // granularityLabel,
    // periodBreakdownSegments,
    auctionRows,
    tagsSuccessRate,
    tagsSuccessRateLoading,
    tags,
    tagGroups,
    tagsLoading,
    tagGroupsLoading,
  } = useTagAnalytics();

  const isDark = theme.palette.mode === 'dark';

  // ── State for Autocomplete Dropdown Scroll Pagination ──────────
  const [tagLimit, setTagLimit] = useState(20);
  const [groupLimit, setGroupLimit] = useState(20);

  // Filter tags list based on tagSearchQuery
  const filteredTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return tags;
    const q = tagSearchQuery.trim().toLowerCase();
    return tags.filter((opt) => {
      const idStr = String(opt.id);
      let enStr = '';
      let arStr = '';
      if (typeof opt.name === 'string') {
        enStr = opt.name.toLowerCase();
        arStr = opt.name.toLowerCase();
      } else if (opt.name) {
        enStr = (opt.name.en || '').toLowerCase();
        arStr = (opt.name.ar || '').toLowerCase();
      }
      if (opt.name_en) enStr = opt.name_en.toLowerCase();
      if (opt.name_ar) arStr = opt.name_ar.toLowerCase();
      return idStr.includes(q) || enStr.includes(q) || arStr.includes(q);
    });
  }, [tags, tagSearchQuery]);

  const visibleTags = useMemo(() => filteredTags.slice(0, tagLimit), [filteredTags, tagLimit]);

  // Filter tag groups list based on groupSearchQuery
  const filteredTagGroups = useMemo(() => {
    if (!groupSearchQuery.trim()) return tagGroups;
    const q = groupSearchQuery.trim().toLowerCase();
    return tagGroups.filter((opt) => {
      const idStr = String(opt.id);
      let enStr = '';
      let arStr = '';
      if (typeof opt.name === 'string') {
        enStr = opt.name.toLowerCase();
        arStr = opt.name.toLowerCase();
      } else if (opt.name) {
        enStr = (opt.name.en || '').toLowerCase();
        arStr = (opt.name.ar || '').toLowerCase();
      }
      if (opt.name_en) enStr = opt.name_en.toLowerCase();
      if (opt.name_ar) arStr = opt.name_ar.toLowerCase();
      return idStr.includes(q) || enStr.includes(q) || arStr.includes(q);
    });
  }, [tagGroups, groupSearchQuery]);

  const visibleTagGroups = useMemo(
    () => filteredTagGroups.slice(0, groupLimit),
    [filteredTagGroups, groupLimit]
  );

  const handleTagScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 40) {
      if (tagLimit < filteredTags.length) {
        setTagLimit((prev) => prev + 20);
      }
    }
  };

  const handleGroupScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 40) {
      if (groupLimit < filteredTagGroups.length) {
        setGroupLimit((prev) => prev + 20);
      }
    }
  };

  // Resolve display name for a tag/group option
  const getOptionLabel = (option: { id: number; name: string | { en: string; ar: string } }) =>
    typeof option.name === 'string'
      ? option.name
      : getLocalizedText(option.name as any, currentLang.value);

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 5 }}>
      {/* ── Page Title & Back Button ── */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <CircleArrowButton
          icon="eva:arrow-ios-back-fill"
          onClick={() => router.push(paths.dashboard.root)}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
          }}
        />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Tag Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Overview • Tag Analytics
          </Typography>
        </Box>
      </Stack>

      {/* ── Compact Header Toolbar (Search + Tag Selector + Active Filter Summary + Filter Drawer Button) ── */}
      <Card
        sx={{
          p: 2,
          mb: 4,
          bgcolor: isDark ? '#11161D' : 'background.paper',
          border: `1px solid ${isDark ? '#1D2633' : theme.palette.divider}`,
          borderRadius: 2.5,
          boxShadow: theme.customShadows?.card,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
        >
          {/* Left group: Search Box + Tag Selector Toggle & Dropdown */}
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={1.5} flex={1}>
            {/* Search Input */}
            <TextField
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search auctions..."
              sx={{ minWidth: 200, maxWidth: { sm: 260 }, flexShrink: 0 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon={'solar:magnifer-linear' as any}
                      width={18}
                      sx={{ color: 'text.disabled' }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Tag / Tag Group Mode Toggle */}
            <ToggleButtonGroup
              size="small"
              value={tagMode}
              exclusive
              onChange={(_e, val: TagMode) => {
                if (val !== null) {
                  setTagMode(val);
                  setSelectedTagId(null);
                  setSelectedTagGroupId(null);
                  setTagSearchQuery('');
                  setGroupSearchQuery('');
                  setTagLimit(20);
                  setGroupLimit(20);
                }
              }}
              sx={{
                bgcolor: isDark ? '#161D26' : '#F4F6F8',
                p: 0.5,
                borderRadius: '8px',
                border: 'none',
                flexShrink: 0,
                '& .MuiToggleButtonGroup-grouped': {
                  margin: 0,
                  border: 0,
                  '&.Mui-disabled': { border: 0 },
                  '&:not(:first-of-type)': { borderRadius: '6px' },
                  '&:first-of-type': { borderRadius: '6px' },
                },
              }}
            >
              <ToggleButton
                value="tag"
                sx={{
                  px: 1.75,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  '&.Mui-selected': {
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: theme.customShadows?.z4,
                    '&:hover': { bgcolor: 'background.paper' },
                  },
                }}
              >
                <Iconify icon={'solar:tag-bold-duotone' as any} width={14} sx={{ mr: 0.5 }} />
                Tag
              </ToggleButton>
              <ToggleButton
                value="tags_group"
                sx={{
                  px: 1.75,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  '&.Mui-selected': {
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: theme.customShadows?.z4,
                    '&:hover': { bgcolor: 'background.paper' },
                  },
                }}
              >
                <Iconify
                  icon={'solar:tag-horizontal-bold-duotone' as any}
                  width={14}
                  sx={{ mr: 0.5 }}
                />
                Group
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Tag or Tag Group Dropdown */}
            {tagMode === 'tag' ? (
              <Autocomplete
                sx={{ minWidth: 220, flex: 1, maxWidth: 340 }}
                options={visibleTags}
                loading={tagsLoading}
                autoHighlight
                value={tags.find((item) => item.id === selectedTagId) ?? null}
                onChange={(_e, val) => setSelectedTagId(val?.id ?? null)}
                onInputChange={(_e, newInputValue, reason) => {
                  if (reason === 'input' || reason === 'clear') {
                    setTagSearchQuery(newInputValue);
                    setTagLimit(20);
                  }
                }}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                filterOptions={(x) => x}
                ListboxProps={{
                  onScroll: handleTagScroll,
                  sx: {
                    maxHeight: 260,
                    overflow: 'auto',
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Tag"
                    size="small"
                    placeholder="Search tags..."
                  />
                )}
              />
            ) : (
              <Autocomplete
                sx={{ minWidth: 220, flex: 1, maxWidth: 340 }}
                options={visibleTagGroups}
                loading={tagGroupsLoading}
                autoHighlight
                value={tagGroups.find((g) => g.id === selectedTagGroupId) ?? null}
                onChange={(_e, val) => setSelectedTagGroupId(val?.id ?? null)}
                onInputChange={(_e, newInputValue, reason) => {
                  if (reason === 'input' || reason === 'clear') {
                    setGroupSearchQuery(newInputValue);
                    setGroupLimit(20);
                  }
                }}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                filterOptions={(x) => x}
                ListboxProps={{
                  onScroll: handleGroupScroll,
                  sx: {
                    maxHeight: 260,
                    overflow: 'auto',
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Group"
                    size="small"
                    placeholder="Search groups..."
                  />
                )}
              />
            )}
          </Stack>

          {/* Right group: Active Filter Summary Text Badge + Filter Drawer Button */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {activeFilterText && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  bgcolor: isDark ? '#161D26' : '#F4F6F8',
                  px: 1.75,
                  py: 0.75,
                  borderRadius: 1,
                  border: `1px solid ${isDark ? '#1D2633' : theme.palette.divider}`,
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                }}
              >
                <Iconify
                  icon={'solar:calendar-bold-duotone' as any}
                  width={16}
                  sx={{ color: '#BF8654' }}
                />
                {activeFilterText}
              </Typography>
            )}

            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              startIcon={<Iconify icon={'eva:options-2-fill' as any} />}
              onClick={() => setFiltersOpen(true)}
              sx={{ textTransform: 'none', fontWeight: 600, height: 40 }}
            >
              Filter
              {activeFilterCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#BF8654',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFilterCount}
                </Box>
              )}
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* ── Always Visible: Success Rate Report for All Tags/Groups ── */}
      <Stack spacing={4}>
        <TagAnalyticsSuccessRate
          data={tagsSuccessRate}
          loading={tagsSuccessRateLoading}
          tagMode={tagMode}
          selectedName={selectedOptionName}
          onSelectTag={(id) => {
            if (tagMode === 'tag') {
              setSelectedTagId(id);
            } else {
              setSelectedTagGroupId(id);
            }
          }}
        />

        {/* ── Selection Specific Details (Hero cards, Prices, Auctions Table) ── */}
        {hasSelection ? (
          <>
            <TagAnalyticsHeroCards
              totalAuctions={totalAuctions}
              /* segments={periodBreakdownSegments} */
              /* granularityLabel={granularityLabel} */
            />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TagAnalyticsPriceBox type="highest" price={highestPrice} currency={currency} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TagAnalyticsPriceBox type="lowest" price={lowestPrice} currency={currency} />
              </Grid>
            </Grid>

            <TagAnalyticsTable auctions={auctionRows} loading={isLoading} currency={currency} />
          </>
        ) : (
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: isDark ? '#11161D' : 'background.paper',
              border: `1px dashed ${isDark ? '#1D2633' : theme.palette.divider}`,
              borderRadius: 2.5,
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              💡 Select a tag or tag group from the dropdown above to inspect detailed auction
              records and price ranges.
            </Typography>
          </Card>
        )}
      </Stack>

      {/* ── Dashboard Filters Drawer ── */}
      <DashboardFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={(next) => setFiltersHandler(next)}
        onReset={clearFilters}
        labels={{
          title: t('dashboard.shared.filters.title'),
          date: t('dashboard.shared.filters.date'),
          startDate: t('dashboard.shared.filters.startDate'),
          endDate: t('dashboard.shared.filters.endDate'),
          country: t('dashboard.shared.filters.country'),
          countryPlaceholder: t('dashboard.shared.filters.countryPlaceholder'),
          allCountries: t('dashboard.shared.filters.allCountries'),
          apply: t('dashboard.shared.filters.apply'),
          reset: t('dashboard.shared.filters.reset'),
          dateError: t('dashboard.shared.filters.dateError'),
          period: t('dashboard.shared.filters.period'),
          periodWeekly: t('dashboard.shared.filters.periodWeekly'),
          periodMonthly: t('dashboard.shared.filters.periodMonthly'),
          periodQuarterly: t('dashboard.shared.filters.periodQuarterly'),
          periodYearly: t('dashboard.shared.filters.periodYearly'),
          periodCustom: t('dashboard.shared.filters.periodCustom'),
        }}
      />
    </DashboardContent>
  );
}
