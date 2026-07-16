import type { LabelColor } from 'src/components/label';
import type { TableColumn, DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fNumber, fPercent } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import {
  TagChip,
  StatCard,
  formatAmount,
  BarChartCard,
  ListWidgetCard,
  TableWidgetCard,
  DashboardToolbar,
  countActiveFilters,
  DashboardFiltersDrawer,
  defaultDashboardFilters,
} from 'src/components/dashboard';

import { inspectionsMockData } from '../data';

import type { InspectionStat } from '../data';

// ----------------------------------------------------------------------

function formatStatValue(stat: InspectionStat) {
  return stat.format === 'percent' ? `${stat.value}%` : fNumber(stat.value);
}

// ----------------------------------------------------------------------

export function InspectionsView() {
  const { t } = useTranslate('dashboard');

  const data = inspectionsMockData;

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const emptyTitle = t('dashboard.shared.empty.title');
  const emptyDescription = t('dashboard.shared.empty.description');

  // Signed percentage → colored trend pill (arrow + "%").
  const renderTrend = (value: number, color: LabelColor = value >= 0 ? 'success' : 'error') => (
    <Label
      color={color}
      variant="soft"
      startIcon={
        <Iconify icon={value >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} width={16} />
      }
    >
      {value >= 0 ? '+' : ''}
      {fPercent(value)}
    </Label>
  );

  const paymentItems = data.paymentMethods.items.map((method) => ({
    id: method.id,
    primary: method.name,
    avatar: (
      <Box
        sx={{
          width: 40,
          height: 40,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          color: `${method.color}.main`,
          bgcolor: (theme) => varAlpha(theme.vars.palette[method.color].mainChannel, 0.16),
        }}
      >
        <Iconify icon={method.icon} width={22} />
      </Box>
    ),
    badge: (
      <Label color="default" variant="soft">
        {fNumber(method.count)}
      </Label>
    ),
  }));

  const tableColumns: TableColumn[] = [
    { id: 'product', label: t('dashboard.inspections.table.product'), width: '40%' },
    { id: 'category', label: t('dashboard.inspections.table.category') },
    { id: 'successful', label: t('dashboard.inspections.table.successful'), align: 'center' },
    { id: 'totalEarning', label: t('dashboard.inspections.table.totalEarning'), align: 'right' },
    {
      id: 'inspections',
      label: t('dashboard.inspections.table.inspections'),
      align: 'center',
      hideOnMobile: true,
    },
  ];

  const tableRows = data.latestInspections.map((row) => ({
    id: row.id,
    cells: {
      product: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 220 }}>
          <Avatar
            variant="rounded"
            src={row.imageUrl}
            alt={row.product}
            sx={{ width: 48, height: 48 }}
          >
            {row.product.charAt(0)}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {row.product}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {row.description}
            </Typography>
          </Box>
        </Box>
      ),
      category: <TagChip icon={<Iconify icon={row.categoryIcon} />} label={row.category} />,
      successful: fNumber(row.successful),
      totalEarning: formatAmount(row.totalEarning, row.currency),
      inspections: renderTrend(row.trend, row.trendColor),
    },
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
          <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              label={t(`dashboard.inspections.stats.${stat.labelKey}`)}
              value={formatStatValue(stat)}
              icon={renderTrend(stat.trend)}
            />
          </Grid>
        ))}

        {/* Row 2 — inspections by category bar chart + payment methods */}
        <Grid size={{ xs: 12, md: 8 }}>
          <BarChartCard
            title={t('dashboard.inspections.byCategory')}
            categories={data.byCategory.items.map((c) => c.name)}
            series={data.byCategory.items.map((c) => c.value)}
            seriesName={t('dashboard.inspections.byCategory')}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ListWidgetCard
            title={t('dashboard.inspections.paymentMethod')}
            items={paymentItems}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </Grid>

        {/* Row 3 — latest inspections table */}
        <Grid size={{ xs: 12 }}>
          <TableWidgetCard
            title={t('dashboard.inspections.latestInspections')}
            columns={tableColumns}
            rows={tableRows}
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
