import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface PeriodSegment {
  label: string;
  count: number;
}

interface Props {
  segments?: PeriodSegment[];
  totalAuctions: number;
  granularityLabel?: string;
}

export function TagAnalyticsHeroCards({ segments = [], totalAuctions, granularityLabel }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Determine grid sizes dynamically (Commented out for date range breakdown)
  // const totalCards = Math.max(segments.length, 1) + 1;
  // const colSize = Math.max(3, Math.floor(12 / totalCards));

  return (
    <Stack spacing={2.5}>
      {/* 1st Box: Hero Total Auctions Card */}
      <Card
        sx={{
          p: 3,
          bgcolor: isDark ? 'rgba(191,134,84,0.12)' : 'rgba(191,134,84,0.08)',
          border: `1.5px solid rgba(191,134,84,0.35)`,
          borderRadius: 2.5,
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background watermark */}
        <Box
          sx={{
            position: 'absolute',
            right: -10,
            bottom: -10,
            opacity: 0.08,
            '& > *': { width: 100, height: 100 },
          }}
        >
          <Iconify
            icon={'solar:hammer-bold-duotone' as any}
            width={100}
            sx={{ color: '#BF8654' }}
          />
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1.5, position: 'relative' }}
        >
          <Typography variant="subtitle2" sx={{ color: '#BF8654', fontWeight: 700 }}>
            Total Ended Auctions
          </Typography>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: isDark ? '#1D2633' : 'rgba(255,255,255,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(191,134,84,0.3)',
            }}
          >
            <Iconify
              icon={'solar:hammer-bold-duotone' as any}
              width={20}
              sx={{ color: '#BF8654' }}
            />
          </Box>
        </Stack>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2.25rem', md: '2.75rem' },
            color: '#BF8654',
            lineHeight: 1,
            position: 'relative',
          }}
        >
          {totalAuctions}
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 600, mt: 1, position: 'relative' }}
        >
          ended auctions total
        </Typography>
      </Card>

      {/* Subsequent Boxes: Time division period cards (e.g., April, May, June) — COMMENTED OUT */}
      {/*
      <Grid container spacing={2.5}>
        {segments.map((seg, idx) => (
          <Grid key={`${seg.label}-${idx}`} size={{ xs: 12, sm: 6, md: colSize }}>
            <Card
              sx={{
                p: 3,
                height: 1,
                bgcolor: isDark ? '#11161D' : 'background.paper',
                border: `1px solid ${isDark ? '#1D2633' : theme.palette.divider}`,
                borderRadius: 2.5,
                boxShadow: theme.customShadows?.card,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {seg.label}
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: isDark ? '#161D26' : '#F4F6F8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon={"solar:calendar-bold-duotone" as any} width={18} sx={{ color: 'text.secondary' }} />
                </Box>
              </Stack>

              <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, color: 'text.primary', lineHeight: 1 }}>
                {seg.count}
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, mt: 1 }}>
                auctions
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      */}
    </Stack>
  );
}
