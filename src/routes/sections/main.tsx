import type { RouteObject } from 'react-router';

import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { SimpleLayout } from 'src/layouts/simple';

import { SplashScreen } from 'src/components/loading-screen';

import { lazyWithRetry } from '../components';

// ----------------------------------------------------------------------

const ComingSoonPage = lazyWithRetry(() => import('src/pages/coming-soon'));
const MaintenancePage = lazyWithRetry(() => import('src/pages/maintenance'));
// Error
const Page500 = lazyWithRetry(() => import('src/pages/error/500'));
const Page403 = lazyWithRetry(() => import('src/pages/error/403'));
const Page404 = lazyWithRetry(() => import('src/pages/error/404'));

// ----------------------------------------------------------------------

export const mainRoutes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: 'coming-soon',
        element: (
          <SimpleLayout slotProps={{ content: { compact: true } }}>
            <ComingSoonPage />
          </SimpleLayout>
        ),
      },
      {
        path: 'maintenance',
        element: (
          <SimpleLayout slotProps={{ content: { compact: true } }}>
            <MaintenancePage />
          </SimpleLayout>
        ),
      },
      {
        path: 'error',
        children: [
          { path: '500', element: <Page500 /> },
          { path: '404', element: <Page404 /> },
          { path: '403', element: <Page403 /> },
        ],
      },
    ],
  },
];
