import type { ReactNode } from 'react';
import type { DatePeriod } from 'src/utils/constants';
import type { Theme, SxProps } from '@mui/material/styles';
import type { IDatePickerControl } from 'src/types/common';

// ----------------------------------------------------------------------
// Shared
// ----------------------------------------------------------------------

/**
 * A trend indicator. Two modes:
 * - **Full**: pass `value` (a signed percentage) → renders an arrow + "%"" +
 *   optional `caption` ("last 7 days") below the stat value.
 * - **Compact**: pass only `direction` → renders just a colored directional
 *   arrow badge (no text), e.g. the auctions KPI cards.
 * `caption` stays translation-free (always passed from the page).
 */
export type StatTrend = {
  value?: number;
  caption?: string;
  direction?: 'up' | 'down';
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
  /** When set, the whole card becomes clickable (pointer + hover lift). */
  onClick?: () => void;
  sx?: SxProps<Theme>;
  subMetrics?: { label: string; value: ReactNode }[];
  totalLabel?: string;
};

export type IconStatCardProps = {
  label: string;
  value: ReactNode;
  /** Inline trend chip next to the value — signed percentage (arrow + "%"). */
  trend?: number;
  /** Muted caption rendered under the value (e.g. "11/90 Auctions"). */
  subtitle?: ReactNode;
  /** Icon shown in the tinted circular badge (top-right). */
  icon?: ReactNode;
  /** Palette key tinting the icon badge. */
  iconColor?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  /** When set, the whole card becomes clickable (pointer + hover lift). */
  onClick?: () => void;
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
// BarChartCard (Auctions by category …)
// ----------------------------------------------------------------------

export type BarChartCardProps = {
  title?: ReactNode;
  headerAction?: ReactNode;
  categories: string[];
  /** Single-series values (paired 1:1 with `categories`). */
  series: number[];
  /** Series name (tooltip label). */
  seriesName?: string;
  colors?: string[];
  /** Render bars horizontally (category axis on the left). Default false. */
  horizontal?: boolean;
  /** Each bar its own color (default true). */
  distributed?: boolean;
  /** Show the value on top of each bar (default true). */
  showValues?: boolean;
  /** Render a color-coded legend from the categories below the chart. */
  showLegend?: boolean;
  height?: number;
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// IconStatRow (icon + value + label row)
// ----------------------------------------------------------------------

export type IconStatRowProps = {
  /** Leading icon rendered in a soft tinted rounded avatar. */
  icon?: ReactNode;
  iconColor?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  label: string;
  value: ReactNode;
  /** Put the label above the value instead of below (e.g. a footer total). */
  reverse?: boolean;
  /** Trailing node aligned to the row end (e.g. an arrow button). */
  action?: ReactNode;
  /** Dashed divider above the row. */
  divider?: boolean;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// RadialGaugeCard (semicircle gauge + optional body)
// ----------------------------------------------------------------------

export type RadialGaugeCardProps = {
  title?: ReactNode;
  headerAction?: ReactNode;
  /** 0–100 gauge fill. */
  value: number;
  /** Text shown under the big percentage in the gauge center. */
  valueLabel?: string;
  /** Overridden gauge color (defaults to success). */
  color?: string;
  /** Extra content rendered below the gauge (stat rows, footer, …). */
  children?: ReactNode;
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
  /** Custom leading node — overrides the avatar entirely (e.g. an icon tile). */
  avatar?: ReactNode;
  /** Avatar image url; falls back to the first letter of `primary`. */
  avatarUrl?: string;
  avatarAlt?: string;
  primary: string;
  secondary?: string;
  /** Optional node between the name block and the trailing block (e.g. a chip). */
  center?: ReactNode;
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
// AvatarGridCard (New Merchants …)
// ----------------------------------------------------------------------

export type AvatarGridItem = {
  id: string | number;
  avatarUrl?: string;
  avatarAlt?: string;
  primary: string;
  secondary?: string;
};

export type AvatarGridCardProps = {
  title?: ReactNode;
  headerAction?: ReactNode;
  /** Count badge shown next to the title (e.g. total merchants). */
  countBadge?: ReactNode;
  items: AvatarGridItem[];
  /** Columns per breakpoint (defaults to `{ xs: 1, sm: 2, md: 3 }`). */
  columns?: { xs?: number; sm?: number; md?: number };
  /** Cap the visible height and scroll beyond it. */
  maxHeight?: number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// StatListCard (Merchants Updates …)
// ----------------------------------------------------------------------

export type StatListItem = {
  id: string | number;
  label: string;
  value: ReactNode;
  /** Leading dot color (theme palette key). */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

export type StatListCardProps = {
  title?: ReactNode;
  headerAction?: ReactNode;
  items: StatListItem[];
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
// TableWidgetCard (Latest inspections …)
// ----------------------------------------------------------------------

export type TableColumn = {
  id: string;
  label: ReactNode;
  align?: 'left' | 'center' | 'right';
  /** Fixed/relative column width (e.g. `240` or `'40%'`). */
  width?: number | string;
  /** Hide this column below the `md` breakpoint to keep mobile clean. */
  hideOnMobile?: boolean;
};

export type TableWidgetRow = {
  id: string | number;
  /** Cell content keyed by column `id`. */
  cells: Record<string, ReactNode>;
};

export type TableWidgetCardProps = {
  title?: ReactNode;
  headerAction?: ReactNode;
  columns: TableColumn[];
  rows: TableWidgetRow[];
  /** Cap the visible height and scroll beyond it. */
  maxHeight?: number;
  /** Minimum table width before the body scrolls horizontally (default 640). */
  minWidth?: number;
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
  /**
   * Selected date period. Presets (`weekly`/`monthly`/`quarterly`/`yearly`)
   * resolve to a concrete `startDate`/`endDate` range; `custom` lets the user
   * pick the range manually; `''` means "no date filter".
   */
  period: DatePeriod;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
  /** Backend country id (as string) from `useGetCountries`; `''` means "All". */
  country: string;
};

export type DashboardToolbarProps = {
  /** Page title shown on the left instead of the search field. */
  title?: ReactNode;
  /** Muted subtitle rendered under `title`. */
  subtitle?: ReactNode;
  /** Search value — when omitted (no `onSearchChange`), the search field is hidden. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
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
    /** Label for the period selector (e.g. "Period"). */
    period?: string;
    periodAllTime?: string;
    periodWeekly?: string;
    periodMonthly?: string;
    periodQuarterly?: string;
    periodYearly?: string;
    periodCustom?: string;
    startDate?: string;
    endDate?: string;
    country?: string;
    countryPlaceholder?: string;
    allCountries?: string;
    apply?: string;
    reset?: string;
    dateError?: string;
  };
};
