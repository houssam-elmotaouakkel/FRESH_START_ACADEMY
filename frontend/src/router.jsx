import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Layout from './components/layout/Layout';

const Home = lazy(() => import('./pages/Home'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="spinner" />
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: 'terms', element: withSuspense(Terms) },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },
]);

export default router;
