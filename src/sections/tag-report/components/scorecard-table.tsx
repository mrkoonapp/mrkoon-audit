import type { Theme, SxProps } from '@mui/material/styles';
import type { MetricKey, ScorecardRow } from 'src/api/tag-report';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { TableSkeleton } from 'src/components/table';

import { MetricTip } from './metric-tip';
import { DeltaChip } from './delta-chip';
import { splitInactive } from '../utils/rows';
import { formatMetric, METRIC_FORMAT, pickLocalized } from '../utils/format';

import type { Quadrant } from '../utils/quadrant';

// ----------------------------------------------------------------------

export const METRIC_ORDER: MetricKey[] = [
  'listingsCreated',
  'activeSellers',
  'interestedBuyers',
  'buyersPerActive',
  'biddersPerListing',
  'sellThroughPct',
  'gmv',
  'mrkoonRevenue',
  'targetReachedPct',
];

/** The columns that answer "where to invest"; the rest sit behind "More columns". */
const KEY_METRICS: MetricKey[] = [
  'listingsCreated',
  'buyersPerActive',
  'sellThroughPct',
  'gmv',
  'mrkoonRevenue',
];

const QUADRANT_COLOR = { needsSellers: 'primary', needsBuyers: 'warning' } as const;

/** The Tag column stays in view while the metrics scroll sideways. */
const stickyTag = (bgcolor: string): SxProps<Theme> => ({
  position: 'sticky',
  left: 0,
  zIndex: 2,
  minWidth: 200,
  bgcolor,
});

type Props = {
  rows: ScorecardRow[];
  loading: boolean;
  /** Dim the old rows while a new filter loads. */
  stale: boolean;
  sort: MetricKey;
  onSort: (sort: MetricKey) => void;
  /** The open Top Tag, or `null` on the Top Tag view. */
  parent: ScorecardRow | null;
  onBack: () => void;
  onOpenTopTag: (tagId: number) => void;
  onSelectChild: (tagId: number) => void;
  onSelectDirect: () => void;
  /** The tag the trend shows, highlighted in the table. */
  selectedTagId: number | null;
  quadrantOf: (tagId: number) => Quadrant | null;
  /** The previous period, e.g. "01 - 31 Aug 2026", for the value tooltips. */
  previousRange?: string;
  currency?: string;
  lang: string;
  locale: string;
};

