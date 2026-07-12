import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useAppDispatch } from 'src/store';
import { userActions } from 'src/store/slices/user-slice';

import { toast } from 'src/components/snackbar';


// ----------------------------------------------------------------------


type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();
  const { t } = useTranslate('common');
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(async () => {
    try {
      dispatch(userActions.logout());

      onClose?.();
      // router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t('common.accountDrawer.logoutError'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, router, t]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      {t('accountDrawer.logout')}
    </Button>
  );
}
