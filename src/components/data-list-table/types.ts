import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseTableReturn } from 'src/components/table';

// ----------------------------------------------------------------------

/**
 * A single column of the {@link DataListTable}. `render` receives the row and
 * returns the cell node (avatar + text, a `<Label>` chip, a formatted number, …)
 * so the table stays presentation-agnostic and every page supplies its own cells.
 */
export type DataListColumn<Row> = {
  /** Stable id — also the sort key when `sortable` is set. */
  id: string;
  label: ReactNode;
  align?: 'left' | 'center' | 'right';
  /** Fixed/relative column width (e.g. `160` or `'25%'`). */
  width?: number | string;
  /** Hide below the `md` breakpoint to keep mobile clean. */
  hideOnMobile?: boolean;
  /** Enable the header sort control for this column. */
  sortable?: boolean;
  render: (row: Row) => ReactNode;
};

/** One tab above the table (e.g. All / Buyers / Sellers on the clients page). */
export type DataListTab = {
  value: string;
  label: string;
  /** Optional count badge shown next to the label. */
  count?: number;
};

export type DataListTableProps<Row> = {
  columns: DataListColumn<Row>[];
  /** The already-paginated rows to render for the current page. */
  rows: Row[];
  /** Total number of rows across all pages (drives pagination count). */
  totalRows: number;
  /** Shared table state from `useTable()`. */
  table: UseTableReturn;
  /** Resolve a row's unique id (used for keys + selection). */
  getRowId: (row: Row) => string;
  /** Render the leading select checkboxes + select-all. Default false. */
  selectable?: boolean;
  /** All row ids on the current page — needed for select-all. */
  pageRowIds?: string[];
  /** Show a trailing "view" (eye) action per row when provided. */
  onViewRow?: (row: Row) => void;
  /** Tooltip for the view action. */
  viewLabel?: string;
  /** Optional tabs rendered above the table. */
  tabs?: DataListTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  loading?: boolean;
  /** True when a search/filter yielded zero rows (renders the empty state). */
  notFound?: boolean;
  /** Minimum table width before the body scrolls horizontally (default 880). */
  minWidth?: number;
  sx?: SxProps<Theme>;
};
