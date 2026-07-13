import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import usdPattern from 'src/assets/pattern/usd-pattern.svg';
import { highlightCardColors } from 'src/theme/theme-config';
import transactionPattern from 'src/assets/pattern/transaction-pattern.svg';

import { Label } from 'src/components/label';
import {
  StatCard,
  DonutCard,
  AreaChartCard,
  ListWidgetCard,
  DashboardToolbar,
  ProgressListCard,
  HighlightStatCard,
  DashboardFiltersDrawer,
} from 'src/components/dashboard';

import { overviewMockData } from '../data';
import {
  formatAmount,
  formatJoinedAt,
  countActiveFilters,
  defaultOverviewFilters,
} from '../utils';

// ----------------------------------------------------------------------

export function OverviewView() {
  const { t } = useTranslate('dashboard');

  const data = overviewMockData;

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultOverviewFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  // Section labels — resolved here so widgets stay translation-free.
  const trendCaption = t('dashboard.overview.trendCaption');
  const emptyTitle = t('dashboard.overview.empty.title');
  const emptyDescription = t('dashboard.overview.empty.description');

  const newClientsItems = data.newClients.items.map((client) => ({
    id: client.id,
    avatarUrl: client.avatarUrl,
    primary: client.name,
    secondary: client.category,
    trailingSecondary: `${t('dashboard.overview.joinedAt')} ${formatJoinedAt(client.joinedAt)}`,
  }));

  const topSellersItems = data.topSellers.map((seller) => ({
    id: seller.id,
    avatarUrl: seller.avatarUrl,
    primary: seller.name,
    secondary: seller.category,
    trailingPrimary: formatAmount(seller.amount, seller.currency),
    badge: (
      <Label color="info" variant="soft">
        {fNumber(seller.quantity)}
      </Label>
    ),
  }));

  const topCategoriesItems = data.topCategories.map((category, index) => ({
    id: category.id,
    label: category.name,
    value: fNumber(category.value),
    percent: category.percent,
    color: (['primary', 'success', 'warning', 'info', 'error'] as const)[index % 5],
  }));

  return (
    <DashboardContent maxWidth="xl">
      <DashboardToolbar
        searchValue={search}
        onSearchChange={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        searchPlaceholder={t('dashboard.overview.searchPlaceholder')}
        filterLabel={t('dashboard.overview.filter')}
        activeFilterCount={activeFilterCount}
      />

      <Grid container spacing={3}>
        {/* Row 1 — KPI stat cards */}
        {data.stats.map((stat) => (
          <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label={t(`dashboard.overview.stats.${stat.labelKey}`)}
              value={fNumber(stat.value)}
              trend={{ value: stat.trend, caption: trendCaption }}
            />
          </Grid>
        ))}

        {/* Row 2 — success rate donut + new clients list */}
        <Grid size={{ xs: 12, md: 5 }}>
          <DonutCard
            title={t('dashboard.overview.successRate.title')}
            series={[data.successRate.successful, data.successRate.failed]}
            labels={[t('dashboard.overview.successRate.successful'), t('dashboard.overview.successRate.failed')]}
            legendValues={[
              fNumber(data.successRate.successful),
              fNumber(data.successRate.failed),
            ]}
            total={`${data.successRate.rate}%`}
            totalLabel={t('dashboard.overview.successRate.centerLabel')}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <ListWidgetCard
            title={t('dashboard.overview.newClients.title')}
            countBadge={
              <Label color="success" variant="soft">
                {fNumber(data.newClients.total)}
              </Label>
            }
            items={newClientsItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        {/* Row 3 — transactions area chart + highlight tiles */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AreaChartCard
            title={t('dashboard.overview.transactions.title')}
            categories={data.transactions.categories}
            series={[{ name: t('dashboard.overview.transactions.title'), data: data.transactions.series }]}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: 1 }}>
            <HighlightStatCard
              color="warning"
              bgColor={highlightCardColors.gold.bg}
              borderColor={highlightCardColors.gold.border}
              label={t('dashboard.overview.totalTransaction', { currency: data.transactions.currency })}
              value={fShortenNumber(data.transactions.totalAmount)}
              pattern={usdPattern}
              sx={{ flex: 1 }}
            />

            <HighlightStatCard
              color="success"
              bgColor={highlightCardColors.green.bg}
              borderColor={highlightCardColors.green.border}
              label={t('dashboard.overview.transactionsCount')}
              value={fNumber(data.transactions.totalCount)}
              pattern={transactionPattern}
              sx={{ flex: 1 }}
            />
          </Box>
        </Grid>

        {/* Row 4 — top sellers + top categories */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ListWidgetCard
            title={t('dashboard.overview.topSellers.title')}
            items={topSellersItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ProgressListCard
            title={t('dashboard.overview.topCategories.title')}
            items={topCategoriesItems}
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
          title: t('dashboard.overview.filters.title'),
          date: t('dashboard.overview.filters.date'),
          startDate: t('dashboard.overview.filters.startDate'),
          endDate: t('dashboard.overview.filters.endDate'),
          country: t('dashboard.overview.filters.country'),
          countryPlaceholder: t('dashboard.overview.filters.countryPlaceholder'),
          apply: t('dashboard.overview.filters.apply'),
          reset: t('dashboard.overview.filters.reset'),
          dateError: t('dashboard.overview.filters.dateError'),
        }}
      />
    </DashboardContent>
  );
}
