import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  periodLabel: string;
  granularityLabel: string;
  totalAuctions: number;
  summaryTags: { tag_id: number; tag_name: string; total_auctions: number }[];
}

export function TagAnalyticsPeriodCard({
  periodLabel,
  granularityLabel,
  totalAuctions,
  summaryTags,
}: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
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
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        {/* Left — period info */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: isDark ? '#1D2633' : '#F4F6F8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify
              icon={'solar:calendar-bold-duotone' as any}
              width={22}
              sx={{ color: '#BF8654' }}
            />
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Period
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 0.25 }}>
              {periodLabel}
            </Typography>
          </Box>
        </Stack>

        {/* Center — granularity badge */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: isDark ? 'rgba(191,134,84,0.12)' : 'rgba(191,134,84,0.10)',
              border: `1px solid rgba(191,134,84,0.3)`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#BF8654',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              By {granularityLabel}
            </Typography>
          </Box>
        </Stack>

        {/* Right — total auctions */}
        <Stack alignItems="flex-end">
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Total Ended Auctions
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            {totalAuctions}
          </Typography>
        </Stack>
      </Stack>

      {/* Summary tags row (for tag group mode — show per-tag breakdown) */}
      {summaryTags.length > 1 && (
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{
            mt: 2.5,
            pt: 2,
            borderTop: `1px solid ${isDark ? '#1D2633' : theme.palette.divider}`,
          }}
        >
          {summaryTags.map((tag) => (
            <Box
              key={tag.tag_id}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: isDark ? '#1D2633' : '#F4F6F8',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {tag.tag_name}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {tag.total_auctions}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Card>
  );
}
