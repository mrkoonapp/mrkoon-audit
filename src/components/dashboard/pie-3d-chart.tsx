import { varAlpha } from 'minimal-shared/utils';
import { useId, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

import { getPie3dSlicePaths } from './utils';

import type { Pie3dGeometry } from './utils';
import type { Pie3dChartProps } from './types';

// ----------------------------------------------------------------------

/** Drawing box and geometry matching the Figma 3D pie (136×120). */
const VIEW_WIDTH = 136;
const VIEW_HEIGHT = 120;

const GEOMETRY: Pie3dGeometry = { cx: 68, cy: 46, rx: 58, ry: 36, depth: 24, explode: 6 };

/**
 * Data-driven pseudo-3D pie (tilted top face + extruded, shaded walls) drawn in
 * plain SVG — ApexCharts has no 3D pie. Slices start at 12 o'clock and run
 * clockwise; zero-value slices are skipped. Hovering a slice lifts it and shows
 * its label + value. When every value is 0 it draws a plain grey disc (zero is
 * real data, so the caller keeps showing the legend with its zeros).
 */
export function Pie3dChart({ slices, width = VIEW_WIDTH, formatValue, sx }: Pie3dChartProps) {
  const shadeId = `pie3d-shade-${useId().replace(/:/g, '')}`;
  const [hovered, setHovered] = useState<number | null>(null);
  const theme = useTheme();

  const total = slices.reduce((acc, slice) => acc + Math.max(slice.value, 0), 0);

  const shapes = useMemo(() => {
    if (!total) return [];

    let angle = 0;

    return slices
      .map((slice, index) => {
        const sweep = (Math.max(slice.value, 0) / total) * Math.PI * 2;
        const start = angle;
        angle += sweep;
        return sweep > 0
          ? { index, slice, ...getPie3dSlicePaths(start, start + sweep, GEOMETRY) }
          : null;
      })
      .filter((shape): shape is NonNullable<typeof shape> => shape !== null)
      .sort((a, b) => a.order - b.order);
  }, [slices, total]);

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      sx={[
        { width, height: (width * VIEW_HEIGHT) / VIEW_WIDTH, flexShrink: 0, overflow: 'visible' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <defs>
        {/* Glossy wall shading as in the design: deeper on the left, white sheen on the right. */}
        <linearGradient id={shadeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#000" stopOpacity="0.08" />
          <stop offset="0.85" stopColor="#FFF" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FFF" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {!total &&
        (() => {
          const { top, outerWall } = getPie3dSlicePaths(0, Math.PI * 2, GEOMETRY);
          const color = varAlpha(theme.vars.palette.grey['500Channel'], 0.32);
          return (
            <g>
              {outerWall && <path d={outerWall} style={{ fill: color }} />}
              {outerWall && <path d={outerWall} fill={`url(#${shadeId})`} />}
              <path d={top} style={{ fill: color }} />
            </g>
          );
        })()}

      {shapes.map(({ index, slice, top, outerWall, sideWalls }) => (
        <Tooltip
          key={slice.label}
          title={`${slice.label}: ${formatValue ? formatValue(slice.value) : slice.value}`}
          followCursor
        >
          <g
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            style={{
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              transform: hovered === index ? 'translateY(-3px)' : undefined,
            }}
          >
            {[...sideWalls, outerWall].filter(Boolean).map((d) => (
              <g key={d}>
                <path d={d!} fill={slice.color} />
                <path d={d!} fill={`url(#${shadeId})`} />
              </g>
            ))}
            <path d={top} fill={slice.color} />
          </g>
        </Tooltip>
      ))}
    </Box>
  );
}
