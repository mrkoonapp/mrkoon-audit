import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';
import type { IDatePickerControl } from 'src/types/common';

// ----------------------------------------------------------------------
// Shared
// ----------------------------------------------------------------------

/**
 * A trend indicator (e.g. "+12% last 7 days"). `value` is a signed percentage;
 * its sign drives the up/down arrow and color. `caption` is a free label such as
 * "last 7 days" — always passed from the page so widgets stay translation-free.
 */
export type StatTrend = {
  value: number;
  caption?: string;
};

// ----------------------------------------------------------------------
// WidgetCard (base shell)
// ----------------------------------------------------------------------

export type WidgetCardProps = {
  title?: ReactNode;
  subheader?: ReactNode;
  /** Node rendered on the right of the header (e.g. a count `<Label>` or select). */
  headerAction?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  /** When true (and not loading), renders the empty state instead of children. */
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sx?: SxProps<Theme>;
  /** Extra styles applied to the body wrapper below the header. */
  bodySx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// StatCard / HighlightStatCard
// ----------------------------------------------------------------------

export type StatCardProps = {
  label: string;
  value: ReactNode;
  trend?: StatTrend;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
};

export type HighlightStatCardProps = {
  label: string;
  value: ReactNode;
  /** Theme palette key driving the default text tint (and the soft-tint
   *  fallback background when `bgColor` is not provided). */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  /** Explicit fixed background color (overrides the palette soft tint). */
  bgColor?: string;
  /** Explicit fixed border color (adds a 1px solid border). */
  borderColor?: string;
  /** Explicit text color (defaults to the `color` palette's lighter shade). */
  textColor?: string;
  /** Decorative pattern image url, cropped into the bottom-right corner. */
  pattern?: string;
  /** Optional icon watermark (top corner) — used when `pattern` is not set. */
  icon?: ReactNode;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// DonutCard
// ----------------------------------------------------------------------

export type DonutCardProps = {
  title?: ReactNode;
  headerAction?: ReactNode;
  series: number[];
  labels: string[];
  colors?: string[];
  /** Center label (defaults to the sum of `series`). */
  total?: string;
  totalLabel?: string;
  /** Formatted values shown next to each legend entry. */
  legendValues?: string[];
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// AreaChartCard
// ----------------------------------------------------------------------

export type AreaChartSeries = {
  name: string;
  data: number[];
};

export type AreaChartCardProps = {
  title?: ReactNode;
  headerAction?: ReactNode;
  categories: string[];
  series: AreaChartSeries[];
  colors?: string[];
  height?: number;
  /** Content rendered beside the chart (e.g. stacked highlight cards). */
  sideSlot?: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// ListWidgetCard (New Clients / Top sellers …)
// ----------------------------------------------------------------------

export type ListWidgetItem = {
  id: string | number;
  /** Avatar image url; falls back to the first letter of `primary`. */
  avatarUrl?: string;
  avatarAlt?: string;
  primary: string;
  secondary?: string;
  /** Right-aligned primary text (e.g. a price or "Joined at"). */
  trailingPrimary?: ReactNode;
  /** Right-aligned secondary text below `trailingPrimary`. */
  trailingSecondary?: ReactNode;
  /** Right-aligned badge node (e.g. a `<Label>` qty). */
  badge?: ReactNode;
};

export type ListWidgetCardProps = {
  title?: ReactNode;
  headerAction?: ReactNode;
  /** Count badge shown next to the title (e.g. total clients). */
  countBadge?: ReactNode;
  items: ListWidgetItem[];
  /** Cap the visible height and scroll beyond it. */
  maxHeight?: number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// MetricListCard (Top sellers …)
// ----------------------------------------------------------------------

/** A single inline metric on a row (icon + value), e.g. "$ 1,820,000 EGP". */
export type MetricListMetric = {
  icon?: ReactNode;
  value: ReactNode;
};

export type MetricListItem = {
  id: string | number;
  avatarUrl?: string;
  avatarAlt?: string;
  primary: string;
  secondary?: string;
  /** Inline metrics rendered on the right, separated by a dot. */
  metrics: MetricListMetric[];
};

export type MetricListCardProps = {
  title?: ReactNode;
  /** Right-of-header node (e.g. a "View all" link). */
  action?: ReactNode;
  items: MetricListItem[];
  /** Cap the visible height and scroll beyond it. */
  maxHeight?: number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// ProgressListCard (Top categories …)
// ----------------------------------------------------------------------

export type ProgressListItem = {
  id: string | number;
  label: string;
  value: ReactNode;
  /** 0–100 fill percentage. */
  percent: number;
  /** Theme palette key for the bar color. */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

export type ProgressListCardProps = {
  title?: ReactNode;
  headerAction?: ReactNode;
  items: ProgressListItem[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// Toolbar + Filters
// ----------------------------------------------------------------------

/**
 * The shared page filters (Date range + Country). Generic across every audit
 * page — additional filters are intentionally out of scope.
 */
export type DashboardFilters = {
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
  /** ISO country code (matches `CountrySelect getValue="code"`). */
  country: string;
};

export type DashboardToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  searchPlaceholder?: string;
  filterLabel?: string;
  /** Number of active filters — renders a badge on the filter button. */
  activeFilterCount?: number;
  sx?: SxProps<Theme>;
};

export type DashboardFiltersDrawerProps = {
  open: boolean;
  onClose: () => void;
  filters: DashboardFilters;
  onApply: (filters: DashboardFilters) => void;
  onReset: () => void;
  /** i18n labels — supplied by the page so the drawer stays translation-free. */
  labels?: {
    title?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    country?: string;
    countryPlaceholder?: string;
    apply?: string;
    reset?: string;
    dateError?: string;
  };
};
