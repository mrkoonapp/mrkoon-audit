import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { paths } from 'src/routes/paths';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import usdPattern from 'src/assets/pattern/usd-pattern.svg';
import { highlightCardColors } from 'src/theme/theme-config';
import transactionPattern from 'src/assets/pattern/transaction-pattern.svg';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import {
  StatCard,
  DonutCard,
  ViewAllLink,
  formatAmount,
  AreaChartCard,
  MetricListCard,
  ListWidgetCard,
  formatJoinedAt,
  DashboardToolbar,
  ProgressListCard,
  HighlightStatCard,
  countActiveFilters,
  DashboardFiltersDrawer,
  defaultDashboardFilters,
} from 'src/components/dashboard';

import { dashboardMockData } from '../data';

// ----------------------------------------------------------------------

export function DashboardView() {
  const { t } = useTranslate('dashboard');

  const data = dashboardMockData;

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  // Section labels — resolved here so widgets stay translation-free.
  const trendCaption = t('dashboard.shared.trendCaption');
  const emptyTitle = t('dashboard.shared.empty.title');
  const emptyDescription = t('dashboard.shared.empty.description');

  const newClientsItems = data.newClients.items.map((client) => ({
    id: client.id,
    avatarUrl: client.avatarUrl,
    primary: client.name,
    secondary: client.category,
    trailingSecondary: `${t('dashboard.shared.joinedAt')} ${formatJoinedAt(client.joinedAt)}`,
  }));

  const topSellersItems = data.topSellers.map((seller) => ({
    id: seller.id,
    avatarUrl: seller.avatarUrl,
    primary: seller.name,
    secondary: seller.category,
    metrics: [
      { value: formatAmount(seller.amount, seller.currency) },
      {
        icon: <Iconify icon="solar:round-transfer-horizontal-bold" />,
        value: fNumber(seller.quantity),
      },
    ],
  }));

  const viewAllAction = (
    <ViewAllLink
      href={`${paths.dashboard.clients}?tab=company`}
      label={t('dashboard.shared.viewAll')}
    />
  );

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
        searchPlaceholder={t('dashboard.shared.search')}
        filterLabel={t('dashboard.shared.filter')}
        activeFilterCount={activeFilterCount}
      />

      <Grid container spacing={3}>
        {/* Row 1 — KPI stat cards */}
        {data.stats.map((stat) => (
          <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label={t(`dashboard.dashboard.stats.${stat.labelKey}`)}
              value={fNumber(stat.value)}
              trend={{ value: stat.trend, caption: trendCaption }}
            />
          </Grid>
        ))}

        {/* Row 2 — success rate donut + new clients list */}
        <Grid size={{ xs: 12, md: 5 }}>
          <DonutCard
            title={t('dashboard.dashboard.successRate.title')}
            series={[data.successRate.successful, data.successRate.failed]}
            labels={[
              t('dashboard.dashboard.successRate.successful'),
              t('dashboard.dashboard.successRate.failed'),
            ]}
            legendValues={[fNumber(data.successRate.successful), fNumber(data.successRate.failed)]}
            total={`${data.successRate.rate}%`}
            totalLabel={t('dashboard.dashboard.successRate.centerLabel')}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <ListWidgetCard
            title={t('dashboard.dashboard.newClients.title')}
            countBadge={
              <Label color="success" variant="soft">
                {fNumber(data.newClients.total)}
              </Label>
            }
            headerAction={
              <ViewAllLink href={paths.dashboard.clients} label={t('dashboard.shared.viewAll')} />
            }
            items={newClientsItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        {/* Row 3 — transactions area chart + highlight tiles */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AreaChartCard
            title={t('dashboard.dashboard.transactions.title')}
            categories={data.transactions.categories}
            series={[
              { name: t('dashboard.dashboard.transactions.title'), data: data.transactions.series },
            ]}
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
              label={t('dashboard.dashboard.totalTransaction', {
                currency: data.transactions.currency,
              })}
              value={fShortenNumber(data.transactions.totalAmount)}
              pattern={usdPattern}
              sx={{ flex: 1 }}
            />

            <HighlightStatCard
              color="success"
              bgColor={highlightCardColors.green.bg}
              borderColor={highlightCardColors.green.border}
              label={t('dashboard.dashboard.transactionsCount')}
              value={fNumber(data.transactions.totalCount)}
              pattern={transactionPattern}
              sx={{ flex: 1 }}
            />
          </Box>
        </Grid>

        {/* Row 4 — top sellers + top categories */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MetricListCard
            title={t('dashboard.dashboard.topSellers.title')}
            action={viewAllAction}
            items={topSellersItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ProgressListCard
            title={t('dashboard.dashboard.topCategories.title')}
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
