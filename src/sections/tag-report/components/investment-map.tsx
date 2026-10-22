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
  loading: boolean;
  lang: string;
  locale: string;
};

/**
 * Top Tags by buyers per active listing (log scale) and sell-through. ApexCharts
 * has no log x axis, so x is plotted as log10 and the ticks are turned back.
 * Dot colors carry the quadrant; dashed lines are the medians.
 */
export function InvestmentMap({ map, loading, lang, locale }: Props) {
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

  const medianLine = { borderColor: theme.palette.text.disabled, strokeDashArray: 4 };

  const options = useChart({
    chart: { type: 'scatter', zoom: { enabled: false } },
    colors: groups.map((group) => group.color),
    markers: { size: 7, strokeWidth: 0 },
    legend: { show: true, position: 'top', horizontalAlign: 'right' },
    xaxis: {
      type: 'numeric',
      tickAmount: 5,
      title: { text: tr('metrics.buyersPerActive') },
      labels: { formatter: (v) => formatMetric('buyersPerActive', 10 ** Number(v), locale) },
    },
    yaxis: {
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
      subheader={tr('quadrant.subheader')}
      loading={loading}
      empty={!map.points.length}
      emptyTitle={tr('quadrant.empty')}
    >
      <Chart type="scatter" series={series} options={options} sx={{ height: 360 }} />
    </WidgetCard>
  );
}
