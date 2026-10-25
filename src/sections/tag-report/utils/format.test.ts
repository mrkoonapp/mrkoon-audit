import { it, expect, describe } from 'vitest';

import { formatMetric } from './format';

// ----------------------------------------------------------------------

describe('formatMetric', () => {
  it('groups the digits of a count', () => {
    expect(formatMetric('interestedBuyers', 1840)).toBe('1,840');
  });

  it('shows a ratio with one decimal', () => {
    expect(formatMetric('buyersPerActive', 6.43)).toBe('6.4');
    expect(formatMetric('biddersPerListing', 4)).toBe('4.0');
  });

  it('shows a rate with one decimal and a percent sign', () => {
    expect(formatMetric('sellThroughPct', 72.24)).toBe('72.2%');
    expect(formatMetric('targetReachedPct', 100)).toBe('100.0%');
  });

  it('shows money in compact form, without the currency', () => {
    expect(formatMetric('gmv', 48_600_000)).toBe('48.6M');
    expect(formatMetric('mrkoonRevenue', 412_000)).toBe('412K');
    expect(formatMetric('mrkoonRevenue', 0)).toBe('0');
  });

  it('shows a value that cannot be measured as a dash, never as zero', () => {
    expect(formatMetric('gmv', null)).toBe('—');
    expect(formatMetric('sellThroughPct', null)).toBe('—');
  });
});
