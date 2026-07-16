import type { DashboardFilters } from 'src/components/dashboard';
import type { DataListColumn } from 'src/components/data-list-table';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { DataListTable } from 'src/components/data-list-table';
import { useTable, rowInPage, getComparator } from 'src/components/table';
import {
  DashboardToolbar,
  countActiveFilters,
  DashboardFiltersDrawer,
  defaultDashboardFilters,
} from 'src/components/dashboard';

import { productsMockData } from '../data';
import { applyProductFilter, getProductStatusColor } from '../utils';

import type { ProductListItem } from '../data';

// ----------------------------------------------------------------------

export function ProductsListView() {
  const { t } = useTranslate('dashboard');

  const table = useTable({ defaultOrderBy: 'created_at', defaultOrder: 'desc' });

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const filtered = useMemo(
    () =>
      applyProductFilter({ data: productsMockData, search, filters }).sort(
        getComparator(table.order, table.orderBy)
      ),
    [search, filters, table.order, table.orderBy]
  );

  const pageRows = rowInPage(filtered, table.page, table.rowsPerPage);
  const notFound = filtered.length === 0;

  const columns: DataListColumn<ProductListItem>[] = useMemo(
    () => [
      {
        id: 'name',
        label: t('dashboard.productsList.columns.product'),
        sortable: true,
        width: 320,
        render: (row) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              variant="rounded"
              alt={row.name}
              src={row.logo}
              sx={{ width: 48, height: 48 }}
            />
            <Typography variant="subtitle2" sx={{ minWidth: 0 }} noWrap>
              {row.name}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'category',
        label: t('dashboard.productsList.columns.category'),
        sortable: true,
        hideOnMobile: true,
        render: (row) => row.category,
      },
      {
        id: 'seller',
        label: t('dashboard.productsList.columns.seller'),
        sortable: true,
        hideOnMobile: true,
        render: (row) => row.seller,
      },
      {
        id: 'start_price',
        label: t('dashboard.productsList.columns.startPrice'),
        align: 'right',
        sortable: true,
        render: (row) => `${fNumber(row.start_price)}${row.currency}`,
      },
      {
        id: 'quantity',
        label: t('dashboard.productsList.columns.quantity'),
        align: 'right',
        sortable: true,
        hideOnMobile: true,
        render: (row) => `${fNumber(row.quantity)} ${row.unit}`,
      },
      {
        id: 'status',
        label: t('dashboard.productsList.columns.status'),
        align: 'center',
        sortable: true,
        render: (row) => (
          <Label variant="soft" color={getProductStatusColor(row.status)}>
            {t(`dashboard.productsList.status.${row.status}`)}
          </Label>
        ),
      },
      {
        id: 'created_at',
        label: t('dashboard.productsList.columns.date'),
        align: 'right',
        sortable: true,
        hideOnMobile: true,
        render: (row) => fDate(row.created_at),
      },
    ],
    [t]
  );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('dashboard.productsList.title')}
      </Typography>

      <DashboardToolbar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          table.onResetPage();
        }}
        onOpenFilters={() => setFiltersOpen(true)}
        searchPlaceholder={t('dashboard.shared.search')}
        filterLabel={t('dashboard.shared.filter')}
        activeFilterCount={activeFilterCount}
      />

      <DataListTable
        columns={columns}
        rows={pageRows}
        totalRows={filtered.length}
        table={table}
        getRowId={(row) => String(row.id)}
        onViewRow={() => {}}
        viewLabel={t('dashboard.shared.view')}
        notFound={notFound}
      />

      <DashboardFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={(next) => {
          setFiltersHandler(next);
          table.onResetPage();
        }}
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
