import type { Dayjs } from 'dayjs';
import type { DatePeriod } from 'src/utils/constants';

import dayjs from 'dayjs';

import { fDate } from 'src/utils/format-time';
import { DATE_PERIODS } from 'src/utils/constants';
import { fCurrency } from 'src/utils/format-number';

import type { DashboardFilters } from './types';

// ----------------------------------------------------------------------
// Generic helpers shared by every dashboard-style page (dashboard, auctions, …)
// ----------------------------------------------------------------------

/** Empty filter state used to seed and reset the shared filters drawer. */
export const defaultDashboardFilters: DashboardFilters = {
  period: DATE_PERIODS.MONTHLY,
  ...getPeriodRange(DATE_PERIODS.MONTHLY),
  // Empty country id = the "All countries" option (unfiltered).
  country: '',
};

/** Count the active (set) filters — drives the toolbar filter badge. */
export function countActiveFilters(filters: DashboardFilters): number {
  let count = 0;
  if (filters.period) count += 1;
  if (filters.country) count += 1;
  return count;
}

/**
 * Resolve a preset period to a concrete `[startDate, endDate]` range spanning
 * the current period (e.g. `monthly` → the current calendar month). `custom`
 * and `''` return a null range — the caller keeps the manually-picked dates.
 * (dayjs' `quarter` plugin isn't loaded, so the quarter is computed manually.)
 */
export function getPeriodRange(period: DatePeriod): {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
} {
  const now = dayjs();

  switch (period) {
    case DATE_PERIODS.ALL_TIME:
      return { startDate: dayjs('2020-01-01').startOf('day'), endDate: now.endOf('day') };
    case DATE_PERIODS.WEEKLY:
      return { startDate: now.startOf('week'), endDate: now.endOf('day') };
    case DATE_PERIODS.MONTHLY:
      return { startDate: now.startOf('month'), endDate: now.endOf('day') };
    case DATE_PERIODS.QUARTERLY: {
      const quarterStartMonth = Math.floor(now.month() / 3) * 3;
      return {
        startDate: now.month(quarterStartMonth).startOf('month'),
        endDate: now.endOf('day'),
      };
    }
    case DATE_PERIODS.YEARLY:
      return { startDate: now.startOf('year'), endDate: now.endOf('day') };
    default:
      return { startDate: null, endDate: null };
  }
}

/** Format a monetary amount together with its currency code (e.g. "1,820,000 EGP"). */
export function formatAmount(amount: number, currency: string): string {
  return `${fCurrency(amount, { minimumFractionDigits: 0 })} ${currency}`;
}

/** Format an ISO date for list rows (e.g. a client's join date). */
export function formatJoinedAt(isoDate: string): string {
  return fDate(isoDate);
}

// ----------------------------------------------------------------------

export type PeriodOption = {
  /** Stable key — the option's start date (`YYYY-MM-DD`). */
  value: string;
  label: string;
  startDate: Dayjs;
  endDate: Dayjs;
};

/** How many past periods the period-value picker lists, per preset. */
const PERIOD_OPTION_COUNTS: Partial<Record<DatePeriod, number>> = {
  [DATE_PERIODS.WEEKLY]: 12,
  [DATE_PERIODS.MONTHLY]: 12,
  [DATE_PERIODS.QUARTERLY]: 8,
  [DATE_PERIODS.YEARLY]: 5,
};

/**
 * Lists the concrete periods a preset can point at, newest first — e.g.
 * `quarterly` → "Q4 2026", "Q3 2026", … The current period ends today (same as
 * `getPeriodRange`); past periods end on their last day. Returns `[]` for
 * presets without discrete values (`all_time`, `custom`, `''`).
 */
