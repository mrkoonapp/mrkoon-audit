import type { RootState } from 'src/store';

import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

type UnauthGuardProps = {
  children: React.ReactNode;
};

export function UnauthGuard({ children }: UnauthGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useSelector((state: RootState) => state.user);

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async (): Promise<void> => {
    if (token) {
      // Already authenticated — send the user to where they were headed
      // (returnTo, set by AuthGuard) or the default post-login destination.
      const returnTo = searchParams.get('returnTo');
      const redirectTo = returnTo && returnTo.startsWith('/') ? returnTo : CONFIG.auth.redirectPath;

      router.replace(redirectTo);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
