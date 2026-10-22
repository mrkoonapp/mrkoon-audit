import type { Localized, MetricKey } from 'src/api/tag-report';

// ----------------------------------------------------------------------

export type MetricFormat = 'count' | 'ratio' | 'rate' | 'money';

export const METRIC_FORMAT: Record<MetricKey, MetricFormat> = {
  listingsCreated: 'count',
  activeSellers: 'count',
  interestedBuyers: 'count',
  buyersPerActive: 'ratio',
  biddersPerListing: 'ratio',
  sellThroughPct: 'rate',
  gmv: 'money',
  mrkoonRevenue: 'money',
  targetReachedPct: 'rate',
};

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 };

/**
 * Display text for one metric value. `null` means "cannot be measured" and is
 * shown as a dash. Money is compact and has no currency: the caller adds it.
 */
export function formatMetric(key: MetricKey, value: number | null, locale = 'en'): string {
  if (value === null) return '—';

  switch (METRIC_FORMAT[key]) {
    case 'ratio':
      return new Intl.NumberFormat(locale, ONE_DECIMAL).format(value);
    case 'rate':
      return `${new Intl.NumberFormat(locale, ONE_DECIMAL).format(value)}%`;
    case 'money':
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value);
    default:
      return new Intl.NumberFormat(locale).format(value);
  }
}

/** The Arabic text for any `ar-*` UI language, else English. */
export function pickLocalized(value: Localized, lang: string): string {
  return lang.startsWith('ar') ? value.ar || value.en : value.en;
}
