import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Chart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';
import { FlagIcon } from 'src/components/flag-icon';

// ----------------------------------------------------------------------

interface Props {
  countryName: string;
  countryCode: string;
  total: string;
  trend: string;
  trendDirection: 'up' | 'down';
  series:
    | {
        name: string;
        data: number[];
      }[]
    | number[];
  options: any;
  type?: 'area' | 'bar' | 'donut' | 'pie';
  onViewAll: () => void;
}

export function DataRoomChartCard({
  countryName,
  countryCode,
  total,
  trend,
  trendDirection,
  series,
  options,
  type = 'area',
  onViewAll,
}: Props) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        bgcolor: theme.palette.mode === 'dark' ? '#11161D' : 'background.paper',
        border: `1px solid ${theme.palette.mode === 'dark' ? '#1D2633' : theme.palette.divider}`,
        borderRadius: 2.5,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FlagIcon code={countryCode} sx={{ width: 22, height: 15, borderRadius: '2px' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {countryName}{' '}
            <Box
              component="span"
              sx={{ color: 'text.secondary', fontWeight: 'normal', fontSize: '13px', ml: 0.5 }}
            >
              (Total: {total})
            </Box>
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.25}
            sx={{
              color: trendDirection === 'up' ? 'success.main' : 'error.main',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            <Iconify
              icon={
                trendDirection === 'up'
                  ? ('eva:diagonal-arrow-right-up-fill' as any)
                  : ('eva:diagonal-arrow-right-down-fill' as any)
              }
              width={14}
            />
            <span>{trend}</span>
          </Stack>
        </Stack>

        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon={'eva:chevron-right-fill' as any} />}
          onClick={onViewAll}
          sx={{ textTransform: 'none', fontWeight: '600', color: 'text.secondary' }}
        >
          View all
        </Button>
      </Stack>

      <Box sx={{ height: 320 }}>
        <Chart type={type} series={series} options={options} sx={{ height: 300 }} />
      </Box>
    </Card>
  );
}
