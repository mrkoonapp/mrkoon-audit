import { it, expect, describe } from 'vitest';

import {
  inspectionSeverity,
  formatInspectionWait,
  inspectionWaitSeconds,
  splitInspectionDuration,
} from './inspection-wait';

/**
 * How long a product has been in inspection (SCRUM-1397): the server's measurement, shown
 * as it was when the board loaded, in words.
 */
describe('inspectionWaitSeconds', () => {
  it('takes the server measurement as whole seconds', () => {
    expect(inspectionWaitSeconds(3600.9)).toBe(3600);
  });

  it('reads a numeric string the way Laravel sometimes sends it', () => {
    expect(inspectionWaitSeconds('120' as unknown as number)).toBe(120);
  });

  it('clamps a negative value to zero', () => {
    expect(inspectionWaitSeconds(-30)).toBe(0);
  });

  it('is null when the server knows no start', () => {
    expect(inspectionWaitSeconds(null)).toBeNull();
    expect(inspectionWaitSeconds(undefined)).toBeNull();
  });
});

describe('splitInspectionDuration', () => {
  it('splits into whole days and the hours left over', () => {
    // 2 days 3 hours 40 minutes: the minutes are dropped, not rounded up.
    expect(splitInspectionDuration(2 * 86400 + 3 * 3600 + 40 * 60)).toEqual({ days: 2, hours: 3 });
  });
});

describe('formatInspectionWait', () => {
  // Stands in for i18next: "<count> <unit>" for the plural keys, "<days> and <hours>" for the
  // joining key, the key itself otherwise.
  const t = (key: string, options?: Record<string, unknown>) => {
    if (options?.count != null) return `${options.count} ${key.split('.').pop()}`;
    if (key.endsWith('.both')) return `${options?.days} and ${options?.hours}`;
    return key;
  };

  it("joins days and hours with the language's own joining key", () => {
    expect(formatInspectionWait(3 * 86400 + 4 * 3600, t)).toBe('3 days and 4 hours');
  });

  it('leaves out a zero part', () => {
    expect(formatInspectionWait(3 * 86400, t)).toBe('3 days');
    expect(formatInspectionWait(4 * 3600 + 59 * 60, t)).toBe('4 hours');
  });

  it('says less than an hour for a product that only just entered inspection', () => {
    expect(formatInspectionWait(59 * 60, t)).toBe('dashboard.inspectionBoard.wait.lessThanHour');
  });

  it('says the start is unknown when the server has no measurement', () => {
    expect(formatInspectionWait(null, t)).toBe('dashboard.inspectionBoard.product.unknownWait');
  });
});

describe('inspectionSeverity', () => {
  it('is fresh during the first day', () => {
    expect(inspectionSeverity(23 * 3600)).toBe('fresh');
  });

  it('is waiting from the first day', () => {
    expect(inspectionSeverity(86400)).toBe('waiting');
  });

  it('is overdue from the fifth day', () => {
    expect(inspectionSeverity(5 * 86400)).toBe('overdue');
  });

  it('treats an unknown wait as fresh rather than alarming', () => {
    expect(inspectionSeverity(null)).toBe('fresh');
  });
});
