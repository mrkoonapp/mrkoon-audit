import type { RouteObject } from 'react-router';

import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';
import { lazyWithRetry } from '../components';

// ----------------------------------------------------------------------

const IndexPage = lazyWithRetry(() => import('src/pages/dashboard'));
const AuctionsPage = lazyWithRetry(() => import('src/pages/dashboard/auctions'));
const AuctionsListPage = lazyWithRetry(() => import('src/pages/dashboard/auctions-list'));
const ProductsListPage = lazyWithRetry(() => import('src/pages/dashboard/products-list'));
const ClientsListPage = lazyWithRetry(() => import('src/pages/dashboard/clients-list'));
const InspectionsPage = lazyWithRetry(() => import('src/pages/dashboard/inspections'));
const SalesPage = lazyWithRetry(() => import('src/pages/dashboard/sales'));
const OperationsPage = lazyWithRetry(() => import('src/pages/dashboard/operations'));
const BlankPage = lazyWithRetry(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },
      { path: 'auctions', element: <AuctionsPage /> },
      { path: 'auctions/list', element: <AuctionsListPage /> },
      { path: 'products', element: <ProductsListPage /> },
      { path: 'clients', element: <ClientsListPage /> },
      { path: 'inspections', element: <InspectionsPage /> },
      { path: 'sales', element: <SalesPage /> },
      { path: 'operations', element: <OperationsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
