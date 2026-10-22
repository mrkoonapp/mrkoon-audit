import type { TagType } from 'src/api/tag-report';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { EmptyContent } from 'src/components/empty-content';
import { CircleArrowButton } from 'src/components/circle-arrow-button';
import { DashboardToolbar, DashboardFiltersDrawer } from 'src/components/dashboard';

import { ReportTile } from '../components/report-tile';
import { ReportError } from '../components/report-error';
import { formatMetric, pickLocalized } from '../utils/format';
import { useTagReport, REPORT_PERIODS } from '../hooks/use-tag-report';

// ----------------------------------------------------------------------

const TAG_TYPES: { value: TagType; key: 'scrap' | 'stagnant' }[] = [
  { value: 1, key: 'scrap' },
  { value: 3, key: 'stagnant' },
];

export function TagReportView() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslate('dashboard');

  const report = useTagReport();
  const { state, dispatch, lang, numberLocale, topScorecard, scorecard, tiles } = report;

  const tr = (key: string, options?: Record<string, unknown>) =>
    t(`dashboard.tagReport.${key}`, options);

  const meta = topScorecard.data?.meta;
  const currency = meta?.country ? pickLocalized(meta.country.currency, lang) : undefined;
  const comparison = meta
    ? tr('vs', { range: fDateRangeShortLabel(meta.previousPeriod.from, meta.previousPeriod.to) })
    : undefined;

  const isError = topScorecard.isError || scorecard.isError;
  const isEmpty = topScorecard.isSuccess && !topScorecard.data.data.length;
  const tagTypeKey = TAG_TYPES.find((type) => type.value === state.filters.type)?.key ?? 'scrap';

  const retry = () => {
    topScorecard.refetch();
    scorecard.refetch();
  };

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 5 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <CircleArrowButton
          icon="eva:arrow-ios-back-fill"
          onClick={() => router.push(paths.dashboard.root)}
          sx={{ border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}
        />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {tr('title')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {tr('subtitle')}
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <ToggleButtonGroup
          size="small"
          exclusive
          value={state.filters.type}
          onChange={(_event, value: TagType | null) => {
            if (value !== null) dispatch({ type: 'setTagType', tagType: value });
          }}
        >
          {TAG_TYPES.map((type) => (
            <ToggleButton key={type.value} value={type.value} sx={{ px: 2 }}>
              {tr(`tagType.${type.key}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <DashboardToolbar
          title={
            meta
              ? fDateRangeShortLabel(meta.period.from, meta.period.to)
              : tr(`periods.${state.filters.period}`)
          }
          subtitle={tr('updatedHourly')}
          onOpenFilters={() => report.setFiltersOpen(true)}
          filterLabel={t('dashboard.shared.filter')}
          activeFilterCount={report.activeFilterCount}
          sx={{ flexGrow: 1 }}
        />
      </Stack>

      {isError ? (
        <ReportError onRetry={retry} />
      ) : isEmpty ? (
        <EmptyContent filled title={tr('states.empty', { type: tr(`tagType.${tagTypeKey}`) })} />
      ) : (
        <Box sx={{ opacity: topScorecard.isPlaceholderData ? 0.5 : 1, transition: 'opacity .2s' }}>
          <Grid container spacing={3}>
            {(tiles.length ? tiles : [null, null, null]).map((tile, index) => (
              <Grid key={tile?.key ?? index} size={{ xs: 12, sm: 4 }}>
                <ReportTile
                  label={tile ? tr(`metrics.${tile.key}`) : ''}
                  value={tile ? formatMetric(tile.key, tile.value.current, numberLocale) : null}
                  currency={tile && tile.key !== 'listingsCreated' ? currency : undefined}
                  metric={tile?.value}
                  caption={comparison}
                  locale={numberLocale}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <DashboardFiltersDrawer
        open={report.filtersOpen}
        onClose={() => report.setFiltersOpen(false)}
        filters={report.drawerFilters}
        onApply={report.applyDrawer}
        onReset={report.resetDrawer}
        hideAllCountries
        periodOptions={REPORT_PERIODS.map((period) => ({
          value: period,
          label: tr(`periods.${period}`),
        }))}
        labels={{
          title: t('dashboard.shared.filters.title'),
          date: t('dashboard.shared.filters.date'),
          period: t('dashboard.shared.filters.period'),
          country: t('dashboard.shared.filters.country'),
          countryPlaceholder: t('dashboard.shared.filters.countryPlaceholder'),
          apply: t('dashboard.shared.filters.apply'),
          reset: t('dashboard.shared.filters.reset'),
        }}
      />
    </DashboardContent>
  );
}
