/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { WalktourLogic } from 'walktour';

import { Walktour } from 'walktour';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type TourStep = {
  selector: string;
  title: string;
  description: string;
  action?: () => void;
};

type AppTourProps = {
  isOpen: boolean;
  onClose: () => void;
  steps: TourStep[];
};

export function AppTour({ isOpen, onClose, steps }: AppTourProps) {
  const { t } = useTranslate('common');

  const customTooltipRenderer = (tourLogic?: WalktourLogic) => {
    if (!tourLogic) return <div />;

    const { stepContent, stepIndex, allSteps, next, prev, close } = tourLogic;
    const isFirst = stepIndex === 0;
    const isLast = stepIndex === allSteps.length - 1;
    const progress = ((stepIndex + 1) / allSteps.length) * 100;

    const handleNav = (direction: 'next' | 'prev') => {
      const targetIndex = direction === 'next' ? stepIndex + 1 : stepIndex - 1;
      const targetStep = steps[targetIndex];
      if (targetStep?.action) {
        targetStep.action();
        setTimeout(() => (direction === 'next' ? next() : prev()), 150);
      } else {
        direction === 'next' ? next() : prev();
      }
    };

    return (
      <Paper
        elevation={8}
        sx={{
          p: 2.5,
          width: 320,
          borderRadius: 2,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {stepContent.title}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {t('tour.stepOf', { current: stepIndex + 1, total: allSteps.length })}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 1.5, borderRadius: 1, height: 4 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {stepContent.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {!isFirst && (
            <Button size="small" variant="outlined" color="inherit" onClick={() => handleNav('prev')}>
              {t('tour.prev')}
            </Button>
          )}

          {isLast ? (
            <Button size="small" variant="contained" onClick={() => close()}>
              {t('tour.close')}
            </Button>
          ) : (
            <Button size="small" variant="contained" onClick={() => handleNav('next')}>
              {t('tour.next')}
            </Button>
          )}
        </Box>
      </Paper>
    );
  };

  const isPdf = new URLSearchParams(window.location.search).has('pdf');

  if (!isOpen || steps.length === 0 || isPdf) return null;

  return (
    <Walktour
      steps={steps}
      isOpen={isOpen}
      maskPadding={4}
      maskRadius={8}
      tooltipSeparation={12}
      disableMaskInteraction
      disableCloseOnClick
      customTooltipRenderer={customTooltipRenderer}
      customCloseFunc={() => onClose()}
      zIndex={9999}
    />
  );
}
