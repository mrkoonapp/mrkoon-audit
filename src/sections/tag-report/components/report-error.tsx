import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onRetry: () => void;
};

/** Replaces the report when a call fails, so no stale numbers stay on screen. */
export function ReportError({ onRetry }: Props) {
  const { t } = useTranslate('dashboard');

  return (
    <Card sx={{ p: 5, gap: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Iconify icon="solar:danger-triangle-bold" width={40} sx={{ color: 'error.main' }} />
      <Typography variant="subtitle1">{t('dashboard.tagReport.states.error')}</Typography>
      <Button variant="outlined" color="inherit" onClick={onRetry}>
        {t('dashboard.tagReport.states.retry')}
      </Button>
    </Card>
  );
}
