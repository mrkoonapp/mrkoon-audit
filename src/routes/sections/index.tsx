import type { RouteObject } from 'react-router';

import { Navigate } from 'react-router';

import { CONFIG } from 'src/global-config';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';
import { lazyWithRetry } from '../components';

// ----------------------------------------------------------------------

const Page404 = lazyWithRetry(() => import('src/pages/error/404'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={CONFIG.auth.redirectPath} replace />,
  },

  // Auth
  ...authRoutes,

  // Dashboard
  ...dashboardRoutes,

  // Main (errors, coming-soon, maintenance)
  ...mainRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
