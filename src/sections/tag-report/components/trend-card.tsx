import type { Trend, MetricKey, ReportPeriod } from 'src/api/tag-report';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { WidgetCard } from 'src/components/dashboard';
import { Chart, useChart } from 'src/components/chart';

import { isMetricDisabled } from '../utils/flow';
import { METRIC_ORDER } from './scorecard-table';
import { formatMetric, METRIC_FORMAT, pickLocalized } from '../utils/format';

// ----------------------------------------------------------------------

const BUCKETS: ReportPeriod[] = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

/** The API labels are English; Arabic labels are built from the bucket start. */
function bucketLabel(point: Trend['data'][number], bucket: ReportPeriod, lang: string) {
  if (!lang.startsWith('ar') || bucket === 'quarterly') return point.label;
  const options: Intl.DateTimeFormatOptions =
    bucket === 'yearly'
      ? { year: 'numeric' }
      : bucket === 'monthly'
        ? { month: 'long', year: 'numeric' }
        : { day: 'numeric', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat(lang, options).format(new Date(point.from));
}

type Props = {
  trend: Trend | undefined;
  loading: boolean;
  stale: boolean;
  metric: MetricKey;
  bucket: ReportPeriod;
  isChild: boolean;
  /** The trend shows the open Top Tag, which also covers its direct listings. */
  showDirectNote: boolean;
  onMetric: (metric: MetricKey) => void;
  onBucket: (bucket: ReportPeriod) => void;
  currency?: string;
  lang: string;
  locale: string;
};

export function TrendCard({
  trend,
  loading,
  stale,
  metric,
  bucket,
  isChild,
  showDirectNote,
  onMetric,
  onBucket,
  currency,
  lang,
  locale,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslate('dashboard');
  const tr = (key: string, options?: Record<string, unknown>) =>
    t(`dashboard.tagReport.${key}`, options);

  const points = trend?.data ?? [];
  const format = METRIC_FORMAT[metric];
  const withCurrency = (text: string) =>
    format === 'money' && currency ? `${text} ${currency}` : text;

  // A null point is a break in the line, never a zero.
  const series = [{ name: tr(`metrics.${metric}`), data: points.map((p) => p.value) }];

  const lastIndex = points.map((p) => p.value !== null).lastIndexOf(true);
  const last = lastIndex >= 0 ? points[lastIndex] : null;

  const options = useChart({
    chart: { type: 'area', zoom: { enabled: false } },
    colors: [theme.palette.info.main],
    stroke: { width: 2.5 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
    markers: { size: 3, strokeWidth: 0 },
    xaxis: { categories: points.map((p) => bucketLabel(p, bucket, lang)) },
    yaxis:
      format === 'rate'
        ? { min: 0, max: 100, labels: { formatter: (v) => formatMetric(metric, v, locale) } }
        : { min: 0, labels: { formatter: (v) => formatMetric(metric, v, locale) } },
    annotations: last
      ? {
          points: [
            {
              x: bucketLabel(last, bucket, lang),
              y: last.value as number,
              marker: { size: 5, fillColor: theme.palette.info.main, strokeWidth: 0 },
              label: {
                text: withCurrency(formatMetric(metric, last.value, locale)),
                borderWidth: 0,
                style: {
                  background: 'transparent',
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                },
              },
            },
          ],
        }
      : {},
    tooltip: {
      x: {
        formatter: (_value, { dataPointIndex }) => {
          const point = points[dataPointIndex];
          return point ? `${fDate(point.from)} – ${fDate(point.to)}` : '';
        },
      },
      y: {
        formatter: (value: number | null) =>
          value === null ? tr('trend.noValue') : withCurrency(formatMetric(metric, value, locale)),
      },
    },
  });

  const title = trend
    ? `${tr('trend.title')} · ${pickLocalized(trend.meta.tag.name, lang)}`
    : tr('trend.title');

  return (
    <WidgetCard
      title={title}
      subheader={showDirectNote ? tr('trend.directNote') : undefined}
      headerAction={
        <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
          <TextField
            select
            size="small"
            label={tr('trend.metric')}
            value={metric}
            onChange={(event) => onMetric(event.target.value as MetricKey)}
            sx={{ minWidth: 200 }}
          >
            {METRIC_ORDER.map((key) => (
              <MenuItem key={key} value={key} disabled={isMetricDisabled(key, isChild)}>
                {tr(`metrics.${key}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={tr('trend.bucket')}
            value={bucket}
            onChange={(event) => onBucket(event.target.value as ReportPeriod)}
            sx={{ minWidth: 130 }}
          >
            {BUCKETS.map((key) => (
              <MenuItem key={key} value={key}>
                {tr(`trend.buckets.${key}`)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      }
      loading={loading}
      empty={!points.length}
      emptyTitle={tr('trend.empty')}
    >
      {points.every((p) => p.value === null) && points.length ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
          {tr('trend.noValue')}
        </Typography>
      ) : (
        <Chart
          type="area"
          series={series}
          options={options}
          sx={{ height: 320, opacity: stale ? 0.5 : 1, transition: 'opacity .2s' }}
        />
      )}
    </WidgetCard>
  );
}
