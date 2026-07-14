import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CircleArrowButton } from 'src/components/circle-arrow-button';
import {
  StatCard,
  ViewAllLink,
  StatListCard,
  formatJoinedAt,
  AvatarGridCard,
  ListWidgetCard,
  ProgressListCard,
  DashboardToolbar,
  countActiveFilters,
  DashboardFiltersDrawer,
  defaultDashboardFilters,
} from 'src/components/dashboard';

import { salesMockData } from '../data';

// ----------------------------------------------------------------------

export function SalesView() {
  const { t } = useTranslate('dashboard');

  const router = useRouter();

  const data = salesMockData;

  // Maps a KPI card to the listing page it opens (undefined → not clickable).
  const statHref: Record<string, string | undefined> = {
    products: paths.dashboard.products,
    auctions: paths.dashboard.auctionsList,
  };

  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const emptyTitle = t('dashboard.shared.empty.title');
  const emptyDescription = t('dashboard.shared.empty.description');

  const renderStatValue = (value: number, unitKey: string) => (
    <>
      {fNumber(value)}{' '}
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {t(`dashboard.sales.units.${unitKey}`)}
      </Box>
    </>
  );

  const newMerchantItems = data.newMerchants.items.map((merchant) => ({
    id: merchant.id,
    avatarUrl: merchant.avatarUrl,
    primary: merchant.name,
    secondary: formatJoinedAt(merchant.joinedAt),
  }));

  const updateItems = data.merchantsUpdates.map((update) => ({
    id: update.id,
    label: t(`dashboard.sales.updates.${update.labelKey}`),
    value: fNumber(update.value),
    color: update.color,
  }));

  const topSuccessItems = data.topSuccess.map((item) => ({
    id: item.id,
    label: item.name,
    value: fNumber(item.value),
    percent: item.percent,
    color: item.color,
  }));

  const topMerchantItems = data.topMerchants.map((merchant) => ({
    id: merchant.id,
    avatarUrl: merchant.avatarUrl,
    primary: merchant.name,
    secondary: merchant.category,
    trailingSecondary: (
      <Box sx={{ textAlign: 'end' }}>
        <Box component="span" sx={{ display: 'block' }}>
          {t('dashboard.shared.joinedAt')}
        </Box>
        <Box component="span" sx={{ display: 'block' }}>
          {formatJoinedAt(merchant.joinedAt)}
        </Box>
      </Box>
    ),
  }));

  return (
    <DashboardContent maxWidth="xl">
      <DashboardToolbar
        title={t('dashboard.sales.title')}
        subtitle={t('dashboard.sales.overview')}
        onOpenFilters={() => setFiltersOpen(true)}
        filterLabel={t('dashboard.shared.filter')}
        activeFilterCount={activeFilterCount}
      />

      <Grid container spacing={3}>
        {/* Row 1 — KPI stat cards */}
        {data.stats.map((stat) => (
          <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              label={t(`dashboard.sales.stats.${stat.labelKey}`)}
              value={renderStatValue(stat.value, stat.unitKey)}
              onClick={statHref[stat.id] ? () => router.push(statHref[stat.id]!) : undefined}
              icon={
                stat.action ? (
                  <CircleArrowButton />
                ) : (
                  stat.icon && <Iconify icon={stat.icon} width={28} />
                )
              }
            />
          </Grid>
        ))}

        {/* Row 2 — new merchants grid + merchants updates */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AvatarGridCard
            title={t('dashboard.sales.newMerchants')}
            countBadge={
              <Label color="success" variant="soft">
                {fNumber(data.newMerchants.total)}
              </Label>
            }
            items={newMerchantItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatListCard
            title={t('dashboard.sales.merchantsUpdates')}
            items={updateItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        {/* Row 3 — top 5 success + top 5 merchants */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ProgressListCard
            title={t('dashboard.sales.top5Success')}
            items={topSuccessItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ListWidgetCard
            title={t('dashboard.sales.top5Merchants')}
            headerAction={
              <ViewAllLink href={paths.dashboard.clients} label={t('dashboard.shared.viewAll')} />
            }
            items={topMerchantItems}
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
