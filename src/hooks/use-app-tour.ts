import { useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

const TOUR_STORAGE_KEY = 'app_tour_completed';

export function useAppTour() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const { value: isOpen, onTrue: onOpen, onFalse: onClose } = useBoolean(false);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);

    if (!completed && isDesktop) {
      // Small delay to ensure nav items are rendered
      const timer = setTimeout(() => {
        onOpen();
      }, 500);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isDesktop, onOpen]);

  const startTour = () => {
    onOpen();
  };

  const closeTour = () => {
    onClose();
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  };

  return { isOpen, startTour, closeTour };
}
