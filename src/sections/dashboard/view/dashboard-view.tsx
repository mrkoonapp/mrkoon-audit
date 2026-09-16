import type { DatePeriod } from 'src/utils/constants';
import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState } from 'react';

import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fIsAfter } from 'src/utils/format-time';
import { DATE_PERIODS } from 'src/utils/constants';

import { useTranslate } from 'src/locales';
import { useGetHomeDashboardData } from 'src/api/audit';
import { DashboardContent } from 'src/layouts/dashboard';

import { getPeriodRange } from 'src/components/dashboard/utils';
import { CountrySelectRemote } from 'src/components/country-select';
import {
  DashboardToolbar,
  countActiveFilters,
  defaultDashboardFilters,
} from 'src/components/dashboard';

import { DashboardKpiTable } from './dashboard-kpi-table';

// ----------------------------------------------------------------------

export function DashboardView() {
  const { t } = useTranslate('dashboard');

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFilterHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const { data, isLoading } = useGetHomeDashboardData(filters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  // Section labels — resolved here so widgets stay translation-free.
  const emptyTitle = t('dashboard.shared.empty.title');
  const emptyDescription = t('dashboard.shared.empty.description');

  const isCustomPeriod = filters.period === DATE_PERIODS.CUSTOM;
  const dateError = isCustomPeriod && fIsAfter(filters.startDate, filters.endDate);

  const handlePeriodChange = (value: DatePeriod) => {
    if (value === DATE_PERIODS.CUSTOM || value === '') {
      setFilterHandler({ period: value });
      return;
    }
    const { startDate, endDate } = getPeriodRange(value);
    setFilterHandler({ period: value, startDate, endDate });
  };

  const periodOptions: { value: DatePeriod; label: string }[] = [
    { value: DATE_PERIODS.ALL_TIME, label: t('dashboard.shared.filters.periodAllTime') },
    { value: DATE_PERIODS.WEEKLY, label: t('dashboard.shared.filters.periodWeekly') },
    { value: DATE_PERIODS.MONTHLY, label: t('dashboard.shared.filters.periodMonthly') },
    { value: DATE_PERIODS.QUARTERLY, label: t('dashboard.shared.filters.periodQuarterly') },
    { value: DATE_PERIODS.YEARLY, label: t('dashboard.shared.filters.periodYearly') },
    { value: DATE_PERIODS.CUSTOM, label: t('dashboard.shared.filters.periodCustom') },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <DashboardToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('dashboard.shared.search')}
        hideFilterButton
      >
        <TextField
          select
          size="small"
          label={t('dashboard.shared.filters.period')}
          value={filters.period}
          onChange={(event) => handlePeriodChange(event.target.value as DatePeriod)}
          sx={{ minWidth: 160 }}
        >
          {periodOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {isCustomPeriod && (
          <>
            <DatePicker
              label={t('dashboard.shared.filters.startDate')}
              value={filters.startDate}
              onChange={(newValue) => setFilterHandler({ startDate: newValue })}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 140 } } }}
            />
            <DatePicker
              label={t('dashboard.shared.filters.endDate')}
              value={filters.endDate}
              minDate={filters.startDate ?? undefined}
              onChange={(newValue) => setFilterHandler({ endDate: newValue })}
              slotProps={{ textField: { size: 'small', error: dateError, sx: { minWidth: 140 } } }}
            />
          </>
        )}

        <CountrySelectRemote
          id="dashboard-inline-filter-country"
          placeholder={t('dashboard.shared.filters.countryPlaceholder')}
          allLabel={t('dashboard.shared.filters.allCountries')}
          value={filters.country}
          onChange={(newValue) => setFilterHandler({ country: newValue })}
          sx={{ minWidth: 200 }}
          size="small"
        />
      </DashboardToolbar>

      <Grid container spacing={3}>
        {/* Row 1 — KPI stat tables */}
        <Grid size={{ xs: 12 }}>
          <DashboardKpiTable rawKpis={data?.rawKpis} filters={filters} search={search} />
        </Grid>

        {/* Row 2 — success rate donut + new clients list */}
        {/* <Grid size={{ xs: 12, md: 5 }}>
          <DonutCard
            title={t('dashboard.dashboard.successRate.title')}
            series={data?.successRate ? [data.successRate.successful, data.successRate.failed] : []}
            labels={[
              t('dashboard.dashboard.successRate.successful'),
              t('dashboard.dashboard.successRate.failed'),
            ]}
            legendValues={
              data?.successRate
                ? [fNumber(data.successRate.successful), fNumber(data.successRate.failed)]
                : []
            }
            total={data?.successRate ? `${data.successRate.rate}%` : ''}
            totalLabel={t('dashboard.dashboard.successRate.centerLabel')}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            loading={isLoading}
          />
        </Grid> */}

        {/* <Grid size={{ xs: 12, md: 7 }}>
          <ListWidgetCard
            title={t('dashboard.dashboard.newClients.title')}
            countBadge={
              <Label color="success" variant="soft">
                {isLoading ? '-' : fNumber(data?.newClients?.total || 0)}
              </Label>
            }
            headerAction={
              <ViewAllLink href={paths.dashboard.clients} label={t('dashboard.shared.viewAll')} />
            }
            items={newClientsItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            loading={isLoading}
          />
        </Grid> */}

        {/* Row 3 — transactions area chart + highlight tiles */}
        {/* <Grid size={{ xs: 12, md: 8 }}>
          <AreaChartCard
            title={t('dashboard.dashboard.transactions.title')}
            categories={data?.transactions?.categories || []}
            series={[
              {
                name: t('dashboard.dashboard.transactions.title'),
                data: data?.transactions?.series || [],
              },
            ]}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            loading={isLoading}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: 1 }}>
            <HighlightStatCard
              color="warning"
              bgColor={highlightCardColors.gold.bg}
              borderColor={highlightCardColors.gold.border}
              label={t('dashboard.dashboard.totalTransaction', {
                currency: data?.transactions?.currency || 'EGP',
              })}
              value={isLoading ? '-' : fShortenNumber(data?.transactions?.totalAmount || 0)}
              pattern={usdPattern}
              sx={{ flex: 1 }}
            />

            <HighlightStatCard
              color="success"
              bgColor={highlightCardColors.green.bg}
              borderColor={highlightCardColors.green.border}
              label={t('dashboard.dashboard.transactionsCount')}
              value={isLoading ? '-' : fNumber(data?.transactions?.totalCount || 0)}
              pattern={transactionPattern}
              sx={{ flex: 1 }}
            />
          </Box>
        </Grid> */}

        {/* Row 4 — top sellers + top categories */}
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <MetricListCard
            title={t('dashboard.dashboard.topSellers.title')}
            action={viewAllAction}
            items={topSellersItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            loading={isLoading}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ProgressListCard
            title={t('dashboard.dashboard.topCategories.title')}
            items={topCategoriesItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            loading={isLoading}
          />
        </Grid> */}
      </Grid>

    </DashboardContent>
  );
}
