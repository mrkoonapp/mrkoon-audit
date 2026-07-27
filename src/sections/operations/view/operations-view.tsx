import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState } from 'react';

import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import {
  IconStatCard,
  BarChartCard,
  DashboardToolbar,
  countActiveFilters,
  DashboardFiltersDrawer,
  defaultDashboardFilters,
} from 'src/components/dashboard';

import { useGetOperationsDashboardData } from 'src/api/audit';
import { operationsMockData } from '../data';

import type { OperationStat } from '../data';

// ----------------------------------------------------------------------

function formatStatValue(stat: any) {
  return stat.format === 'percent' ? `${stat.value}%` : fNumber(stat.value);
}

// ----------------------------------------------------------------------

export function OperationsView() {
  const theme = useTheme();
  const { t } = useTranslate('dashboard');

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const { data: apiData } = useGetOperationsDashboardData(filters);
  const data = apiData ?? operationsMockData;

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const emptyTitle = t('dashboard.shared.empty.title');
  const emptyDescription = t('dashboard.shared.empty.description');

  const slaColors = [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  return (
    <DashboardContent maxWidth="xl">
      <DashboardToolbar
        searchValue={search}
        onSearchChange={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        searchPlaceholder={t('dashboard.shared.search')}
        filterLabel={t('dashboard.shared.filter')}
        activeFilterCount={activeFilterCount}
      />

      <Grid container spacing={3}>
        {/* Row 1 — KPI stat cards */}
        {data.stats.map((stat) => (
          <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <IconStatCard
              label={t(`dashboard.operations.stats.${stat.labelKey}`)}
              value={formatStatValue(stat)}
              trend={stat.trend}
              subtitle={t(`dashboard.operations.subtitles.${stat.subtitleKey}`)}
              icon={<Iconify icon={stat.icon as any} />}
              iconColor={stat.iconColor}
            />
          </Grid>
        ))}

        {/* Row 2 — SLA compliance breakdown horizontal bar chart */}
        <Grid size={{ xs: 12 }}>
          <BarChartCard
            horizontal
            height={280}
            title={t('dashboard.operations.slaBreakdown')}
            categories={data.slaBreakdown.map((item) =>
              t(`dashboard.operations.sla.${item.labelKey}`)
            )}
            series={data.slaBreakdown.map((item) => item.value)}
            colors={slaColors}
            seriesName={t('dashboard.operations.slaBreakdown')}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>
      </Grid>

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
