import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState } from 'react';

import Grid from '@mui/material/Grid';

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

import { operationsMockData } from '../data';

import type { OperationStat } from '../data';

// ----------------------------------------------------------------------

function formatStatValue(stat: OperationStat) {
  return stat.format === 'percent' ? `${stat.value}%` : fNumber(stat.value);
}

// ----------------------------------------------------------------------

export function OperationsView() {
  const { t } = useTranslate('dashboard');

  const data = operationsMockData;

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const emptyTitle = t('dashboard.shared.empty.title');
  const emptyDescription = t('dashboard.shared.empty.description');

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
              icon={<Iconify icon={stat.icon} />}
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
            colors={data.slaBreakdown.map((item) => item.color)}
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
        }}
      />
    </DashboardContent>
  );
}