export function getPeriodOptions(period: DatePeriod): PeriodOption[] {
  const count = PERIOD_OPTION_COUNTS[period];
  if (!count) return [];

  const now = dayjs();

  return Array.from({ length: count }, (_, index) => {
    let start: Dayjs;
    let end: Dayjs;
    let label: string;

    switch (period) {
      case DATE_PERIODS.WEEKLY:
        start = now.subtract(index, 'week').startOf('week');
        end = start.endOf('week');
        label = `${start.format('D MMM')} – ${end.format('D MMM YYYY')}`;
        break;
      case DATE_PERIODS.QUARTERLY: {
        const quarterStart = now.month(Math.floor(now.month() / 3) * 3).startOf('month');
        start = quarterStart.subtract(index * 3, 'month');
        end = start.add(2, 'month').endOf('month');
        label = `Q${Math.floor(start.month() / 3) + 1} ${start.year()}`;
        break;
      }
      case DATE_PERIODS.YEARLY:
        start = now.subtract(index, 'year').startOf('year');
        end = start.endOf('year');
        label = start.format('YYYY');
        break;
      default:
        start = now.subtract(index, 'month').startOf('month');
        end = start.endOf('month');
        label = start.format('MMM YYYY');
    }

    return {
      value: start.format('YYYY-MM-DD'),
      label,
      startDate: start,
      endDate: index === 0 ? now.endOf('day') : end,
    };
  });
}

// ----------------------------------------------------------------------
// 3D pie geometry (used by `Pie3dChart`)
// ----------------------------------------------------------------------

export type Pie3dGeometry = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** Height of the extruded side walls. */
  depth: number;
  /** Distance each slice is pushed out from the center. */
  explode: number;
};

export type Pie3dSlicePaths = {
  /** Painting order — slices further back are drawn first. */
  order: number;
  top: string;
  /** Curved outer wall, only for the part of the slice facing the viewer. */
  outerWall: string | null;
  /** The two cut faces (start / end edge) extruded downwards. */
  sideWalls: string[];
};

/**
 * Builds the SVG paths of one slice of a pseudo-3D (tilted, extruded) pie.
 * Angles are in radians, measured clockwise from 12 o'clock.
 */
export function getPie3dSlicePaths(
  startAngle: number,
  endAngle: number,
  { cx, cy, rx, ry, depth, explode }: Pie3dGeometry
): Pie3dSlicePaths {
  // Convert "clockwise from 12 o'clock" to SVG angle (clockwise from 3 o'clock).
  const a0 = startAngle - Math.PI / 2;
  const a1 = endAngle - Math.PI / 2;
  const mid = (a0 + a1) / 2;

  const ox = cx + explode * Math.cos(mid);
  const oy = cy + explode * Math.sin(mid) * (ry / rx);

  const point = (angle: number, dy = 0) =>
    `${(ox + rx * Math.cos(angle)).toFixed(2)} ${(oy + ry * Math.sin(angle) + dy).toFixed(2)}`;
  const arc = (from: number, to: number, dy = 0, sweep = 1) =>
    `A ${rx} ${ry} 0 ${Math.abs(to - from) > Math.PI ? 1 : 0} ${sweep} ${point(to, dy)}`;

  const isFull = endAngle - startAngle >= Math.PI * 2 - 1e-6;
  const center = `${ox.toFixed(2)} ${oy.toFixed(2)}`;

  const top = isFull
    ? `M ${point(0)} ${arc(0, Math.PI)} ${arc(Math.PI, Math.PI * 2)} Z`
    : `M ${center} L ${point(a0)} ${arc(a0, a1)} Z`;

  // The visible (front) half of the rim is the SVG range [0, π].
  const frontStart = Math.max(a0, 0);
  const frontEnd = Math.min(a1, Math.PI);
  const outerWall =
    frontEnd > frontStart
      ? `M ${point(frontStart)} ${arc(frontStart, frontEnd)} L ${point(frontEnd, depth)} ${arc(frontEnd, frontStart, depth, 0)} Z`
      : null;

  const sideWall = (angle: number) =>
    `M ${center} L ${point(angle)} L ${point(angle, depth)} L ${ox.toFixed(2)} ${(oy + depth).toFixed(2)} Z`;

  return {
    order: Math.sin(mid),
    top,
    outerWall,
    sideWalls: isFull ? [] : [sideWall(a0), sideWall(a1)],
  };
}

// ----------------------------------------------------------------------
// Rounded donut geometry (used by `RoundedDonutChart`)
// ----------------------------------------------------------------------

export type RoundedDonutGeometry = {
  cx: number;
  cy: number;
  /** Radius of the ring's center line. */
  radius: number;
  /** Ring thickness (also the diameter of the rounded slice ends). */
  thickness: number;
  /** Empty space between two slices, in px along the ring. */
  gap: number;
};

