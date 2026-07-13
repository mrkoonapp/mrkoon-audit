import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import type { DataListColumn, DataListTableProps } from './types';

// ----------------------------------------------------------------------

const hideOnMobileSx = <Row,>(col: DataListColumn<Row>) =>
  col.hideOnMobile ? { display: { xs: 'none', md: 'table-cell' } } : undefined;

/**
 * Generic, column-driven listing table — the shared shell behind the Products,
 * Clients and Auctions listing pages. Column `render` supplies each cell, so the
 * table itself renders no domain strings. Supports optional selection, per-row
 * sort, a trailing "view" action, tabs, plus loading / empty states. The body is
 * the one place we allow horizontal scroll (below `minWidth`), per the data-table
 * rule. The page keeps its search + Filter toolbar (`DashboardToolbar`) above it.
 */
export function DataListTable<Row>({
  columns,
  rows,
  totalRows,
  table,
  getRowId,
  selectable = false,
  pageRowIds = [],
  onViewRow,
  viewLabel,
  tabs,
  activeTab,
  onTabChange,
  loading = false,
  notFound = false,
  minWidth = 880,
  sx,
}: DataListTableProps<Row>) {
  const headCells = [
    ...columns.map((col) => ({
      id: col.id,
      label: typeof col.label === 'string' ? col.label : undefined,
      align: col.align,
      width: col.width,
      sx: hideOnMobileSx(col),
    })),
    ...(onViewRow ? [{ id: '', label: '', align: 'right' as const, width: 88 }] : []),
  ];

  // Only sortable columns trigger the shared sort handler.
  const handleSort = (id: string) => {
    if (!id) return;
    const col = columns.find((c) => c.id === id);
    if (col?.sortable) table.onSort(id);
  };

  const colSpan = columns.length + (selectable ? 1 : 0) + (onViewRow ? 1 : 0);

  return (
    <Card sx={sx}>
      {tabs && tabs.length > 0 && (
        <Tabs
          value={activeTab}
          onChange={(_, value) => onTabChange?.(value)}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.grey['500Channel']}`,
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                  {tab.label}
                  {tab.count !== undefined && (
                    <Label variant={tab.value === activeTab ? 'filled' : 'soft'} color="default">
                      {tab.count}
                    </Label>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      )}

      <Scrollbar>
        <Table sx={{ minWidth }}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headCells={headCells}
            rowCount={pageRowIds.length}
            numSelected={table.selected.length}
            onSort={handleSort}
            onSelectAllRows={
              selectable ? (checked) => table.onSelectAllRows(checked, pageRowIds) : undefined
            }
          />

          <TableBody>
            {loading ? (
              <TableSkeleton rowCount={table.rowsPerPage} cellCount={colSpan} />
            ) : (
              rows.map((row) => {
                const id = getRowId(row);
                const selected = table.selected.includes(id);

                return (
                  <TableRow key={id} hover selected={selected}>
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected}
                          onChange={() => table.onSelectRow(id)}
                          slotProps={{ input: { 'aria-label': `Select ${id}` } }}
                        />
                      </TableCell>
                    )}

                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align} sx={hideOnMobileSx(col)}>
                        {col.render(row)}
                      </TableCell>
                    ))}

                    {onViewRow && (
                      <TableCell align="right" padding="none" sx={{ pr: 2 }}>
                        <Tooltip title={viewLabel ?? ''} placement="top" arrow>
                          <IconButton color="default" onClick={() => onViewRow(row)}>
                            <Iconify icon="solar:eye-bold" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}

            {!loading && <TableNoData notFound={notFound} />}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        page={table.page}
        count={totalRows}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
