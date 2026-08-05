import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CircleArrowButton } from 'src/components/circle-arrow-button';
import { DashboardToolbar, DashboardFiltersDrawer } from 'src/components/dashboard';

import { useDataRoom } from '../hooks/use-data-room';
import { DataRoomKpiCard, DataRoomChartCard } from '../components';

// ----------------------------------------------------------------------

export function DataRoomView() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslate('dashboard');

  const {
    selectedCountry,
    search,
    setSearch,
    selectedTab,
    setSelectedTab,
    filters,
    filtersOpen,
    setFiltersOpen,
    setFiltersHandler,
    clearFilters,
    activeFilterCount,
    activeData,
    egyptChartOptions,
    saudiChartOptions,
    egyptSeries,
    saudiSeries,
    performanceTabs,
    chartType,
    chartMode,
    setChartMode,
    onViewAll,
  } = useDataRoom();

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 5 }}>
      {/* Title & Back Button Stack */}
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
            Data Room
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Overview • Data Room
          </Typography>
        </Box>
      </Stack>

      {/* Shared Dashboard Toolbar */}
      <DashboardToolbar
        searchValue={search}
        onSearchChange={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        searchPlaceholder={t('dashboard.shared.search')}
        filterLabel={t('dashboard.shared.filter')}
        activeFilterCount={activeFilterCount}
      />

      {/* Row 1 — 4 Main KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {activeData.kpis.map((kpi) => (
          <Grid key={kpi.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <DataRoomKpiCard kpi={kpi} />
          </Grid>
        ))}
      </Grid>

      {/* Performance Analytics Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        gap={2}
        sx={{ mb: 3, mt: 5 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ width: 4, height: 24, borderRadius: '4px', bgcolor: '#BF8654' }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Performance Analytics
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
          {/* Chart Style Toggle (Bar BI Chart, Pie/Donut Chart, Line/Area Chart) */}
          <ToggleButtonGroup
            size="small"
            value={chartMode}
            exclusive
            onChange={(_e, val) => val && setChartMode(val)}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#161D26' : '#F4F6F8',
              p: 0.5,
              borderRadius: '8px',
              border: 'none',
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
              value="bar"
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
              <Iconify icon={'solar:chart-2-bold-duotone' as any} width={14} sx={{ mr: 0.5 }} />
              Bar
            </ToggleButton>
            <ToggleButton
              value="pie"
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
              <Iconify icon={'solar:pie-chart-3-bold-duotone' as any} width={14} sx={{ mr: 0.5 }} />
              Pie
            </ToggleButton>
            <ToggleButton
              value="area"
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
              <Iconify icon={'solar:graph-up-bold-duotone' as any} width={14} sx={{ mr: 0.5 }} />
              Line
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Group By Selector Toggle */}
          <ToggleButtonGroup
            size="small"
            value={filters.group_by || 'date'}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setFiltersHandler({ ...filters, group_by: newValue });
              }
            }}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#161D26' : '#F4F6F8',
              p: 0.5,
              borderRadius: '8px',
              border: 'none',
              '& .MuiToggleButtonGroup-grouped': {
                margin: 0,
                border: 0,
                '&.Mui-disabled': {
                  border: 0,
                },
                '&:not(:first-of-type)': {
                  borderRadius: '6px',
                },
                '&:first-of-type': {
                  borderRadius: '6px',
                },
              },
            }}
          >
            <ToggleButton
              value="date"
              sx={{
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontWeight: 'bold',
                '&.Mui-selected': {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: theme.customShadows?.z4,
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                },
              }}
            >
              Date
            </ToggleButton>
            <ToggleButton
              value="tags_group"
              sx={{
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontWeight: 'bold',
                '&.Mui-selected': {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: theme.customShadows?.z4,
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                },
              }}
            >
              Tag Groups
            </ToggleButton>
            <ToggleButton
              value="tag"
              sx={{
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontWeight: 'bold',
                '&.Mui-selected': {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: theme.customShadows?.z4,
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                },
              }}
            >
              Tags
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {/* Pill Tab Selector */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 4,
          pb: 1,
          overflowX: 'auto',
          maxWidth: '100%',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 3,
            bgcolor: 'action.hover',
          },
        }}
      >
        {performanceTabs.map((tab) => {
          const isActive = selectedTab === tab.value;
          return (
            <Button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              startIcon={<Iconify icon={tab.icon as any} width={20} />}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                flexShrink: 0,
                fontSize: '14px',
                transition: theme.transitions.create(['background-color', 'color']),
                ...(isActive
                  ? {
                      bgcolor: 'common.white',
                      color: 'grey.900',
                      boxShadow: theme.customShadows?.z8,
                      '&:hover': { bgcolor: 'common.white' },
                    }
                  : {
                      bgcolor: theme.palette.mode === 'dark' ? '#161D26' : '#F4F6F8',
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? '#1D2734' : '#E5E8EB',
                      },
                    }),
              }}
            >
              {tab.label}
            </Button>
          );
        })}
      </Stack>

      {/* Row 2 — Double Charts Grid */}
      <Grid container spacing={3}>
        {/* Egypt Chart Card */}
        {(selectedCountry === 'all' || selectedCountry === 'egypt') && (
          <Grid size={{ xs: 12, md: selectedCountry === 'all' ? 6 : 12 }}>
            <DataRoomChartCard
              countryName="Egypt"
              countryCode="EG"
              total={activeData.egyptTotal}
              trend={activeData.egyptTrend}
              trendDirection={activeData.egyptTrendDirection}
              series={egyptSeries}
              options={egyptChartOptions}
              type={chartType}
              onViewAll={onViewAll}
            />
          </Grid>
        )}

        {/* Saudi Arabia Chart Card */}
        {(selectedCountry === 'all' || selectedCountry === 'ksa') && (
          <Grid size={{ xs: 12, md: selectedCountry === 'all' ? 6 : 12 }}>
            <DataRoomChartCard
              countryName="Saudi Arabia"
              countryCode="SA"
              total={activeData.saudiTotal}
              trend={activeData.saudiTrend}
              trendDirection={activeData.saudiTrendDirection}
              series={saudiSeries}
              options={saudiChartOptions}
              type={chartType}
              onViewAll={onViewAll}
            />
          </Grid>
        )}
      </Grid>

      {/* Shared Dashboard Filters Drawer */}
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
