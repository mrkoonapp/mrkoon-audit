import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { useState, useMemo } from 'react';

import { getLocalizedText } from 'src/utils/format-string';
import { fNumber, fPercent } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';
import { TableWidgetCard } from 'src/components/dashboard';
import { TablePaginationCustom } from 'src/components/table';

import type { TagSuccessRateItem } from 'src/api/tag-analytics';

// ----------------------------------------------------------------------

interface Props {
  data: TagSuccessRateItem[];
  loading?: boolean;
  tagMode?: 'tag' | 'tags_group';
  selectedName?: string | null;
  onSelectTag?: (id: number) => void;
}

export function TagAnalyticsSuccessRate({
  data,
  loading,
  tagMode = 'tag',
  selectedName,
  onSelectTag,
}: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { currentLang } = useTranslate('dashboard');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  // ── Pagination & Search State ──────────────────────────────────────────
  const [tableSearch, setTableSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const hasPeriodData = useMemo(
    () => Boolean(selectedName) || data.some((item) => Boolean(item.period_key || item.date_label)),
    [selectedName, data]
  );

  const displayName = useMemo(() => {
    if (selectedName) return selectedName;
    if (!hasPeriodData || data.length === 0) return '';
    const firstItem = data[0];
    if (!firstItem?.name) return '';
    return typeof firstItem.name === 'string'
      ? firstItem.name
      : getLocalizedText(firstItem.name as any, currentLang.value);
  }, [selectedName, data, hasPeriodData, currentLang.value]);

  const title = hasPeriodData
    ? `${displayName ? `${displayName} — ` : ''}${tagMode === 'tag' ? 'Success Rate Over Time' : 'Group Success Rate Over Time'}`
    : tagMode === 'tag'
    ? 'Tags Success Rate Overview'
    : 'Tag Groups Success Rate Overview';

  const subtitle = hasPeriodData
    ? 'Success rate percentage trends over time'
    : 'Success rate percentage comparison across tags';

  // ── Filtered Data for Search ──────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (!tableSearch.trim()) return data;
    const q = tableSearch.trim().toLowerCase();
    return data.filter((item) => {
      const nameText =
        typeof item.name === 'string'
          ? item.name
          : `${(item.name as any)?.en ?? ''} ${(item.name as any)?.ar ?? ''}`;
      const periodText = `${item.title_en ?? ''} ${item.title_ar ?? ''} ${item.date_label ?? ''} ${item.period_key ?? ''}`;
      return (
        nameText.toLowerCase().includes(q) ||
        periodText.toLowerCase().includes(q) ||
        String(item.id).includes(q)
      );
    });
  }, [data, tableSearch]);

  // ── Paginated Data ────────────────────────────────────────────────────
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // ── Prepare Chart Data ────────────────────────────────────────────────
  const categories = data.map((item) => {
    if (currentLang.value === 'ar') {
      return item.title_ar || item.date_label || item.period_key || '';
    }
    return item.title_en || item.date_label || item.period_key || '';
  });

  const rateSeries = [{ name: 'Success Rate (%)', data: data.map((item) => item.success_rate) }];

  const chartOptions = useChart({
    colors: ['#22C55E'],
    stroke: {
      show: true,
      width: 3,
      curve: 'smooth' as any,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontSize: '11px',
          fontWeight: 500,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontSize: '11px',
        },
        formatter: (v: number) => `${Math.round(v)}%`,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    grid: {
      strokeDashArray: 3,
      borderColor: isDark ? '#1C2430' : '#E5E8EB',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (v: number, opts?: any) => {
          const dataIndex = opts?.dataPointIndex;
          if (dataIndex !== undefined && data[dataIndex]) {
            const item = data[dataIndex];
            return `${fPercent(v)} (${fNumber(item.successful_auctions)} / ${fNumber(item.total_products)} auctions)`;
          }
          return fPercent(v);
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '11px', fontWeight: '600', colors: [isDark ? '#22C55E' : '#15803D'] },
      formatter: (v: number) => (v > 0 ? `${v}%` : ''),
    },
  });

  // ── Prepare Table Rows ────────────────────────────────────────────────
  const columns = [
    { id: 'index', label: '#', width: 48, align: 'center' as const },
    ...(hasPeriodData
      ? [{ id: 'period', label: 'Period', width: 160 }]
      : [{ id: 'name', label: 'Name', width: 200 }]),
    { id: 'total_products', label: 'Total Products', width: 140, align: 'right' as const },
    { id: 'successful_auctions', label: 'Successful Auctions', width: 160, align: 'right' as const },
    { id: 'failed_auctions', label: 'Failed Auctions', width: 140, align: 'right' as const },
    { id: 'success_rate', label: 'Success Rate', width: 220 },
  ];

  const rows = paginatedData.map((item, index) => {
    const globalIndex = page * rowsPerPage + index + 1;
    const nameText =
      typeof item.name === 'string'
        ? item.name
        : getLocalizedText(item.name as any, currentLang.value);

    const periodText =
      currentLang.value === 'ar'
        ? (item.title_ar || item.date_label || item.period_key)
        : (item.title_en || item.date_label || item.period_key);

    const rate = typeof item.success_rate === 'number' ? item.success_rate : 0;
    const color = rate >= 70 ? 'success' : rate >= 40 ? 'warning' : 'error';
    const barColor = rate >= 70 ? '#22C55E' : rate >= 40 ? '#FFAB00' : '#FF5630';

    return {
      id: `${item.id}-${item.period_key ?? index}`,
      cells: {
        index: (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {globalIndex}
          </Typography>
        ),
        name: (
          <Typography
            variant="subtitle2"
            onClick={() => onSelectTag?.(item.id)}
            sx={{
              fontWeight: 600,
              cursor: onSelectTag ? 'pointer' : 'default',
              color: onSelectTag ? '#BF8654' : 'text.primary',
              '&:hover': onSelectTag ? { textDecoration: 'underline' } : {},
            }}
          >
            {nameText || `Tag #${item.id}`}
          </Typography>
        ),
        period: (
          <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {periodText || '-'}
          </Typography>
        ),
        total_products: (
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {fNumber(item.total_products)}
          </Typography>
        ),
        successful_auctions: (
          <Label color="success" variant="soft">
            {fNumber(item.successful_auctions)}
          </Label>
        ),
        failed_auctions: (
          <Label color="error" variant="soft">
            {fNumber(item.failed_auctions)}
          </Label>
        ),
        success_rate: (
          <Stack spacing={1} sx={{ width: '100%', minWidth: 160 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <LinearProgress
                variant="determinate"
                value={Math.min(Math.max(rate, 0), 100)}
                sx={{
                  flex: 1,
                  mr: 1.5,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: barColor,
                    borderRadius: 3,
                  },
                }}
              />
              <Label color={color} variant="soft" sx={{ fontWeight: 'bold' }}>
                {fPercent(rate)}
              </Label>
            </Stack>
          </Stack>
        ),
      },
    };
  });

  return (
    <Stack spacing={3}>
      <Card
        sx={{
          p: 3,
          bgcolor: isDark ? '#11161D' : 'background.paper',
          border: `1px solid ${isDark ? '#1D2633' : theme.palette.divider}`,
          borderRadius: 2.5,
          boxShadow: theme.customShadows?.card,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          gap={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            {(!hasPeriodData || viewMode === 'table') && (
              <TextField
                size="small"
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Search report..."
                sx={{ minWidth: 160, maxWidth: 220 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={"solar:magnifer-linear" as any} width={16} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {hasPeriodData && (
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant={viewMode === 'chart' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setViewMode('chart')}
                  startIcon={<Iconify icon={"solar:chart-2-bold-duotone" as any} />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Chart
                </Button>
                <Button
                  size="small"
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  color="inherit"
                  onClick={() => setViewMode('table')}
                  startIcon={<Iconify icon={"solar:list-bold-duotone" as any} />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Table
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>

        {hasPeriodData && viewMode === 'chart' ? (
          <Box sx={{ width: '100%', pt: 1, height: 320 }}>
            <Chart type="area" series={rateSeries} options={chartOptions} sx={{ height: 300 }} />
          </Box>
        ) : (
          <Box>
            <TableWidgetCard
              columns={columns}
              rows={rows}
              loading={loading}
              emptyTitle="No success rate data"
              emptyDescription="No tag success rate report available for the selected filters."
              sx={{ border: 'none', p: 0, boxShadow: 'none' }}
            />
            {!loading && filteredData.length > 0 && (
              <TablePaginationCustom
                count={filteredData.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{ borderTop: `1px solid ${theme.palette.divider}`, mt: 1 }}
              />
            )}
          </Box>
        )}
      </Card>
    </Stack>
  );
}
