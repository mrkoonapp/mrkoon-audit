import type { ScorecardRow } from 'src/api/tag-report';

import { useTheme } from '@mui/material/styles';

import { useTranslate } from 'src/locales';

import { BarChartCard } from 'src/components/dashboard';

import { pickLocalized } from '../utils/format';

// ----------------------------------------------------------------------

type Props = {
  rows: ScorecardRow[];
  loading: boolean;
  currency?: string;
  lang: string;
};

/** Revenue per row, largest first. One color: these are values, not good or bad. */
export function RevenueBars({ rows, loading, currency, lang }: Props) {
  const theme = useTheme();
  const { t } = useTranslate('dashboard');

  const bars = rows
    .filter((row) => row.metrics.mrkoonRevenue.current !== null)
    .sort(
      (a, b) => (b.metrics.mrkoonRevenue.current ?? 0) - (a.metrics.mrkoonRevenue.current ?? 0)
    );

  const name = (row: ScorecardRow) => {
    const text = pickLocalized(row.tag.name, lang);
    return row.tag.isDirect ? t('dashboard.tagReport.table.direct', { name: text }) : text;
  };

  const metricLabel = t('dashboard.tagReport.metrics.mrkoonRevenue');

  return (
    <BarChartCard
      title={t('dashboard.tagReport.bars.title')}
      categories={bars.map(name)}
      series={bars.map((row) => row.metrics.mrkoonRevenue.current ?? 0)}
      seriesName={currency ? `${metricLabel} (${currency})` : metricLabel}
      colors={[theme.palette.info.main]}
      horizontal
      distributed={false}
      height={Math.max(240, bars.length * 36)}
      loading={loading}
      empty={!bars.length}
      emptyTitle={t('dashboard.tagReport.bars.empty')}
    />
  );
}
