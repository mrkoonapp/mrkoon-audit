import { lazy, Suspense } from 'react';
import { useIsClient } from 'minimal-shared/hooks';
import { mergeClasses } from 'minimal-shared/utils';

import { styled, useTheme } from '@mui/material/styles';

import { chartClasses } from './classes';
import { ChartLoading } from './components';

import type { ChartProps } from './types';

// ----------------------------------------------------------------------

const LazyChart = lazy(() =>
  import('react-apexcharts').then((module) => ({ default: module.default }))
);

export function Chart({
  type,
  series,
  options,
  slotProps,
  loading,
  className,
  sx,
  ...other
}: ChartProps) {
  const theme = useTheme();
  const isClient = useIsClient();

  const renderFallback = () => <ChartLoading type={type} sx={slotProps?.loading} />;

  return (
    <ChartRoot
      dir={theme.direction}
      className={mergeClasses([chartClasses.root, className])}
      sx={sx}
      {...other}
    >
      {isClient ? (
        <Suspense fallback={renderFallback()}>
          {loading && renderFallback()}
          <LazyChart type={type} series={series} options={options} width="100%" height="100%" />
        </Suspense>
      ) : (
        renderFallback()
      )}
    </ChartRoot>
  );
}

// ----------------------------------------------------------------------

const ChartRoot = styled('div')(({ theme }) => ({
  width: '100%',
  flexShrink: 0,
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 1.5,
  '@media print': {
    breakInside: 'avoid',
  },
}));
