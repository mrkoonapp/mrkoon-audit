import type { RouteObject } from 'react-router';

import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { UnauthGuard } from 'src/auth/guard';

import { lazyWithRetry } from '../components';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazyWithRetry(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazyWithRetry(() => import('src/pages/auth/jwt/sign-up')),
  CallbackPage: lazyWithRetry(() => import('src/pages/auth/jwt/callback')),
};

const authJwt = {
  path: 'jwt',
  children: [
    {
      path: 'sign-in',
      element: (
        <UnauthGuard>
          <AuthSplitLayout>
            <Jwt.SignInPage />
          </AuthSplitLayout>
        </UnauthGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <UnauthGuard>
          <AuthSplitLayout>
            <Jwt.SignUpPage />
          </AuthSplitLayout>
        </UnauthGuard>
      ),
    },
    {
      path: 'callback',
      element: <Jwt.CallbackPage />,
    },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt],
  },
];