export function ScorecardTable({
  rows,
  loading,
  stale,
  sort,
  onSort,
  parent,
  onBack,
  onOpenTopTag,
  onSelectChild,
  onSelectDirect,
  selectedTagId,
  quadrantOf,
  previousRange,
  currency,
  lang,
  locale,
}: Props) {
  const { t } = useTranslate('dashboard');
  const tr = (key: string, options?: Record<string, unknown>) =>
    t(`dashboard.tagReport.${key}`, options);

  const [allColumns, setAllColumns] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const metrics = allColumns ? METRIC_ORDER : KEY_METRICS;
  const { active, inactive } = splitInactive(rows);
  const visibleRows = showInactive ? [...active, ...inactive] : active;

  const money = (key: MetricKey, value: number | null) => {
    const text = formatMetric(key, value, locale);
    return METRIC_FORMAT[key] === 'money' && currency && value !== null
      ? `${text} ${currency}`
      : text;
  };

  const tagName = (row: ScorecardRow) => {
    const name = pickLocalized(row.tag.name, lang);
    return row.tag.isDirect ? tr('table.direct', { name }) : name;
  };

  const handleClick = (row: ScorecardRow) => {
    if (row.tag.isDirect) onSelectDirect();
    else if (parent) onSelectChild(row.tag.id);
    else onOpenTopTag(row.tag.id);
  };

  const renderHead = () => (
    <TableHead>
      <TableRow>
        <TableCell sx={stickyTag('background.neutral')}>{tr('table.tag')}</TableCell>
        {metrics.map((key) => (
          <TableCell
            key={key}
            align="right"
            sortDirection={sort === key ? 'desc' : false}
            sx={{ whiteSpace: 'nowrap' }}
          >
            <MetricTip metric={key}>
              <TableSortLabel
                hideSortIcon
                active={sort === key}
                direction="desc"
                onClick={() => onSort(key)}
              >
                {METRIC_FORMAT[key] === 'money' && currency
                  ? tr('table.withCurrency', { label: tr(`metrics.${key}`), currency })
                  : tr(`metrics.${key}`)}
              </TableSortLabel>
            </MetricTip>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTagCell = (row: ScorecardRow) => {
    const quadrant = parent ? null : quadrantOf(row.tag.id);
    return (
      <TableCell sx={[stickyTag('background.paper'), !!parent && { pl: 4 }] as SxProps<Theme>}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: parent ? 400 : 600,
            color: row.tag.isDirect ? 'text.secondary' : 'text.primary',
          }}
        >
          {tagName(row)}
        </Typography>
        {quadrant && (
          <Label color={QUADRANT_COLOR[quadrant]} sx={{ mt: 0.5 }}>
            {tr(`quadrant.${quadrant}`)}
          </Label>
        )}
      </TableCell>
    );
  };

  const renderMetricCell = (row: ScorecardRow, key: MetricKey) => {
    const value = row.metrics[key];
    const isNull = value.current === null;
    const previous =
      previousRange && !isNull
        ? tr('previousValue', { range: previousRange, value: money(key, value.previous) })
        : undefined;

    return (
      <TableCell key={key} align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        <MetricTip metric={key} nullReason={isNull} previous={previous}>
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              cursor: 'help',
              color: isNull ? 'text.disabled' : 'inherit',
            }}
          >
            <bdi>{formatMetric(key, value.current, locale)}</bdi>
            {!isNull && <DeltaChip value={value} locale={locale} variant="text" />}
          </Box>
        </MetricTip>
      </TableCell>
    );
  };

  return (
    <Card>
      <CardHeader
        title={tr('table.title')}
        subheader={
          parent ? (
            <Breadcrumbs sx={{ mt: 0.5 }}>
              <Link component="button" variant="body2" color="inherit" onClick={onBack}>
                {tr('table.allTopTags')}
              </Link>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {pickLocalized(parent.tag.name, lang)}
              </Typography>
            </Breadcrumbs>
          ) : undefined
        }
        action={
          <Button
            size="small"
            color="inherit"
            startIcon={
              <Iconify icon={allColumns ? 'eva:minus-circle-fill' : 'mingcute:add-line'} />
            }
            onClick={() => setAllColumns((on) => !on)}
          >
            {allColumns ? tr('table.fewerColumns') : tr('table.moreColumns')}
          </Button>
        }
        sx={{ mb: 2 }}
      />

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: allColumns ? 1200 : 760 }}>
          {renderHead()}

          <TableBody sx={{ opacity: stale ? 0.5 : 1, transition: 'opacity .2s' }}>
            {loading ? (
              <TableSkeleton rowCount={6} cellCount={metrics.length + 1} />
            ) : (
              visibleRows.map((row) => (
                <TableRow
                  key={`${row.tag.id}-${row.tag.isDirect}`}
                  hover
                  tabIndex={0}
                  role="button"
                  selected={!row.tag.isDirect && row.tag.id === selectedTagId}
                  onClick={() => handleClick(row)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleClick(row);
                  }}
                  sx={{ cursor: 'pointer', '&:hover td': { bgcolor: 'action.hover' } }}
                >
                  {renderTagCell(row)}
                  {metrics.map((key) => renderMetricCell(row, key))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && inactive.length > 0 && (
        <Box
          sx={{
            p: 1.5,
            textAlign: 'center',
            borderTop: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
          }}
        >
          <Button size="small" color="inherit" onClick={() => setShowInactive((on) => !on)}>
            {showInactive
              ? tr('table.hideInactive')
              : tr('table.showInactive', { count: inactive.length })}
          </Button>
        </Box>
      )}
    </Card>
  );
}
