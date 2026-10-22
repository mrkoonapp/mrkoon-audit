import type { Theme, SxProps } from '@mui/material/styles';
import type { MetricKey, ScorecardRow } from 'src/api/tag-report';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TableContainer from '@mui/material/TableContainer';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { TableSkeleton, TableHeadCustom } from 'src/components/table';

import { DeltaChip } from './delta-chip';
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

const QUADRANT_COLOR = { needsSellers: 'primary', needsBuyers: 'warning' } as const;

/** The Tag column stays in view while the metrics scroll sideways. */
const stickyTag: SxProps<Theme> = {
  position: 'sticky',
  left: 0,
  zIndex: 2,
  minWidth: 200,
  bgcolor: 'background.paper',
};

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
  currency,
  lang,
  locale,
}: Props) {
  const { t } = useTranslate('dashboard');
  const tr = (key: string, options?: Record<string, unknown>) =>
    t(`dashboard.tagReport.${key}`, options);

  const headCells = [
    { id: 'tag', label: tr('table.tag'), sx: stickyTag },
    ...METRIC_ORDER.map((key) => ({
      id: key,
      align: 'right' as const,
      label:
        METRIC_FORMAT[key] === 'money' && currency
          ? tr('table.withCurrency', { label: tr(`metrics.${key}`), currency })
          : tr(`metrics.${key}`),
      sx: { whiteSpace: 'nowrap' },
    })),
  ];

  const tagName = (row: ScorecardRow) => {
    const name = pickLocalized(row.tag.name, lang);
    return row.tag.isDirect ? tr('table.direct', { name }) : name;
  };

  const handleClick = (row: ScorecardRow) => {
    if (row.tag.isDirect) onSelectDirect();
    else if (parent) onSelectChild(row.tag.id);
    else onOpenTopTag(row.tag.id);
  };

  const renderTagCell = (row: ScorecardRow) => {
    const quadrant = parent ? null : quadrantOf(row.tag.id);
    return (
      <TableCell sx={[stickyTag, { ...(parent && { pl: 4 }) }] as SxProps<Theme>}>
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
    const text = <bdi>{formatMetric(key, value.current, locale)}</bdi>;
    return (
      <TableCell key={key} align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {value.current === null ? (
          <Tooltip title={tr(`nullReasons.${key}`)}>
            <Box component="span" sx={{ color: 'text.disabled', cursor: 'help' }}>
              {text}
            </Box>
          </Tooltip>
        ) : (
          <>
            {text}
            <DeltaChip value={value} locale={locale} variant="text" />
          </>
        )}
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
        sx={{ mb: 2 }}
      />

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 1200 }}>
          <TableHeadCustom
            headCells={headCells}
            order="desc"
            orderBy={sort}
            onSort={(id) => {
              if (id !== 'tag') onSort(id as MetricKey);
            }}
          />

          <TableBody sx={{ opacity: stale ? 0.5 : 1, transition: 'opacity .2s' }}>
            {loading ? (
              <TableSkeleton rowCount={6} cellCount={headCells.length} />
            ) : (
              rows.map((row) => (
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
                  {METRIC_ORDER.map((key) => renderMetricCell(row, key))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
