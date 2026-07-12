import { useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

const NAV_TOUR_STORAGE_KEY = 'app_tour_completed';

export function usePageTour(tourKey: string) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const { value: isOpen, onTrue: onOpen, onFalse: onClose } = useBoolean(false);

  const storageKey = `page_tour_${tourKey}_completed`;

  useEffect(() => {
    const navTourDone = localStorage.getItem(NAV_TOUR_STORAGE_KEY);
    const pageTourDone = localStorage.getItem(storageKey);

    if (navTourDone && !pageTourDone && isDesktop) {
      const timer = setTimeout(() => {
        onOpen();
      }, 800);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isDesktop, onOpen, storageKey]);

  const closeTour = () => {
    onClose();
    localStorage.setItem(storageKey, 'true');
  };

  return { isOpen, closeTour };
}
