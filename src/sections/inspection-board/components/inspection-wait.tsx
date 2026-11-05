import type { TypographyProps } from '@mui/material/Typography';

import { useCallback } from 'react';

import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import {
  inspectionSeverity,
  formatInspectionWait,
  inspectionWaitSeconds,
  INSPECTION_SEVERITY_COLOR,
} from '../utils/inspection-wait';

// ----------------------------------------------------------------------

/** "3 days and 4 hours" for a server-measured wait, in the current language. */
export const useInspectionWaitText = () => {
  const { t } = useTranslate('dashboard');

  return useCallback(
    (elapsedSeconds: number | null | undefined) =>
      formatInspectionWait(inspectionWaitSeconds(elapsedSeconds), t),
    [t]
  );
};

interface InspectionWaitProps extends TypographyProps {
  /** The server's `inspection_elapsed_seconds`. */
  elapsedSeconds: number | null | undefined;
}

/**
 * How long a product has been in inspection, as plain text measured when the board loaded.
 * Green on the first day, amber after it, red from the fifth day.
 */
export const InspectionWait = ({ elapsedSeconds, sx, ...other }: InspectionWaitProps) => {
  const waitText = useInspectionWaitText();
  const seconds = inspectionWaitSeconds(elapsedSeconds);
  const color = INSPECTION_SEVERITY_COLOR[inspectionSeverity(seconds)];

  return (
    <Typography
      variant="subtitle2"
      sx={[
        { color: seconds == null ? 'text.disabled' : `${color}.main` },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {waitText(elapsedSeconds)}
    </Typography>
  );
};
