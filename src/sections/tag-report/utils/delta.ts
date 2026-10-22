import type { MetricValue } from 'src/api/tag-report';

// ----------------------------------------------------------------------

export type Delta = { kind: 'up' | 'down' | 'flat'; text: string } | { kind: 'new' | 'none' };

/** The change badge for one metric. Rates change in percentage points. */
export function delta(m: MetricValue, locale = 'en'): Delta {
  const isPp = m.changePp !== undefined;
  const change = isPp ? m.changePp : m.changePct;
  const unit = isPp ? ' pp' : '%';

  if (change === null || change === undefined) {
    // Only counts and money can be "new"; a rate with no previous value has no change.
    const isNew = !isPp && (m.current ?? 0) > 0 && m.previous === 0;
    return { kind: isNew ? 'new' : 'none' };
  }

  if (change === 0) return { kind: 'flat', text: `0${unit}` };

  const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(Math.abs(change));
  return change > 0
    ? { kind: 'up', text: `▲ ${n}${unit}` }
    : { kind: 'down', text: `▼ ${n}${unit}` };
}
