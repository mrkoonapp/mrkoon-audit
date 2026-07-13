import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import { Scrollbar } from 'src/components/scrollbar';

import { WidgetCard } from './widget-card';

import type { TableColumn, TableWidgetCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * Generic data-table widget (e.g. "Latest inspections"). Column-driven: pass
 * `columns` (id + label + alignment) and `rows` whose `cells` map is keyed by
 * column id, so every cell is a caller-supplied node (avatar + text, chip,
 * label, …). Body scrolls horizontally below `minWidth` — the one place the
 * dashboard allows horizontal scroll, per the data-table rule.
 */
export function TableWidgetCard({
  title,
  headerAction,
  columns,
  rows,
  maxHeight,
  minWidth = 640,
  loading,
  emptyTitle,
  emptyDescription,
  sx,
}: TableWidgetCardProps) {
  const hideOnMobileSx = (col: TableColumn) =>
    col.hideOnMobile ? { display: { xs: 'none', md: 'table-cell' } } : undefined;

  return (
    <WidgetCard
      title={title}
      headerAction={headerAction}
      loading={loading}
      empty={!loading && rows.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      bodySx={{ p: 0 }}
      sx={sx}
    >
      <Scrollbar sx={{ maxHeight }}>
        <Table sx={{ minWidth }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align}
                  sx={{
                    width: col.width,
                    whiteSpace: 'nowrap',
                    color: 'text.secondary',
                    bgcolor: 'background.neutral',
                    ...hideOnMobileSx(col),
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align} sx={hideOnMobileSx(col)}>
                    {row.cells[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </WidgetCard>
  );
}
