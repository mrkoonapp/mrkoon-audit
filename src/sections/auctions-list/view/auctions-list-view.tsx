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
import { useGetAuctionsList } from 'src/api/audit';
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

import { auctionsListMockData } from '../data';
import { applyAuctionFilter, getAuctionStatusColor } from '../utils';

import type { AuctionListItem, AuctionListStatus } from '../data';

// ----------------------------------------------------------------------

export function AuctionsListView() {
  const { t } = useTranslate('dashboard');

  const table = useTable({ defaultOrderBy: 'created_at', defaultOrder: 'desc' });

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFiltersHandler, clearFilters } =
    useCustomFilter<DashboardFilters>(defaultDashboardFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const { data: apiRes } = useGetAuctionsList(filters, table.page + 1, table.rowsPerPage, search);

  const filtered = useMemo(
    () =>
      applyAuctionFilter({ data: auctionsListMockData, search, filters }).sort(
        getComparator(table.order, table.orderBy)
      ),
    [search, filters, table.order, table.orderBy]
  );

  const realRows = useMemo(() => {
    if (!apiRes) return null;
    return apiRes.data.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image || '',
      start_price: item.start_price,
      high_price: item.highest_price,
      currency: ' EGP',
      status: (item.status === 'active' ? 'running' : item.status) as AuctionListStatus,
      bidders: item.bidders_count,
      created_at: item.created_at,
    }));
  }, [apiRes]);

  const pageRows = realRows ?? rowInPage(filtered, table.page, table.rowsPerPage);
  const totalRows = apiRes ? apiRes.total : filtered.length;
  const notFound = pageRows.length === 0;

  const columns: DataListColumn<AuctionListItem>[] = useMemo(
    () => [
      {
        id: 'name',
        label: t('dashboard.auctionsList.columns.auction'),
        sortable: true,
        width: 360,
        render: (row) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              variant="rounded"
              alt={row.name}
              src={row.image}
              sx={{ width: 48, height: 48 }}
            />
            <Typography
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {row.name}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'start_price',
        label: t('dashboard.auctionsList.columns.startPrice'),
        align: 'right',
        sortable: true,
        render: (row) => `${fNumber(row.start_price)}${row.currency}`,
      },
      {
        id: 'high_price',
        label: t('dashboard.auctionsList.columns.highestPrice'),
        align: 'right',
        sortable: true,
        render: (row) => `${fNumber(row.high_price)}${row.currency}`,
      },
      {
        id: 'status',
        label: t('dashboard.auctionsList.columns.status'),
        align: 'center',
        sortable: true,
        render: (row) => (
          <Label variant="soft" color={getAuctionStatusColor(row.status)}>
            {t(`dashboard.auctionsList.status.${row.status}`)}
          </Label>
        ),
      },
      {
        id: 'bidders',
        label: t('dashboard.auctionsList.columns.bidders'),
        align: 'right',
        sortable: true,
        hideOnMobile: true,
        render: (row) => fNumber(row.bidders),
      },
      {
        id: 'created_at',
        label: t('dashboard.auctionsList.columns.date'),
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
        {t('dashboard.auctionsList.title')}
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
        totalRows={totalRows}
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
          periodAllTime: t('dashboard.shared.filters.periodAllTime'),
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
