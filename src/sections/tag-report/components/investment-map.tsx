import { useTheme } from '@mui/material/styles';

import { useTranslate } from 'src/locales';

import { WidgetCard } from 'src/components/dashboard';
import { Chart, useChart } from 'src/components/chart';

import { formatMetric, pickLocalized } from '../utils/format';

import type { QuadrantMap } from '../utils/quadrant';

// ----------------------------------------------------------------------

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

type Props = {
  map: QuadrantMap;
  /** All Top Tags, plotted or not. */
  total: number;
  loading: boolean;
  lang: string;
  locale: string;
};

/**
 * Top Tags by buyers per active listing (log scale) and sell-through. ApexCharts
 * has no log x axis, so x is plotted as log10 and the ticks are turned back.
 * Dot colors carry the quadrant; dashed lines are the medians.
 */
export function InvestmentMap({ map, total, loading, lang, locale }: Props) {
  const theme = useTheme();
  const { t } = useTranslate('dashboard');
  const tr = (key: string, options?: Record<string, unknown>) =>
    t(`dashboard.tagReport.${key}`, options);

  const groups = [
    {
      name: tr('quadrant.needsSellers'),
      color: theme.palette.primary.main,
      quadrant: 'needsSellers',
    },
    {
      name: tr('quadrant.needsBuyers'),
      color: theme.palette.warning.main,
      quadrant: 'needsBuyers',
    },
    { name: tr('quadrant.other'), color: theme.palette.info.main, quadrant: null },
  ] as const;

  const pointsByGroup = groups.map((group) =>
    map.points.filter((p) => map.quadrantOf(p.id) === group.quadrant)
  );

  const series = groups.map((group, index) => ({
    name: group.name,
    data: pointsByGroup[index].map((p) => ({ x: Math.log10(p.x), y: p.y })),
  }));

  // Ticks on whole decades (1, 10, 100) read better than evenly spaced logs.
  const logs = map.points.map((p) => Math.log10(p.x));
  const minLog = logs.length ? Math.floor(Math.min(...logs)) : 0;
  const maxLog = logs.length ? Math.max(Math.ceil(Math.max(...logs)), minLog + 1) : 1;
  const tickLabel = (log: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: log < 0 ? 1 : 0 }).format(10 ** log);

  const nameOf = (seriesIndex: number, dataPointIndex: number) => {
    const point = pointsByGroup[seriesIndex]?.[dataPointIndex];
    return point ? pickLocalized(point.row.tag.name, lang) : '';
  };

  const medianLine = { borderColor: theme.palette.text.disabled, strokeDashArray: 4 };

  const options = useChart({
    chart: { type: 'scatter', zoom: { enabled: false } },
    colors: groups.map((group) => group.color),
    markers: { size: 7, strokeWidth: 0 },
    legend: { show: true, position: 'top', horizontalAlign: 'right' },
    dataLabels: {
      enabled: true,
      offsetY: -12,
      formatter: (_value, { seriesIndex, dataPointIndex }) => nameOf(seriesIndex, dataPointIndex),
      background: { enabled: false },
      style: { fontSize: '11px', fontWeight: 600, colors: [theme.vars.palette.text.secondary] },
    },
    xaxis: {
      type: 'numeric',
      min: minLog,
      max: maxLog,
      tickAmount: maxLog - minLog,
      title: { text: tr('metrics.buyersPerActive') },
      labels: { formatter: (v) => tickLabel(Number(v)) },
    },
    yaxis: {
      min: 0,
      max: 100,
      title: { text: tr('metrics.sellThroughPct') },
      labels: { formatter: (v) => formatMetric('sellThroughPct', v, locale) },
    },
    annotations: map.medians
      ? {
          xaxis: [{ x: Math.log10(map.medians.buyersPerActive), ...medianLine }],
          yaxis: [{ y: map.medians.sellThroughPct, ...medianLine }],
        }
      : {},
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex }) => {
        const point = pointsByGroup[seriesIndex]?.[dataPointIndex];
        if (!point) return '';
        const { metrics } = point.row;
        const text = tr('quadrant.tooltip', {
          buyers: formatMetric('interestedBuyers', metrics.interestedBuyers.current, locale),
          ratio: formatMetric('buyersPerActive', point.x, locale),
          sellThrough: formatMetric('sellThroughPct', point.y, locale),
        });
        return `<div style="padding:8px 12px"><b>${escapeHtml(
          pickLocalized(point.row.tag.name, lang)
        )}</b><br/>${escapeHtml(text)}</div>`;
      },
    },
  });

  return (
    <WidgetCard
      title={tr('quadrant.title')}
      subheader={`${tr('quadrant.subheader')} · ${tr('quadrant.plotted', {
        count: map.points.length,
        total,
      })}`}
      loading={loading}
      empty={!map.points.length}
      emptyTitle={tr('quadrant.empty')}
    >
      <Chart type="scatter" series={series} options={options} sx={{ height: 360 }} />
    </WidgetCard>
  );
}
