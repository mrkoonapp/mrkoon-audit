import type { TagType } from 'src/api/tag-report';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
import { CountrySelectRemote } from 'src/components/country-select';
import { CircleArrowButton } from 'src/components/circle-arrow-button';

import { TrendCard } from '../components/trend-card';
import { ReportTile } from '../components/report-tile';
import { ReportError } from '../components/report-error';
import { RevenueBars } from '../components/revenue-bars';
import { InvestmentMap } from '../components/investment-map';
import { formatMetric, pickLocalized } from '../utils/format';
import { ScorecardTable } from '../components/scorecard-table';
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
  const previousRange = meta
    ? fDateRangeShortLabel(meta.previousPeriod.from, meta.previousPeriod.to)
    : undefined;
  const comparison = previousRange ? tr('vs', { range: previousRange }) : undefined;

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
        useFlexGap
        flexWrap="wrap"
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

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ flexGrow: 1 }}>
          {REPORT_PERIODS.map((period) => {
            const selected = state.filters.period === period;
            return (
              <Chip
                key={period}
                label={tr(`periods.${period}`)}
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                onClick={() => dispatch({ type: 'setPeriod', period })}
              />
            );
          })}
        </Stack>

        <Box sx={{ width: { xs: 1, md: 220 } }}>
          <CountrySelectRemote
            id="tag-report-country"
            fullWidth
            hideAll
            placeholder={t('dashboard.shared.filters.countryPlaceholder')}
            value={String(state.filters.countryId)}
            onChange={(value) => {
              if (value) dispatch({ type: 'setCountry', countryId: Number(value) });
            }}
          />
        </Box>
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5, mb: 3 }}>
        {meta ? (
          <>
            <Box component="b" sx={{ color: 'text.primary' }}>
              {fDateRangeShortLabel(meta.period.from, meta.period.to)}
            </Box>
            {` · ${comparison} · `}
          </>
        ) : null}
        {tr('updatedHourly')}
      </Typography>

      {isError ? (
        <ReportError onRetry={retry} />
      ) : isEmpty ? (
        <EmptyContent filled title={tr('states.empty', { type: tr(`tagType.${tagTypeKey}`) })} />
      ) : (
        <Box>
          <Grid
            container
            spacing={3}
            sx={{ opacity: topScorecard.isPlaceholderData ? 0.5 : 1, transition: 'opacity .2s' }}
          >
            {(tiles.length ? tiles : [null, null, null]).map((tile, index) => (
              <Grid key={tile?.key ?? index} size={{ xs: 12, sm: 4 }}>
                <ReportTile
                  metricKey={tile?.key ?? null}
                  label={tile ? tr(`metrics.${tile.key}`) : ''}
                  value={tile ? formatMetric(tile.key, tile.value.current, numberLocale) : null}
                  currency={tile && tile.key !== 'listingsCreated' ? currency : undefined}
                  metric={tile?.value}
                  caption={comparison}
                  previous={
                    tile && previousRange
                      ? tr('previousValue', {
                          range: previousRange,
                          value: `${formatMetric(tile.key, tile.value.previous, numberLocale)}${
                            tile.key !== 'listingsCreated' && currency ? ` ${currency}` : ''
                          }`,
                        })
                      : undefined
                  }
                  locale={numberLocale}
                />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* The map is for Top Tags only. */}
            {!state.parentId && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InvestmentMap
                  map={report.quadrants}
                  total={report.topRows.length}
                  loading={topScorecard.isLoading}
                  lang={lang}
                  locale={numberLocale}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: state.parentId ? 12 : 6 }}>
              <RevenueBars
                rows={report.rows}
                loading={scorecard.isLoading}
                currency={currency}
                lang={lang}
                locale={numberLocale}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <TrendCard
              trend={report.trendQuery.data}
              loading={
                report.trendQuery.isLoading ||
                (!report.trendQuery.data && report.trendTagId === null)
              }
              stale={report.trendQuery.isPlaceholderData}
              metric={state.trend.metric}
              bucket={state.trend.bucket}
              isChild={state.trend.isChild}
              showDirectNote={state.parentId !== null && report.trendTagId === state.parentId}
              onMetric={(metric) => dispatch({ type: 'setTrendMetric', metric })}
              onBucket={(bucket) => dispatch({ type: 'setBucket', bucket })}
              currency={currency}
              lang={lang}
              locale={numberLocale}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <ScorecardTable
              rows={report.rows}
              loading={scorecard.isLoading}
              stale={scorecard.isPlaceholderData}
              sort={state.sort}
              onSort={(sort) => dispatch({ type: 'setSort', sort })}
              parent={report.parentRow}
              onBack={() => dispatch({ type: 'backToTopTags' })}
              onOpenTopTag={(tagId) => dispatch({ type: 'openTopTag', tagId })}
              onSelectChild={(tagId) => dispatch({ type: 'selectChild', tagId })}
              onSelectDirect={() => dispatch({ type: 'selectDirect' })}
              selectedTagId={report.trendTagId}
              quadrantOf={report.quadrants.quadrantOf}
              previousRange={previousRange}
              currency={currency}
              lang={lang}
              locale={numberLocale}
            />
          </Box>
        </Box>
      )}
    </DashboardContent>
  );
}
