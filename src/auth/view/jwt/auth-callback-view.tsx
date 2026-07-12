import type { IMainUserInfo } from 'src/types/user.types';

import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAppDispatch } from 'src/store';
import { fetchUserProfile } from 'src/api/auth';
import { userActions } from 'src/store/slices/user-slice';
import { useTranslate, resolveLocaleFromLangParam } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export function AuthCallbackView() {
  const [searchParams] = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { onChangeLang } = useTranslate();
  const calledRef = useRef(false);

  useEffect(() => {
    // Prevent double-execution in StrictMode
    if (calledRef.current) return;
    calledRef.current = true;

    const token = searchParams.get('token');
    const returnTo = searchParams.get('returnTo');

    if (!token) {
      router.replace(paths.auth.jwt.signIn);
      return;
    }

    (async () => {
      try {
        // 1. Persist token so axios interceptor picks it up for subsequent requests
        localStorage.removeItem('persist:user');
        localStorage.removeItem('accessToken');

        // 2. Fetch user profile using the provided token
        const userInfo = await fetchUserProfile(token);

        // 3. Hydrate Redux with profile data + token
        dispatch(
          userActions.hydrateFromProfile({ ...userInfo, token } as unknown as Partial<IMainUserInfo>)
        );

        // 4. Sync locale from `lang` query param (website → dashboard handoff)
        const langParam = searchParams.get('lang');
        const resolvedLocale = resolveLocaleFromLangParam(langParam, userInfo.country?.global_code);
        if (resolvedLocale) {
          onChangeLang(resolvedLocale, { silent: true });
        }

        // 5. Redirect to returnTo (if provided and starts with /) or dashboard
        const redirectTo =
          returnTo && returnTo.startsWith('/') ? returnTo : paths.dashboard.root;
        router.replace(redirectTo);
      } catch (error) {
        console.error('Auth callback failed:', error);

        // Clear persisted token on failure
        localStorage.removeItem('accessToken');
        document.cookie = 'token=; path=/; max-age=0';

        toast.error('Session expired or invalid. Please sign in again.');
        router.replace(paths.auth.jwt.signIn);
      }
    })();
  }, [searchParams, router, dispatch, onChangeLang]);

  return <SplashScreen />;
}
