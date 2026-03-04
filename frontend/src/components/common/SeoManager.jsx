import { useLocation } from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import { getSeoForPath } from '../../utils/seo';

/**
 * Automatically applies SEO meta tags based on the current route.
 * Place inside any component that has access to React Router context.
 */
const SeoManager = () => {
  const { pathname } = useLocation();
  const seoConfig = getSeoForPath(pathname);

  useSeo({
    title: seoConfig.title,
    description: seoConfig.description,
    canonical: seoConfig.canonical,
    robots: seoConfig.robots || 'index,follow',
  });

  return null; // Render nothing — side-effect only
};

export default SeoManager;
