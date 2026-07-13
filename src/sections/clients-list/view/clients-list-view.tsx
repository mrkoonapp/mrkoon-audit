import type { DashboardFilters } from 'src/components/dashboard';
import type { DataListTab, DataListColumn } from 'src/components/data-list-table';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

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

import { clientsMockData } from '../data';
import { CLIENT_TAB_VALUES } from '../constants';
import { applyClientFilter, countClientsByTab, getClientStatusColor } from '../utils';

import type { ClientListItem } from '../data';
import type { ClientTabValue } from '../constants';

// ----------------------------------------------------------------------

function resolveTab(value: string | null): ClientTabValue {
  return CLIENT_TAB_VALUES.includes(value as ClientTabValue) ? (value as ClientTabValue) : 'all';
}

// ----------------------------------------------------------------------

export function ClientsListView() {
  const { t } = useTranslate('dashboard');

  const router = useRouter();
  const searchParams = useSearchParams();

  const table = useTable({ defaultOrderBy: 'name', defaultOrder: 'asc' });

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeTab = resolveTab(searchParams.get('tab'));

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const counts = useMemo(() => countClientsByTab(clientsMockData), []);

  const tabs: DataListTab[] = useMemo(
    () =>
      CLIENT_TAB_VALUES.map((value) => ({
        value,
        label: t(`dashboard.clientsList.tabs.${value}`),
        count: counts[value],
      })),
    [t, counts]
  );

  const filtered = useMemo(
    () =>
      applyClientFilter({ data: clientsMockData, search, tab: activeTab }).sort(
        getComparator(table.order, table.orderBy) as unknown as (
          a: ClientListItem,
          b: ClientListItem
        ) => number
      ),
    [search, activeTab, table.order, table.orderBy]
  );

  const pageRows = rowInPage(filtered, table.page, table.rowsPerPage);
  const notFound = filtered.length === 0;

  const handleTabChange = (value: string) => {
    table.onResetPage();
    router.push(value === 'all' ? '?' : `?tab=${value}`);
  };

  const columns: DataListColumn<ClientListItem>[] = useMemo(
    () => [
      {
        id: 'name',
        label: t('dashboard.clientsList.columns.client'),
        sortable: true,
        width: 280,
        render: (row) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar alt={row.name} src={row.image} sx={{ width: 44, height: 44 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {row.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }} noWrap>
                {row.user_code}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        id: 'phone',
        label: t('dashboard.clientsList.columns.phone'),
        hideOnMobile: true,
        render: (row) => row.phone,
      },
      {
        id: 'country',
        label: t('dashboard.clientsList.columns.country'),
        hideOnMobile: true,
        render: (row) => (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ fontSize: 20, lineHeight: 1 }}>
              {row.country.flag}
            </Box>
            {row.country.name}
          </Box>
        ),
      },
      {
        id: 'rate',
        label: t('dashboard.clientsList.columns.rate'),
        sortable: true,
        hideOnMobile: true,
        render: (row) => (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <Rating value={row.rate} precision={0.1} readOnly size="small" max={5} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {row.rate}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'wallet',
        label: t('dashboard.clientsList.columns.wallet'),
        align: 'right',
        sortable: true,
        render: (row) => `${fNumber(row.wallet)}${row.currency}`,
      },
      {
        id: 'status',
        label: t('dashboard.clientsList.columns.status'),
        align: 'center',
        sortable: true,
        render: (row) => (
          <Label variant="soft" color={getClientStatusColor(row.status)}>
            {t(`dashboard.clientsList.status.${row.status}`)}
          </Label>
        ),
      },
    ],
    [t]
  );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('dashboard.clientsList.title')}
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
        selectable
        pageRowIds={pageRows.map((row) => String(row.id))}
        onViewRow={() => {}}
        viewLabel={t('dashboard.shared.view')}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
        }}
      />
    </DashboardContent>
  );
}