export type RoundedDonutSlicePaths = {
  /** Filled ring segment with rounded corners. */
  slice: string;
  /** Leader line from the slice to its label. */
  leader: string;
  /** Where the label text starts. */
  labelX: number;
  labelY: number;
  labelAnchor: 'start' | 'end';
};

/** Narrowest a slice is drawn (px along the ring), so tiny shares stay visible. */
const ROUNDED_DONUT_MIN_SLICE_PX = 6;

/**
 * Paths of one slice of a donut with rounded, separated slices and an outside
 * callout. Angles are in radians, clockwise from 12 o'clock. Each slice is a
 * filled ring segment whose corners are rounded *inside* its own angle, so the
 * drawn area keeps the true share (round caps that stick out would make small
 * slices look much bigger). The rounding shrinks for narrow slices.
 */
export function getRoundedDonutSlicePaths(
  startAngle: number,
  endAngle: number,
  { cx, cy, radius, thickness, gap }: RoundedDonutGeometry
): RoundedDonutSlicePaths {
  const outer = radius + thickness / 2;
  const inner = radius - thickness / 2;
  const mid = (startAngle + endAngle) / 2;

  const point = (angle: number, r: number) => ({
    x: cx + r * Math.sin(angle),
    y: cy - r * Math.cos(angle),
  });
  const fmt = ({ x, y }: { x: number; y: number }) => `${x.toFixed(2)} ${y.toFixed(2)}`;

  let slice: string;

  if (endAngle - startAngle >= Math.PI * 2 - 1e-6) {
    // A single 100% slice: a full ring (outer circle minus the hole, even-odd).
    const ring = (r: number) =>
      `M ${fmt(point(0, r))} A ${r} ${r} 0 1 1 ${fmt(point(Math.PI, r))} A ${r} ${r} 0 1 1 ${fmt(point(0, r))} Z`;
    slice = `${ring(outer)} ${ring(inner)}`;
  } else {
    const halfGap = gap / 2 / radius;
    let s = startAngle + halfGap;
    let e = endAngle - halfGap;
    const minSweep = ROUNDED_DONUT_MIN_SLICE_PX / inner;
    if (e - s < minSweep) {
      s = mid - minSweep / 2;
      e = mid + minSweep / 2;
    }

    // Corner radius: as round as the design for wide slices, smaller for narrow ones.
    const corner = Math.min(thickness / 2, ((e - s) * inner) / 2);
    const dOuter = corner / outer;
    const dInner = corner / inner;
    const outerLarge = e - dOuter - (s + dOuter) > Math.PI ? 1 : 0;
    const innerLarge = e - dInner - (s + dInner) > Math.PI ? 1 : 0;

    slice = [
      `M ${fmt(point(s + dOuter, outer))}`,
      `A ${outer} ${outer} 0 ${outerLarge} 1 ${fmt(point(e - dOuter, outer))}`,
      `Q ${fmt(point(e, outer))} ${fmt(point(e, outer - corner))}`,
      `L ${fmt(point(e, inner + corner))}`,
      `Q ${fmt(point(e, inner))} ${fmt(point(e - dInner, inner))}`,
      `A ${inner} ${inner} 0 ${innerLarge} 0 ${fmt(point(s + dInner, inner))}`,
      `Q ${fmt(point(s, inner))} ${fmt(point(s, inner + corner))}`,
      `L ${fmt(point(s, outer - corner))}`,
      `Q ${fmt(point(s, outer))} ${fmt(point(s + dOuter, outer))}`,
      'Z',
    ].join(' ');
  }

  // Callout: out from the ring edge, then a short horizontal run to the label.
  const isRight = Math.sin(mid) >= 0;
  const edge = point(mid, outer + 2);
  const elbow = point(mid, outer + 14);
  const end = { x: elbow.x + (isRight ? 18 : -18), y: elbow.y };

  return {
    slice,
    leader: `M ${fmt(edge)} L ${fmt(elbow)} L ${fmt(end)}`,
    labelX: end.x + (isRight ? 4 : -4),
    labelY: end.y,
    labelAnchor: isRight ? 'start' : 'end',
  };
}
