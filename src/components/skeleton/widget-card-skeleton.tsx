import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

type Props = {
  count: number;
  gridSize: Record<string, number>;
};

export function WidgetCardSkeleton({ count, gridSize }: Props) {
  return (
    <Grid container spacing={3}>
      {[...Array(count)].map((_, index) => (
        <Grid key={index} size={gridSize}>
          <Card sx={{ py: 3, pl: 3, pr: 2.5, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" sx={{ width: '40%', height: 36 }} />
              <Skeleton variant="text" sx={{ width: '60%', height: 20 }} />
            </Box>

            <Skeleton
              variant="circular"
              width={36}
              height={36}
              sx={{ position: 'absolute', top: 24, right: 20 }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
