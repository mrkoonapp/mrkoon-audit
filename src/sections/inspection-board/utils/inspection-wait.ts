// ----------------------------------------------------------------------

const SECONDS_PER_DAY = 24 * 60 * 60;

/**
 * Past the first day a product is waiting, and from the fifth day on it is overdue.
 * The backend's InspectionBoardService::OVERDUE_AFTER_DAYS: change both together, or the
 * summary's overdue_count and the rows' red waits disagree.
 */
export const INSPECTION_WAITING_AFTER_DAYS = 1;
export const INSPECTION_OVERDUE_AFTER_DAYS = 5;

export type InspectionSeverity = 'fresh' | 'waiting' | 'overdue';

export const INSPECTION_SEVERITY_COLOR = {
  fresh: 'success',
  waiting: 'warning',
  overdue: 'error',
} as const satisfies Record<InspectionSeverity, string>;

/**
 * The server's `inspection_elapsed_seconds` as whole seconds, or null when it knows no start.
 * The board shows the wait as it was when it loaded; it does not count on in the browser.
 */
export function inspectionWaitSeconds(value: number | null | undefined): number | null {
  const seconds = Number(value);
  if (value == null || !Number.isFinite(seconds)) return null;
  return Math.max(0, Math.floor(seconds));
}

export function splitInspectionDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));

  return {
    days: Math.floor(safe / SECONDS_PER_DAY),
    hours: Math.floor((safe % SECONDS_PER_DAY) / 3600),
  };
}

type Translate = (key: string, options?: Record<string, unknown>) => string;

/**
 * "3 days and 4 hours" / «3 أيام و4 ساعات»: the units come from plural keys, and the
 * `wait.both` key joins them the way the language does. A zero part is left out.
 * (The app targets ES2020, which has no `Intl.ListFormat`.)
 */
export function formatInspectionWait(seconds: number | null, t: Translate): string {
  if (seconds == null) return t('dashboard.inspectionBoard.product.unknownWait');

  const duration = splitInspectionDuration(seconds);
  const parts = (['days', 'hours'] as const)
    .filter((unit) => duration[unit] > 0)
    .map((unit) => t(`dashboard.inspectionBoard.wait.${unit}`, { count: duration[unit] }));

  if (parts.length === 2) {
    return t('dashboard.inspectionBoard.wait.both', { days: parts[0], hours: parts[1] });
  }
  return parts[0] ?? t('dashboard.inspectionBoard.wait.lessThanHour');
}

export function inspectionSeverity(totalSeconds: number | null): InspectionSeverity {
  if (totalSeconds == null) return 'fresh';

  const days = totalSeconds / SECONDS_PER_DAY;
  if (days >= INSPECTION_OVERDUE_AFTER_DAYS) return 'overdue';
  if (days >= INSPECTION_WAITING_AFTER_DAYS) return 'waiting';
  return 'fresh';
}
