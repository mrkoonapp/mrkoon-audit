import type { ScorecardRow } from 'src/api/tag-report';

import { useTheme } from '@mui/material/styles';

import { useTranslate } from 'src/locales';

import { WidgetCard } from 'src/components/dashboard';
import { Chart, useChart } from 'src/components/chart';

import { formatMetric, pickLocalized } from '../utils/format';

// ----------------------------------------------------------------------

const TOP = 10;
const BAR_HEIGHT = 36;

type Props = {
  rows: ScorecardRow[];
  loading: boolean;
  currency?: string;
  lang: string;
  locale: string;
};

/**
 * The top tags by revenue, largest first. Drawn with `Chart` directly: the
 * shared bar card formats the category axis as numbers (NaN when horizontal).
 * One color: these are values, not good or bad.
 */
export function RevenueBars({ rows, loading, currency, lang, locale }: Props) {
  const theme = useTheme();
  const { t } = useTranslate('dashboard');
  const tr = (key: string, options?: Record<string, unknown>) =>
    t(`dashboard.tagReport.${key}`, options);

  const bars = rows
    .filter((row) => (row.metrics.mrkoonRevenue.current ?? 0) > 0)
    .sort((a, b) => (b.metrics.mrkoonRevenue.current ?? 0) - (a.metrics.mrkoonRevenue.current ?? 0))
    .slice(0, TOP);

  const name = (row: ScorecardRow) => {
    const text = pickLocalized(row.tag.name, lang);
    return row.tag.isDirect ? tr('table.direct', { name: text }) : text;
  };

  const money = (value: number) => {
    const text = formatMetric('mrkoonRevenue', value, locale);
    return currency ? `${text} ${currency}` : text;
  };

  const options = useChart({
    colors: [theme.palette.info.main],
    stroke: { show: false },
    legend: { show: false },
    grid: { yaxis: { lines: { show: false } }, xaxis: { lines: { show: true } } },
    xaxis: {
      categories: bars.map(name),
      labels: {
        formatter: (value: string) => formatMetric('mrkoonRevenue', Number(value), locale),
      },
    },
    yaxis: { labels: { formatter: (value: string | number) => String(value), maxWidth: 160 } },
    tooltip: { y: { formatter: (value: number) => money(value) } },
    dataLabels: {
      enabled: true,
      offsetX: 28,
      formatter: (value: number) => formatMetric('mrkoonRevenue', value, locale),
      style: { colors: [theme.vars.palette.text.secondary], fontWeight: 600 },
    },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, barHeight: '60%', dataLabels: { position: 'top' } },
    },
  });

  return (
    <WidgetCard
      title={tr('bars.title')}
      subheader={currency ? tr('bars.subheader', { currency }) : undefined}
      loading={loading}
      empty={!bars.length}
      emptyTitle={tr('bars.empty')}
    >
      <Chart
        type="bar"
        series={[
          {
            name: tr('metrics.mrkoonRevenue'),
            data: bars.map((r) => r.metrics.mrkoonRevenue.current ?? 0),
          },
        ]}
        options={options}
        sx={{ height: Math.max(200, bars.length * BAR_HEIGHT + 60) }}
      />
    </WidgetCard>
  );
}
