import { useMemo } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

import { getRoundedDonutSlicePaths } from './utils';

import type { RoundedDonutGeometry } from './utils';
import type { RoundedDonutChartProps } from './types';

// ----------------------------------------------------------------------

/** Drawing box + geometry from the Figma "Pay Requests" pie (365×150 chart area). */
const VIEW_WIDTH = 365;
const VIEW_HEIGHT = 150;

const GEOMETRY: RoundedDonutGeometry = { cx: 182, cy: 72, radius: 38, thickness: 42, gap: 14 };

/**
 * Donut whose slices are ring segments with rounded corners and a gap between them,
 * each with an outside callout (percentage + count, leader line in the slice
 * color). Plain SVG — ApexCharts can't draw rounded slices or callouts.
 * Slices start at 12 o'clock and run clockwise; zero-value slices are skipped.
 * When every value is 0 it draws an empty grey ring with "0" in the middle.
 */
export function RoundedDonutChart({
  slices,
  formatValue = String,
  formatPercent = (percent) => `${percent.toFixed(2)}%`,
  sx,
}: RoundedDonutChartProps) {
  const theme = useTheme();

  const total = slices.reduce((acc, slice) => acc + Math.max(slice.value, 0), 0);

  const shapes = useMemo(() => {
    if (!total) return [];

    let angle = 0;

    return slices
      .filter((slice) => slice.value > 0)
      .map((item) => {
        const share = item.value / total;
        const start = angle;
        angle += share * Math.PI * 2;
        return {
          item,
          percent: share * 100,
          ...getRoundedDonutSlicePaths(start, angle, GEOMETRY),
        };
      });
  }, [slices, total]);

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      sx={[
        { width: 1, maxWidth: VIEW_WIDTH, height: 'auto', overflow: 'visible' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* All values are 0: zero is real data, so draw an empty grey ring with "0". */}
      {!total && (
        <g>
          <path
            d={getRoundedDonutSlicePaths(0, Math.PI * 2, GEOMETRY).slice}
            fillRule="evenodd"
            style={{ fill: varAlpha(theme.vars.palette.grey['500Channel'], 0.24) }}
          />
          <text
            x={GEOMETRY.cx}
            y={GEOMETRY.cy + 5}
            textAnchor="middle"
            fontSize={14}
            fontWeight={700}
            fill={theme.vars.palette.text.secondary}
          >
            {formatValue(0)}
          </text>
        </g>
      )}

      {shapes.map(({ item, percent, slice, leader, labelX, labelY, labelAnchor }) => (
        <g key={item.label}>
          <Tooltip title={`${item.label}: ${formatValue(item.value)}`} followCursor>
            <path d={slice} fill={item.color} fillRule="evenodd" style={{ cursor: 'pointer' }} />
          </Tooltip>

          <path d={leader} fill="none" stroke={item.color} strokeWidth={1} />

          <text
            x={labelX}
            y={labelY - 3}
            textAnchor={labelAnchor}
            fontSize={12}
            fontWeight={700}
            fill={theme.vars.palette.text.secondary}
          >
            {formatPercent(percent)}
          </text>
          <text
            x={labelX}
            y={labelY + 12}
            textAnchor={labelAnchor}
            fontSize={12}
            fontWeight={600}
            fill={item.color}
          >
            {formatValue(item.value)}
          </text>
        </g>
      ))}
    </Box>
  );
}
