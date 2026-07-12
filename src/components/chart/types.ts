import type { Theme, SxProps } from '@mui/material/styles';
import type { Props as ApexProps } from 'react-apexcharts';

// ----------------------------------------------------------------------

export type ChartOptions = ApexProps['options'] & {
  rtl?: boolean;
};

export type ChartProps = React.ComponentProps<'div'> &
  Pick<ApexProps, 'type' | 'series'> & {
    sx?: SxProps<Theme>;
    loading?: boolean;
    options?: ChartOptions;
    slotProps?: {
      loading?: SxProps<Theme>;
    };
  };
