import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { useGetHomeKpis } from 'src/api/home-kpis';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { DUMMY_SUMMARY_TRENDS } from '../data';
import { OVERVIEW_ACCENTS } from '../constants';
import { matchesSearch, buildDashboardOverview, getOverviewDefaultFilters } from '../utils';
import {
  SellersBarsIcon,
  BuyersRadialIcon,
  OverviewUsersCard,
  OverviewCountryTabs,
  OverviewSummaryCard,
  OverviewPeriodFilter,
  OverviewAuctionsCard,
  OverviewTopCategories,
  OverviewProductsChart,
  OverviewPayRequestsCard,
  OverviewTransactionsCard,
} from '../components';

// ----------------------------------------------------------------------

export function DashboardView() {
  const { t, currentLang } = useTranslate('dashboard');

  const [search, setSearch] = useState('');

  const { filters, setFilterHandler } = useCustomFilter<DashboardFilters>(
    getOverviewDefaultFilters()
  );

  const { data: kpis, isLoading, isError, refetch } = useGetHomeKpis(filters);

  const overview = useMemo(
    () => (kpis ? buildDashboardOverview(kpis, currentLang.value) : undefined),
    [kpis, currentLang.value]
  );

  const label = (key: string) => t(`dashboard.dashboard.overview.${key}`);
  const visible = (title: string) => matchesSearch(title, search);

  const summary = overview?.summary;

  const summaryCards = [
    {
      id: 'gmv',
      label: label('summary.gmv'),
      stat: summary?.gmv,
      suffix: label('currency'),
      trend: DUMMY_SUMMARY_TRENDS.gmv,
    },
    {
      id: 'products',
      label: label('summary.totalProducts'),
      stat: summary?.products,
      trend: DUMMY_SUMMARY_TRENDS.products,
    },
    {
      id: 'buyers',
      label: label('summary.totalBuyers'),
      stat: summary?.buyers,
      trend: DUMMY_SUMMARY_TRENDS.buyers,
    },
    {
      id: 'sellers',
      label: label('summary.totalSellers'),
      stat: summary?.sellers,
      trend: DUMMY_SUMMARY_TRENDS.sellers,
    },
  ].filter((card) => visible(card.label));

  const widgets = [
    {
      id: 'products',
      title: label('productsKpis.title'),
      size: { xs: 12, md: 7, lg: 8 },
      node: <OverviewProductsChart data={overview?.productsChart} loading={isLoading} />,
    },
    {
      id: 'categories',
      title: label('topCategories.title'),
      size: { xs: 12, md: 5, lg: 4 },
      node: (
        <OverviewTopCategories categories={overview?.topCategories ?? []} loading={isLoading} />
      ),
    },
    {
      id: 'buyers',
      title: label('buyers.title'),
      size: { xs: 12, sm: 6, md: 4 },
      node: (
        <OverviewUsersCard
          title={label('buyers.title')}
          accent={OVERVIEW_ACCENTS.buyers}
          icon={<BuyersRadialIcon />}
          users={overview?.buyers}
          loading={isLoading}
        />
      ),
    },
    {
      id: 'sellers',
      title: label('sellers.title'),
      size: { xs: 12, sm: 6, md: 4 },
      node: (
        <OverviewUsersCard
          title={label('sellers.title')}
          accent={OVERVIEW_ACCENTS.sellers}
          icon={<SellersBarsIcon />}
          users={overview?.sellers}
          loading={isLoading}
        />
      ),
    },
    {
      id: 'auctions',
      title: label('auctions.title'),
      size: { xs: 12, md: 4 },
      node: <OverviewAuctionsCard auctions={overview?.auctions} loading={isLoading} />,
    },
    {
      id: 'payRequests',
      title: label('payRequests.title'),
      size: { xs: 12, md: 4 },
      node: <OverviewPayRequestsCard />,
    },
    {
      id: 'transactions',
      title: label('transactions.title'),
      size: { xs: 12, md: 8 },
      node: <OverviewTransactionsCard />,
    },
  ].filter((widget) => visible(widget.title));

  const renderContent = () => {
    if (isError) {
      return (
        <EmptyContent
          filled
          title={label('error.title')}
          description={label('error.description')}
          action={
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => refetch()}
              startIcon={<Iconify icon="solar:restart-bold" />}
              sx={{ mt: 2 }}
            >
              {label('error.retry')}
            </Button>
          }
          sx={{ py: 10 }}
        />
      );
    }

    if (!summaryCards.length && !widgets.length) {
      return (
        <EmptyContent
          filled
          title={label('noResults.title')}
          description={label('noResults.description')}
          sx={{ py: 10 }}
        />
      );
    }

    return (
      <Grid container spacing={3}>
        {summaryCards.map((card) => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewSummaryCard
              label={card.label}
              total={card.stat?.total ?? 0}
              suffix={
                card.suffix ??
                (card.stat?.active !== undefined
                  ? t('dashboard.dashboard.overview.summary.active', {
                      value: fNumber(card.stat.active),
                    })
                  : undefined)
              }
              split={card.stat?.split ?? { EG: 0, SA: 0 }}
              trend={card.trend}
              loading={isLoading}
            />
          </Grid>
        ))}

        {widgets.map((widget) => (
          <Grid key={widget.id} size={widget.size}>
            {widget.node}
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <DashboardContent maxWidth="xl">
      {/* Header — title + country tabs */}
      <Box
        sx={{
          mb: 3,
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h5">{label('title')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {label('subtitle')}
          </Typography>
        </Box>

        <OverviewCountryTabs
          value={filters.country}
          onChange={(country) => setFilterHandler({ country })}
        />
      </Box>

      {/* Toolbar — search + period */}
      <Box
        sx={{
          mb: 3,
          gap: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('dashboard.shared.search')}
          sx={{ width: { xs: 1, sm: 320 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <OverviewPeriodFilter filters={filters} onChange={setFilterHandler} />
      </Box>

      {renderContent()}
    </DashboardContent>
  );
}
