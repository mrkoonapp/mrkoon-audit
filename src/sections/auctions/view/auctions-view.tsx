import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import {
  TagChip,
  StatCard,
  BarChartCard,
  ListWidgetCard,
  formatJoinedAt,
  DashboardToolbar,
  countActiveFilters,
  DashboardFiltersDrawer,
  defaultDashboardFilters,
} from 'src/components/dashboard';

import { auctionsMockData } from '../data';
import { AuctionsSummaryCard } from '../components';

import type { AuctionStat } from '../data';

// ----------------------------------------------------------------------

function formatStatValue(stat: AuctionStat) {
  if (stat.format === 'currency') return `${fNumber(stat.value)}${stat.currency ?? ''}`;
  if (stat.format === 'percent') return `${stat.value}%`;
  return fNumber(stat.value);
}

// ----------------------------------------------------------------------

export function AuctionsView() {
  const { t } = useTranslate('dashboard');

  const data = auctionsMockData;

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const emptyTitle = t('dashboard.shared.empty.title');
  const emptyDescription = t('dashboard.shared.empty.description');

  const clientItems = data.participatedClients.items.map((client) => ({
    id: client.id,
    avatarUrl: client.avatarUrl,
    primary: client.name,
    secondary: client.category,
    center: <TagChip icon={<Iconify icon={client.chipIcon} />} label={client.chipLabel} />,
    trailingSecondary: `${t('dashboard.shared.joinedAt')} ${formatJoinedAt(client.joinedAt)}`,
  }));

  const barTitle = (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {t('dashboard.auctions.byCategory')}
      <Label color="success" variant="soft">
        {data.byCategory.percent}%
      </Label>
    </Box>
  );

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
            <StatCard
              label={t(`dashboard.auctions.stats.${stat.labelKey}`)}
              value={formatStatValue(stat)}
              trend={{ direction: stat.direction }}
            />
          </Grid>
        ))}

        {/* Row 2 — auctions by category bar chart */}
        <Grid size={{ xs: 12 }}>
          <BarChartCard
            title={barTitle}
            categories={data.byCategory.items.map((c) => c.name)}
            series={data.byCategory.items.map((c) => c.value)}
            seriesName={t('dashboard.auctions.byCategory')}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        {/* Row 3 — participated clients + auctions summary gauge */}
        <Grid size={{ xs: 12, md: 7 }}>
          <ListWidgetCard
            title={t('dashboard.auctions.participatedClients')}
            countBadge={
              <Label color="success" variant="soft">
                {fNumber(data.participatedClients.total)}
              </Label>
            }
            items={clientItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <AuctionsSummaryCard summary={data.summary} />
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
