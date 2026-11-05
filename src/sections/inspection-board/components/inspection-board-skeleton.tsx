import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import {
  INSPECTION_SUMMARY_GRID,
  InspectionSummaryOverview,
  useInspectionSummaryStrip,
  INSPECTION_SUMMARY_TOTAL_SX,
} from './inspection-board-summary';

// ----------------------------------------------------------------------

/*
 * Mirrors the board as it loads: the overview card and the three figures, then Top Tag cards
 * collapsed to their header (the tag and its audience), the way every card starts.
 */

const TagCardSkeleton = () => (
  <Card>
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        pt: 3,
        pb: 2.5,
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ flex: '1 1 220px', minWidth: 0 }}
      >
        <Skeleton variant="circular" width={56} height={56} sx={{ flexShrink: 0 }} />
        <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton variant="rounded" height={20} sx={{ width: '55%' }} />
          <Skeleton variant="rounded" width={110} height={22} />
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Skeleton variant="circular" width={44} height={44} sx={{ flexShrink: 0 }} />
        <Stack spacing={0.75}>
          <Skeleton variant="rounded" width={40} height={20} />
          <Skeleton variant="rounded" width={90} height={12} />
        </Stack>
      </Stack>
    </Box>
  </Card>
);

/** An overview count, laid out like the real one: in the strip, or as a row of the list. */
const CountSkeleton = ({ strip }: { strip: boolean }) =>
  strip ? (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ flex: 1, minWidth: 0, px: 3 }}
    >
      <Skeleton variant="rounded" width={40} height={40} sx={{ flexShrink: 0 }} />
      <Stack spacing={1} sx={{ width: 96 }}>
        <Skeleton variant="rounded" width={48} height={26} />
        <Skeleton variant="rounded" height={14} />
      </Stack>
    </Stack>
  ) : (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.75 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Skeleton variant="rounded" width={32} height={32} sx={{ flexShrink: 0 }} />
        <Skeleton variant="rounded" width={120} height={14} />
      </Stack>
      <Skeleton variant="rounded" width={28} height={22} />
    </Stack>
  );

const StatSkeleton = () => (
  <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0, px: { xs: 2, sm: 3 } }}>
    <Skeleton variant="rounded" width={40} height={40} />
    <Stack spacing={1}>
      <Skeleton variant="rounded" width={48} height={26} />
      <Skeleton variant="rounded" height={14} sx={{ width: '70%' }} />
    </Stack>
  </Stack>
);

export const InspectionBoardSkeleton = () => {
  const strip = useInspectionSummaryStrip();

  return (
    <Stack spacing={3}>
      <Box sx={INSPECTION_SUMMARY_GRID}>
        <InspectionSummaryOverview strip={strip}>
          {[0, 1, 2].map((stat) => (
            <CountSkeleton key={stat} strip={strip} />
          ))}
        </InspectionSummaryOverview>
        {[0, 1, 2].map((spotlight) => (
          <Card key={spotlight} sx={{ py: 3, ...(spotlight === 2 && INSPECTION_SUMMARY_TOTAL_SX) }}>
            <StatSkeleton />
          </Card>
        ))}
      </Box>
      <Grid container spacing={3}>
        {[0, 1, 2, 3].map((card) => (
          <Grid key={card} size={{ xs: 12, xl: 6 }}>
            <TagCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
