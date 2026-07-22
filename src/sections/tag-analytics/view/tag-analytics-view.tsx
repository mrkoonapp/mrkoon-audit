import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import Autocomplete from '@mui/material/Autocomplete';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getLocalizedText } from 'src/utils/format-string';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CircleArrowButton } from 'src/components/circle-arrow-button';
import { DashboardFiltersDrawer } from 'src/components/dashboard';

import { useTagAnalytics } from '../hooks/use-tag-analytics';
import {
  TagAnalyticsTable,
  TagAnalyticsHeroCards,
  TagAnalyticsPriceBox,
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
    totalAuctions,
    highestPrice,
    lowestPrice,
    currency,
    granularityLabel,
    periodBreakdownSegments,
    auctionRows,
    tags,
    tagGroups,
    tagsLoading,
    tagGroupsLoading,
  } = useTagAnalytics();

  const isDark = theme.palette.mode === 'dark';

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
                    <Iconify icon={"solar:magnifer-linear" as any} width={18} sx={{ color: 'text.disabled' }} />
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
                <Iconify icon={"solar:tag-bold-duotone" as any} width={14} sx={{ mr: 0.5 }} />
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
                <Iconify icon={"solar:tag-horizontal-bold-duotone" as any} width={14} sx={{ mr: 0.5 }} />
                Group
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Tag or Tag Group Dropdown */}
            {tagMode === 'tag' ? (
              <Autocomplete
                sx={{ minWidth: 220, flex: 1, maxWidth: 340 }}
                options={tags}
                loading={tagsLoading}
                value={tags.find((t) => t.id === selectedTagId) ?? null}
                onChange={(_e, val) => setSelectedTagId(val?.id ?? null)}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
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
                options={tagGroups}
                loading={tagGroupsLoading}
                value={tagGroups.find((g) => g.id === selectedTagGroupId) ?? null}
                onChange={(_e, val) => setSelectedTagGroupId(val?.id ?? null)}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
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
                <Iconify icon={"solar:calendar-bold-duotone" as any} width={16} sx={{ color: '#BF8654' }} />
                {activeFilterText}
              </Typography>
            )}

            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              startIcon={<Iconify icon={"eva:options-2-fill" as any} />}
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

      {/* ── Content (Shown when a tag/group is selected) ── */}
      {hasSelection ? (
        <Stack spacing={4}>
          {/* Row 1 — Hero Period Cards (Total Auctions 1st, then April, May, June) */}
          <TagAnalyticsHeroCards
            segments={periodBreakdownSegments}
            totalAuctions={totalAuctions}
            granularityLabel={granularityLabel}
          />

          {/* Row 2 — Highest Price & Lowest Price Cards */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TagAnalyticsPriceBox
                type="highest"
                price={highestPrice}
                currency={currency}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TagAnalyticsPriceBox
                type="lowest"
                price={lowestPrice}
                currency={currency}
              />
            </Grid>
          </Grid>

          {/* Row 3 — Auctions Table */}
          <TagAnalyticsTable
            auctions={auctionRows}
            loading={isLoading}
            currency={currency}
          />
        </Stack>
      ) : (
        /* Empty State */
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{
            py: 12,
            borderRadius: 2.5,
            border: `1px dashed ${isDark ? '#1D2633' : theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: isDark ? '#1D2633' : '#F4F6F8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon={"solar:tag-bold-duotone" as any} width={32} sx={{ color: '#BF8654' }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Select a tag to view analytics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled', textAlign: 'center', maxWidth: 360 }}>
            Use the tag selector in the toolbar above to choose a tag or tag group.
          </Typography>
        </Stack>
      )}

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
