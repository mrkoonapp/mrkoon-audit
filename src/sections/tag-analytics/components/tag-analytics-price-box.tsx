import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  type: 'highest' | 'lowest';
  price: number;
  currency: string;
}

const CONFIG = {
  highest: {
    label: 'Highest Price',
    icon: 'eva:trending-up-fill',
    bgColor: 'rgba(191,134,84,0.10)',
    borderColor: 'rgba(191,134,84,0.30)',
    iconColor: '#BF8654',
    valueColor: '#BF8654',
    darkBg: 'rgba(191,134,84,0.08)',
  },
  lowest: {
    label: 'Lowest Price',
    icon: 'eva:trending-down-fill',
    bgColor: 'rgba(46,182,125,0.10)',
    borderColor: 'rgba(46,182,125,0.30)',
    iconColor: '#2EB67D',
    valueColor: '#2EB67D',
    darkBg: 'rgba(46,182,125,0.08)',
  },
} as const;

export function TagAnalyticsPriceBox({ type, price, currency }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const cfg = CONFIG[type];

  return (
    <Card
      sx={{
        p: 3,
        height: 1,
        border: `1px solid ${cfg.borderColor}`,
        bgcolor: isDark ? cfg.darkBg : cfg.bgColor,
        borderRadius: 2.5,
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background watermark icon */}
      <Box
        sx={{
          position: 'absolute',
          right: -12,
          bottom: -12,
          opacity: 0.06,
          '& > *': { width: 96, height: 96 },
        }}
      >
        <Iconify icon={cfg.icon as any} width={96} sx={{ color: cfg.iconColor }} />
      </Box>

      <Stack spacing={1.5} sx={{ position: 'relative' }}>
        {/* Icon + Label */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: isDark ? '#1D2633' : 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${cfg.borderColor}`,
            }}
          >
            <Iconify icon={cfg.icon as any} width={20} sx={{ color: cfg.iconColor }} />
          </Box>
          <Typography
            variant="subtitle2"
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            {cfg.label}
          </Typography>
        </Stack>

        {/* Value */}
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: cfg.valueColor }}>
          {fNumber(price)}
          <Typography
            component="span"
            variant="body2"
            sx={{ ml: 0.75, color: 'text.secondary', fontWeight: 500 }}
          >
            {currency}
          </Typography>
        </Typography>
      </Stack>
    </Card>
  );
}
