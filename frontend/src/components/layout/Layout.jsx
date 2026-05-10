import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SeoManager from '../common/SeoManager';
import ErrorBoundary from '../common/ErrorBoundary';
import { OrganizationJsonLd } from '../common/JsonLd';
import usePageTracking from '../../hooks/usePageTracking';

const Layout = () => {
  // Track page views on route changes
  usePageTracking();

  return (
    <div>
      {/* Skip to content - accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <SeoManager />
      <OrganizationJsonLd />
      <ScrollRestoration />
      <Header />
      <main id="main-content" role="main" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
