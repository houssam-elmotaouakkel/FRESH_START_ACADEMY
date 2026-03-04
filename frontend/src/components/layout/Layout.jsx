import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import RamadanBanner from '../branding/RamadanBanner';
import SeoManager from '../common/SeoManager';
import ErrorBoundary from '../common/ErrorBoundary';
import { OrganizationJsonLd } from '../common/JsonLd';
import usePageTracking from '../../hooks/usePageTracking';

const Layout = () => {
  // Track page views on route changes
  usePageTracking();

  return (
    <div className="min-h-screen flex flex-col">
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
      <RamadanBanner />
      <Header />
      <main id="main-content" className="flex-grow" role="main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
