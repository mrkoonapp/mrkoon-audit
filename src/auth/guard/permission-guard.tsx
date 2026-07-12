import type { PermissionKey } from 'src/sections/users-permissions/types';

import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { usePermissions } from 'src/hooks/use-permissions';

import { useTranslate } from 'src/locales';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

const REDIRECT_SECONDS = 3;

type PermissionGuardProps = {
  children: React.ReactNode;
  permission: PermissionKey | PermissionKey[];
  requireAll?: boolean;
};

export function PermissionGuard({ children, permission, requireAll }: PermissionGuardProps) {
  const { has, hasAny, hasAll } = usePermissions();

  const allowed = Array.isArray(permission)
    ? requireAll
      ? hasAll(permission)
      : hasAny(permission)
    : has(permission);

  if (allowed) return <>{children}</>;

  return <ForbiddenView />;
}

// ----------------------------------------------------------------------

function ForbiddenView() {
  const router = useRouter();
  const { t } = useTranslate('common');
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const timeout = setTimeout(() => {
      router.replace(paths.dashboard.root);
    }, REDIRECT_SECONDS * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <Container
      component={MotionContainer}
      sx={{
        textAlign: 'center',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('common.forbidden.title')}
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('common.forbidden.description')}
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
      </m.div>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Button
          size="large"
          variant="contained"
          onClick={() => router.replace(paths.dashboard.root)}
        >
          {t('common.forbidden.goHome')}
        </Button>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {t('common.forbidden.autoRedirect', { seconds: secondsLeft })}
        </Typography>
      </Box>
    </Container>
  );
}
