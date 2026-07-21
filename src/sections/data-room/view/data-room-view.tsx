import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { useDataRoom } from '../hooks/use-data-room';
import { DataRoomHeader, DataRoomKpiCard, DataRoomChartCard } from '../components';

// ----------------------------------------------------------------------

export function DataRoomView() {
  const {
    theme,
    selectedCountry,
    setSelectedCountry,
    search,
    setSearch,
    selectedTab,
    setSelectedTab,
    selectedQuarter,
    setSelectedQuarter,
    selectedPeriodType,
    setSelectedPeriodType,
    activeData,
    egyptChartOptions,
    saudiChartOptions,
    egyptSeries,
    saudiSeries,
    performanceTabs,
    onViewAll,
  } = useDataRoom();

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 5 }}>
      {/* Header component */}
      <DataRoomHeader
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        search={search}
        onSearchChange={setSearch}
        selectedPeriodType={selectedPeriodType}
        onPeriodTypeChange={setSelectedPeriodType}
        selectedQuarter={selectedQuarter}
        onQuarterChange={setSelectedQuarter}
      />

      {/* Row 1 — KPI Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {activeData.kpis.map((kpi) => (
          <Grid key={kpi.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <DataRoomKpiCard kpi={kpi} />
          </Grid>
        ))}
      </Grid>

      {/* Performance Analytics Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3, mt: 5 }}>
        <Box sx={{ width: 4, height: 24, borderRadius: '4px', bgcolor: '#BF8654' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Performance Analytics
        </Typography>
      </Stack>

      {/* Pill Tab Selector */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 4,
          pb: 1,
          overflowX: 'auto',
          maxWidth: '100%',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 3,
            bgcolor: 'action.hover',
          },
        }}
      >
        {performanceTabs.map((tab) => {
          const isActive = selectedTab === tab.value;
          return (
            <Button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              startIcon={<Iconify icon={tab.icon as any} width={20} />}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                flexShrink: 0,
                fontSize: '14px',
                transition: theme.transitions.create(['background-color', 'color']),
                ...(isActive
                  ? {
                      bgcolor: 'common.white',
                      color: 'grey.900',
                      boxShadow: theme.customShadows?.z8,
                      '&:hover': { bgcolor: 'common.white' },
                    }
                  : {
                      bgcolor: theme.palette.mode === 'dark' ? '#161D26' : '#F4F6F8',
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? '#1D2734' : '#E5E8EB',
                      },
                    }),
              }}
            >
              {tab.label}
            </Button>
          );
        })}
      </Stack>

      {/* Row 2 — Double Charts Grid */}
      <Grid container spacing={3}>
        {/* Egypt Chart Card */}
        {(selectedCountry === 'all' || selectedCountry === 'egypt') && (
          <Grid size={{ xs: 12, md: selectedCountry === 'all' ? 6 : 12 }}>
            <DataRoomChartCard
              countryName="Egypt"
              countryCode="EG"
              total={activeData.egyptTotal}
              trend={activeData.egyptTrend}
              trendDirection={activeData.egyptTrendDirection}
              series={egyptSeries}
              options={egyptChartOptions}
              onViewAll={onViewAll}
            />
          </Grid>
        )}

        {/* Saudi Arabia Chart Card */}
        {(selectedCountry === 'all' || selectedCountry === 'ksa') && (
          <Grid size={{ xs: 12, md: selectedCountry === 'all' ? 6 : 12 }}>
            <DataRoomChartCard
              countryName="Saudi Arabia"
              countryCode="SA"
              total={activeData.saudiTotal}
              trend={activeData.saudiTrend}
              trendDirection={activeData.saudiTrendDirection}
              series={saudiSeries}
              options={saudiChartOptions}
              onViewAll={onViewAll}
            />
          </Grid>
        )}
      </Grid>
    </DashboardContent>
  );
}
