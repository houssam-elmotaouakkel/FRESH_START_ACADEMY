import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureUtmFromSearch, trackPageView } from '../lib/analytics';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const fullPath = `${location.pathname}${location.search || ''}`;
    captureUtmFromSearch(location.search);
    trackPageView(fullPath);
  }, [location.pathname, location.search]);
};

export default usePageTracking;
